import {useEffect, useState} from 'react';
import {Github, GitCommitHorizontal, RefreshCw, ArrowUpRight} from 'lucide-react';
import {profile} from '../content';

type PublicEvent = {id:string;type:string;repo:{name:string};created_at:string;payload?:{action?:string;ref_type?:string}};
const interval = 5 * 60 * 1000;
const endpoint = 'https://api.github.com/users/Andyyy28/events/public?per_page=12';
function eventLabel(event:PublicEvent){
 const action=event.payload?.action;
 switch(event.type){
  case 'PushEvent': return 'Pushed code';
  case 'CreateEvent': return `Created ${event.payload?.ref_type||'a Git reference'}`;
  case 'DeleteEvent': return `Deleted ${event.payload?.ref_type||'a Git reference'}`;
  case 'PullRequestEvent': return `${action||'Updated'} a pull request`;
  case 'IssuesEvent': return `${action||'Updated'} an issue`;
  case 'IssueCommentEvent': return 'Commented on an issue or pull request';
  case 'WatchEvent': return 'Starred a repository';
  case 'ForkEvent': return 'Forked a repository';
  case 'ReleaseEvent': return 'Published a release';
  case 'PublicEvent': return 'Made a repository public';
  default:return event.type.replace(/Event$/,'').replace(/([a-z])([A-Z])/g,'$1 $2');
 }
}
export function GitHubActivity(){
 const [events,setEvents]=useState<PublicEvent[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[updated,setUpdated]=useState<Date|null>(null),[request,setRequest]=useState(0);
 useEffect(()=>{
  let controller:AbortController|undefined;
  let disposed=false, busy=false;
  async function refresh(force=false){
   if(busy||(!force&&document.hidden))return;
   busy=true;setLoading(true);setError('');
   const activeController=new AbortController();controller=activeController;
   const timeout=setTimeout(()=>activeController.abort(),15000);
   try{
    const response=await fetch(endpoint,{signal:activeController.signal,headers:{Accept:'application/vnd.github+json'}});
    if(!response.ok)throw new Error(response.status===403||response.status===429?'GitHub’s public API limit was reached. Please try again later.':'GitHub activity is temporarily unavailable. Please try again.');
    const result:unknown=await response.json();
    if(!Array.isArray(result))throw new Error('GitHub returned an unexpected response. Please try again.');
    const valid=result.filter((e):e is PublicEvent=>typeof e?.id==='string'&&typeof e?.type==='string'&&typeof e?.repo?.name==='string'&&/^[\w.-]+\/[\w.-]+$/.test(e.repo.name)&&typeof e?.created_at==='string'&&Number.isFinite(Date.parse(e.created_at)));
    if(!disposed&&!activeController.signal.aborted){setEvents(valid.slice(0,6));setUpdated(new Date())}
   }catch(e){if(!disposed)setError(activeController.signal.aborted?'The request timed out. Please try again.':e instanceof Error?e.message:'Could not load activity.');}
   finally{clearTimeout(timeout);busy=false;if(!disposed)setLoading(false)}
  }
  void refresh(true);
  const timer=setInterval(()=>void refresh(),interval);
  function onVisible(){if(!document.hidden)void refresh()}
  document.addEventListener('visibilitychange',onVisible);
  return()=>{disposed=true;clearInterval(timer);controller?.abort();document.removeEventListener('visibilitychange',onVisible)};
 },[request]);
 return <div className="github-activity raised" aria-labelledby="github-title">
  <div className="activity-header"><div><p className="eyebrow"><Github size={14}/> BUILDING IN THE OPEN</p><h3 id="github-title">Live GitHub activity</h3><a href={profile.github} target="_blank" rel="noreferrer">@Andyyy28 <ArrowUpRight size={14}/></a></div><button className="button raised" disabled={loading} onClick={()=>setRequest(n=>n+1)}><RefreshCw size={15} className={loading?'refreshing':''}/>{loading?'Loading…':'Refresh'}</button></div>
  <p className="activity-status" role="status">{error||(!updated?'Loading public activity…':`Last checked ${updated.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}. ${loading?'Refreshing…':''}`)}{error&&updated?' Showing the last successfully loaded activity.':''}</p>
  {!loading&&!error&&events.length===0&&<p className="activity-empty">No recent public events are available. Visit GitHub to explore my repositories.</p>}
  <ul className="activity-list">{events.map(event=><li key={event.id}><span className="activity-icon"><GitCommitHorizontal size={18}/></span><div><span>{eventLabel(event)}</span><a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noreferrer">{event.repo.name}<ArrowUpRight size={12}/></a></div><time dateTime={event.created_at}>{new Date(event.created_at).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}</time></li>)}</ul>
  <div className="activity-footer"><p>Public events only · Refreshes every 5 minutes while this page is visible.<br/>GitHub may delay events; this is not a contribution count.</p><a className="small-link" href={profile.github} target="_blank" rel="noreferrer">View GitHub <ArrowUpRight size={14}/></a></div>
 </div>
}
