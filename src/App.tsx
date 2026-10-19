import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { useEffect } from 'react';
import { Nav, Footer, BottomNav } from './ui';
import { Home, Search } from './home';
import { ListingPage } from './listing';
import { Book } from './book';
import { Dashboard, ListWizard } from './dash';
import * as M from './misc';
function R(){const loc=useLocation();useEffect(()=>{window.scrollTo(0,0)},[loc.pathname]);
 return <AnimatePresence mode="wait"><Routes location={loc} key={loc.pathname}>
  <Route path="/" element={<Home/>}/><Route path="/search" element={<Search/>}/><Route path="/listing/:id" element={<ListingPage/>}/><Route path="/book/:id" element={<Book/>}/>
  <Route path="/dashboard" element={<Dashboard/>}/><Route path="/list" element={<ListWizard/>}/><Route path="/login" element={<M.Login/>}/><Route path="/messages" element={<M.Messages/>}/>
  <Route path="/notifications" element={<M.Notifications/>}/><Route path="/favorites" element={<M.Favorites/>}/><Route path="/account" element={<M.Account/>}/><Route path="/help" element={<M.Help/>}/>
  <Route path="/pricing" element={<M.Pricing/>}/><Route path="/about" element={<M.About/>}/><Route path="/careers" element={<M.Careers/>}/><Route path="/blog" element={<M.Blog/>}/><Route path="/blog/:slug" element={<M.Post/>}/>
  <Route path="/terms" element={<M.Terms/>}/><Route path="/privacy" element={<M.Privacy/>}/><Route path="/owners" element={<M.Owners/>}/><Route path="*" element={<M.NotFound/>}/></Routes></AnimatePresence>}
function Shell(){const loc=useLocation();const full=loc.pathname==='/search';return <><Nav/><R/>{!full&&<Footer/>}<BottomNav/></>}
export default function App(){return <MotionConfig reducedMotion="user"><HashRouter><Shell/></HashRouter></MotionConfig>}
