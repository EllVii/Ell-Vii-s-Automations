from pathlib import Path

# -----------------------------
# 1. Create hidden admin page
# -----------------------------
admin = r'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Ell Vii's Admin | Chat Review</title>
  <style>
    :root{
      --bg:#f8fafc;--card:#fff;--ink:#0f172a;--muted:#64748b;--line:#e2e8f0;
      --brand:#2563eb;--dark:#0f172a;--danger:#dc2626;--good:#16a34a;
      --shadow:0 16px 45px rgba(15,23,42,.10);--radius:22px;
    }
    *{box-sizing:border-box}
    body{margin:0;background:var(--bg);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
    .wrap{max-width:1180px;margin:0 auto;padding:28px 18px}
    .top{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;flex-wrap:wrap;margin-bottom:22px}
    h1{font-size:clamp(34px,6vw,60px);line-height:.92;letter-spacing:-.065em;margin:0}
    p{color:var(--muted);line-height:1.55}
    .card{background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:22px;box-shadow:var(--shadow)}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
    .btn{display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:14px;padding:12px 16px;font-weight:950;cursor:pointer;text-decoration:none}
    .primary{background:var(--brand);color:white}.secondary{background:#eef2f7;color:#334155;border:1px solid var(--line)}.danger{background:var(--danger);color:white}.good{background:var(--good);color:white}
    input,textarea,select{width:100%;border:1px solid var(--line);border-radius:14px;padding:12px 14px;font:inherit;background:white}
    textarea{min-height:120px;resize:vertical}
    label{display:block;font-size:11px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;color:#334155;margin-bottom:7px}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .item{border:1px solid var(--line);border-radius:16px;padding:14px;background:#fff;margin-bottom:10px}
    .item b{display:block;margin-bottom:4px}
    .small{font-size:12px;color:var(--muted)}
    .warn{background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;border-radius:16px;padding:14px;font-weight:800}
    @media(max-width:850px){.grid,.row{grid-template-columns:1fr}.btn{width:100%}}
  </style>
</head>
<body>
  <main class="wrap">
    <div class="top">
      <div>
        <h1>Chat Admin</h1>
        <p>Review local chatbot conversations and edit suggested responses.</p>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <a class="btn secondary" href="./index.html">Public Website</a>
        <a class="btn secondary" href="./crm-demo/">CRM Demo</a>
      </div>
    </div>

    <div class="warn">
      Demo privacy note: this page is hidden but not truly secure on a static site. Before using with real customers, protect this page with Cloudflare Access or backend login.
    </div>

    <section class="grid" style="margin-top:18px">
      <div class="card">
        <h2>Chat Response Library</h2>
        <p>These are the suggested responses your website chatbot can use.</p>

        <form onsubmit="saveResponse(event)">
          <div class="row">
            <div>
              <label>Response Key</label>
              <select id="responseKey"></select>
            </div>
            <div>
              <label>Label</label>
              <input id="responseLabel" placeholder="Website only, no monthly?">
            </div>
          </div>

          <div style="margin-top:12px">
            <label>Response Text</label>
            <textarea id="responseText"></textarea>
          </div>

          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
            <button class="btn primary" type="submit">Save Response</button>
            <button class="btn secondary" type="button" onclick="resetDefaults()">Reset Defaults</button>
          </div>
        </form>
      </div>

      <div class="card">
        <h2>Conversation Logs</h2>
        <p>Shows chatbot messages saved in this browser.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px">
          <button class="btn secondary" onclick="renderLogs()">Refresh</button>
          <button class="btn danger" onclick="clearLogs()">Clear Logs</button>
        </div>
        <div id="chatLogs"></div>
      </div>
    </section>
  </main>

  <script>
    const RESPONSE_KEY = 'ev_chat_responses_v1';
    const LOG_KEY = 'ev_chat_logs_v1';

    const DEFAULT_RESPONSES = {
      website: {
        label: 'I need a website',
        text: 'A website starts with the $375 Prototype Launch. That includes website direction, lead-flow planning, call/book/pay structure, and basic SEO foundation. After launch, you can manage it yourself or choose an upkeep plan.'
      },
      websiteOnly: {
        label: 'Website only, no monthly?',
        text: 'Yes. You can choose a website-only build with no monthly plan. After launch, the site is handed off and you are responsible for hosting, domain renewal, updates, edits, security, backups, forms, and broken third-party tools unless you choose a support plan.'
      },
      upkeep: {
        label: 'What does upkeep include?',
        text: 'Website upkeep is handled through Stay Live at $197/mo. It can include hosting support, SSL checks, basic updates, monthly site checks, form checks, small text/image edits, and basic technical support. Bigger redesigns, new pages, CRM, ads, phone workflows, or major SEO work are separate.'
      },
      crm: {
        label: 'I need a CRM',
        text: 'The CRM is separate from the public website. It includes industry modes for Home Services, Beauty/Wellness, Restaurant/Hospitality, and Housing/Rental. It helps track notes, follow-ups, pipeline, ELA accountability, and missed opportunities.'
      },
      phone: {
        label: 'I miss calls/leads',
        text: 'For missed calls and lead protection, we use Twilio-powered phone workflows. Options include full number porting, low-risk call forwarding, or hosted SMS when eligible. The goal is simple: calls and texts should create records instead of disappearing.'
      },
      pricing: {
        label: 'Show pricing',
        text: 'Website Prototype Launch starts at $375 one-time. Stay Live starts at $197/mo. Growth Partner starts at $397/mo. CRM add-ons start at +$97/mo. Phone workflow add-ons start at +$79/mo with included usage allowances.'
      },
      values: {
        label: 'Are you faith-based?',
        text: 'Yes. Ell Vii’s Automations is Christian-led, faith-rooted, service-driven, and open to serving businesses of all backgrounds. We do not label people or businesses as good or bad. We serve with humility, grace, honesty, and excellence.'
      }
    };

    function getResponses(){
      return JSON.parse(localStorage.getItem(RESPONSE_KEY)) || DEFAULT_RESPONSES;
    }

    function saveResponses(data){
      localStorage.setItem(RESPONSE_KEY, JSON.stringify(data));
    }

    function populateKeys(){
      const data = getResponses();
      const select = document.getElementById('responseKey');
      select.innerHTML = Object.keys(data).map(k => `<option value="${k}">${k}</option>`).join('');
      loadSelected();
    }

    function loadSelected(){
      const data = getResponses();
      const key = document.getElementById('responseKey').value;
      document.getElementById('responseLabel').value = data[key]?.label || '';
      document.getElementById('responseText').value = data[key]?.text || '';
    }

    function saveResponse(e){
      e.preventDefault();
      const data = getResponses();
      const key = document.getElementById('responseKey').value;
      data[key] = {
        label: document.getElementById('responseLabel').value,
        text: document.getElementById('responseText').value
      };
      saveResponses(data);
      alert('Response saved.');
    }

    function resetDefaults(){
      if(!confirm('Reset all chatbot responses to defaults?')) return;
      saveResponses(DEFAULT_RESPONSES);
      populateKeys();
    }

    function renderLogs(){
      const logs = JSON.parse(localStorage.getItem(LOG_KEY)) || [];
      const box = document.getElementById('chatLogs');

      if(!logs.length){
        box.innerHTML = '<p class="small">No logs saved in this browser yet.</p>';
        return;
      }

      box.innerHTML = logs.slice().reverse().map(log => `
        <div class="item">
          <b>${log.role === 'user' ? 'Visitor' : 'Assistant'}</b>
          <div>${escapeHtml(log.text)}</div>
          <div class="small">${new Date(log.time).toLocaleString()}</div>
        </div>
      `).join('');
    }

    function clearLogs(){
      if(!confirm('Clear chatbot logs from this browser?')) return;
      localStorage.removeItem(LOG_KEY);
      renderLogs();
    }

    function escapeHtml(text){
      const p = document.createElement('p');
      p.textContent = text || '';
      return p.innerHTML;
    }

    document.getElementById('responseKey').addEventListener('change', loadSelected);
    populateKeys();
    renderLogs();
  </script>
</body>
</html>
'''
Path("admin.html").write_text(admin)

# -----------------------------
# 2. Patch public website chatbot to use editable responses + logs
# -----------------------------
site_path = Path("index.html")
site = site_path.read_text()

patch_script = r'''
  <script>
    window.EV_CHAT_RESPONSE_KEY = 'ev_chat_responses_v1';
    window.EV_CHAT_LOG_KEY = 'ev_chat_logs_v1';

    window.EV_DEFAULT_CHAT_RESPONSES = {
      website: {
        label: 'I need a website',
        text: 'A website starts with the $375 Prototype Launch. That includes website direction, lead-flow planning, call/book/pay structure, and basic SEO foundation. After launch, you can manage it yourself or choose an upkeep plan.'
      },
      websiteOnly: {
        label: 'Website only, no monthly?',
        text: 'Yes. You can choose a website-only build with no monthly plan. After launch, the site is handed off and you are responsible for hosting, domain renewal, updates, edits, security, backups, forms, and broken third-party tools unless you choose a support plan.'
      },
      upkeep: {
        label: 'What does upkeep include?',
        text: 'Website upkeep is handled through Stay Live at $197/mo. It can include hosting support, SSL checks, basic updates, monthly site checks, form checks, small text/image edits, and basic technical support. Bigger redesigns, new pages, CRM, ads, phone workflows, or major SEO work are separate.'
      },
      crm: {
        label: 'I need a CRM',
        text: 'The CRM is separate from the public website. It includes industry modes for Home Services, Beauty/Wellness, Restaurant/Hospitality, and Housing/Rental. It helps track notes, follow-ups, pipeline, ELA accountability, and missed opportunities.'
      },
      phone: {
        label: 'I miss calls/leads',
        text: 'For missed calls and lead protection, we use Twilio-powered phone workflows. Options include full number porting, low-risk call forwarding, or hosted SMS when eligible. The goal is simple: calls and texts should create records instead of disappearing.'
      },
      pricing: {
        label: 'Show pricing',
        text: 'Website Prototype Launch starts at $375 one-time. Stay Live starts at $197/mo. Growth Partner starts at $397/mo. CRM add-ons start at +$97/mo. Phone workflow add-ons start at +$79/mo with included usage allowances.'
      },
      values: {
        label: 'Are you faith-based?',
        text: 'Yes. Ell Vii’s Automations is Christian-led, faith-rooted, service-driven, and open to serving businesses of all backgrounds. We do not label people or businesses as good or bad. We serve with humility, grace, honesty, and excellence.'
      }
    };

    function evGetResponses(){
      return JSON.parse(localStorage.getItem(window.EV_CHAT_RESPONSE_KEY)) || window.EV_DEFAULT_CHAT_RESPONSES;
    }

    function evLogMessage(text, role){
      const logs = JSON.parse(localStorage.getItem(window.EV_CHAT_LOG_KEY)) || [];
      logs.push({ text, role, time: new Date().toISOString() });
      localStorage.setItem(window.EV_CHAT_LOG_KEY, JSON.stringify(logs.slice(-200)));
    }

    function evRespondFromLibrary(topic){
      const data = evGetResponses();
      const response = data[topic] || window.EV_DEFAULT_CHAT_RESPONSES[topic];
      if(response){
        evBotReply(response.text);
      }
    }
  </script>
'''

if "window.EV_CHAT_RESPONSE_KEY" not in site:
    site = site.replace("<!-- Ell Vii's Website Chatbot -->", patch_script + "\n  <!-- Ell Vii's Website Chatbot -->")

# Patch evAddMessage to log messages if not already patched
old = """      body.appendChild(div);
      body.scrollTop = body.scrollHeight;"""
new = """      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
      if(typeof evLogMessage === 'function') evLogMessage(text, who);"""
if old in site and "evLogMessage(text, who)" not in site:
    site = site.replace(old, new)

# Patch evQuickReply response blocks to prefer library
# Safe lightweight: add an early library response variable after user message, then each topic uses evRespondFromLibrary.
replacements = {
"evBotReply('A website starts with the $375 Prototype Launch. That includes the website direction, lead-flow planning, call/book/pay structure, and basic SEO foundation. After launch, you can either manage it yourself or choose an upkeep plan.');": "evRespondFromLibrary('website');",
"evBotReply('Yes. You can choose a website-only build with no monthly plan. After launch, the site is handed off and you are responsible for hosting, domain renewal, updates, edits, security, backups, forms, and broken third-party tools unless you choose a support plan. A short launch correction window is included for true launch issues.');": "evRespondFromLibrary('websiteOnly');",
"evBotReply('Website upkeep is handled through Stay Live at $197/mo. It can include hosting support, SSL checks, basic updates, monthly site checks, form checks, small text/image edits, and basic technical support. Bigger redesigns, new pages, CRM, ads, phone workflows, or major SEO work are separate.');": "evRespondFromLibrary('upkeep');",
"evBotReply('The CRM is separate from the public website. It includes industry modes for Home Services, Beauty/Wellness, Restaurant/Hospitality, and Housing/Rental. It helps track notes, follow-ups, pipeline, ELA accountability, and missed opportunities.');": "evRespondFromLibrary('crm');",
"evBotReply('For missed calls and lead protection, we use Twilio-powered phone workflows. Options include full number porting, low-risk call forwarding, or hosted SMS when eligible. The goal is simple: calls and texts should create records instead of disappearing.');": "evRespondFromLibrary('phone');",
"evBotReply('Website Prototype Launch starts at $375 one-time. Stay Live starts at $197/mo. Growth Partner starts at $397/mo. CRM add-ons start at +$97/mo. Phone workflow add-ons start at +$79/mo with included usage allowances.');": "evRespondFromLibrary('pricing');",
"evBotReply('Yes. Ell Vii’s Automations is Christian-led, faith-rooted, service-driven, and open to serving businesses of all backgrounds. We do not label people or businesses as good or bad. We serve with humility, grace, honesty, and excellence.');": "evRespondFromLibrary('values');"
}
for a,b in replacements.items():
    site = site.replace(a,b)

site_path.write_text(site)

# -----------------------------
# 3. Add CRM Chat Admin section
# -----------------------------
crm_path = Path("crm-demo/index.html")
crm = crm_path.read_text()

# Add nav button
if "Chat Admin" not in crm:
    crm = crm.replace('<button onclick="navTo(\'settings\',this)">Settings</button>', '<button onclick="navTo(\'chatAdmin\',this)">Chat Admin</button>\n        <button onclick="navTo(\'settings\',this)">Settings</button>')

# Add section before settings
chat_section = r'''
      <section id="chatAdmin" class="section">
        <div class="grid two">
          <div class="card">
            <h3 style="margin-top:0">Chat Response Library</h3>
            <p class="muted">Edit suggested website chatbot responses. This demo uses browser storage. Production should use a database.</p>

            <div class="form-group">
              <label>Response Key</label>
              <select id="crmResponseKey" onchange="crmLoadChatResponse()"></select>
            </div>

            <div class="form-group">
              <label>Label</label>
              <input id="crmResponseLabel">
            </div>

            <div class="form-group">
              <label>Response Text</label>
              <textarea id="crmResponseText"></textarea>
            </div>

            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn primary inline" onclick="crmSaveChatResponse()">Save Response</button>
              <button class="btn secondary inline" onclick="crmResetChatResponses()">Reset Defaults</button>
            </div>
          </div>

          <div class="card">
            <h3 style="margin-top:0">Website Chat Logs</h3>
            <p class="muted">Local website chatbot logs saved in this browser.</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px">
              <button class="btn secondary inline" onclick="crmRenderChatLogs()">Refresh</button>
              <button class="btn danger inline" onclick="crmClearChatLogs()">Clear Logs</button>
            </div>
            <div id="crmChatLogs"></div>
          </div>
        </div>
      </section>
'''
if '<section id="chatAdmin"' not in crm:
    crm = crm.replace('      <section id="settings" class="section">', chat_section + '\n      <section id="settings" class="section">')

# Add JS helpers before final </script>
crm_js = r'''
function crmDefaultResponses(){
  return {
    website:{label:'I need a website',text:'A website starts with the $375 Prototype Launch. That includes website direction, lead-flow planning, call/book/pay structure, and basic SEO foundation. After launch, you can manage it yourself or choose an upkeep plan.'},
    websiteOnly:{label:'Website only, no monthly?',text:'Yes. You can choose a website-only build with no monthly plan. After launch, the site is handed off and you are responsible for hosting, domain renewal, updates, edits, security, backups, forms, and broken third-party tools unless you choose a support plan.'},
    upkeep:{label:'What does upkeep include?',text:'Website upkeep is handled through Stay Live at $197/mo. It can include hosting support, SSL checks, basic updates, monthly site checks, form checks, small text/image edits, and basic technical support. Bigger redesigns, new pages, CRM, ads, phone workflows, or major SEO work are separate.'},
    crm:{label:'I need a CRM',text:'The CRM is separate from the public website. It includes industry modes for Home Services, Beauty/Wellness, Restaurant/Hospitality, and Housing/Rental. It helps track notes, follow-ups, pipeline, ELA accountability, and missed opportunities.'},
    phone:{label:'I miss calls/leads',text:'For missed calls and lead protection, we use Twilio-powered phone workflows. Options include full number porting, low-risk call forwarding, or hosted SMS when eligible. The goal is simple: calls and texts should create records instead of disappearing.'},
    pricing:{label:'Show pricing',text:'Website Prototype Launch starts at $375 one-time. Stay Live starts at $197/mo. Growth Partner starts at $397/mo. CRM add-ons start at +$97/mo. Phone workflow add-ons start at +$79/mo with included usage allowances.'},
    values:{label:'Are you faith-based?',text:'Yes. Ell Vii’s Automations is Christian-led, faith-rooted, service-driven, and open to serving businesses of all backgrounds. We do not label people or businesses as good or bad. We serve with humility, grace, honesty, and excellence.'}
  };
}
function crmGetChatResponses(){return JSON.parse(localStorage.getItem('ev_chat_responses_v1'))||crmDefaultResponses()}
function crmSaveChatResponses(data){localStorage.setItem('ev_chat_responses_v1',JSON.stringify(data))}
function crmPopulateChatAdmin(){
  const select=document.getElementById('crmResponseKey');
  if(!select) return;
  const data=crmGetChatResponses();
  select.innerHTML=Object.keys(data).map(k=>`<option value="${k}">${k}</option>`).join('');
  crmLoadChatResponse();
  crmRenderChatLogs();
}
function crmLoadChatResponse(){
  const data=crmGetChatResponses();
  const key=document.getElementById('crmResponseKey')?.value;
  if(!key) return;
  document.getElementById('crmResponseLabel').value=data[key]?.label||'';
  document.getElementById('crmResponseText').value=data[key]?.text||'';
}
function crmSaveChatResponse(){
  const data=crmGetChatResponses();
  const key=document.getElementById('crmResponseKey').value;
  data[key]={label:document.getElementById('crmResponseLabel').value,text:document.getElementById('crmResponseText').value};
  crmSaveChatResponses(data);
  alert('Chat response saved.');
}
function crmResetChatResponses(){
  if(!confirm('Reset chatbot responses to defaults?')) return;
  crmSaveChatResponses(crmDefaultResponses());
  crmPopulateChatAdmin();
}
function crmRenderChatLogs(){
  const box=document.getElementById('crmChatLogs');
  if(!box) return;
  const logs=JSON.parse(localStorage.getItem('ev_chat_logs_v1'))||[];
  if(!logs.length){box.innerHTML='<p class="small">No website chatbot logs saved in this browser yet.</p>';return;}
  box.innerHTML=logs.slice().reverse().map(log=>`<div class="ai-card"><b>${log.role==='user'?'Visitor':'Assistant'}</b><br><span>${esc(log.text)}</span><br><small class="muted">${new Date(log.time).toLocaleString()}</small></div>`).join('');
}
function crmClearChatLogs(){
  if(!confirm('Clear local website chatbot logs?')) return;
  localStorage.removeItem('ev_chat_logs_v1');
  crmRenderChatLogs();
}
'''
if "function crmDefaultResponses()" not in crm:
    crm = crm.replace("render();", crm_js + "\nrender();\ncrmPopulateChatAdmin();")

# update page titles mapping to include chatAdmin
crm = crm.replace('settings:"Settings"}[id]||id', 'chatAdmin:"Chat Admin",settings:"Settings"}[id]||id')

crm_path.write_text(crm)

print("Added admin.html, patched public chatbot logging/editable responses, and added CRM Chat Admin section.")
