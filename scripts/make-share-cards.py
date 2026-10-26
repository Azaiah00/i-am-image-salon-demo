"""
Regenerates the link-preview cards (what shows when a link is texted or posted).
  pip install playwright && python -m playwright install chromium
  python scripts/make-share-cards.py
Writes public/og.jpg and public/og/*.jpg (1200x630). Edit copy/prices below, then rerun.
"""
import os, re, shutil
from playwright.sync_api import sync_playwright
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P=f"{R}/public"; F=f"{R}/src/app/fonts"; O=f"{R}/scripts/.share-cards"
os.makedirs(O, exist_ok=True); os.makedirs(f"{P}/og", exist_ok=True)
def art(name, cls=""):
    s=open(f"{P}/media/art/{name}.svg").read()
    s=s.replace('<svg ', f'<svg class="art {cls}" preserveAspectRatio="xMidYMid meet" ',1)
    s=s.replace('<style>path{','<style>.art path{')
    s=re.sub(r'animation:d[^;}]*;?','',s)
    s=re.sub(r'stroke-dashoffset:[0-9.]+;?','',s)
    return s
LOGO=f"file://{P}/media/brand/logo-dark.svg"
SPIRAL=f"file://{P}/media/brand/spiral.svg"
ICON={
 "user":'<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
 "crown":'<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>',
 "scissors":'<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',
 "check":'<path d="M20 6 9 17l-5-5"/>',
 "arrow":'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
 "clock":'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
 "pin":'<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
 "compass":'<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/>',
}
def ic(n,size=22,color="currentColor",sw=2): return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round">{ICON[n]}</svg>'
STAR='<svg width="22" height="22" viewBox="0 0 24 24" fill="#f92505"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>'
STARS=STAR*5
BASE=f"""
@font-face{{font-family:Jost;src:url(file://{F}/jost-var.woff2) format('woff2');font-weight:100 900}}
@font-face{{font-family:Pinyon;src:url(file://{F}/pinyon.woff2) format('woff2')}}
*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{width:1200px;height:630px;overflow:hidden}}
body{{background:#0b0a0a;color:#f4f1ee;font-family:Jost,sans-serif;position:relative;-webkit-font-smoothing:antialiased}}
.glow{{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none}}
.script{{font-family:Pinyon;color:#ff4a3d;font-weight:400;font-size:1.22em;line-height:.6;padding-right:.08em}}
.eyebrow{{font-size:15px;letter-spacing:.34em;text-transform:uppercase;color:#ff4a3d;font-weight:500}}
.display{{font-weight:400;letter-spacing:-.025em;line-height:.98}}
.muted{{color:#a3a3a8}}
.pill{{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:9px 18px;font-size:18px;color:#d9d7d5}}
.cta{{display:inline-flex;align-items:center;gap:12px;background:#c8140e;color:#fff;border-radius:999px;padding:16px 30px;font-size:22px;font-weight:500;box-shadow:0 18px 50px -12px rgba(249,37,5,.75)}}
.neon .art path{{stroke-width:2.6;filter:drop-shadow(0 0 6px rgba(249,37,5,.85))}}
.grain{{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.035) 1px,transparent 1px);background-size:3px 3px;pointer-events:none}}
.frame{{position:absolute;inset:18px;border:1px solid rgba(249,37,5,.22);border-radius:28px;pointer-events:none}}
.brand{{display:flex;align-items:center;gap:14px}}
.brand img{{height:64px}}
.brand b{{display:block;font-weight:500;letter-spacing:.32em;font-size:19px}}
.brand span{{display:block;font-size:12px;letter-spacing:.3em;color:#ff4a3d;margin-top:5px;text-transform:uppercase}}
"""
def brand(sub="Hair Salon · NW Portland"):
    return f'<div class="brand"><img src="{LOGO}"><div><b>I AM IMAGE</b><span>{sub}</span></div></div>'
def page(body, extra=""):
    return f"<!doctype html><html><head><meta charset='utf-8'><style>{BASE}{extra}</style></head><body>{body}<div class='grain'></div><div class='frame'></div></body></html>"

