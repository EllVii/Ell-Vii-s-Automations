from pathlib import Path

path = Path("index.html")
html = path.read_text()

chatbot_css = r'''
    /* Ell Vii's Website Chatbot */
    .ev-chat-toggle{
      position:fixed;right:22px;bottom:22px;width:64px;height:64px;border-radius:22px;
      background:var(--brand);color:white;border:4px solid white;box-shadow:0 18px 40px rgba(15,23,42,.25);
      display:flex;align-items:center;justify-content:center;font-weight:950;cursor:pointer;z-index:100;
    }
    .ev-chat-panel{
      position:fixed;right:22px;bottom:96px;width:410px;max-width:calc(100vw - 32px);
      height:600px;max-height:calc(100vh - 120px);background:white;border:1px solid var(--line);
      border-radius:24px;box-shadow:0 24px 70px rgba(15,23,42,.25);display:none;flex-direction:column;
      overflow:hidden;z-index:100;
    }
    .ev-chat-header{background:var(--dark);color:white;padding:18px;display:flex;justify-content:space-between;align-items:center}
    .ev-chat-header b{display:block}.ev-chat-header span{font-size:11px;color:#cbd5e1;font-weight:800}
    .ev-chat-body{flex:1;overflow:auto;background:#f8fafc;padding:16px}
    .ev-msg{max-width:88%;padding:12px 14px;border-radius:16px;margin:0 0 10px;font-size:13px;line-height:1.45;white-space:pre-line}
    .ev-msg.bot{background:white;border:1px solid var(--line);color:var(--ink);border-top-left-radius:4px}
    .ev-msg.user{background:var(--brand);color:white;margin-left:auto;border-top-right-radius:4px}
    .ev-suggestions{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}
    .ev-suggestions button{
      border:1px solid var(--line);background:white;color:#334155;border-radius:999px;padding:9px 11px;
      font-size:12px;font-weight:900;cursor:pointer;
    }
    .ev-suggestions button:hover{border-color:var(--brand);color:var(--brand)}
    .ev-chat-input{border-top:1px solid var(--line);background:white;padding:12px;display:flex;gap:8px}
    .ev-chat-input input{flex:1;border:1px solid var(--line);border-radius:14px;padding:12px;font:inherit}
    .ev-chat-input button{border:0;background:var(--brand);color:white;border-radius:14px;padding:0 14px;font-weight:950;cursor:pointer}
    @media(max-width:900px){
      .ev-chat-panel{right:16px;bottom:88px;width:calc(100vw - 32px)}
      .ev-chat-toggle{right:16px;bottom:18px}
    }
'''

