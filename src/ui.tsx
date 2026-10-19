import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import L from 'leaflet'; import 'leaflet/dist/leaflet.css';
import { BoardArt, Logo } from './art';
import { fmt$, fmtK, owners, FORMATS, type Listing } from './data';
import { useStore, toggleFav, set } from './store';
export const Reveal=({children,delay=0,className}:{children:ReactNode;delay?:number;className?:string})=>
 <motion.div className={className} initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-40px'}} transition={{duration:.6,delay,ease:[.2,.8,.2,1]}}>{children}</motion.div>;
export function Counter({to,prefix='',suffix='',dec=0}:{to:number;prefix?:string;suffix?:string;dec?:number}){
 const ref=useRef<HTMLSpanElement>(null);const inV=useInView(ref,{once:true});const rm=useReducedMotion();const[v,setV]=useState(0);
 useEffect(()=>{if(!inV)return;if(rm){setV(to);return}let f=0;const t0=performance.now();const step=(t:number)=>{const p=Math.min(1,(t-t0)/1200);setV(to*(1-Math.pow(1-p,3)));if(p<1)f=requestAnimationFrame(step)};f=requestAnimationFrame(step);return()=>cancelAnimationFrame(f)},[inV,to,rm]);
 return <span ref={ref}>{prefix}{dec?v.toFixed(dec):Math.round(v).toLocaleString()}{suffix}</span>}
export const Heart=({on}:{on:boolean})=><svg width="18" height="18" viewBox="0 0 24 24" fill={on?'#ff385c':'none'} stroke={on?'#ff385c':'#14161c'} strokeWidth="2"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg>;
export const fname=(f:string)=>FORMATS.find(x=>x.id===f)?.name||f;
export function ListingCard({l,onHover}:{l:Listing;onHover?:(id:string|null)=>void}){
 const st=useStore();const on=st.favorites.includes(l.id);
 return <motion.div layout initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.4}} onMouseEnter={()=>onHover?.(l.id)} onMouseLeave={()=>onHover?.(null)}>
  <Link to={'/listing/'+l.id} className="lcard"><div className="img"><BoardArt l={l}/></div>
   <motion.button whileTap={{scale:.8}} className="fav" aria-label="Save" onClick={e=>{e.preventDefault();toggleFav(l.id)}}><Heart on={on}/></motion.button>
   {l.digital&&<span className="badge b" style={{position:'absolute',top:12,left:12}}>DIGITAL</span>}
   <div className="meta"><div className="t"><span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{l.title}</span><span>★ {l.rating}</span></div>
   <div className="mute sm">{l.city}, {l.state} · {fname(l.format)} · {l.width}×{l.height} ft</div>
   <div className="mute sm">{fmtK(l.dailyImpr)} daily impressions</div>
   <div style={{marginTop:4}}><b>{fmt$(l.weekly)}</b> <span className="mute sm">/ week</span></div></div></Link></motion.div>}
export function Modal({open,onClose,children}:{open:boolean;onClose:()=>void;children:ReactNode}){
 useEffect(()=>{const k=(e:KeyboardEvent)=>e.key==='Escape'&&onClose();addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[onClose]);
 return <AnimatePresence>{open&&<><motion.div className="drawer-bg" onClick={onClose} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}/>
  <div className="modal"><motion.div initial={{opacity:0,scale:.92,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.95,y:10}} transition={{type:'spring',damping:24,stiffness:300}}>{children}</motion.div></div></>}</AnimatePresence>}
