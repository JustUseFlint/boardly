import { useSyncExternalStore } from 'react';
import { DEMO } from './data';
export type Booking={id:string;listingId:string;start:string;end:string;total:number;fee:number;status:'pending'|'confirmed'|'declined'|'live'|'completed';creative?:string;created:string;advertiser:string;company:string};
export type Msg={id:string;thread:string;from:string;text:string;at:string};
export type State={user:null|{email:string;name:string;company:string;role:'advertiser'|'owner';ownerId?:string};favorites:string[];bookings:Booking[];messages:Msg[];savedSearches:{q:string;at:string}[];myListings:any[];creatives:{id:string;name:string;src:string}[];notifications:{id:string;text:string;at:string;read:boolean}[];cart:{listingId:string;start:string;end:string}[]};
const KEY='boardly-v1';
const iso=(d:number)=>new Date(Date.now()+d*864e5).toISOString().slice(0,10);
const seed=():State=>({user:null,favorites:['b1003','b1010','b1021'],cart:[],savedSearches:[{q:'?city=Chicago&format=digital',at:iso(-3)}],myListings:[],creatives:[],
 bookings:[
  {id:'BK-24019',listingId:'b1003',start:iso(-20),end:iso(8),total:14200,fee:0,status:'live',created:iso(-34),advertiser:'Brian Walls',company:'Juniper Coffee'},
  {id:'BK-24077',listingId:'b1010',start:iso(9),end:iso(37),total:9800,fee:0,status:'confirmed',created:iso(-4),advertiser:'Brian Walls',company:'Juniper Coffee'},
  {id:'BK-23811',listingId:'b1021',start:iso(-90),end:iso(-62),total:7600,fee:0,status:'completed',created:iso(-110),advertiser:'Brian Walls',company:'Juniper Coffee'},
  {id:'BK-24102',listingId:'b1001',start:iso(14),end:iso(42),total:11300,fee:0,status:'pending',created:iso(-1),advertiser:'Marcus Hale',company:'Vela Mobility'},
  {id:'BK-24103',listingId:'b1013',start:iso(21),end:iso(35),total:5200,fee:0,status:'pending',created:iso(0),advertiser:'Sofia Delgado',company:'Bluefin Sushi'},
  {id:'BK-24055',listingId:'b1025',start:iso(-10),end:iso(18),total:8900,fee:0,status:'live',created:iso(-30),advertiser:'Priya Patel',company:'Hearth Insurance'},
 ],
 messages:[
  {id:'m1',thread:'Skyline Outdoor Co.',from:'Skyline Outdoor Co.',text:'Hi Brian! Your vinyl is printed and install is scheduled for Thursday morning.',at:iso(-22)},
  {id:'m2',thread:'Skyline Outdoor Co.',from:'me',text:'Perfect, thanks. Can you send the proof-of-posting photos when done?',at:iso(-22)},
  {id:'m3',thread:'Skyline Outdoor Co.',from:'Skyline Outdoor Co.',text:'Absolutely, they will appear in your dashboard within 24 hours of install.',at:iso(-21)},
  {id:'m4',thread:'Meridian Media Group',from:'Meridian Media Group',text:'Your creative passed spec check. We will schedule it into the 8-slot loop.',at:iso(-3)},
  {id:'m5',thread:'Boardly Support',from:'Boardly Support',text:'Welcome to Boardly! This is a demo workspace with sample data.',at:iso(-40)},
 ],
 notifications:[{id:'n1',text:'BK-24077 confirmed by owner',at:iso(-3),read:false},{id:'n2',text:'Proof-of-posting uploaded for BK-24019',at:iso(-19),read:false},{id:'n3',text:'Price drop on a saved board in Chicago',at:iso(-2),read:true}]});
let state:State=(()=>{try{const v=localStorage.getItem(KEY);if(v)return{...seed(),...JSON.parse(v)}}catch{}return seed()})();
const subs=new Set<()=>void>();
export const set=(f:(s:State)=>Partial<State>)=>{state={...state,...f(state)};localStorage.setItem(KEY,JSON.stringify(state));subs.forEach(x=>x())};
export const useStore=()=>useSyncExternalStore(cb=>{subs.add(cb);return()=>subs.delete(cb)},()=>state);
export const login=(role:'advertiser'|'owner')=>{const d=DEMO[role];set(()=>({user:{email:d.email,name:d.name,company:d.company,role:d.role as any,ownerId:(d as any).ownerId}}))};
export const resetDemo=()=>{localStorage.removeItem(KEY);state=seed();subs.forEach(x=>x())};
export const toggleFav=(id:string)=>set(s=>({favorites:s.favorites.includes(id)?s.favorites.filter(x=>x!==id):[...s.favorites,id]}));
