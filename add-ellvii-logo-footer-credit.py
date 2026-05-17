from pathlib import Path
import shutil

ROOT = Path(".")
PUBLIC_LOGO = ROOT / "public/assets/icon/ellvii-logo-dark-background.png"
PUBLIC_APP_ICON = ROOT / "public/assets/icon/ellvii-logo-app-icon.png"

ASSET_DIR = ROOT / "assets/icon"
ASSET_DIR.mkdir(parents=True, exist_ok=True)

TARGET_LOGO = ASSET_DIR / "ellvii-logo-dark-background.png"
TARGET_APP_ICON = ASSET_DIR / "ellvii-logo-app-icon.png"

# Copy logo assets from /public/assets/icon into /assets/icon
# This matters because the live static site is served from repo root.
if PUBLIC_LOGO.exists():
    shutil.copy2(PUBLIC_LOGO, TARGET_LOGO)
    print(f"Copied {PUBLIC_LOGO} -> {TARGET_LOGO}")
else:
    print(f"Warning: {PUBLIC_LOGO} not found")

if PUBLIC_APP_ICON.exists():
    shutil.copy2(PUBLIC_APP_ICON, TARGET_APP_ICON)
    print(f"Copied {PUBLIC_APP_ICON} -> {TARGET_APP_ICON}")

LOGO_SRC = "/assets/icon/ellvii-logo-dark-background.png"
DOMAIN = "https://ellviisautomations.com/"

FOOTER_CSS = r"""
/* Ell Vii's footer brand credit */
.ev-footer-credit{
  margin-top:28px;
  padding-top:24px;
  border-top:1px solid rgba(148,163,184,.28);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:18px;
  flex-wrap:wrap;
}

.ev-footer-credit a{
  color:inherit;
  text-decoration:none;
}

.ev-footer-brand{
  display:flex;
  align-items:center;
  gap:16px;
  min-width:260px;
}

.ev-footer-brand img{
  width:118px;
  max-width:34vw;
  height:auto;
  border-radius:18px;
  background:#020617;
  box-shadow:0 18px 45px rgba(15,23,42,.28);
}

.ev-footer-brand-copy{
  line-height:1.35;
}

.ev-footer-brand-copy strong{
  display:block;
  font-size:14px;
  letter-spacing:-.02em;
  color:inherit;
}

.ev-footer-brand-copy span{
  display:block;
  margin-top:4px;
  font-size:12px;
  color:inherit;
  opacity:.72;
}

.ev-footer-domain{
  font-size:12px;
  font-weight:950;
  letter-spacing:.08em;
  text-transform:uppercase;
  opacity:.82;
}

@media(max-width:720px){
  .ev-footer-credit{
    justify-content:center;
    text-align:center;
  }

  .ev-footer-brand{
    justify-content:center;
  }
}
"""

FOOTER_SNIPPET = f"""
      <div class="ev-footer-credit">
        <a class="ev-footer-brand" href="{DOMAIN}" target="_blank" rel="noopener" aria-label="Website made by Ell Vii's Automations">
          <img src="{LOGO_SRC}" alt="Ell Vii's Automations logo - Smart Websites Better Follow-Up" loading="lazy">
          <span class="ev-footer-brand-copy">
            <strong>Website made by Ell Vii’s Automations</strong>
            <span>Smart websites. Better follow-up.</span>
          </span>
        </a>
        <a class="ev-footer-domain" href="{DOMAIN}" target="_blank" rel="noopener">ellviisautomations.com</a>
      </div>
"""

def ensure_css(html: str) -> str:
    if "/* Ell Vii's footer brand credit */" in html:
        return html

    if "</style>" in html:
        return html.replace("</style>", FOOTER_CSS + "\n  </style>", 1)

    return "<style>\n" + FOOTER_CSS + "\n</style>\n" + html

def ensure_footer_credit(html: str) -> str:
    # Replace old version if it exists
    if "ev-footer-credit" in html:
        return html

    footer_end = html.rfind("</footer>")
    if footer_end != -1:
        return html[:footer_end] + "\n" + FOOTER_SNIPPET + "\n  " + html[footer_end:]

    body_end = html.rfind("</body>")
    fallback_footer = f"""
  <footer class="footer">
    <div class="wrap">
{FOOTER_SNIPPET}
    </div>
  </footer>
"""
    if body_end != -1:
        return html[:body_end] + fallback_footer + "\n" + html[body_end:]

    return html + fallback_footer

def patch_html(path: Path):
    if not path.exists():
        print(f"Skipped missing file: {path}")
        return

    html = path.read_text(encoding="utf-8")
    html = ensure_css(html)
    html = ensure_footer_credit(html)
    path.write_text(html, encoding="utf-8")
    print(f"Patched footer credit in {path}")

patch_html(ROOT / "index.html")
patch_html(ROOT / "crm-demo/index.html")

print("Done. Footer logo credit added to main website and CRM demo.")
