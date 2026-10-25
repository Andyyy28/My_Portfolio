import {useState, type FormEvent} from 'react';
import {ArrowUpRight, Mail, Send} from 'lucide-react';
import {profile} from '../content';

type Draft = {subject:string;body:string};

export function ContactForm(){
 const [draft,setDraft]=useState<Draft|null>(null);
 function prepare(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  const data=new FormData(event.currentTarget);
  const name=String(data.get('name')||'').trim();
  const email=String(data.get('email')||'').trim();
  const message=String(data.get('message')||'').trim();
  if(!name||!email||!message)return;
  setDraft({subject:`Portfolio inquiry from ${name}`,body:`Hi Ruby,\n\n${message}\n\nFrom: ${name}\nReply to: ${email}`});
 }
 const mailto=draft?`mailto:${profile.email}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`:'';
 const gmail=draft?`https://mail.google.com/mail/?${new URLSearchParams({view:'cm',fs:'1',to:profile.email,su:draft.subject,body:draft.body})}`:'';
 return <form className="contact-form" onSubmit={prepare} onChange={()=>setDraft(null)}>
  <div className="form-row"><label>Your name<input name="name" autoComplete="name" placeholder="Alex Smith" required pattern=".*\S.*" maxLength={100}/></label><label>Your email<input type="email" name="email" autoComplete="email" placeholder="alex@example.com" required maxLength={254}/></label></div>
  <label>Your message<textarea name="message" placeholder="Hey Ruby, I’d love to chat about…" required rows={4} maxLength={2000} onInput={event=>event.currentTarget.setCustomValidity(event.currentTarget.value.trim()?'':'Please write a message.')}/></label>
  <button className="button primary" type="submit">Prepare email <Send size={16}/></button>
  <p className="form-note">Send to {profile.email} using Gmail or your email app. No message is sent until you click Send there.</p>
  {draft&&<div className="email-draft-panel">
   <p role="status"><strong>Your email draft is ready.</strong><br/>To: {profile.email}</p>
   <p className="draft-subject">Subject: {draft.subject}</p>
   <div className="email-draft-actions"><a className="button primary" href={gmail} target="_blank" rel="noreferrer">Open Gmail <ArrowUpRight size={16}/></a><a className="button raised" href={mailto}>Open email app <Mail size={16}/></a></div>
   <p className="form-note">Review the draft and click Send. You may need to sign in to Gmail. Ruby will receive it from the account you send with; your reply address is included in the message.</p>
  </div>}
 </form>
}
