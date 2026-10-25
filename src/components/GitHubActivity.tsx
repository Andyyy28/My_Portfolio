import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {Github, RefreshCw, ArrowUpRight} from 'lucide-react';
import {profile} from '../content';

type Day = {date:string;count:number;level:number};
type Calendar = {total:number;days:Day[];fetchedAt:string};
const interval=5*60*1000;
const dateOf=(day:Day)=>new Date(`${day.date}T00:00:00Z`);
const describe=(day:Day)=>`${day.count===0?'No':day.count} contribution${day.count===1?'':'s'} on ${dateOf(day).toLocaleDateString(undefined,{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'})}`;
function isCalendar(value:unknown):value is Calendar {
 const data=value as Calendar|null;
 return !!data&&Number.isSafeInteger(data.total)&&data.total>=0&&Number.isFinite(Date.parse(data.fetchedAt))&&Array.isArray(data.days)&&data.days.length>=350&&data.days.length<=371&&data.days.every(d=>/^\d{4}-\d{2}-\d{2}$/.test(d.date)&&Number.isInteger(d.count)&&d.count>=0&&Number.isInteger(d.level)&&d.level>=0&&d.level<=4);
}

export function GitHubActivity(){
 const [calendar,setCalendar]=useState<Calendar|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState(''),[request,setRequest]=useState(0),[selected,setSelected]=useState<Day|null>(null),[focusIndex,setFocusIndex]=useState(0);
 const cells=useRef<(HTMLButtonElement|null)[]>([]);
 useEffect(()=>{
  let controller:AbortController|undefined, disposed=false, busy=false;
  async function refresh(force=false){
   if(busy||(!force&&document.hidden))return;
   busy=true;setLoading(true);setError('');
   const activeController=new AbortController();controller=activeController;
   const timeout=setTimeout(()=>activeController.abort(),15000);
   try{
    const response=await fetch('/api/github-contributions',{signal:activeController.signal});
    if(!response.ok)throw new Error('The contribution calendar is temporarily unavailable. Please retry or view it on GitHub.');
    const result:unknown=await response.json();
    if(!isCalendar(result))throw new Error('The contribution data could not be verified. Please view the calendar on GitHub.');
    if(!disposed){setCalendar(result);setSelected(null)}
   }catch(e){if(!disposed)setError(activeController.signal.aborted?'The request timed out. Please try again.':e instanceof Error?e.message:'Could not load contributions.');}
   finally{clearTimeout(timeout);busy=false;if(!disposed)setLoading(false)}
  }
  void refresh(true);
  const timer=setInterval(()=>void refresh(),interval);
  function onVisible(){if(!document.hidden)void refresh()}
  document.addEventListener('visibilitychange',onVisible);
  return()=>{disposed=true;clearInterval(timer);controller?.abort();document.removeEventListener('visibilitychange',onVisible)};
 },[request]);
 const offset=calendar?dateOf(calendar.days[0]).getUTCDay():0;
 const weeks=calendar?Math.ceil((calendar.days.length+offset)/7):53;
 const months=calendar?.days.flatMap((day,i)=>i===0||dateOf(day).getUTCDate()===1?[{label:dateOf(day).toLocaleDateString('en',{month:'short',timeZone:'UTC'}),column:Math.floor((i+offset)/7)+1}]:[])??[];
 return <div className="github-activity raised" aria-labelledby="github-title">
  <div className="activity-header"><div><p className="eyebrow"><Github size={14}/> BUILDING IN THE OPEN</p><h3 id="github-title">GitHub contributions</h3><a href={profile.github} target="_blank" rel="noreferrer">@Andyyy28 <ArrowUpRight size={14}/></a></div><button className="button raised" disabled={loading} onClick={()=>setRequest(n=>n+1)}><RefreshCw size={15} className={loading?'refreshing':''}/>{loading?'Loading…':'Refresh'}</button></div>
  <p className="activity-status" role="status">{error||(!calendar?'Loading GitHub’s contribution calendar…':`Updated ${new Date(calendar.fetchedAt).toLocaleString()}. ${loading?'Refreshing…':''}`)}{error&&calendar?' Showing the last successfully loaded calendar.':''}</p>
  {calendar&&<>
   <p className="contribution-total"><strong>{calendar.total.toLocaleString()}</strong> contributions in the last year</p>
   <div className="calendar-scroll" role="region" aria-label="GitHub contribution calendar. Scroll horizontally on small screens." tabIndex={0}>
    <div className="contribution-calendar" style={{'--weeks':weeks} as CSSProperties}>
     <div className="calendar-months" aria-hidden="true">{months.filter((month,i)=>i===months.length-1||months[i+1].column-month.column>1).map((month,i)=><span key={i} style={{gridColumn:month.column}}>{month.label}</span>)}</div>
     <div className="calendar-weekdays" aria-hidden="true"><span style={{gridRow:2}}>Mon</span><span style={{gridRow:4}}>Wed</span><span style={{gridRow:6}}>Fri</span></div>
     <div className="calendar-days" aria-label="Daily contributions. Use arrow keys to move by day or week.">{calendar.days.map((day,i)=><button key={day.date} ref={element=>{cells.current[i]=element}} type="button" tabIndex={focusIndex===i?0:-1} className={`contribution-cell level-${day.level}`} style={{gridColumn:Math.floor((i+offset)/7)+1,gridRow:(i+offset)%7+1}} title={describe(day)} aria-label={describe(day)} onMouseEnter={()=>setSelected(day)} onFocus={()=>{setSelected(day);setFocusIndex(i)}} onClick={()=>{setSelected(day);setFocusIndex(i)}} onKeyDown={event=>{
      const moves:Record<string,number>={ArrowLeft:-7,ArrowRight:7,ArrowUp:-1,ArrowDown:1,Home:-i,End:calendar.days.length-1-i};
      if(event.key in moves){event.preventDefault();const next=Math.max(0,Math.min(calendar.days.length-1,i+moves[event.key]));setFocusIndex(next);cells.current[next]?.focus()}
     }}/>)}</div>
    </div>
   </div>
   <div className="calendar-bottom"><p className="calendar-detail" aria-live="polite">{selected?describe(selected):'Hover, focus, or tap a square to explore a day.'}</p><div className="calendar-legend" aria-label="Contribution intensity from less to more"><span>Less</span>{[0,1,2,3,4].map(level=><i key={level} className={`level-${level}`} aria-hidden="true"/>)}<span>More</span></div></div>
  </>}
  <div className="activity-footer"><p>From GitHub’s public contribution calendar · Refreshes every 5 minutes while visible.<br/>GitHub may take time to count new contributions.</p><a className="small-link" href={`${profile.github}?tab=overview`} target="_blank" rel="noreferrer">View on GitHub <ArrowUpRight size={14}/></a></div>
 </div>
}
