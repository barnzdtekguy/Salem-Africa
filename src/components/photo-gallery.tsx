'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, X, Download, ZoomIn } from 'lucide-react';
import gallery from '@/data/gallery.json';
const albums=[{id:'all',name:'All photographs'},{id:'lagos',name:'Life at Salem Lagos'},{id:'saoc',name:'SAOC 2026'},{id:'hero',name:'Salem family'}];
export function PhotoGallery(){
 const [album,setAlbum]=useState('all');const [limit,setLimit]=useState(24);const [active,setActive]=useState<number|null>(null);const dialog=useRef<HTMLDialogElement>(null);
 const filtered=gallery.filter(p=>album==='all'||p.album===album);const photo=active!==null?filtered[active]:null;const isOpen=active!==null;
 useEffect(()=>{const a=new URLSearchParams(window.location.search).get('album');if(albums.some(x=>x.id===a))setAlbum(a!);},[]);
 useEffect(()=>{if(isOpen){dialog.current?.showModal();const prev=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=prev;dialog.current?.close();}}},[isOpen]);
 function changeAlbum(id:string){setAlbum(id);setLimit(24);const url=new URL(window.location.href);if(id==='all')url.searchParams.delete('album');else url.searchParams.set('album',id);window.history.replaceState(null,'',url);}
 return <div className="gallery-wrap">
  <div className="gallery-toolbar"><div className="album-tabs" role="group" aria-label="Filter photo albums">{albums.map(a=><button key={a.id} aria-pressed={album===a.id} onClick={()=>changeAlbum(a.id)}>{a.name}<span>{gallery.filter(p=>a.id==='all'||p.album===a.id).length}</span></button>)}</div><p aria-live="polite">{filtered.length} photographs</p></div>
  <div className="photo-grid">{filtered.slice(0,limit).map((p,i)=><button key={p.id} className="gallery-photo" onClick={()=>setActive(i)} aria-label={`Open ${p.alt}, photograph ${i+1}`}><Image src={p.thumbnail} alt={p.alt} width={p.width} height={p.height} sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"/><span><ZoomIn size={20}/>View photograph</span></button>)}</div>
  {limit<filtered.length&&<div className="gallery-more"><button className="premium-button" onClick={()=>setLimit(n=>n+24)}>Load more photographs <ArrowRight size={18}/></button><p>Showing {Math.min(limit,filtered.length)} of {filtered.length}</p></div>}
  <dialog ref={dialog} className="photo-lightbox" onCancel={()=>setActive(null)} onClick={e=>{if(e.target===e.currentTarget)setActive(null)}} onKeyDown={e=>{if(e.key==='ArrowRight')setActive(i=>((i??0)+1)%filtered.length);if(e.key==='ArrowLeft')setActive(i=>((i??0)-1+filtered.length)%filtered.length)}} aria-label="Service photograph viewer">
   {photo&&<><div className="lightbox-top"><span>{photo.alt} <small>{(active??0)+1} / {filtered.length}</small></span><div><a href={photo.src} download={`${photo.id}.webp`} aria-label="Download photograph"><Download size={21}/></a><button onClick={()=>setActive(null)} aria-label="Close photograph"><X size={25}/></button></div></div><div className="lightbox-stage"><button onClick={()=>setActive(i=>((i??0)-1+filtered.length)%filtered.length)} aria-label="Previous photograph"><ArrowLeft/></button><Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="90vw"/><button onClick={()=>setActive(i=>((i??0)+1)%filtered.length)} aria-label="Next photograph"><ArrowRight/></button></div><p className="lightbox-hint">Use the arrow keys to explore · Esc to close</p></>}
  </dialog>
 </div>
}
