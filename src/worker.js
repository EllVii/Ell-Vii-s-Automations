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

const legalTermsHTML = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n\n  <title>Terms of Service | Ell Vii\u2019s Automations</title>\n  <meta name=\"description\" content=\"Terms of Service for Ell Vii\u2019s Automations. Review website use terms, service limitations, project expectations, payments, refunds, and automation disclaimers.\" />\n\n  <style>\n    body {\n      margin: 0;\n      font-family: Arial, Helvetica, sans-serif;\n      background: #f7f7f7;\n      color: #111;\n      line-height: 1.65;\n    }\n\n    .page {\n      max-width: 900px;\n      margin: 0 auto;\n      padding: 48px 20px;\n    }\n\n    .card {\n      background: #fff;\n      border-radius: 22px;\n      padding: 34px;\n      box-shadow: 0 18px 50px rgba(0,0,0,.08);\n      border: 1px solid rgba(0,0,0,.08);\n    }\n\n    h1 {\n      margin-top: 0;\n      font-size: 34px;\n      line-height: 1.15;\n    }\n\n    h2 {\n      margin-top: 32px;\n      font-size: 21px;\n    }\n\n    a {\n      color: #000;\n      font-weight: 700;\n    }\n\n    .muted {\n      color: #666;\n      font-size: 14px;\n    }\n\n    .back {\n      display: inline-block;\n      margin-bottom: 20px;\n      text-decoration: none;\n    }\n\n    ul {\n      padding-left: 22px;\n    }\n  </style>\n</head>\n\n<body>\n  <main class=\"page\">\n    <a class=\"back\" href=\"/\">&larr; Back to Home</a>\n\n    <section class=\"card\">\n      <h1>Terms of Service</h1>\n      <p class=\"muted\">Effective Date: May 15, 2026</p>\n\n      <p>\n        These Terms of Service govern your use of the Ell Vii\u2019s Automations website, chatbot,\n        contact forms, and related services. By using this website or submitting information, you\n        agree to these terms.\n      </p>\n\n      <h2>1. Services</h2>\n      <p>\n        Ell Vii\u2019s Automations may provide website design, website updates, SEO support, lead\n        capture tools, chatbot setup, CRM workflows, automation setup, consulting, and related\n        digital business services.\n      </p>\n\n      <h2>2. Website and Chatbot Use</h2>\n      <p>\n        The website and chatbot are provided for general business information and lead intake.\n        Chatbot responses may be automated and should not be treated as legal, financial, tax,\n        medical, or professional advice.\n      </p>\n\n      <h2>3. Contact Permission</h2>\n      <p>\n        By submitting your name, email address, phone number, or project details through this\n        website, chatbot, or contact form, you agree that Ell Vii\u2019s Automations may contact you\n        about your request, services, quotes, consultations, or follow-ups.\n      </p>\n\n      <h2>4. Project Quotes and Pricing</h2>\n      <p>\n        Any prices, estimates, packages, or service descriptions listed on this website are for\n        general informational purposes unless confirmed in writing. Final pricing may depend on\n        project scope, revisions, integrations, third-party tools, hosting needs, timelines, and\n        requested features.\n      </p>\n\n      <h2>5. Client Responsibilities</h2>\n      <p>Clients are responsible for providing accurate and timely information, including:</p>\n      <ul>\n        <li>Business details</li>\n        <li>Brand assets</li>\n        <li>Images, logos, and written content</li>\n        <li>Access to required accounts or platforms</li>\n        <li>Approval of project details before launch</li>\n      </ul>\n\n      <h2>6. Third-Party Tools</h2>\n      <p>\n        Some services may rely on third-party platforms such as hosting providers, domain\n        registrars, analytics tools, CRMs, calendar tools, AI services, chatbot providers, email\n        services, or payment processors. Ell Vii\u2019s Automations is not responsible for outages,\n        policy changes, billing changes, limitations, or errors caused by third-party providers.\n      </p>\n\n      <h2>7. No Guaranteed Results</h2>\n      <p>\n        Ell Vii\u2019s Automations may help improve online presence, website quality, lead capture,\n        workflows, and SEO structure. However, we do not guarantee specific rankings, traffic,\n        sales, revenue, customer volume, or business results.\n      </p>\n\n      <h2>8. Payments and Refunds</h2>\n      <p>\n        Payment terms, deposits, launch fees, monthly service fees, refunds, and cancellation\n        terms should be confirmed in writing before work begins. Unless otherwise agreed in\n        writing, completed work, setup time, custom development, and third-party costs may be\n        non-refundable.\n      </p>\n\n      <h2>9. Intellectual Property</h2>\n      <p>\n        Unless otherwise agreed in writing, clients retain ownership of their submitted business\n        materials. Ell Vii\u2019s Automations may retain ownership of reusable frameworks, templates,\n        workflows, code patterns, automation methods, and internal processes used to provide\n        services.\n      </p>\n\n      <h2>10. Limitation of Liability</h2>\n      <p>\n        To the fullest extent permitted by law, Ell Vii\u2019s Automations is not liable for indirect,\n        incidental, lost profit, lost revenue, data loss, platform outage, third-party service issue,\n        or consequential damages arising from use of the website or services.\n      </p>\n\n      <h2>11. Acceptable Use</h2>\n      <p>\n        You agree not to misuse the website, chatbot, forms, or services. This includes attempting\n        to disrupt the site, submit harmful code, abuse the chatbot, impersonate others, or use the\n        services for unlawful purposes.\n      </p>\n\n      <h2>12. Updates to These Terms</h2>\n      <p>\n        We may update these Terms of Service from time to time. Any changes will be posted on this\n        page with an updated effective date.\n      </p>\n\n      <h2>13. Contact</h2>\n      <p>\n        For questions about these terms, contact Ell Vii\u2019s Automations at:\n        <br />\n        <strong>Email:</strong> <a href=\"mailto:the.velasquez.law@gmail.com\">the.velasquez.law@gmail.com</a>\n      </p>\n    </section>\n  </main>\n</body>\n</html>\n";

