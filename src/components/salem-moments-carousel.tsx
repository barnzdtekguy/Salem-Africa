'use client';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ArrowLeft, Pause, Play } from 'lucide-react';
import gallery from '@/data/gallery.json';
const selected = ['DSC_6662.JPG','DSC_6658.JPG','DSC_6664.JPG','DSC_6685.JPG','DSC_6673.JPG','DSC_6661.JPG','DSC_6688.JPG','DSC_6667.JPG'];
const photos=selected.map(n=>gallery.find(p=>p.original===n)).filter((p):p is typeof gallery[number]=>!!p);
export function SalemMomentsCarousel(){
 const track=useRef<HTMLDivElement>(null);const [paused,setPaused]=useState(false);
 function move(d:number){const el=track.current;if(!el)return;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const end=el.scrollLeft+el.clientWidth>=el.scrollWidth-5;el.scrollTo({left:d===1&&end?0:el.scrollLeft+d*(el.children[0].clientWidth+24),behavior:reduced?'instant':'smooth'});}
 useEffect(()=>{if(paused||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const timer=setInterval(()=>move(1),5500);return()=>clearInterval(timer)},[paused]);
 return <section className="moments-section textured" aria-labelledby="moments-heading">
  <div className="section-heading"><div><p className="eyebrow">The people. The worship. The moments.</p><h2 id="moments-heading">This is what <em>family</em> looks like.</h2><p>A glimpse of life at Salem Lagos, and an invitation to be part of it.</p></div><Link href="/media/pictures?album=lagos" className="text-link">Explore the photo library <ArrowUpRight size={19}/></Link></div>
  <div ref={track} className="moments-track" aria-label="Salem Lagos service photographs">{photos.map((p,i)=><Link className="moment-card" key={p.id} href="/media/pictures?album=lagos" aria-label={`Explore Salem Lagos service photographs, image ${i+1}`}><Image src={p.thumbnail} alt={p.alt} fill sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 30vw"/><div className="moment-caption"><span>Life at Salem Lagos</span><ArrowUpRight size={21}/></div></Link>)}</div>
  <div className="moments-bottom"><span>Moments of faith. Memories of a lifetime.</span><div className="round-controls"><button onClick={()=>move(-1)} aria-label="Previous photographs"><ArrowLeft size={18}/></button><button onClick={()=>move(1)} aria-label="Next photographs"><ArrowRight size={18}/></button><button onClick={()=>setPaused(!paused)} aria-label={paused?'Play photo carousel':'Pause photo carousel'}>{paused?<Play size={15}/>:<Pause size={15}/>}</button></div></div>
 </section>
}
