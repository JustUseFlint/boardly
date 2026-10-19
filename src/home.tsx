import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { listings, FORMATS, CITIES, fmtK } from './data';
import { Reveal, Counter, ListingCard, PageT, BoardMap, Drawer, Skel, useToast, Toast } from './ui';
import { BoardArt } from './art';
import { set, useStore } from './store';
export function Home(){const nav=useNavigate();const[q,setQ]=useState({city:'',from:'',to:'',format:''});const[faq,setFaq]=useState<number|null>(0);
 const go=()=>nav('/search?'+new URLSearchParams(Object.entries(q).filter(([,v])=>v) as any));
 const featured=listings.filter(l=>l.rating>4.7).slice(0,8);
 return <PageT>
 <div className="hero"><div className="wrap">
  <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.8}}><span className="badge b">New · Digital LED boards go live in 48 hours</span>
  <h1 style={{marginTop:18}}>Rent any billboard.<br/><span className="grad">In minutes, not months.</span></h1>
  <p className="mute" style={{fontSize:19,maxWidth:600}}>Search 100+ roadside, digital and indoor screens across 18 US cities. Transparent prices, real traffic data, one-click booking.</p></motion.div>
  <motion.div className="search" initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} transition={{delay:.25,duration:.6}}>
   <label>Where<select value={q.city} onChange={e=>setQ({...q,city:e.target.value})}><option value="">Any city</option>{CITIES.map(c=><option key={c[0]}>{c[0]}</option>)}</select></label>
   <label>Start<input type="date" value={q.from} onChange={e=>setQ({...q,from:e.target.value})}/></label>
   <label>End<input type="date" value={q.to} onChange={e=>setQ({...q,to:e.target.value})}/></label>
   <label>Format<select value={q.format} onChange={e=>setQ({...q,format:e.target.value})}><option value="">Any format</option>{FORMATS.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</select></label>
   <button className="btn" onClick={go} style={{borderRadius:999}}>Search</button></motion.div></div></div>
 <section className="wrap"><Reveal><div className="sh"><h2>Browse by format</h2></div></Reveal>
  <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))'}}>{FORMATS.map((f,i)=><Reveal key={f.id} delay={i*.05}><Link to={'/search?format='+f.id} className="cat" style={{display:'block'}}>
   <div style={{borderRadius:10,overflow:'hidden',aspectRatio:'16/10',marginBottom:10}}><BoardArt l={listings.find(l=>l.format===f.id)!}/></div><b>{f.name}</b><div className="mute sm">{f.desc}</div><div className="sm" style={{marginTop:4}}>{listings.filter(l=>l.format===f.id).length} boards</div></Link></Reveal>)}</div></section>
 <section className="wrap"><Reveal><div className="sh"><div><h2>Featured boards</h2><p className="mute" style={{margin:'6px 0 0'}}>Top-rated inventory with instant availability</p></div><Link className="btn sec sm" to="/search">View all</Link></div></Reveal>
  <div className="grid g4">{featured.map(l=><ListingCard key={l.id} l={l}/>)}</div></section>
 <section style={{background:'var(--soft)'}}><div className="wrap"><Reveal><div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',textAlign:'center'}}>
  <div className="stat"><b><Counter to={listings.length}/></b><div className="mute">Boards listed</div></div>
  <div className="stat"><b><Counter to={Math.round(listings.reduce((a,l)=>a+l.dailyImpr,0)/1e5)/10} dec={1} suffix="M"/></b><div className="mute">Daily impressions</div></div>
  <div className="stat"><b><Counter to={18}/></b><div className="mute">US cities</div></div>
  <div className="stat"><b><Counter to={4.9} dec={1} suffix="★"/></b><div className="mute">Average advertiser rating</div></div></div></Reveal></div></section>
 <section className="wrap"><Reveal><div className="sh"><h2>Popular cities</h2></div></Reveal><div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))'}}>{CITIES.map((c,i)=><Reveal key={c[0]} delay={(i%6)*.04}><Link to={'/search?city='+c[0]} className="cat" style={{display:'block'}}><b>{c[0]}</b><div className="mute sm">{listings.filter(l=>l.city===c[0]).length} boards · {c[1]}</div></Link></Reveal>)}</div></section>
 <section className="wrap"><div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))'}}>{[['For advertisers',['Search by city, format, audience and budget','Compare traffic, impressions & CPM side by side','Upload creative, see it on the board, book & pay','Track go-live and proof of posting in your dashboard']],['For owners',['List a board in 5 steps, free','Set prices, minimum terms and blackout dates','Approve requests and get paid weekly','Watch occupancy and earnings in real time']]].map(([t,steps]:any,k)=><Reveal key={t} delay={k*.1}><div className="card pad" style={{height:'100%'}}><span className="badge b">{t}</span><h2 style={{fontSize:24,margin:'12px 0 16px'}}>How it works</h2>{steps.map((s:string,i:number)=><div key={i} style={{display:'flex',gap:14,padding:'10px 0'}}><b style={{width:30,height:30,borderRadius:'50%',background:'var(--soft)',display:'grid',placeItems:'center',flex:'none'}}>{i+1}</b><span>{s}</span></div>)}<Link to={k?'/owners':'/search'} className="btn sm" style={{marginTop:12}}>{k?'List your board':'Start exploring'}</Link></div></Reveal>)}</div></section>
 <section className="wrap"><Reveal><div className="sh"><h2>Loved by local brands</h2></div></Reveal><div className="grid g3">{[['“We launched in three cities in one afternoon. The traffic data made picking boards obvious.”','Dana Okafor, Juniper Coffee'],['“Our board pays its mortgage now. Boardly fills dates we never used to sell.”','Luis Castillo, Redrock Signworks'],['“Seeing our ad mocked onto the real board before paying sold the whole team.”','Grace Kim, Northbeam Fitness']].map(([t,a],i)=><Reveal key={i} delay={i*.08}><div className="card pad"><div style={{color:'#ffb400'}}>★★★★★</div><p style={{fontSize:16}}>{t}</p><b className="sm">{a}</b></div></Reveal>)}</div>
  <Reveal><p className="mute sm" style={{textAlign:'center',marginTop:40}}>AS FEATURED IN (sample)</p><div className="press"><span>AdWeekly</span><span>The Outdoor Review</span><span>MarketPulse</span><span>Startup Ledger</span><span>Signal Daily</span></div></Reveal></section>
 <section className="wrap" style={{maxWidth:820}}><Reveal><h2 style={{marginBottom:16}}>Frequently asked questions</h2></Reveal>{[['How fast can my ad go live?','Digital LED boards can go live in as little as 48 hours. Static bulletins need 7–21 days for printing and installation. Every listing shows its lead time and a computed go-live timeline.'],['How are impressions calculated?','We combine vehicle and pedestrian counts, visibility geometry, speed and dwell time. See our blog post on methodology.'],['What does it cost?','Advertisers pay the board price plus a 5% service fee. Owners pay 10% on completed bookings. No subscriptions.'],['Can I cancel?','Free cancellation up to 14 days before go-live for static boards and 72 hours for digital.'],['Is this real?','This is a demo marketplace with sample data. No real payments are processed.']].map(([q2,a],i)=><div key={i} style={{borderBottom:'1px solid var(--line)'}}><button className="ghost" style={{width:'100%',textAlign:'left',padding:'18px 0',display:'flex',justifyContent:'space-between',fontSize:16}} onClick={()=>setFaq(faq===i?null:i)}>{q2}<motion.span animate={{rotate:faq===i?45:0}}>+</motion.span></button>
  <AnimatePresence initial={false}>{faq===i&&<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} style={{overflow:'hidden'}}><p className="mute" style={{marginTop:0}}>{a}</p></motion.div>}</AnimatePresence></div>)}</section>
 </PageT>}
