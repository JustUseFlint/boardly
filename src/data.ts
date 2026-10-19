// SAMPLE DATA — all owners, advertisers, boards and reviews are fictional.
export type Format = 'bulletin'|'poster'|'digital'|'wrap'|'transit'|'stadium'|'mall';
export const FORMATS: {id:Format;name:string;desc:string}[] = [
  {id:'bulletin',name:'Roadside Bulletin',desc:'14×48 ft highway giants'},
  {id:'poster',name:'Poster',desc:'Street-level 10×22 ft'},
  {id:'digital',name:'Digital LED',desc:'Rotating spots, instant go-live'},
  {id:'wrap',name:'Building Wrap',desc:'Facade-scale statements'},
  {id:'transit',name:'Transit & Airport',desc:'Terminals, stations, shelters'},
  {id:'stadium',name:'Stadium',desc:'Arena concourse & ribbon boards'},
  {id:'mall',name:'Mall Indoor Screens',desc:'High-dwell shopper screens'},
];
export const CITIES = [
  ['New York','NY',40.7128,-74.006],['Los Angeles','CA',34.0522,-118.2437],['Chicago','IL',41.8781,-87.6298],
  ['Houston','TX',29.7604,-95.3698],['Phoenix','AZ',33.4484,-112.074],['Philadelphia','PA',39.9526,-75.1652],
  ['San Antonio','TX',29.4241,-98.4936],['San Diego','CA',32.7157,-117.1611],['Dallas','TX',32.7767,-96.797],
  ['Austin','TX',30.2672,-97.7431],['Miami','FL',25.7617,-80.1918],['Atlanta','GA',33.749,-84.388],
  ['Denver','CO',39.7392,-104.9903],['Seattle','WA',47.6062,-122.3321],['Nashville','TN',36.1627,-86.7816],
  ['Las Vegas','NV',36.1699,-115.1398],['Indianapolis','IN',39.7684,-86.1581],['Boston','MA',42.3601,-71.0589],
] as const;
let s = 20261019; const r = () => { s = (s*1664525+1013904223)%4294967296; return s/4294967296 };
const pick = <T,>(a: readonly T[]) => a[Math.floor(r()*a.length)];
const ri = (a:number,b:number)=>Math.floor(a+r()*(b-a+1));
const FIRST=['Maya','Jordan','Elena','Marcus','Priya','Diego','Hannah','Tyrell','Sofia','Noah','Aisha','Liam','Grace','Mateo','Chloe','Owen','Zara','Ethan','Nina','Caleb'];
const LAST=['Brooks','Patel','Nguyen','Ramirez','Okafor','Bennett','Kim','Castillo','Hughes','Sato','Delgado','Foster','Mercer','Lindqvist','Hale','Vance'];
const OWNERCO=['Skyline Outdoor Co.','Meridian Media Group','Northlight Displays','Crossroads Signage','Brightline Boards','Harbor & Main Media','Summit View Outdoor','Copperline Digital','Lakeshore Ad Structures','Redrock Signworks','Parkway Media Partners','Lumen Facade Studio'];
export type Owner={id:string;name:string;contact:string;since:number;rating:number;response:string;verified:boolean;boards:number;bio:string};
export const owners:Owner[]=OWNERCO.map((n,i)=>({id:'o'+i,name:n,contact:pick(FIRST)+' '+pick(LAST),since:ri(2009,2022),rating:+(4.4+r()*0.6).toFixed(2),response:pick(['within an hour','within 2 hours','same day']),verified:r()>0.2,boards:0,bio:`${n} operates premium out-of-home inventory with hands-on install crews and proof-of-posting on every campaign.`}));
owners[0].name='Skyline Outdoor Co.'; // demo owner account
const ROADS=['I-95 Northbound','I-10 Eastbound','Main St & 5th Ave','Sunset Blvd','Highway 101 South','Market Street','Broadway & 42nd','Riverside Dr','Loop 610 West','Peachtree St','Colfax Ave','Ocean Dr','Lake Shore Dr','Elm & Commerce','Airport Pkwy','Union Station Concourse','Arena Plaza','Galleria Center Court','Terminal B Baggage Claim','Downtown Transit Mall'];
export type Listing={id:string;title:string;format:Format;digital:boolean;city:string;state:string;lat:number;lng:number;address:string;
 width:number;height:number;facing:string;side:string;illuminated:boolean;spot:number;loop:number;weekly:number;monthly:number;
 dailyImpr:number;vehicles:number;pedestrians:number;speed:number;dwell:number;ownerId:string;rating:number;reviews:number;
 hue:number;demo:{age:number[];gender:number[];income:number[]};hourly:number[];weekly7:number[];trend:number[];poi:number;visibility:number;
 competing:number;booked:[number,number][];leadDays:number;tags:string[];minWeeks:number};