export function Drawer({open,onClose,children}:{open:boolean;onClose:()=>void;children:ReactNode}){
 return <AnimatePresence>{open&&<><motion.div className="drawer-bg" onClick={onClose} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}/>
  <motion.div className="drawer" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring',damping:30,stiffness:280}}>{children}</motion.div></>}</AnimatePresence>}
export function Toast({msg}:{msg:string|null}){return <AnimatePresence>{msg&&<motion.div className="toast" initial={{opacity:0,y:20,x:'-50%'}} animate={{opacity:1,y:0,x:'-50%'}} exit={{opacity:0,y:20,x:'-50%'}}>{msg}</motion.div>}</AnimatePresence>}
export function useToast(){const[m,setM]=useState<string|null>(null);return[m,(s:string)=>{setM(s);setTimeout(()=>setM(null),2600)}] as const}
// ---- purchase-to-live timeline
export const addDays=(d:string,n:number)=>{const x=new Date(d+'T12:00:00');x.setDate(x.getDate()+n);return x.toISOString().slice(0,10)};
export const nice=(d:string)=>new Date(d+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
export function stages(l:Listing,start:string,end:string,created?:string){
 const lead=l.leadDays; const c=created||addDays(start,-lead-3);
 const prod=l.digital?{n:'Digital scheduling',d:'Creative loaded into the '+l.loop+'-spot loop'}:{n:'Printing & install',d:l.format==='wrap'?'Mesh vinyl printed, rigging crew installs':'Vinyl printed and posted by install crew'};
 const arr=[
  {n:'Booking confirmed',d:'Payment authorized',date:c},
  {n:'Creative upload',d:'Upload artwork at '+(l.digital?(l.width*30)+'×'+(l.height*30)+' px':(l.width*12)+'×'+(l.height*12)+' in'),date:addDays(start,-lead)},
  {n:'Spec check',d:'Automatic size, contrast & legibility check',date:addDays(start,-lead+1)},
  {n:'Owner approval',d:'Owner reviews content (typically '+owners[+l.ownerId.slice(1)].response+')',date:addDays(start,-lead+2)},
  {n:prod.n,d:prod.d,date:addDays(start,l.digital?-1:-Math.max(2,Math.round(lead/2)))},
  {n:'Go live + proof of posting',d:'Timestamped photo of your ad on the board',date:start},
  {n:'Campaign running',d:'Daily impression reports',date:addDays(start,1)},
  {n:'Campaign ends',d:'Final report & '+(l.digital?'creative removed':'vinyl removal'),date:end},
 ];for(let i=1;i<arr.length;i++)if(arr[i].date<arr[i-1].date)arr[i].date=arr[i-1].date;return arr}
export function Timeline({l,start,end,created}:{l:Listing;start:string;end:string;created?:string}){
 const today=new Date().toISOString().slice(0,10); const s=stages(l,start,end,created); const cur=s.findLastIndex(x=>x.date<=today);
 return <div className="tl">{s.map((x,i)=><motion.div key={i} className={'st '+(i<cur?'done':i===cur?'now':'')} initial={{opacity:0,x:-10}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.06}}>
  <div style={{display:'flex',justifyContent:'space-between',gap:8}}><b className="sm">{x.n}</b><span className="mute sm">{nice(x.date)}</span></div><div className="mute" style={{fontSize:12}}>{x.d}</div></motion.div>)}
  <div className="mute" style={{fontSize:12,marginTop:6}}>Lead time for {fname(l.format)}: {l.leadDays} days before go-live</div></div>}
// ---- map
export function BoardMap({items,hl,height='100%'}:{items:Listing[];hl?:string|null;height?:string}){
 const el=useRef<HTMLDivElement>(null);const m=useRef<L.Map|null>(null);const mk=useRef<Record<string,L.Marker>>({});const nav=useNavigate();
 useEffect(()=>{if(!el.current)return;m.current=L.map(el.current,{scrollWheelZoom:true,zoomControl:true}).setView([39,-96],4);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors',maxZoom:18}).addTo(m.current);return()=>{m.current?.remove()}},[]);
 useEffect(()=>{const map=m.current;if(!map)return;Object.values(mk.current).forEach(x=>x.remove());mk.current={};
  items.forEach(l=>{const k=L.marker([l.lat,l.lng],{icon:L.divIcon({className:'',html:`<div class="pin" id="pin-${l.id}">${fmt$(l.weekly)}</div>`,iconSize:[70,24],iconAnchor:[35,12]})}).addTo(map).on('click',()=>nav('/listing/'+l.id));mk.current[l.id]=k});
  if(items.length){const b=L.latLngBounds(items.map(l=>[l.lat,l.lng] as [number,number]));map.fitBounds(b,{padding:[40,40],maxZoom:12})}},[items]);
 useEffect(()=>{document.querySelectorAll('.pin.hl').forEach(e=>e.classList.remove('hl'));if(hl)document.getElementById('pin-'+hl)?.classList.add('hl')},[hl]);
 return <div ref={el} style={{height,width:'100%',background:'#eef0f4'}}/>}
// ---- chrome
export function Nav(){const st=useStore();const nav=useNavigate();const[open,setOpen]=useState(false);const unread=st.notifications.filter(n=>!n.read).length;
 return <><div className="demo-banner">Demo marketplace · sample data · no real payments are processed</div><header className="nav"><div className="wrap">
  <Link to="/" aria-label="Boardly home"><Logo/></Link>
  <nav className="links"><NavLink className="hide-m" to="/search">Explore</NavLink><NavLink className="hide-m" to="/owners">List your board</NavLink><NavLink className="hide-m" to="/pricing">Pricing</NavLink>
   {st.user?<><NavLink to="/notifications" aria-label="Notifications" style={{position:'relative'}}>🔔{unread>0&&<span className="badge r" style={{position:'absolute',top:0,right:0,padding:'1px 5px'}}>{unread}</span>}</NavLink>
    <button className="ghost" onClick={()=>setOpen(true)} style={{display:'flex',alignItems:'center',gap:8}}><span style={{width:30,height:30,borderRadius:'50%',background:'linear-gradient(135deg,#6d5cff,#ff5c8a)',color:'#fff',display:'grid',placeItems:'center',fontSize:13}}>{st.user.name[0]}</span><span className="hide-m">{st.user.name.split(' ')[0]}</span></button></>
   :<button className="btn sm" onClick={()=>nav('/login')}>Log in</button>}</nav></div></header>
  <Drawer open={open} onClose={()=>setOpen(false)}><div onClick={()=>setOpen(false)}>
   <h3 style={{marginBottom:4}}>{st.user?.name}</h3><div className="mute sm" style={{marginBottom:20}}>{st.user?.company} · {st.user?.role}</div>
   {[['/dashboard','Dashboard'],['/messages','Messages'],['/notifications','Notifications'],['/favorites','Saved boards'],['/account','Account & settings'],['/help','Help center']].map(([h,t])=><Link key={h} to={h} style={{display:'block',padding:'14px 0',borderBottom:'1px solid var(--line)',fontWeight:600}}>{t}</Link>)}
   <button className="btn sec" style={{marginTop:20,width:'100%'}} onClick={()=>{set(()=>({user:null}));nav('/')}}>Log out</button></div></Drawer></>}
export function BottomNav(){return <nav className="bnav">{[['/','⌂','Home'],['/search','⌕','Explore'],['/favorites','♡','Saved'],['/messages','✉','Inbox'],['/dashboard','▦','Dashboard']].map(([h,i,t])=><NavLink key={h} to={h} end><span style={{fontSize:18}}>{i}</span>{t}</NavLink>)}</nav>}
export function Footer(){return <footer className="footer"><div className="wrap"><div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))'}}>
 <div><span style={{filter:'brightness(1.4)'}}><Logo/></span><p className="sm" style={{color:'#9a9eac',maxWidth:240}}>The marketplace for out-of-home advertising. Book any billboard in minutes.</p></div>
 <div><b style={{color:'#fff'}}>Advertisers</b><Link to="/search">Explore boards</Link><Link to="/pricing">Pricing & fees</Link><Link to="/help">Help center</Link><Link to="/blog">Blog</Link></div>
 <div><b style={{color:'#fff'}}>Owners</b><Link to="/owners">List your board</Link><Link to="/dashboard">Owner dashboard</Link><Link to="/help">Owner guide</Link></div>
 <div><b style={{color:'#fff'}}>Company</b><Link to="/about">About</Link><Link to="/careers">Careers</Link><Link to="/terms">Terms</Link><Link to="/privacy">Privacy</Link></div></div>
 <p className="sm" style={{color:'#6b7080',marginTop:40}}>© 2026 Boardly, Inc. (demo). All listings, companies and people are sample data.</p></div></footer>}
export const PageT=({children}:{children:ReactNode})=><motion.main initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.35,ease:[.2,.8,.2,1]}}>{children}</motion.main>;
export const Skel=({h=200}:{h?:number})=><div className="skel" style={{height:h}}/>;
