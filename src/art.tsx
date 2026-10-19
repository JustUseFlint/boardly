import type { Listing } from './data';
const ADS=[['Fresh roast.','Juniper Coffee'],['Move more.','Northbeam Fitness'],['Smile wider.','Atlas Dental'],['Home, found.','Kindred Realty'],['Ride electric.','Vela Mobility'],['Your ad here','Boardly']];
export function BoardArt({l,variant=0,creative,className}:{l:Listing;variant?:number;creative?:string;className?:string}){
  const h=(l.hue+variant*40)%360; const night=variant%3===2; const ad=ADS[(parseInt(l.id.slice(1))+variant)%ADS.length];
  const indoor=['mall','transit','stadium'].includes(l.format); const wrap=l.format==='wrap';
  const id='g'+l.id+variant; const bw=wrap?150:indoor?220:260, bh=wrap?190:indoor?124:84; const bx=(400-bw)/2, by=wrap?40:indoor?50:46;
  return <svg viewBox="0 0 400 260" className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-label={l.title}>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={indoor?'#2a2f3a':night?'#0b1530':`hsl(${(h+190)%360} 60% 72%)`}/><stop offset="1" stopColor={indoor?'#4b5263':night?'#3a2552':`hsl(${(h+30)%360} 70% 86%)`}/></linearGradient>
      <linearGradient id={id+'a'} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={`hsl(${h} 75% 52%)`}/><stop offset="1" stopColor={`hsl(${(h+50)%360} 80% 38%)`}/></linearGradient>
      <filter id={id+'glow'}><feGaussianBlur stdDeviation="6"/></filter></defs>
    <rect width="400" height="260" fill={`url(#${id})`}/>
    {!indoor&&<g fill={night?'#111a33':`hsl(${(h+200)%360} 20% 35%)`} opacity=".75">{[0,40,70,110,150,200,240,290,330,365].map((x,i)=><rect key={i} x={x} y={150-((i*37+variant*13)%70)} width={34} height={200}/>)}</g>}
    {night&&!indoor&&<g fill="#ffd66b" opacity=".6">{Array.from({length:30},(_,i)=><rect key={i} x={(i*53)%390} y={110+(i*29)%80} width="3" height="4"/>)}</g>}
    {indoor?<><rect y="200" width="400" height="60" fill="#1c1f27"/><g fill="#fff" opacity=".08">{[0,1,2,3,4].map(i=><rect key={i} x={i*90+10} y="10" width="60" height="16" rx="3"/>)}</g></>
     :<><rect y="205" width="400" height="55" fill={night?'#141821':'#3b3f47'}/><rect y="230" width="400" height="3" fill="#f5d36a" opacity=".7"/></>}
    {!indoor&&!wrap&&<><rect x="195" y={by+bh} width="10" height={205-by-bh} fill="#555b66"/><rect x={bx} y={by+bh} width={bw} height="5" fill="#666c78"/></>}
    {wrap&&<rect x={bx-20} y={by-20} width={bw+40} height="260" fill={night?'#1a2238':'#8a93a3'}/>}
    {(l.digital||night)&&<rect x={bx-6} y={by-6} width={bw+12} height={bh+12} fill={`hsl(${h} 90% 60%)`} opacity=".45" filter={`url(#${id}glow)`}/>}
    <rect x={bx-4} y={by-4} width={bw+8} height={bh+8} rx="3" fill="#20242c"/>
    {creative?<image href={creative} x={bx} y={by} width={bw} height={bh} preserveAspectRatio="xMidYMid slice"/>:
     <g><rect x={bx} y={by} width={bw} height={bh} fill={`url(#${id}a)`}/>
      <circle cx={bx+bw*0.82} cy={by+bh*0.5} r={Math.min(bw,bh)*0.32} fill="#fff" opacity=".18"/>
      <text x={bx+14} y={by+bh*0.48} fill="#fff" fontFamily="Inter, system-ui" fontWeight="800" fontSize={Math.min(bh*0.3,30)}>{ad[0]}</text>
      <text x={bx+14} y={by+bh*0.48+Math.min(bh*0.22,20)} fill="#fff" opacity=".85" fontFamily="Inter, system-ui" fontWeight="600" fontSize={Math.min(bh*0.15,13)}>{ad[1]}</text></g>}
    {l.digital&&<g><rect x={bx+bw-46} y={by+6} width="40" height="13" rx="6" fill="#000" opacity=".5"/><circle cx={bx+bw-38} cy={by+12.5} r="3" fill="#3ef08a"/><text x={bx+bw-32} y={by+16} fill="#fff" fontSize="8" fontFamily="Inter">LIVE</text></g>}
    {!indoor&&<g fill="#000" opacity=".55">{[30,250,320].map((x,i)=><rect key={i} x={(x+variant*60)%380} y="212" width="44" height="14" rx="5"/>)}</g>}
  </svg>;
}
export function Logo({size=28}:{size?:number}){return <span className="logo" style={{fontSize:size*0.8}}>
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden><rect width="32" height="32" rx="9" fill="url(#lg)"/><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6d5cff"/><stop offset="1" stopColor="#ff5c8a"/></linearGradient></defs>
  <rect x="7" y="8" width="18" height="10" rx="2" fill="#fff"/><rect x="15" y="18" width="2" height="7" fill="#fff"/><rect x="11" y="24" width="10" height="2" rx="1" fill="#fff"/></svg>
  <b>boardly</b></span>}