cards={}
# ---------------- SITE
cards["og"]=page(f"""
<div class="glow" style="width:620px;height:620px;right:-60px;top:20px;background:rgba(200,20,14,.38)"></div>
<img src="{SPIRAL}" style="position:absolute;right:120px;top:-120px;width:520px;opacity:.10">
<div style="position:absolute;left:72px;top:60px;width:640px">
  {brand()}
  <h1 class="display" style="font-size:70px;margin-top:50px">Elevate your look.<br>Empower your <span class="script">image.</span></h1>
  <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:34px;width:540px">
    <span class="pill">Locs</span><span class="pill">Knotless braids</span><span class="pill">Silk press</span><span class="pill">Color &amp; cuts</span><span class="pill">Sew-ins</span><span class="pill">Fades</span>
  </div>
  <div style="display:flex;align-items:center;gap:14px;margin-top:32px">
    <div style="display:flex;gap:3px">{STARS}</div><span style="font-size:20px">5.0 on Google</span><span class="muted" style="font-size:20px">· Since 2011</span>
  </div>
</div>
<div style="position:absolute;right:250px;top:70px;height:600px;opacity:.16">{art("braids","h")}</div>
<div style="position:absolute;right:-60px;top:70px;height:600px;opacity:.16">{art("silkpress","h")}</div>
<div class="neon" style="position:absolute;right:70px;top:36px;height:640px">{art("locs","h")}</div>
<div style="position:absolute;right:56px;bottom:46px;display:flex;gap:8px;font-size:13px;letter-spacing:.24em;color:#d9d7d5;text-transform:uppercase">
  <span>Locs</span><span style="color:#ff4a3d">→</span><span>Braids</span><span style="color:#ff4a3d">→</span><span>Silk press</span>
</div>
""", ".h{height:100%;width:auto;display:block}")

# ---------------- BOOK
cards["book"]=page(f"""
<div class="glow" style="width:640px;height:640px;right:-80px;top:-40px;background:rgba(200,20,14,.42)"></div>
<div style="position:absolute;right:330px;top:40px;height:600px;opacity:.07">{art("silkpress","h")}</div>
<div style="position:absolute;left:72px;top:64px;width:560px">
  {brand("Book online")}
  <h1 class="display" style="font-size:94px;margin-top:52px">Book your<br>next <span class="script">look.</span></h1>
  <p style="font-size:24px;line-height:1.4;color:#d9d7d5;margin-top:26px;width:500px">Pick your service, stylist and time. See your price before you confirm.</p>
  <div style="margin-top:36px" class="cta">Book now {ic("arrow",24,"#fff",2.4)}</div>
</div>
<div style="position:absolute;right:78px;top:62px;width:420px;transform:rotate(3deg);border-radius:30px;background:linear-gradient(160deg,#1f1b1b,#131111);border:1px solid rgba(255,255,255,.12);box-shadow:0 40px 90px -20px rgba(0,0,0,.9),0 0 0 1px rgba(249,37,5,.18),0 0 80px -10px rgba(249,37,5,.35);padding:28px">
  <div style="display:flex;justify-content:space-between;align-items:center"><span class="eyebrow" style="font-size:12px;color:#a3a3a8">Your booking</span><span style="font-size:13px;color:#ff4a3d;letter-spacing:.14em">STEP 4 OF 5</span></div>
  <div style="display:flex;gap:6px;margin-top:14px">{''.join(f'<span style="flex:1;height:5px;border-radius:9px;background:{"#f92505" if i<4 else "rgba(255,255,255,.1)"}"></span>' for i in range(5))}</div>
  <div style="margin-top:22px;padding:16px 18px;border-radius:18px;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;align-items:center">
    <div><div style="font-size:21px">Cécred Silk Press</div><div class="muted" style="font-size:15px;margin-top:4px;display:flex;align-items:center;gap:6px">{ic("clock",15,"#a3a3a8")} 1 hr 30 min</div></div>
    <div style="font-size:24px">$100</div>
  </div>
  <div style="margin-top:12px;padding:14px 18px;border-radius:18px;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:12px">
    <span style="width:38px;height:38px;border-radius:50%;background:rgba(249,37,5,.16);color:#ff4a3d;display:grid;place-items:center;font-size:17px">K</span>
    <div><div style="font-size:18px">Kayla Means</div><div class="muted" style="font-size:14px">Owner · stylist</div></div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-top:16px">
    {''.join(f'<div style="text-align:center;padding:10px 0;border-radius:14px;font-size:14px;{"background:#c8140e;color:#fff" if d=="Thu" else "border:1px solid rgba(255,255,255,.12);color:#d9d7d5"}">{d}</div>' for d in ["Mon","Tue","Thu","Fri","Sat"])}
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:8px">
    {''.join(f'<div style="text-align:center;padding:10px 0;border-radius:14px;font-size:15px;{"background:#f4f1ee;color:#1a1717;font-weight:500" if t=="11:30 AM" else "border:1px solid rgba(255,255,255,.12);color:#d9d7d5"}">{t}</div>' for t in ["10:00 AM","11:30 AM","1:00 PM"])}
  </div>
  <div style="margin-top:18px;padding-top:16px;border-top:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;align-items:end">
    <div><div class="muted" style="font-size:14px">Total</div><div style="font-size:34px;line-height:1">$100</div></div>
    <div style="display:flex;align-items:center;gap:8px;background:#c8140e;border-radius:999px;padding:11px 18px;font-size:16px">{ic("check",17,"#fff",2.6)} Confirm</div>
  </div>
</div>
""", ".h{height:100%;width:auto;display:block}")

