import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { listings, fmt$, fmtK } from './data';
import { BoardArt } from './art';
import { PageT, Timeline, nice, fname, Counter } from './ui';
import { priceFor } from './listing';
import { set, useStore, type Booking } from './store';
import { NotFound } from './misc';
const STEPS=['Creative','Spec check','Checkout','Confirmed'];
export function Book(){const{id}=useParams();const[sp]=useSearchParams();const l=listings.find(x=>x.id===id);const st=useStore();const nav=useNavigate();
 const[step,setStep]=useState(0);const[img,setImg]=useState<string>('');const[dim,setDim]=useState<[number,number]|null>(null);const[name,setName]=useState('');const[busy,setBusy]=useState(false);const[bk,setBk]=useState<Booking|null>(null);
 const[card,setCard]=useState({n:'4242 4242 4242 4242',exp:'12/29',cvc:'123',name:st.user?.name||''});
 if(!l)return <NotFound/>;const s=sp.get('s')!,e=sp.get('e')!;const p=priceFor(l,s,e);
 const ratio=l.width/l.height;
 const load=(f:File)=>{const r=new FileReader();r.onload=()=>{const src=r.result as string;const im=new Image();im.onload=()=>{setDim([im.width,im.height]);setImg(src);setName(f.name)};im.src=src};r.readAsDataURL(f)};
 const sample=()=>{const c=document.createElement('canvas');c.width=l.width*30;c.height=l.height*30;const x=c.getContext('2d')!;const g=x.createLinearGradient(0,0,c.width,c.height);g.addColorStop(0,'#1a1a2e');g.addColorStop(1,'#6d5cff');x.fillStyle=g;x.fillRect(0,0,c.width,c.height);x.fillStyle='#fff';x.font=`800 ${c.height*0.28}px Inter, sans-serif`;x.fillText('Fresh roast.',c.width*0.06,c.height*0.5);x.font=`600 ${c.height*0.12}px Inter, sans-serif`;x.fillText('Juniper Coffee · 2 blocks ahead',c.width*0.06,c.height*0.72);setImg(c.toDataURL('image/png'));setDim([c.width,c.height]);setName('juniper-sample-creative.png')};
 const checks=dim?[{t:'Aspect ratio matches '+l.width+':'+l.height,ok:Math.abs(dim[0]/dim[1]-ratio)/ratio<0.08},{t:`Resolution ≥ ${l.width*20}×${l.height*20}px`,ok:dim[0]>=l.width*20},{t:'File type PNG / JPG',ok:/png|jpe?g/i.test(name)||img.startsWith('data:image/')},{t:'Legibility: ≤ 7 words recommended',ok:true,warn:true},{t:'Content policy pre-screen',ok:true}]:[];
 const pass=checks.length>0&&checks.every(c=>c.ok);
 const pay=()=>{setBusy(true);setTimeout(()=>{const b:Booking={id:'BK-'+(24200+Math.floor(Math.random()*700)),listingId:l.id,start:s,end:e,total:p.total,fee:p.fee,status:l.tags.includes('Instant book')?'confirmed':'pending',creative:img.length<400000?img:undefined,created:new Date().toISOString().slice(0,10),advertiser:st.user?.name||'Guest',company:st.user?.company||''};
  set(x=>({bookings:[b,...x.bookings],creatives:img.length<400000?[{id:b.id,name,src:img},...x.creatives]:x.creatives,notifications:[{id:'n'+Date.now(),text:`Booking ${b.id} placed for ${l.title}`,at:b.created,read:false},...x.notifications]}));setBk(b);setBusy(false);setStep(3)},1400)};
 return <PageT><div className="wrap" style={{maxWidth:1080,paddingTop:28,paddingBottom:60}}>
  <Link to={'/listing/'+l.id} className="mute sm">‹ Back to listing</Link><h1 style={{fontSize:30,margin:'8px 0 18px'}}>Book {l.title}</h1>
  <div style={{display:'flex',gap:6,marginBottom:24}}>{STEPS.map((t,i)=><div key={t} style={{flex:1}}><div style={{height:4,borderRadius:4,background:'var(--line)',overflow:'hidden'}}><motion.div animate={{width:i<=step?'100%':'0%'}} style={{height:4,background:'linear-gradient(90deg,#6d5cff,#ff5c8a)'}}/></div><div className="sm" style={{marginTop:6,fontWeight:i===step?700:500,color:i===step?'':'var(--mute)'}}>{i+1}. {t}</div></div>)}</div>
  <div className="detail"><AnimatePresence mode="wait"><motion.div key={step} initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}} transition={{duration:.3}}>
   {step===0&&<div><h3>Upload your creative</h3><p className="mute sm">Recommended {l.digital?`${l.width*30}×${l.height*30}px PNG/JPG`:`${l.width*12}×${l.height*12} in at 1:${12} scale, PNG/JPG`}. We'll preview it on the board.</p>
    <label className="card pad" style={{display:'block',textAlign:'center',borderStyle:'dashed',cursor:'pointer'}}><input type="file" accept="image/*" hidden onChange={x=>x.target.files?.[0]&&load(x.target.files[0])} data-testid="upload"/><div style={{fontSize:30}}>⇪</div><b>Drop an image or click to upload</b><div className="mute sm">{name||'No file selected'}</div></label>
    <button className="btn sec sm" style={{marginTop:10}} onClick={sample}>Use a sample creative</button>
    <div style={{borderRadius:16,overflow:'hidden',marginTop:16}}><BoardArt l={l} creative={img||undefined}/></div><div className="mute sm" style={{marginTop:6}}>Mockup preview of your creative on {l.title}</div>
    <button className="btn" style={{marginTop:16}} disabled={!img} onClick={()=>setStep(1)}>Continue to spec check</button></div>}
   {step===1&&<div><h3>Spec validation</h3><p className="mute sm">{name} · {dim?.[0]}×{dim?.[1]}px</p>{checks.map((c,i)=><motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*.15}} style={{display:'flex',gap:10,padding:'10px 0',borderBottom:'1px solid var(--line)'}}><span className={'badge '+(c.ok?'g':'r')}>{c.ok?'✓ Pass':'✕ Fail'}</span>{c.t}</motion.div>)}
    {!pass&&<p className="sm" style={{color:'var(--red)'}}>Fix the failing checks, or use the sample creative sized to spec.</p>}
    <div style={{display:'flex',gap:8,marginTop:16}}><button className="btn sec" onClick={()=>setStep(0)}>Back</button><button className="btn" disabled={!pass} onClick={()=>setStep(2)}>Continue to checkout</button></div></div>}
   {step===2&&<div><h3>Checkout</h3><div className="card pad" style={{background:'#fff8e6',borderColor:'#ffe1a1',marginBottom:16}}><b>Demo mode.</b> <span className="sm">No real charges. Use any card number; nothing is sent anywhere.</span></div>
    <div className="grid" style={{gap:10}}><input className="f" aria-label="Name on card" value={card.name} onChange={x=>setCard({...card,name:x.target.value})} placeholder="Name on card"/><input className="f" aria-label="Card number" value={card.n} onChange={x=>setCard({...card,n:x.target.value})}/><div style={{display:'flex',gap:10}}><input className="f" aria-label="Expiry" value={card.exp} onChange={x=>setCard({...card,exp:x.target.value})}/><input className="f" aria-label="CVC" value={card.cvc} onChange={x=>setCard({...card,cvc:x.target.value})}/></div>
    <label className="sm"><input type="checkbox" defaultChecked/> I agree to the <Link to="/terms" style={{textDecoration:'underline'}}>terms</Link> and cancellation policy</label></div>
    <div style={{display:'flex',gap:8,marginTop:16}}><button className="btn sec" onClick={()=>setStep(1)}>Back</button><button className="btn" disabled={busy||card.n.replace(/\D/g,'').length<12} onClick={pay}>{busy?'Processing…':`Pay ${fmt$(p.total)} (demo)`}</button></div></div>}
   {step===3&&bk&&<div style={{textAlign:'center'}}><motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:260,damping:14}} style={{width:80,height:80,borderRadius:'50%',background:'var(--green)',color:'#fff',fontSize:40,display:'grid',placeItems:'center',margin:'0 auto'}}>✓</motion.div>
    <h2 style={{margin:'16px 0 4px'}}>{bk.status==='confirmed'?'Booking confirmed!':'Request sent!'}</h2><p className="mute">{bk.id} · {bk.status==='confirmed'?'Instant book confirmed':'The owner usually responds within a few hours'} · Demo, no charge made</p>
    <div className="card pad" style={{textAlign:'left'}}><b>Your path to go-live</b><div style={{marginTop:10}}><Timeline l={l} start={s} end={e} created={bk.created}/></div></div>
    <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:16}}><button className="btn" onClick={()=>nav('/dashboard')}>Go to dashboard</button><Link className="btn sec" to="/search">Keep exploring</Link></div></div>}
  </motion.div></AnimatePresence>
  <div><div className="card pad sticky"><div style={{borderRadius:12,overflow:'hidden'}}><BoardArt l={l} creative={img||undefined}/></div><b style={{display:'block',marginTop:10}}>{l.title}</b><div className="mute sm">{l.city} · {fname(l.format)} · {l.width}×{l.height} ft</div>
   <div className="sm" style={{marginTop:12}}>{nice(s)} → {nice(e)} · {p.weeks} weeks</div>
   {[['Media',p.base],...(p.prod?[['Print & install',p.prod]]:[]),['Service fee',p.fee]].map(([k,v]:any)=><div key={k} className="sm" style={{display:'flex',justifyContent:'space-between',padding:'4px 0'}}><span>{k}</span><span>{fmt$(v)}</span></div>)}
   <div style={{display:'flex',justifyContent:'space-between',fontWeight:800,borderTop:'1px solid var(--line)',paddingTop:10,marginTop:6}}><span>Total</span><span>{fmt$(p.total)}</span></div>
   <div className="mute" style={{fontSize:12}}>Est. <Counter to={l.dailyImpr*p.days}/> impressions ({fmtK(l.dailyImpr)}/day)</div></div></div></div></div></PageT>}
