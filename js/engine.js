let zeroKnowledge=null;
async function loadKnowledge(){const r=await fetch("data/knowledge.json");zeroKnowledge=await r.json();}
function normalizeText(t){return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^\w\s/]/g," ").replace(/\s+/g," ").trim();}
function randomResponse(a){return a[Math.floor(Math.random()*a.length)];}
function has(q,p){return (` ${q} `).includes(` ${normalizeText(p)} `);}
function entity(q,item){if(!item.entity_values)return null;return [...item.entity_values].sort((a,b)=>b.length-a.length).find(v=>has(q,v))||null;}
function calculateScore(q,item){
 let s=0;
 for(const p of item.patterns||[]){const n=normalizeText(p);if(q===n)s+=120;else if(has(q,n))s+=45;}
 for(const t of item.terms||[])if(has(q,t))s+=8;
 const e=entity(q,item); if(e)s+=35;
 if(item.id==="REP_REGIONAL"){if(has(q,"regional")||has(q,"region"))s+=30;if(e)s+=25;if(has(q,"cite")&&!has(q,"region")&&!e)s-=20;}
 if(item.id==="REP_CITE_UT"){if(has(q,"cite")||has(q,"ut")||has(q,"unidad tecnica"))s+=30;if(has(q,"regional")||has(q,"region"))s-=15;}
 if(s>0)s+=item.priority||0; return {score:s,entity:e};
}
function findKnowledge(text){
 const q=normalizeText(text);let best=null;
 for(const item of zeroKnowledge.entries){const r=calculateScore(q,item);if(!best||r.score>best.score)best={...item,...r};}
 if(!best||best.score<20)return {response:randomResponse(zeroKnowledge.fallback.responses),action:null};
 let response=randomResponse(best.responses||["Encontré un recurso relacionado."]);
 if(best.entity&&best.entity_response){const d=best.entity.replace(/\b\w/g,c=>c.toUpperCase());response=best.entity_response.replace("{entity}",d);}
 return {id:best.id,type:best.type,name:best.name,score:best.score,response,action:best.action||null,entity:best.entity||null};
}