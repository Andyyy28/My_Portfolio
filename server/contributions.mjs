// Read GitHub's public calendar. Contributions are never inferred from events.
export const contributionSource = 'https://github.com/users/Andyyy28/contributions';
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`))?.[1];
export function parseContributions(html) {
 const tooltips = new Map();
 for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
  const id=attr(match[1],'for'), text=match[2].replace(/<[^>]*>/g,'').trim();
  const count=text.match(/^(No|[\d,]+) contributions? on /);
  if(id&&count)tooltips.set(id,count[1]==='No'?0:Number(count[1].replaceAll(',','')));
 }
 const days=[];
 for (const match of html.matchAll(/<td\b[^>]*\bdata-date=[^>]*>/g)) {
  const tag=match[0],date=attr(tag,'data-date'),level=Number(attr(tag,'data-level')),count=tooltips.get(attr(tag,'id'));
  if(!date||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isInteger(count)||count<0||!Number.isInteger(level)||level<0||level>4||(count===0)!==(level===0))throw new Error('Unrecognized GitHub calendar cell');
  days.push({date,count,level});
 }
 days.sort((a,b)=>a.date.localeCompare(b.date));
 if(days.length<350||days.length>371)throw new Error('Incomplete GitHub calendar');
 for(let i=0;i<days.length;i++){
  const time=Date.parse(`${days[i].date}T00:00:00Z`);
  if(!Number.isFinite(time)||new Date(time).toISOString().slice(0,10)!==days[i].date||(i>0&&time-Date.parse(`${days[i-1].date}T00:00:00Z`)!==86400000))throw new Error('Invalid GitHub calendar dates');
 }
 const totalText=html.replace(/<[^>]*>/g,' ').match(/([\d,]+)\s+contributions?\s+in the last year/i);
 const total=totalText?Number(totalText[1].replaceAll(',','')):NaN;
 // GitHub's headline and rendered week cells can differ near a rolling-year
 // boundary or during upstream refreshes. Preserve both as GitHub supplies them.
 if(!Number.isSafeInteger(total)||total<0)throw new Error('Missing GitHub calendar total');
 return {total,days,source:contributionSource,fetchedAt:new Date().toISOString()};
}
export async function getContributionResponse(){
 try{
  const response=await fetch(contributionSource,{headers:{Accept:'text/html','User-Agent':'Ruby-Jean-Solomon-Portfolio'},signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw new Error(`GitHub returned ${response.status}`);
  const calendar=parseContributions(await response.text());
  return Response.json(calendar,{headers:{'Cache-Control':'public, max-age=0, s-maxage=300, stale-while-revalidate=600'}});
 }catch(error){
  console.error('Contribution calendar unavailable:',error instanceof Error?error.message:'Unknown error');
  return Response.json({error:'The contribution calendar is temporarily unavailable. Please try again or view it on GitHub.'},{status:502,headers:{'Cache-Control':'no-store'}});
 }
}
