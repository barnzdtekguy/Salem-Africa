'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Play } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
const ORDER = ['001','013','002','011','008','005','010','003','014','006','004','007','009','012'];
const MESSAGES = [
 {kicker:'Welcome to Salem Africa',title:<>Saving. Healing.<br/>Making many <em>mighty.</em></>,href:'/churches',cta:'Find your Salem family'},
 {kicker:'Strong in faith. Empowered by wisdom.',title:<>Raising God<br/>an <em>army.</em></>,href:'/vision',cta:'Discover our mandate'},
 {kicker:'One house. One heart. One purpose.',title:<>A life of worship.<br/>A family of <em>faith.</em></>,href:'/about',cta:'Get to know Salem'},
 {kicker:'There is a place for you here',title:<>Come as you are.<br/>Grow into your <em>purpose.</em></>,href:'/churches',cta:'Plan your visit'},
];
export function HeroSlider(){
 const [index,setIndex]=useState(0);const reduced=useReducedMotion();
 useEffect(()=>{if(reduced)return;const t=setInterval(()=>setIndex(i=>(i+1)%ORDER.length),4000);return()=>clearInterval(t)},[reduced]);
 const message=MESSAGES[index%MESSAGES.length];
 return <section id="home-hero" className={`salem-hero${index===0?' is-first-slide':''}`} aria-roledescription="carousel" aria-label="Welcome to Salem Africa">
    <div className="hero-photographs">
      {ORDER.map((n,i)=>n==='001'?(
        <div key={n} className="hero-picture">
          <Image src="/images/hero/desktop%20hero%20slide.jpg" alt="" fill loading="eager" sizes="100vw" className={`hero-photo hero-photo--landscape ${i===index?'is-active':''}`} />
        </div>
      ):(
        <Image key={n} src={`/images/hero/salem-hero-${n}.webp`} alt="" fill loading="lazy" sizes="100vw" className={`hero-photo ${i===index?'is-active':''}`} />
      ))}
    </div>
  <div className="hero-shade"/>
  <div className="hero-content"><p className="eyebrow light">{message.kicker}</p><h1>{message.title}</h1><p className="hero-description">A church family across Africa and beyond.<br/>Rooted in Christ. Growing in faith. Living with purpose.</p>
  <div className="hero-actions"><Link href={message.href} className="premium-button">{message.cta}<ArrowUpRight size={18}/></Link><Link href="/media/live" className="watch-link"><span><Play size={14} fill="currentColor"/></span>Worship with us online</Link></div></div>
 </section>
}
