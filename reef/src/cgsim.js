/* 用简单打法攻击 v6：不看局面的打法应该明显更差 */
const C=require('./cg.js');const clone=o=>JSON.parse(JSON.stringify(o));
const cellOrder=(S,d)=>{const cs=C.cgTargets(S,d).filter(t=>t.cell!=null).map(t=>t.cell);return cs};
function playBlind(S){for(let g=0;g<40;g++){let done=false;for(let i=0;i<S.hand.length&&!done;i++){const id=S.hand[i].id;if(S.energy<C.CD[id].e)continue;const T=C.cgTargets(S,id);if(T.length){done=C.cgPlay(S,i,T[0])}}if(!done){if(!C.cgDrawAct(S))break}}
 for(let c=0;c<C.NS;c++)if(C.cgCanAct(S,c)&&S.foes.length){const d=C.CD[S.cells[c].c.id];if(d.clean)continue;C.cgAttack(S,c,0)}}
function playSmart(S){for(let g=0;g<40;g++){let best=null,bv=-1;S.hand.forEach((k,i)=>{const d=C.CD[k.id];if(S.energy<d.e)return;C.cgTargets(S,k.id).forEach(t=>{let v=0;const fc=C.frontCell(S);
   if(d.fx==='plankton')v=5;else if(d.fx==='cleanup'){const f=S.foes[t.foe];v=f.hp<=3?6:2}else if(d.terr){const x=S.cells[t.cell];v=!x.coral?(x.c&&C.CD[x.c.id].home?6:(S.cells.some(y=>y.coral&&!y.c)?.5:3)):1.5}
   else if(d.fx==='zoox')v=S.cells[t.cell].c?3:.5;else{const x=S.cells[t.cell];v=d.h>=6?(t.cell>fc?5+t.cell:1):(d.home?(x.coral?4:.3):2)+(t.cell<fc||fc<0?1:0)+(d.a||0)*.3}
   if(v>bv){bv=v;best=[i,t]}})});if(best&&bv>=1&&C.cgPlay(S,...best))continue;if(S.hand.length<3&&C.cgDrawAct(S))continue;if(best&&C.cgPlay(S,...best))continue;if(!C.cgDrawAct(S))break}
 // 行动：先让能补刀的补刀，优先打渔网/海星；裂唇鱼清洁被网住或已行动的最强同伴
 for(let pass=0;pass<3;pass++)for(let c=0;c<C.NS;c++){if(!C.cgCanAct(S,c))continue;const d=C.CD[S.cells[c].c.id];if(d.clean){let b=-1,bv=0;for(let q=0;q<C.NS;q++){const o=S.cells[q].c;if(o&&q!==c&&(o.net||!o.ready)&&C.atkOf(S,q)>bv){bv=C.atkOf(S,q);b=q}}if(b>=0&&pass>0)C.cgClean(S,c,b);continue}
  if(!S.foes.length)continue;const a=C.atkOf(S,c);let fi=S.foes.findIndex(f=>f.hp<=a);if(fi<0)fi=S.foes.map((f,i)=>[i,({cots:3,net:2,algae:1})[f.id]*10-f.hp]).sort((x,y)=>y[1]-x[1])[0][0];C.cgAttack(S,c,fi)}}
// 新手：牌随手放（不懂前排、不懂珊瑚），每个生物有三成概率忘了出手，随便挑敌人打
function playNovice(S){for(let g=0;g<40;g++){const A=[];S.hand.forEach((k,i)=>{if(S.energy>=C.CD[k.id].e)C.cgTargets(S,k.id).forEach(t=>A.push([i,t]))});if(A.length){C.cgPlay(S,...A[Math.floor(Math.random()*A.length)]);continue}if(Math.random()<.5&&C.cgDrawAct(S))continue;break}
 for(let c=0;c<C.NS;c++)if(C.cgCanAct(S,c)&&S.foes.length&&Math.random()>.3){if(C.CD[S.cells[c].c.id].clean)continue;C.cgAttack(S,c,Math.floor(Math.random()*S.foes.length))}}
function playNoAttack(S){for(let g=0;g<40;g++){const A=[];S.hand.forEach((k,i)=>{if(S.energy>=C.CD[k.id].e)C.cgTargets(S,k.id).forEach(t=>A.push([i,t]))});if(A.length){C.cgPlay(S,...A[0]);continue}break}}
const N=+process.argv[2]||300,LV=C.getLV();
for(const [name,pol] of [['只放牌不出手',playNoAttack],['新手乱打',playNovice],['哪亮点哪',playBlind],['看局面',playSmart]]){const out=[];for(let lv=0;lv<LV.length;lv++){let w=0,t=0,h=0;for(let n=0;n<N;n++){const S=C.cgInit(lv);let g=0;while(!S.over&&g++<60){pol(S);C.cgAutoAll(S);if(!S.over)C.cgEnd(S)}if(S.over==='win'){w++;h+=S.heart}t+=S.turn}out.push(`关${lv+1} ${Math.round(w/N*100)}%（${(t/N).toFixed(1)} 回合，剩 ${(h/(w||1)).toFixed(1)} 心）`)}console.log(name.padEnd(5),out.join('  '))}
