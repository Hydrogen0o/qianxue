const T=require('./td.js');
function run(li,mode){const G=T.tdNew(li),L=G.L;let t=0;const dt=1/30;
 while(!G.over&&t<400){t+=dt;T.tdStep(G,dt);if(mode==='idle')continue;
  // 收光有延迟：落地 1.5 秒后才点；mode==='lazy' 时漏掉 30%
  G.suns.slice().forEach(s=>{if(s.y>=s.ty&&s.life<8.5){if(mode==='lazy'&&!s.rolled){s.rolled=1;s.skip=Math.random()<.3}if(!s.skip)T.tdSun(G,s.id)}});
  const rows=[...Array(L.rows).keys()],cnt=(k,r)=>G.units.filter(u=>u.k===k&&(r==null||u.r===r)).length,free=(r,cs)=>cs.find(c=>!T.unitAt(G,r,c));
  const threat=r=>G.foes.filter(f=>f.r===r);
  if(L.cards.includes('shark')){const r=rows.find(r=>threat(r).some(f=>f.x<1.2)&&threat(r).length>=1&&!G.mow[r]);if(r!=null&&T.tdPlace(G,'shark',r,0))continue}
  if(L.cards.includes('trigger')){const r=rows.filter(r=>threat(r).some(f=>f.k==='cots')&&cnt('trigger',r)<1).sort((a,b)=>Math.min(...threat(a).map(f=>f.x))-Math.min(...threat(b).map(f=>f.x)))[0];if(r!=null){const c=free(r,[2,1,3]);if(c!=null&&T.tdPlace(G,'trigger',r,c))continue;if(G.energy<150)continue}}
  const need=rows.filter(r=>threat(r).length&&cnt('parrot',r)===0).sort((a,b)=>Math.min(...threat(a).map(f=>f.x))-Math.min(...threat(b).map(f=>f.x)))[0];
  if(need!=null){const c=free(need,[1,2,3]);if(c!=null&&T.tdPlace(G,'parrot',need,c))continue;if(G.energy<100)continue}
  if(L.cards.includes('coral')&&cnt('coral')<Math.min(L.rows,5)+(li>=3?2:0)){const r=rows.sort((a,b)=>cnt('coral',a)-cnt('coral',b))[0],c=free(r,[0,1]);if(c!=null&&T.tdPlace(G,'coral',r,c))continue}
  if(L.cards.includes('urchin')){const r=rows.find(r=>threat(r).some(f=>f.k==='big')&&cnt('urchin',r)===0);if(r!=null){const c=free(r,[4,3]);if(c!=null&&T.tdPlace(G,'urchin',r,c))continue}}
  if(G.energy>=200){const r=rows.sort((a,b)=>cnt('parrot',a)-cnt('parrot',b))[0],c=free(r,[1,2,3,4]);if(c!=null&&cnt('parrot',r)<3)T.tdPlace(G,'parrot',r,c)}}
 return [G.over||'timeout',Math.round(G.t),G.mow.filter(Boolean).length,G.units.length]}
for(let li=0;li<T.TDL.length;li++){for(const m of ['good','lazy','idle']){let w=0,mow=0,tt=0;const N=m==='idle'?5:40;for(let i=0;i<N;i++){const r=run(li,m);if(r[0]==='win'){w++;mow+=r[2]}tt+=r[1]}console.log('L'+(li+1),m,'win',w+'/'+N,'avg mowers left',(mow/(w||1)).toFixed(1),'avg sec',Math.round(tt/N))}}