const legalPrivacyHTML = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n\n  <title>Privacy Policy | Ell Vii\u2019s Automations</title>\n  <meta name=\"description\" content=\"Privacy Policy for Ell Vii\u2019s Automations. Learn how we collect, use, and protect information submitted through our website, chatbot, forms, and business automation services.\" />\n\n  <style>\n    body {\n      margin: 0;\n      font-family: Arial, Helvetica, sans-serif;\n      background: #f7f7f7;\n      color: #111;\n      line-height: 1.65;\n    }\n\n    .page {\n      max-width: 900px;\n      margin: 0 auto;\n      padding: 48px 20px;\n    }\n\n    .card {\n      background: #fff;\n      border-radius: 22px;\n      padding: 34px;\n      box-shadow: 0 18px 50px rgba(0,0,0,.08);\n      border: 1px solid rgba(0,0,0,.08);\n    }\n\n    h1 {\n      margin-top: 0;\n      font-size: 34px;\n      line-height: 1.15;\n    }\n\n    h2 {\n      margin-top: 32px;\n      font-size: 21px;\n    }\n\n    a {\n      color: #000;\n      font-weight: 700;\n    }\n\n    .muted {\n      color: #666;\n      font-size: 14px;\n    }\n\n    .back {\n      display: inline-block;\n      margin-bottom: 20px;\n      text-decoration: none;\n    }\n\n    ul {\n      padding-left: 22px;\n    }\n  </style>\n</head>\n\n<body>\n  <main class=\"page\">\n    <a class=\"back\" href=\"/\">&larr; Back to Home</a>\n\n    <section class=\"card\">\n      <h1>Privacy Policy</h1>\n      <p class=\"muted\">Effective Date: May 15, 2026</p>\n\n      <p>\n        Ell Vii\u2019s Automations respects your privacy. This Privacy Policy explains how we collect,\n        use, and protect information submitted through our website, chatbot, contact forms, and\n        related business automation services.\n      </p>\n\n      <h2>1. Information We Collect</h2>\n      <p>We may collect information you choose to provide, including:</p>\n      <ul>\n        <li>Your first name</li>\n        <li>Email address</li>\n        <li>Phone number</li>\n        <li>Business name</li>\n        <li>Project details or service requests</li>\n        <li>Messages submitted through our chatbot or contact forms</li>\n      </ul>\n\n      <h2>2. How We Use Your Information</h2>\n      <p>We use submitted information to:</p>\n      <ul>\n        <li>Respond to your questions or service requests</li>\n        <li>Contact you about website, SEO, CRM, chatbot, or automation services</li>\n        <li>Schedule consultations or follow-ups</li>\n        <li>Improve our website, chatbot, and customer experience</li>\n        <li>Prepare proposals, quotes, or project recommendations</li>\n      </ul>\n\n      <h2>3. Chatbot and Lead Capture</h2>\n      <p>\n        Our chatbot may ask for your first name and either an email address or phone number before\n        continuing the conversation. This helps us personalize responses and gives us a point of\n        contact so we can follow up regarding your request.\n      </p>\n\n      <h2>4. Cookies, Local Storage, and Analytics</h2>\n      <p>\n        Our website may use browser storage, cookies, analytics tools, or similar technologies to\n        improve site performance, remember chatbot information, understand visitor behavior, and\n        improve our services.\n      </p>\n\n      <h2>5. Third-Party Services</h2>\n      <p>\n        We may use third-party tools for hosting, analytics, forms, CRM systems, chatbot services,\n        email communication, calendars, or automation workflows. These providers may process data\n        according to their own privacy policies.\n      </p>\n\n      <h2>6. Information Sharing</h2>\n      <p>\n        We do not sell your personal information. We may share information only when needed to\n        provide services, operate our business tools, comply with legal requirements, or protect our\n        rights and systems.\n      </p>\n\n      <h2>7. Data Security</h2>\n      <p>\n        We use reasonable safeguards to protect submitted information. However, no website,\n        internet transmission, or digital storage system can be guaranteed to be completely secure.\n      </p>\n\n      <h2>8. Your Choices</h2>\n      <p>\n        You may request that we update or delete your contact information by contacting us directly.\n        You may also choose not to submit information through the chatbot or contact forms.\n      </p>\n\n      <h2>9. Children\u2019s Privacy</h2>\n      <p>\n        Our services are intended for business owners and adults. We do not knowingly collect\n        personal information from children.\n      </p>\n\n      <h2>10. Updates to This Policy</h2>\n      <p>\n        We may update this Privacy Policy from time to time. Any changes will be posted on this\n        page with an updated effective date.\n      </p>\n\n      <h2>11. Contact</h2>\n      <p>\n        For privacy questions or requests, contact Ell Vii\u2019s Automations at:\n        <br />\n        <strong>Email:</strong> <a href=\"mailto:the.velasquez.law@gmail.com\">the.velasquez.law@gmail.com</a>\n      </p>\n    </section>\n  </main>\n</body>\n</html>\n";

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
  const rawContact = String(body.contact || "").trim();
  const contactType = detectContactType(rawContact);
  const sourcePage = String(body.sourcePage || "").trim();
  const userAgent = request.headers.get("User-Agent") || "";

  const contact =
    contactType === "phone"
      ? rawContact.replace(/\D/g, "")
      : rawContact.toLowerCase();

  if (!firstName || firstName.length < 2) {
    return jsonResponse({ success: false, error: "First name is required." }, 400);
  }

  if (!isValidEmail(rawContact) && !isValidPhone(rawContact)) {
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

  // Important: do not let message logging block lead capture.
  // If this part fails, the lead is already saved and the visitor should still continue.
  try {
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
  } catch (error) {
    console.warn("Lead saved, but system message logging failed:", error);
  }

  return jsonResponse({
    success: true,
    conversationId: id,
    firstName,
    contactType,
  });
}
async function handlePrototypeRequest(request, env) {
  if (!env.CHAT_DB) {
    return jsonResponse({ success: false, error: "CHAT_DB binding missing." }, 500);
  }

  const body = await parseJson(request);

  if (!body) {
    return jsonResponse({ success: false, error: "Invalid JSON body." }, 400);
  }

  const fullName = String(body.name || "").trim();
  const firstName = cleanFirstName(fullName);
  const business = String(body.business || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const interest = String(body.interest || "").trim();
  const message = String(body.message || "").trim();
  const sourcePage = String(body.sourcePage || "").trim() || "prototype-request-form";
  const userAgent = request.headers.get("User-Agent") || "";

  if (!firstName || firstName.length < 2) {
    return jsonResponse({ success: false, error: "Name is required." }, 400);
  }

  if (!isValidEmail(email)) {
    return jsonResponse({ success: false, error: "Valid email is required." }, 400);
  }

  const id = crypto.randomUUID();
  const timestamp = nowIso();

  await env.CHAT_DB.prepare(
    `INSERT INTO conversations
      (id, first_name, contact, contact_type, source_page, user_agent, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(id, firstName, email, "email", sourcePage, userAgent, timestamp, timestamp)
    .run();

  const details =
    `Prototype request submitted.
Name: ${fullName}
Business: ${business || "Not provided"}
Email: ${email}
Interest: ${interest || "Not provided"}
Message: ${message || "No message provided."}`;

  try {
    await env.CHAT_DB.prepare(
      `INSERT INTO messages (conversation_id, role, message, created_at)
       VALUES (?, ?, ?, ?)`
    )
      .bind(id, "system", details, timestamp)
      .run();
  } catch (error) {
    console.warn("Prototype lead saved, but message logging failed:", error);
  }

  return jsonResponse({
    success: true,
    conversationId: id,
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
    
    if (path === "/api/prototype-request" && request.method === "POST") {
      return handlePrototypeRequest(request, env);
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

    // Legal page routing — serve directly from Worker to avoid asset redirect issues
    if (path === "/terms" || path === "/terms.html") {
      return htmlResponse(legalTermsHTML);
    }

    if (path === "/privacy" || path === "/privacy.html") {
      return htmlResponse(legalPrivacyHTML);
    }

    if (env && env.ASSETS) {
      return assetResponse(request, env);
    }

    return new Response("Not Found", { status: 404 });
  },
};