chatbot_html = r'''
  <!-- Ell Vii's Website Chatbot -->
  <div class="ev-chat-toggle" onclick="toggleEvChat()">Chat</div>

  <div class="ev-chat-panel" id="evChatPanel">
    <div class="ev-chat-header">
      <div>
        <b>Ell Vii's Assistant</b>
        <span>Website • CRM • Hosting • Phone Workflows</span>
      </div>
      <button onclick="toggleEvChat()" style="background:transparent;border:0;color:white;font-size:24px;cursor:pointer;">&times;</button>
    </div>

    <div class="ev-chat-body" id="evChatBody">
      <div class="ev-msg bot">
        Hi — I can help you figure out whether you need a website, CRM, hosting, upkeep, or a Twilio-powered phone workflow.
      </div>

      <div class="ev-suggestions" id="evSuggestions">
        <button onclick="evQuickReply('website')">I need a website</button>
        <button onclick="evQuickReply('websiteOnly')">Website only, no monthly?</button>
        <button onclick="evQuickReply('upkeep')">What does upkeep include?</button>
        <button onclick="evQuickReply('crm')">I need a CRM</button>
        <button onclick="evQuickReply('phone')">I miss calls/leads</button>
        <button onclick="evQuickReply('pricing')">Show pricing</button>
        <button onclick="evQuickReply('values')">Are you faith-based?</button>
      </div>
    </div>

    <div class="ev-chat-input">
      <input id="evChatInput" placeholder="Ask about websites, upkeep, CRM, hosting, or phones..." onkeydown="if(event.key==='Enter') evSendChat();" />
      <button onclick="evSendChat()">Send</button>
    </div>
  </div>

  <script>
    function toggleEvChat(){
      const panel = document.getElementById('evChatPanel');
      panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
    }

    function evAddMessage(text, who){
      const body = document.getElementById('evChatBody');
      const div = document.createElement('div');
      div.className = 'ev-msg ' + who;
      div.textContent = text;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }

    function evBotReply(text){
      setTimeout(function(){ evAddMessage(text, 'bot'); }, 250);
    }

    function evQuickReply(topic){
      const labels = {
        website: 'I need a website',
        websiteOnly: 'Can I just get a website with no monthly plan?',
        upkeep: 'What does website upkeep include?',
        crm: 'I need a CRM',
        phone: 'I miss calls/leads',
        pricing: 'Show pricing',
        values: 'Are you faith-based?'
      };

      evAddMessage(labels[topic] || topic, 'user');

      if(topic === 'website'){
        evBotReply('A website starts with the $375 Prototype Launch. That includes the website direction, lead-flow planning, call/book/pay structure, and basic SEO foundation. After launch, you can either manage it yourself or choose an upkeep plan.');
        document.getElementById('services')?.scrollIntoView({behavior:'smooth'});
      }

      if(topic === 'websiteOnly'){
        evBotReply('Yes. You can choose a website-only build with no monthly plan. After launch, the site is handed off and you are responsible for hosting, domain renewal, updates, edits, security, backups, forms, and broken third-party tools unless you choose a support plan. A short launch correction window is included for true launch issues.');
        document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'});
      }

      if(topic === 'upkeep'){
        evBotReply('Website upkeep is handled through Stay Live at $197/mo. It can include hosting support, SSL checks, basic updates, monthly site checks, form checks, small text/image edits, and basic technical support. Bigger redesigns, new pages, CRM, ads, phone workflows, or major SEO work are separate.');
        document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'});
      }

      if(topic === 'crm'){
        evBotReply('The CRM is separate from the public website. It includes industry modes for Home Services, Beauty/Wellness, Restaurant/Hospitality, and Housing/Rental. It helps track notes, follow-ups, pipeline, ELA accountability, and missed opportunities.');
        document.getElementById('crm')?.scrollIntoView({behavior:'smooth'});
      }

      if(topic === 'phone'){
        evBotReply('For missed calls and lead protection, we use Twilio-powered phone workflows. Options include full number porting, low-risk call forwarding, or hosted SMS when eligible. The goal is simple: calls and texts should create records instead of disappearing.');
        document.getElementById('phones')?.scrollIntoView({behavior:'smooth'});
      }

      if(topic === 'pricing'){
        evBotReply('Website Prototype Launch starts at $375 one-time. Stay Live starts at $197/mo. Growth Partner starts at $397/mo. CRM add-ons start at +$97/mo. Phone workflow add-ons start at +$79/mo with included usage allowances.');
        document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'});
      }

      if(topic === 'values'){
        evBotReply('Yes. Ell Vii’s Automations is Christian-led, faith-rooted, service-driven, and open to serving businesses of all backgrounds. We do not label people or businesses as good or bad. We serve with humility, grace, honesty, and excellence.');
        document.getElementById('values')?.scrollIntoView({behavior:'smooth'});
      }
    }

    function evSendChat(){
      const input = document.getElementById('evChatInput');
      const text = input.value.trim();
      if(!text) return;

      input.value = '';
      evAddMessage(text, 'user');

      const q = text.toLowerCase();

      if(
        q.includes('no monthly') ||
        q.includes('without monthly') ||
        q.includes('just a website') ||
        q.includes('only website') ||
        q.includes('website only') ||
        q.includes('one time') ||
        q.includes('one-time') ||
        q.includes('handoff') ||
        q.includes('hand off')
      ){
        evBotReply('Yes. You can choose a website-only build with no monthly plan. After launch, the site is handed off and you are responsible for hosting, domain renewal, updates, edits, security, backups, forms, and broken third-party tools unless you choose a support plan. If you need help later, support can be billed hourly or moved into a monthly plan.');
        return;
      }

      if(
        q.includes('upkeep') ||
        q.includes('maintenance') ||
        q.includes('support') ||
        q.includes('hosting') ||
        q.includes('ssl') ||
        q.includes('updates') ||
        q.includes('edit')
      ){
        evBotReply('Stay Live is the upkeep plan at $197/mo. It can include hosting support, SSL checks, basic updates, monthly site checks, form checks, small text/image edits, and basic technical support. Larger work is quoted separately.');
        return;
      }

      if(q.includes('price') || q.includes('cost') || q.includes('pricing') || q.includes('how much')){
        evQuickReply('pricing');
        return;
      }

      if(q.includes('crm') || q.includes('lead') || q.includes('follow') || q.includes('pipeline')){
        evQuickReply('crm');
        return;
      }

      if(q.includes('phone') || q.includes('call') || q.includes('text') || q.includes('twilio') || q.includes('missed')){
        evQuickReply('phone');
        return;
      }

      if(q.includes('website') || q.includes('site') || q.includes('seo')){
        evQuickReply('website');
        return;
      }

      if(q.includes('faith') || q.includes('christian') || q.includes('values') || q.includes('serve all')){
        evQuickReply('values');
        return;
      }

      evBotReply('Good question. The safest starting point is usually a website prototype. Then we add hosting, CRM, phone workflows, SEO, or AI only if the business actually needs them.');
    }
  </script>
'''

# Remove old chatbot block if present
start = html.find("  <!-- Ell Vii's Website Chatbot -->")
if start != -1:
    end = html.find("</body>", start)
    html = html[:start] + html[end:]

# Add CSS if missing
if "/* Ell Vii's Website Chatbot */" not in html:
    html = html.replace("</style>", chatbot_css + "\n  </style>")

# Add fresh chatbot before body close
html = html.replace("</body>", chatbot_html + "\n</body>")

path.write_text(html)
print("Chatbot updated with website-only, upkeep, CRM, phone, pricing, and values responses.")
