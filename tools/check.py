import sys, json
from playwright.sync_api import sync_playwright
BASE=sys.argv[1]; OUT=sys.argv[2] if len(sys.argv)>2 else 'docs/screenshots'
R=['/','/search','/search?city=Chicago','/listing/b1003','/listing/b1007','/login','/dashboard','/dashboard?tab=Campaigns','/dashboard?tab=Bookings','/dashboard?tab=Creatives','/dashboard?tab=Invoices','/messages','/notifications','/favorites','/account','/help','/pricing','/about','/careers','/blog','/blog/measuring-ooh','/terms','/privacy','/owners','/nope']
OWN=['/dashboard','/dashboard?tab=My listings','/dashboard?tab=Requests','/dashboard?tab=Calendar','/dashboard?tab=Earnings','/dashboard?tab=Payouts','/dashboard?tab=Reviews','/list']
probs=[]
with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/home/box/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome')
  for name,vp in [('desk',{'width':1440,'height':900}),('phone',{'width':390,'height':844})]:
    ctx=b.new_context(viewport=vp,device_scale_factor=1); pg=ctx.new_page(); errs=[]
    pg.on('console',lambda m: m.type=='error' and errs.append(m.text)); pg.on('pageerror',lambda e: errs.append(str(e)))
    def visit(r,tag):
      pg.goto(BASE+'#'+r); pg.wait_for_timeout(1300)
      ow=pg.evaluate('document.documentElement.scrollWidth-window.innerWidth')
      if ow>2: probs.append(f'{name} {r} overflow {ow}')
      if pg.locator('text=This board is blank').count() and r!='/nope': probs.append(f'{name} {r} 404')
      pg.evaluate('(async()=>{for(let y=0;y<document.body.scrollHeight;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60))}})()'); pg.wait_for_timeout(2500); pg.evaluate('window.scrollTo(0,0)'); pg.wait_for_timeout(400)
      pg.screenshot(path=f'{OUT}/{name}-{tag}.png',full_page=(r in['/','/listing/b1003']))
    for r in R[:6]: visit(r, r.strip('/').replace('/','_').replace('?','_') or 'home')
    pg.click('text=Continue as Advertiser'); pg.wait_for_timeout(800)
    for r in R[6:]: visit(r, r.strip('/').replace('/','_').replace('?','_').replace('=','-').replace(' ','') or 'home')
    # booking flow
    pg.goto(BASE+'#/listing/b1003'); pg.wait_for_timeout(1200); pg.locator('.card button.btn').first.click(); pg.wait_for_timeout(800)
    pg.click('text=Use a sample creative'); pg.wait_for_timeout(500); pg.screenshot(path=f'{OUT}/{name}-book-creative.png')
    pg.click('text=Continue to spec check'); pg.wait_for_timeout(1200); pg.click('text=Continue to checkout'); pg.wait_for_timeout(700)
    pg.screenshot(path=f'{OUT}/{name}-book-checkout.png'); pg.locator('button:has-text("(demo)")').click(); pg.wait_for_timeout(2500)
    if not pg.locator('text=Your path to go-live').count(): probs.append(name+' booking failed')
    pg.screenshot(path=f'{OUT}/{name}-book-confirmed.png',full_page=True)
    pg.goto(BASE+'#/login'); pg.wait_for_timeout(600); pg.click('text=Continue as Owner'); pg.wait_for_timeout(800)
    for r in OWN: visit(r,'owner-'+r.strip('/').replace('/','_').replace('?','_').replace('=','-').replace(' ',''))
    pg.goto(BASE+'#/dashboard?tab=Requests'); pg.wait_for_timeout(900)
    n0=pg.locator('button:has-text("Approve")').count(); 
    if n0: pg.locator('button:has-text("Approve")').first.click(); pg.wait_for_timeout(500)
    if n0 and pg.locator('button:has-text("Approve")').count()!=n0-1: probs.append(name+' approve failed')
    # imgs
    bad=pg.evaluate('[...document.images].filter(i=>!i.complete||!i.naturalWidth).length')
    probs+= [f'{name} console: {e[:160]}' for e in set(errs)]
    ctx.close()
print(json.dumps(probs,indent=1))