# ---------------- PORTAL
def role(icon,t,d,hi=False):
    return f'''<div style="flex:1;border-radius:26px;padding:26px 24px;background:{"linear-gradient(160deg,rgba(200,20,14,.38),#1c1919 55%,#131111)" if hi else "linear-gradient(160deg,#1c1919,#131111)"};border:1px solid {"rgba(255,74,61,.7)" if hi else "rgba(255,255,255,.12)"};{"box-shadow:0 30px 70px -25px rgba(249,37,5,.8);" if hi else ""}">
    <span style="width:54px;height:54px;border-radius:16px;display:grid;place-items:center;background:{"#c8140e" if hi else "rgba(249,37,5,.12)"};color:{"#fff" if hi else "#ff4a3d"}">{ic(icon,26)}</span>
    <div style="font-size:30px;margin-top:20px">{t}</div><div class="muted" style="font-size:17px;line-height:1.35;margin-top:8px">{d}</div></div>'''
cards["portal"]=page(f"""
<div class="glow" style="width:700px;height:500px;left:250px;top:250px;background:rgba(200,20,14,.30)"></div>
<div style="position:absolute;left:72px;top:60px;right:72px">
  <div style="display:flex;justify-content:space-between;align-items:center">{brand("Booking portal")}<span style="display:inline-flex;align-items:center;gap:8px;border-radius:999px;background:#c8140e;padding:9px 18px;font-size:15px;letter-spacing:.18em;font-weight:500">{ic("compass",17,"#fff")} INTERACTIVE DEMO</span></div>
  <h1 class="display" style="font-size:76px;margin-top:40px">One portal. <span class="script">Three</span> views.</h1>
  <p style="font-size:22px;color:#d9d7d5;margin-top:16px">Choose who you are and a guide walks you through every feature.</p>
  <div style="display:flex;gap:18px;margin-top:34px">
    {role("user","Client","Book, reschedule, rewards and a photo journey")}
    {role("crown","Owner","Every chair, client and dollar in one place",True)}
    {role("scissors","Stylist","Your own calendar, clients and earnings")}
  </div>
</div>
""")

# ---------------- MENU
CATS=[("locs","Locs",60),("braids","Braids",65),("silkpress","Silk press",25),("pixie","Color & cuts",45),("weave","Weaves & wigs",125),("barber","Barber",20),("kids","Kids",65)]
def tile(a,n,p):
    return f'''<div style="position:relative;height:196px;border-radius:22px;overflow:hidden;background:linear-gradient(170deg,#1c1919,#110f0f);border:1px solid rgba(255,255,255,.1)">
      <div style="position:absolute;left:50%;top:-6px;transform:translateX(-50%);width:210px;height:300px" class="neon">{art(a,"w")}</div>
      <div style="position:absolute;inset:auto 0 0 0;padding:44px 16px 14px;background:linear-gradient(to top,#0b0a0a 35%,transparent)"><div style="font-size:20px">{n}</div><div style="font-size:15px;color:#ff4a3d;margin-top:2px">from ${p}</div></div></div>'''