export const SIZES:Record<Format,[number,number][]>={bulletin:[[48,14],[60,20]],poster:[[22,10],[24,12]],digital:[[48,14],[40,12],[30,10]],wrap:[[120,80],[90,140]],transit:[[10,6],[16,9]],stadium:[[60,8],[40,22]],mall:[[6,10],[12,7]]};
export const listings:Listing[]=[];
const fmts:Format[]=['bulletin','bulletin','digital','digital','poster','wrap','transit','stadium','mall','digital'];
for(let i=0;i<108;i++){
  const c=CITIES[i%CITIES.length]; const f=pick(fmts); const [w,h]=pick(SIZES[f]); const digital=f==='digital'||(['transit','stadium','mall'].includes(f)&&r()>0.3);
  const base={bulletin:2600,poster:900,digital:3800,wrap:9500,transit:1800,stadium:5200,mall:1200}[f]*(c[0]==='New York'||c[0]==='Los Angeles'?1.8:c[0]==='Indianapolis'||c[0]==='San Antonio'?0.75:1)*(0.75+r()*0.6);
  const vehicles=['mall','transit','stadium'].includes(f)?ri(0,3000):ri(18000,145000); const pedestrians=ri(f==='bulletin'?0:4000, ['mall','transit','stadium','wrap'].includes(f)?60000:15000);
  const dailyImpr=Math.round((vehicles*1.4+pedestrians)*(0.55+r()*0.3));
  const peak=f==='mall'?14:pick([8,17,18]); const hourly=Array.from({length:24},(_,hh)=>Math.round(100*Math.max(0.05,Math.exp(-((hh-peak)**2)/12)+0.6*Math.exp(-((hh-(peak>12?8:17))**2)/10))));
  const weekly7=Array.from({length:7},(_,d)=>Math.round(dailyImpr*(f==='stadium'?(d>=5?1.5:0.7):(d>=5?0.8:1.05))*(0.92+r()*0.16)));
  let t=dailyImpr*30*0.9; const trend=Array.from({length:12},()=>Math.round(t*=0.985+r()*0.04));
  const a=[ri(10,20),ri(20,32),ri(18,26),ri(12,20)]; const age=[...a,100-a.reduce((x,y)=>x+y,0)];
  const g=ri(42,58); const inc=[ri(15,30),ri(25,40)]; const income=[...inc,100-inc[0]-inc[1]];
  const booked:[number,number][]=[]; let d=ri(2,20); for(let k=0;k<4;k++){const len=ri(7,28); booked.push([d,d+len]); d+=len+ri(10,40)}
  const CR:Record<string,string[]>={'New York':['Times Square','I-278 BQE','West Side Hwy','Broadway & 42nd','JFK Terminal 4'],'Los Angeles':['Sunset Blvd','I-405 South','Hollywood & Highland','Wilshire Blvd','LAX Terminal B'],'Chicago':['I-90/94 Kennedy','Lake Shore Dr','Michigan Ave','Wacker Dr','OHare Terminal 1'],'Houston':['Loop 610 West','I-45 North','Westheimer Rd','Main St','Galleria Center Court'],'Phoenix':['I-10 Eastbound','Camelback Rd','Loop 101','Sky Harbor T4'],'Philadelphia':['I-95 Northbound','Market Street','Schuylkill Expy','Broad St'],'San Antonio':['I-35 South','Riverwalk','Loop 410','Broadway'],'San Diego':['I-5 South','Gaslamp Quarter','Harbor Dr','Mission Valley'],'Dallas':['I-35E Stemmons','Woodall Rodgers Fwy','Elm & Commerce','Arena Plaza'],'Austin':['I-35 Upper Deck','South Congress Ave','MoPac Expy','6th Street'],'Miami':['I-95 Southbound','Ocean Dr','Biscayne Blvd','Brickell Ave'],'Atlanta':['I-75/85 Connector','Peachtree St','Ponce de Leon Ave','ATL Concourse B'],'Denver':['I-25 Northbound','Colfax Ave','16th St Mall','Union Station Concourse'],'Seattle':['I-5 Northbound','Pike Street','Aurora Ave','SeaTac Concourse A'],'Nashville':['I-40 East','Broadway','West End Ave','Arena Plaza'],'Las Vegas':['Las Vegas Blvd','I-15 South','Fremont St','Harry Reid T1'],'Indianapolis':['I-65 Southbound','Meridian St','Monument Circle','Arena Plaza','Keystone Crossing'],'Boston':['I-93 Southbound','Mass Pike','Boylston St','Downtown Transit Mall']};
  const road=pick(CR[c[0]]||ROADS);
  listings.push({id:'b'+(1001+i),title:`${road} ${ {bulletin:'Bulletin',poster:'Poster',digital:'Digital Board',wrap:'Building Wrap',transit:'Transit Display',stadium:'Arena Board',mall:'Mall Screen'}[f]}`,format:f,digital,city:c[0],state:c[1],
   lat:c[2]+(r()-0.5)*0.16,lng:c[3]+(r()-0.5)*0.2,address:`${ri(100,9800)} ${road}, ${c[0]}, ${c[1]}`,width:w,height:h,facing:pick(['North','South','East','West','Northeast','Southwest']),side:pick(['Left-hand read','Right-hand read','Cross read']),
   illuminated:digital||r()>0.3,spot:digital?pick([8,10,15]):0,loop:digital?pick([6,8,10]):0,weekly:Math.round(base/10)*10,monthly:Math.round(base*3.6/10)*10,
   dailyImpr,vehicles,pedestrians,speed:vehicles>40000?ri(45,65):ri(15,35),dwell:['mall','transit','stadium'].includes(f)?ri(25,240):ri(4,12),ownerId:'o'+(i%owners.length),rating:+(4.2+r()*0.8).toFixed(2),reviews:ri(4,140),hue:ri(0,359),
   demo:{age,gender:[g,100-g],income},hourly,weekly7,trend,poi:ri(55,99),visibility:ri(62,99),competing:ri(0,9),booked,leadDays:{bulletin:10,poster:7,digital:2,wrap:21,transit:7,stadium:5,mall:3}[f],
   tags:[...(r()>0.6?['Superhost-grade']:[]),...(r()>0.7?['Instant book']:[]),...(digital?['Same-week launch']:[])],minWeeks:digital?1:f==='wrap'?4:2});
  owners[i%owners.length].boards++;
}
export const cpm=(l:Listing)=>+((l.weekly/(l.dailyImpr*7/1000))).toFixed(2);
export type Review={id:string;listingId:string;author:string;company:string;rating:number;date:string;text:string};
const RT=['Install was flawless and the proof-of-posting photos arrived the same day.','Our foot traffic jumped noticeably the week this board went live. Owner was super responsive.','Great visibility from the highway, creative looked crisp even at night.','Booking took five minutes. The impression estimates matched our attribution data closely.','Loop was shorter than other screens we tried, so frequency was excellent.','Slight delay on printing but the owner kept us updated at every step.','Best CPM we found in the market for this audience. Renewing for Q2.','The analytics panel made it easy to justify the spend to our CFO.'];
const CO=['Juniper Coffee','Northbeam Fitness','Atlas Dental','Kindred Realty','Bluefin Sushi','Vela Mobility','Hearth Insurance','Pine & Pour'];
export const reviews:Review[]=listings.flatMap(l=>Array.from({length:ri(3,6)},(_,k)=>({id:l.id+'r'+k,listingId:l.id,author:pick(FIRST)+' '+pick(LAST)[0]+'.',company:pick(CO),rating:r()>0.25?5:4,date:`2026-${String(ri(1,9)).padStart(2,'0')}-${String(ri(1,28)).padStart(2,'0')}`,text:pick(RT)})));
export const fmt$=(n:number)=>'$'+Math.round(n).toLocaleString();
export const fmtK=(n:number)=>n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e3?(n/1e3).toFixed(n>=1e5?0:1)+'K':String(n);
export const DEMO={advertiser:{email:'advertiser@demo.boardly',password:'demo1234',name:'Brian Walls',company:'Juniper Coffee',role:'advertiser'},owner:{email:'owner@demo.boardly',password:'demo1234',name:'Avery Chen',company:'Skyline Outdoor Co.',role:'owner',ownerId:'o0'}};
export const POSTS=[
 {slug:'digital-vs-static',title:'Digital vs. static: which billboard is right for your launch?',date:'Sep 30, 2026',read:6,body:'Static bulletins deliver 100% share of voice for weeks at a time, which makes them ideal for brand building. Digital LED faces rotate 6–10 advertisers in a loop, but go live in hours and let you daypart creative. For launches with a hard date, digital wins on speed; for always-on awareness, a static bulletin is usually the better CPM.'},
 {slug:'measuring-ooh',title:'How we estimate impressions on every board',date:'Sep 12, 2026',read:8,body:'Boardly combines traffic counts, pedestrian sensors, visibility geometry and dwell time to model daily impressions. Each listing shows its inputs so you can compare apples to apples. Our sample methodology weights vehicle occupancy at 1.4 and discounts angled or obstructed reads.'},
 {slug:'creative-that-reads',title:'Seven words or less: designing creative that reads at 60 mph',date:'Aug 21, 2026',read:5,body:'Drivers glance at a billboard for about five seconds. Keep copy under seven words, use high-contrast colors, one image, and a logo large enough to read from 500 feet. Our spec checker flags low contrast and tiny text before you book.'},
 {slug:'owners-pricing',title:'Owners: pricing your board for 90% occupancy',date:'Jul 8, 2026',read:7,body:'Owners on Boardly who price within 10% of the market CPM median see 90%+ occupancy. Use the earnings dashboard to test weekly discounts and minimum terms.'},
];
