function securityHeaders(extraHeaders = {}) {
  return {
    ...extraHeaders,
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: securityHeaders({
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    }),
  });
}

function htmlResponse(html, status = 200) {
  return new Response(html, {
    status,
    headers: securityHeaders({
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    }),
  });
}

function redirectToHttps(request) {
  const url = new URL(request.url);

  // Only redirect when the actual request URL is HTTP.
  // Do not use X-Forwarded-Proto here; it can create redirect loops behind Cloudflare.
  if (url.protocol === "http:") {
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  return null;
}

async function assetResponse(request, env, pathname = null) {
  const assetRequest = pathname ? rewriteAssetRequest(request, pathname) : request;
  const response = await env.ASSETS.fetch(assetRequest);

  // Prevent redirect loops if ASSETS tries to redirect/fallback instead of serving the file.
  if (response.status >= 300 && response.status < 400) {
    return new Response("Not Found", {
      status: 404,
      headers: securityHeaders({
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      }),
    });
  }

  const headers = new Headers(response.headers);

  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function rewriteAssetRequest(request, pathname) {
  const url = new URL(request.url);
  url.pathname = pathname;
  return new Request(url.toString(), request);
}

function normalizePath(pathname) {
  return pathname.replace(/\/+$/, "") || "/";
}

function nowIso() {
  return new Date().toISOString();
}

function cleanFirstName(value) {
  return String(value || "")
    .replace(/[^a-zA-ZÀ-ÿ' -]/g, "")
    .trim()
    .split(" ")[0];
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function isValidPhone(value) {
  return /^[0-9+\-().\s]{7,}$/.test(String(value || "").trim());
}

function detectContactType(contact) {
  if (isValidEmail(contact)) return "email";
  if (isValidPhone(contact)) return "phone";
  return "unknown";
}

function getBearerToken(request) {
  const header = request.headers.get("Authorization") || "";
  if (!header.startsWith("Bearer ")) return "";
  return header.slice("Bearer ".length).trim();
}

function requireAdmin(request, env) {
  if (!env.ADMIN_TOKEN) {
    return {
      ok: false,
      response: jsonResponse(
        { success: false, error: "ADMIN_TOKEN is not set in Cloudflare secrets." },
        500
      ),
    };
  }

  const token = getBearerToken(request);

  if (!token || token !== env.ADMIN_TOKEN) {
    return {
      ok: false,
      response: jsonResponse({ success: false, error: "Unauthorized" }, 401),
    };
  }

  return { ok: true };
}

async function parseJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function handleChatStart(request, env) {
  if (!env.CHAT_DB) {
    return jsonResponse({ success: false, error: "CHAT_DB binding missing." }, 500);
  }

  const body = await parseJson(request);
  if (!body) {
    return jsonResponse({ success: false, error: "Invalid JSON body." }, 400);
  }

  const firstName = cleanFirstName(body.firstName);
  const contact = String(body.contact || "").trim();
  const contactType = body.contactType || detectContactType(contact);
  const sourcePage = String(body.sourcePage || "").trim();
  const userAgent = request.headers.get("User-Agent") || "";

  if (!firstName || firstName.length < 2) {
    return jsonResponse({ success: false, error: "First name is required." }, 400);
  }

  if (!isValidEmail(contact) && !isValidPhone(contact)) {
    return jsonResponse(
      { success: false, error: "Valid email or phone number is required." },
      400
    );
  }

  const id = crypto.randomUUID();
  const timestamp = nowIso();

  await env.CHAT_DB.prepare(
    `INSERT INTO conversations
      (id, first_name, contact, contact_type, source_page, user_agent, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(id, firstName, contact, contactType, sourcePage, userAgent, timestamp, timestamp)
    .run();

  await env.CHAT_DB.prepare(
    `INSERT INTO messages (conversation_id, role, message, created_at)
     VALUES (?, ?, ?, ?)`
  )
    .bind(
      id,
      "system",
      `Lead captured: ${firstName} | ${contactType}: ${contact}`,
      timestamp
    )
    .run();

  return jsonResponse({
    success: true,
    conversationId: id,
    firstName,
    contactType,
  });
}

async function handleChatMessage(request, env) {
  if (!env.CHAT_DB) {
    return jsonResponse({ success: false, error: "CHAT_DB binding missing." }, 500);
  }

  const body = await parseJson(request);
  if (!body) {
    return jsonResponse({ success: false, error: "Invalid JSON body." }, 400);
  }

  const conversationId = String(body.conversationId || "").trim();
  const role = String(body.role || "").trim();
  const message = String(body.message || "").trim();

  if (!conversationId) {
    return jsonResponse({ success: false, error: "conversationId is required." }, 400);
  }

  if (!["user", "bot", "system"].includes(role)) {
    return jsonResponse({ success: false, error: "Invalid role." }, 400);
  }

  if (!message) {
    return jsonResponse({ success: false, error: "Message is required." }, 400);
  }

  const existing = await env.CHAT_DB.prepare(
    `SELECT id FROM conversations WHERE id = ?`
  )
    .bind(conversationId)
    .first();

  if (!existing) {
    return jsonResponse({ success: false, error: "Conversation not found." }, 404);
  }

  const timestamp = nowIso();

  await env.CHAT_DB.prepare(
    `INSERT INTO messages (conversation_id, role, message, created_at)
     VALUES (?, ?, ?, ?)`
  )
    .bind(conversationId, role, message, timestamp)
    .run();

  await env.CHAT_DB.prepare(
    `UPDATE conversations SET updated_at = ? WHERE id = ?`
  )
    .bind(timestamp, conversationId)
    .run();

  return jsonResponse({ success: true });
}

async function handleGetConversation(request, env, conversationId) {
  if (!env.CHAT_DB) {
    return jsonResponse({ success: false, error: "CHAT_DB binding missing." }, 500);
  }

  const conversation = await env.CHAT_DB.prepare(
    `SELECT id, first_name, contact, contact_type, source_page, created_at, updated_at
     FROM conversations
     WHERE id = ?`
  )
    .bind(conversationId)
    .first();

  if (!conversation) {
    return jsonResponse({ success: false, error: "Conversation not found." }, 404);
  }

  const messages = await env.CHAT_DB.prepare(
    `SELECT id, role, message, created_at
     FROM messages
     WHERE conversation_id = ?
     ORDER BY id ASC`
  )
    .bind(conversationId)
    .all();

  return jsonResponse({
    success: true,
    conversation,
    messages: messages.results || [],
  });
}

async function handleAdminConversations(request, env) {
  const admin = requireAdmin(request, env);
  if (!admin.ok) return admin.response;

  const rows = await env.CHAT_DB.prepare(
    `SELECT id, first_name, contact, contact_type, source_page, created_at, updated_at
     FROM conversations
     ORDER BY created_at DESC
     LIMIT 100`
  ).all();

  return jsonResponse({
    success: true,
    conversations: rows.results || [],
  });
}

async function handleAdminConversationDetail(request, env, conversationId) {
  const admin = requireAdmin(request, env);
  if (!admin.ok) return admin.response;

  return handleGetConversation(request, env, conversationId);
}

const adminHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Ell Vii's Automations Admin</title>
  <style>
    body{margin:0;background:#f8fafc;color:#0f172a;font-family:Arial,Helvetica,sans-serif}
    .wrap{max-width:1100px;margin:0 auto;padding:28px}
    .card{background:#fff;border:1px solid #e2e8f0;border-radius:20px;padding:20px;box-shadow:0 16px 40px rgba(15,23,42,.08);margin-bottom:18px}
    h1{margin:0 0 10px;font-size:34px;letter-spacing:-.04em}
    input{width:100%;padding:13px;border:1px solid #cbd5e1;border-radius:12px;font-size:15px}
    button{border:0;background:#2563eb;color:#fff;font-weight:800;border-radius:12px;padding:12px 14px;cursor:pointer}
    .row{display:flex;gap:10px;align-items:center}
    .row input{flex:1}
    table{width:100%;border-collapse:collapse;background:#fff}
    th,td{padding:12px;border-bottom:1px solid #e2e8f0;text-align:left;font-size:14px}
    th{font-size:12px;text-transform:uppercase;color:#64748b;background:#f8fafc}
    tr{cursor:pointer}
    tr:hover{background:#f8fafc}
    .muted{color:#64748b}
    .msg{padding:10px 12px;border-radius:12px;margin:8px 0;max-width:800px}
    .msg.user{background:#dbeafe}
    .msg.bot{background:#ecfdf5}
    .msg.system{background:#f1f5f9;color:#475569}
    .error{color:#b91c1c;font-weight:700}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>Ell Vii's Automations Admin</h1>
      <p class="muted">View chatbot leads and message history.</p>
      <div class="row">
        <input id="token" type="password" placeholder="Enter ADMIN_TOKEN" />
        <button onclick="saveToken()">Save Token</button>
        <button onclick="loadConversations()">Load Leads</button>
      </div>
      <p id="status" class="muted"></p>
    </div>

    <div class="card">
      <h2>Recent Leads</h2>
      <div id="leads"></div>
    </div>

    <div class="card">
      <h2>Conversation</h2>
      <div id="conversation" class="muted">Click a lead to view the message history.</div>
    </div>
  </div>

  <script>
    const tokenInput = document.getElementById("token");
    const saved = localStorage.getItem("ellvii_admin_token");
    if(saved) tokenInput.value = saved;

    function setStatus(text, isError=false){
      const el = document.getElementById("status");
      el.textContent = text;
      el.className = isError ? "error" : "muted";
    }

    function getToken(){
      return tokenInput.value.trim();
    }

    function saveToken(){
      localStorage.setItem("ellvii_admin_token", getToken());
      setStatus("Token saved.");
    }

    async function api(path){
      const res = await fetch(path, {
        headers: {
          "Authorization": "Bearer " + getToken()
        }
      });

      const data = await res.json().catch(() => ({}));

      if(!res.ok || data.success === false){
        throw new Error(data.error || "Request failed");
      }

      return data;
    }

    async function loadConversations(){
      try{
        saveToken();
        setStatus("Loading leads...");
        const data = await api("/api/admin/conversations");
        const rows = data.conversations || [];

        if(!rows.length){
          document.getElementById("leads").innerHTML = "<p class='muted'>No leads yet.</p>";
          setStatus("No leads found.");
          return;
        }

        document.getElementById("leads").innerHTML =
          "<table><thead><tr><th>Name</th><th>Contact</th><th>Type</th><th>Created</th><th>Source</th></tr></thead><tbody>" +
          rows.map(row => \`
            <tr onclick="loadConversation('\${row.id}')">
              <td><b>\${escapeHtml(row.first_name || "")}</b></td>
              <td>\${escapeHtml(row.contact || "")}</td>
              <td>\${escapeHtml(row.contact_type || "")}</td>
              <td>\${escapeHtml(row.created_at || "")}</td>
              <td>\${escapeHtml(row.source_page || "")}</td>
            </tr>
          \`).join("") +
          "</tbody></table>";

        setStatus("Loaded " + rows.length + " lead(s).");
      }catch(error){
        setStatus(error.message, true);
      }
    }

    async function loadConversation(id){
      try{
        setStatus("Loading conversation...");
        const data = await api("/api/admin/conversation/" + encodeURIComponent(id));
        const c = data.conversation;
        const messages = data.messages || [];

        document.getElementById("conversation").innerHTML =
          \`<p><b>\${escapeHtml(c.first_name)}</b> — \${escapeHtml(c.contact)}<br><span class="muted">\${escapeHtml(c.created_at)}</span></p>\` +
          messages.map(m => \`
            <div class="msg \${escapeHtml(m.role)}">
              <b>\${escapeHtml(m.role)}:</b> \${escapeHtml(m.message)}
              <br><small class="muted">\${escapeHtml(m.created_at)}</small>
            </div>
          \`).join("");

        setStatus("Conversation loaded.");
      }catch(error){
        setStatus(error.message, true);
      }
    }

    function escapeHtml(value){
      return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }
  </script>
</body>
</html>`;

export default {
  async fetch(request, env) {
    const httpsRedirect = redirectToHttps(request);
    if (httpsRedirect) return httpsRedirect;

    const url = new URL(request.url);
    const path = normalizePath(url.pathname);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    if (path === "/admin") {
      return htmlResponse(adminHTML);
    }

    if (path === "/api/chat/start" && request.method === "POST") {
      return handleChatStart(request, env);
    }

    if (path === "/api/chat/message" && request.method === "POST") {
      return handleChatMessage(request, env);
    }

    if (path.startsWith("/api/chat/conversation/") && request.method === "GET") {
      const id = decodeURIComponent(path.replace("/api/chat/conversation/", ""));
      return handleGetConversation(request, env, id);
    }

    if (path === "/api/admin/conversations" && request.method === "GET") {
      return handleAdminConversations(request, env);
    }

    if (path.startsWith("/api/admin/conversation/") && request.method === "GET") {
      const id = decodeURIComponent(path.replace("/api/admin/conversation/", ""));
      return handleAdminConversationDetail(request, env, id);
    }

    if (path === "/api/health") {
      return jsonResponse({
        success: true,
        worker: "ell-vii-s-automations",
        d1: Boolean(env.CHAT_DB),
      });
    }

    // Legal page routing — serve directly to avoid redirect loops
    if (path === "/terms" || path === "/terms.html") {
      return assetResponse(request, env, "/terms.html");
    }

    if (path === "/privacy" || path === "/privacy.html") {
      return assetResponse(request, env, "/privacy.html");
    }

    if (env && env.ASSETS) {
      return assetResponse(request, env);
    }

    return new Response("Not Found", { status: 404 });
  },
};