cards["menu"]=page(f"""
<div class="glow" style="width:600px;height:600px;right:-100px;top:-120px;background:rgba(200,20,14,.30)"></div>
<div style="position:absolute;left:66px;top:60px;width:300px">
  {brand("The full menu")}
  <h1 class="display" style="font-size:62px;margin-top:44px">Every<br><span class="script">look,</span><br>one chair.</h1>
  <p style="font-size:20px;line-height:1.4;color:#d9d7d5;margin-top:20px">74 services for women, men and kids. Prices and times up front.</p>
</div>
<div style="position:absolute;left:400px;right:62px;top:62px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px">
  {''.join(tile(*c) for c in CATS[:4])}
</div>
<div style="position:absolute;left:400px;right:62px;top:290px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px">
  {''.join(tile(*c) for c in CATS[4:])}
  <div style="height:196px;border-radius:22px;background:#c8140e;display:flex;flex-direction:column;justify-content:space-between;padding:20px;box-shadow:0 24px 60px -20px rgba(249,37,5,.8)"><div style="font-size:15px;letter-spacing:.2em">BOOK ONLINE</div><div style="display:flex;justify-content:space-between;align-items:end"><div style="font-size:30px;line-height:1.05">See all<br>74</div>{ic("arrow",30,"#fff",2.4)}</div></div>
</div>
<div style="position:absolute;left:66px;bottom:60px;display:flex;align-items:center;gap:12px"><div style="display:flex;gap:3px">{STARS}</div><span style="font-size:18px">5.0 on Google</span></div>
""", ".w{width:100%;height:auto;display:block}")

# ---------------- CATEGORY PAGES
LAND={
 "locs":("locs","Locs",60,["Your loc journey,","started","right."],["Starter locs","Retwists","Interlocking","Repair"]),
 "braids":("braids","Braids",65,["Braids that","last","— and protect."],["Knotless","Box braids","Boho","Stitch braids"]),
 "silk-press":("silkpress","Silk Press",25,["Silk that","swings","— and stays healthy."],["Cécred silk press","Blowouts","Treatments"]),
 "color-and-cuts":("pixie","Color & Cuts",45,["Color that","pops.","Cuts that hold."],["Color","Highlights","Pixie cuts","Trims"]),
 "weaves-and-wigs":("weave","Weaves & Wigs",125,["Installs so","seamless","they’re yours."],["Sew-ins","Closures","Wig installs"]),
 "barber":("barber","Barber",20,["Sharp lines.","Clean","fades."],["Fades","Line-ups","Beard"]),
 "kids":("kids","Kids",65,["Little crowns,","gentle","hands."],["Kids braids","Styles","Cuts"]),
}
PILLS_OK={}
for slug,(a,name,p,h1,_) in LAND.items():
    l1,acc,l3=h1
    fs=84 if len(l1+acc+l3)<30 else 70
    cards[f"og-{slug}"]=page(f"""
<div class="glow" style="width:620px;height:620px;right:-60px;top:10px;background:rgba(200,20,14,.38)"></div>
<img src="{SPIRAL}" style="position:absolute;right:300px;top:-90px;width:300px;opacity:.12">
<div style="position:absolute;left:72px;top:64px;width:640px">
  {brand(name)}
  <div class="eyebrow" style="margin-top:46px">{name} · NW Portland</div>
  <h1 class="display" style="font-size:{fs}px;margin-top:16px;max-width:{560 if fs==70 else 640}px">{l1}<br><span class="script">{acc}</span> {l3}</h1>
  <div style="display:flex;align-items:center;gap:22px;margin-top:34px">
    <div class="cta">Book {name.lower() if name!="Kids" else "kids"} {ic("arrow",22,"#fff",2.4)}</div>
    <div><div class="muted" style="font-size:16px">Starting at</div><div style="font-size:34px;line-height:1">${p}</div></div>
  </div>
  <div style="display:flex;align-items:center;gap:12px;margin-top:28px"><div style="display:flex;gap:3px">{STARS}</div><span style="font-size:18px">5.0 on Google · Since 2011</span></div>
</div>
<div class="neon" style="position:absolute;right:70px;top:30px;height:650px">{art(a,"h")}</div>
""", ".h{height:100%;width:auto;display:block}")

with sync_playwright() as pw:
    br=pw.chromium.launch()
    ctx=br.new_context(viewport={"width":1200,"height":630},device_scale_factor=1,reduced_motion="reduce")
    pg=ctx.new_page()
    for k,html in cards.items():
        f=f"{O}/{k}.html"; open(f,"w").write(html)
        pg.goto("file://"+f); pg.wait_for_timeout(500)
        pg.evaluate("document.fonts.ready")
        pg.screenshot(path=f"{O}/{k}.jpg",type="jpeg",quality=88)
    br.close()
for k in cards:
    dest = f"{P}/og.jpg" if k == "og" else f"{P}/og/{k.removeprefix('og-')}.jpg"
    shutil.copy(f"{O}/{k}.jpg", dest)
print("ok", list(cards))
