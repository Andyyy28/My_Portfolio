import {useEffect, useRef, useState} from 'react';
import {ArrowUpRight, Download, X} from 'lucide-react';
import {certificates} from '../content';

export function Certificates() {
 const [selected,setSelected]=useState<typeof certificates[number]|null>(null);
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(selected) dialog.current?.showModal()},[selected]);
 return <section id="certifications" className="section container certificate-section">
  <div className="section-heading"><div><p className="eyebrow">MILESTONES ALONG THE WAY</p><h2>Certifications & learning.</h2></div><p>Five milestones in AI, cybersecurity, and building with emerging technology.</p></div>
  <div className="certificate-grid">{certificates.map(c=><article className="certificate-card raised" key={c.id}>
   <button className="certificate-image" aria-label={`View ${c.title} certificate`} onClick={()=>setSelected(c)}><img src={c.image} alt={`${c.title} certificate awarded to Ruby Jean Solomon`} loading="lazy" width="720" height="510"/><span><ArrowUpRight size={18}/></span></button>
   <div className="certificate-info"><p className="eyebrow">{c.type}</p><h3>{c.title}</h3><p>{c.issuer}</p><small>{c.date}</small><button className="small-link" onClick={()=>setSelected(c)}>View certificate <ArrowUpRight size={14}/></button></div>
  </article>)}</div>
  <dialog ref={dialog} className="certificate-dialog" aria-labelledby="certificate-title" onClose={()=>setSelected(null)} onClick={e=>{if(e.target===dialog.current)dialog.current.close()}}>{selected&&<>
   <button className="dialog-close icon-button" aria-label="Close certificate" onClick={()=>dialog.current?.close()}><X/></button>
   <div className="dialog-content"><p className="eyebrow">{selected.type}</p><h2 id="certificate-title">{selected.title}</h2><p>{selected.issuer} · {selected.date}</p><p>{selected.description}</p></div>
   <img className="certificate-full" src={selected.image} alt={`${selected.title} — original certificate for Ruby Jean Solomon`}/>
   <div className="certificate-actions"><a className="button raised" href={selected.image} target="_blank" rel="noreferrer">Open full size <ArrowUpRight size={16}/></a><a className="button primary" href={selected.image} download>Download <Download size={16}/></a></div>
  </>}</dialog>
 </section>
}
