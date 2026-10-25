import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseContributions,getContributionResponse} from '../server/contributions.mjs';
function fixture({missing=false,total=3,zero=false}={}){
 let html=`<h2>\n${zero?0:total} contributions in the last year\n</h2>`;
 const days=Array.from({length:365},(_,i)=>{
  const date=new Date(Date.UTC(2025,0,1+i)).toISOString().slice(0,10),count=!zero&&i===59?3:0;
  return `<td data-level='${count?2:0}' id='day-${i}' data-date='${date}'></td><tool-tip for='day-${i}'>${count||'No'} contributions on March 1st.</tool-tip>`;
 });
 if(missing)days[59]=days[59].replace(/<tool-tip.*<\/tool-tip>/,'');
 return html+days.reverse().join('');
}
test('sorts dates, reads exact counts and retains zero-contribution days',()=>{
 const c=parseContributions(fixture());assert.equal(c.total,3);assert.equal(c.days.length,365);
 assert.deepEqual(c.days[59],{date:'2025-03-01',count:3,level:2});assert.equal(c.days[0].count,0);assert.equal(c.days.at(-1).date,'2025-12-31');
});
test('supports a genuinely empty year',()=>assert.equal(parseContributions(fixture({zero:true})).total,0));
test('rejects missing counts, changed markup, or missing totals',()=>{
 assert.throws(()=>parseContributions(fixture({missing:true})));assert.throws(()=>parseContributions('<html>Sign in</html>'));assert.throws(()=>parseContributions(fixture().replace('3 contributions in the last year','')));
});
test('preserves GitHub headline separately from visible daily cells',()=>{
 const c=parseContributions(fixture({total:99}));assert.equal(c.total,99);assert.equal(c.days.reduce((sum,day)=>sum+day.count,0),3);
});
test('rejects duplicate or noncontiguous dates',()=>assert.throws(()=>parseContributions(fixture().replace('2025-03-01','2025-03-02'))));
test('upstream failure returns a noncached error instead of an empty calendar',async(t)=>{
 t.mock.method(globalThis,'fetch',async()=>new Response('Unavailable',{status:429}));
 const r=await getContributionResponse();assert.equal(r.status,502);assert.equal(r.headers.get('Cache-Control'),'no-store');assert.ok((await r.json()).error);
});