export function Search(){const[sp,setSp]=useSearchParams();const g=(k:string)=>sp.get(k)||'';const st=useStore();const[toast,show]=useToast();
 const[hl,setHl]=useState<string|null>(null);const[open,setOpen]=useState(false);const[loading,setLoading]=useState(true);const[view,setView]=useState<'list'|'map'>('list');
 useEffect(()=>{setLoading(true);const t=setTimeout(()=>setLoading(false),450);return()=>clearTimeout(t)},[sp]);
 const upd=(k:string,v:string)=>{const n=new URLSearchParams(sp);v?n.set(k,v):n.delete(k);setSp(n,{replace:true})};
 const res=useMemo(()=>{let r=listings.filter(l=>(!g('city')||l.city===g('city'))&&(!g('format')||l.format===g('format'))&&(!g('max')||l.weekly<=+g('max'))&&(!g('min')||l.weekly>=+g('min'))
  &&(!g('impr')||l.dailyImpr>=+g('impr'))&&(!g('lit')||l.illuminated)&&(!g('type')||(g('type')==='digital'?l.digital:!l.digital))&&(!g('size')||(g('size')==='l'?l.width>=40:l.width<40))&&(!g('age')||l.demo.age[1]>=+g('age'))&&(!g('q')||(l.title+l.city).toLowerCase().includes(g('q').toLowerCase())));
  if(g('from')){const off=Math.round((new Date(g('from')).getTime()-Date.now())/864e5);r=r.filter(l=>!l.booked.some(([a,b])=>off>=a&&off<=b))}
  const s=g('sort');if(s==='price')r=[...r].sort((a,b)=>a.weekly-b.weekly);if(s==='-price')r=[...r].sort((a,b)=>b.weekly-a.weekly);if(s==='impr')r=[...r].sort((a,b)=>b.dailyImpr-a.dailyImpr);if(s==='cpm')r=[...r].sort((a,b)=>a.weekly/a.dailyImpr-b.weekly/b.dailyImpr);if(s==='rating')r=[...r].sort((a,b)=>b.rating-a.rating);return r},[sp]);
 const nf=['max','min','impr','lit','type','size','age','from'].filter(k=>g(k)).length;
 return <PageT><div className="filters">
  <input className="f" placeholder="Search boards…" style={{width:180,flex:'none'}} value={g('q')} onChange={e=>upd('q',e.target.value)}/>
  <select className="f" style={{width:150,flex:'none'}} value={g('city')} onChange={e=>upd('city',e.target.value)} aria-label="City"><option value="">All cities</option>{CITIES.map(c=><option key={c[0]}>{c[0]}</option>)}</select>
  <button className={'chip '+(!g('format')?'on':'')} onClick={()=>upd('format','')}>All</button>
  {FORMATS.map(f=><button key={f.id} className={'chip '+(g('format')===f.id?'on':'')} onClick={()=>upd('format',g('format')===f.id?'':f.id)}>{f.name}</button>)}
  <button className="chip" onClick={()=>setOpen(true)}>⚙ Filters{nf?` (${nf})`:''}</button>
  <select className="f" style={{width:170,flex:'none'}} value={g('sort')} onChange={e=>upd('sort',e.target.value)} aria-label="Sort"><option value="">Sort: Recommended</option><option value="price">Price: low to high</option><option value="-price">Price: high to low</option><option value="impr">Most impressions</option><option value="cpm">Lowest CPM</option><option value="rating">Top rated</option></select>
  <button className="chip" onClick={()=>{set(s=>({savedSearches:[{q:'?'+sp.toString(),at:new Date().toISOString().slice(0,10)},...s.savedSearches]}));show('Search saved')}}>☆ Save search</button>
  <button className="chip bmap" onClick={()=>setView(view==='list'?'map':'list')}>{view==='list'?'🗺 Map':'☰ List'}</button></div>
 {view==='map'?<div style={{height:'calc(100vh - 190px)'}}><BoardMap items={res}/></div>:
 <div className="split"><div className="list"><div className="mute sm" style={{marginBottom:14}}>{loading?'Searching…':`${res.length} boards${g('city')?' in '+g('city'):''}`} {st.savedSearches.length>0&&<>· <a href="#/favorites" style={{textDecoration:'underline'}}>{st.savedSearches.length} saved searches</a></>}</div>
  <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))'}}>{loading?Array.from({length:6},(_,i)=><div key={i}><Skel h={160}/><div style={{height:10}}/><Skel h={14}/><div style={{height:6}}/><Skel h={14}/></div>):res.map(l=><ListingCard key={l.id} l={l} onHover={setHl}/>)}</div>
  {!loading&&!res.length&&<div className="card pad" style={{textAlign:'center'}}><h3>No boards match</h3><p className="mute">Try removing a filter.</p><button className="btn sm" onClick={()=>setSp({})}>Clear all</button></div>}</div>
  <div className="map"><BoardMap items={res} hl={hl}/></div></div>}
 <Drawer open={open} onClose={()=>setOpen(false)}><h3>Filters</h3>{[
  ['Max price / week','max',[['','Any'],['1500','$1,500'],['3000','$3,000'],['6000','$6,000'],['10000','$10,000']]],['Min price / week','min',[['','Any'],['1000','$1,000'],['3000','$3,000']]],
  ['Daily impressions','impr',[['','Any'],['25000','25K+'],['75000','75K+'],['150000','150K+']]],['Type','type',[['','Any'],['digital','Digital'],['static','Static']]],['Size','size',[['','Any'],['l','Large (40 ft+)'],['s','Small']]],
  ['Illumination','lit',[['','Any'],['1','Illuminated only']]],['Audience: age 25–34 share','age',[['','Any'],['25','25%+'],['30','30%+']]]].map(([t,k,opts]:any)=><div key={k} style={{margin:'18px 0'}}><b className="sm">{t}</b><div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:8}}>{opts.map(([v,lab]:any)=><button key={v} className={'chip '+(g(k)===v?'on':'')} onClick={()=>upd(k,v)}>{lab}</button>)}</div></div>)}
  <b className="sm">Available from</b><input type="date" className="f" style={{marginTop:8}} value={g('from')} onChange={e=>upd('from',e.target.value)}/>
  <div style={{display:'flex',gap:8,marginTop:24}}><button className="btn sec" onClick={()=>setSp({})}>Clear</button><button className="btn" style={{flex:1}} onClick={()=>setOpen(false)}>Show {res.length} boards</button></div></Drawer><Toast msg={toast}/></PageT>}
export {fmtK};
