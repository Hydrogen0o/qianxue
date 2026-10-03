/* 用简单策略攻击三道拉锯规则 */
const C=require('./cg.js');const clone=o=>JSON.parse(JSON.stringify(o));
const acts=S=>{const A=[];S.hand.forEach((k,i)=>{const d=C.CD[k.id];if(S.energy<d.e)return;if(d.fx)A.push([i,-1,-1]);else C.cgTargets(S,k.id).forEach(t=>A.push([i,t.l,t.c]))});return A};
const habBonus=(S,a)=>{const id=S.hand[a[0]].id;return C.CD[id].hab?S.hand.filter(h=>C.CD[h.id].home===id).length*1.5+.3:0};
const P={
 '哪亮点哪':S=>{for(;;){const a=acts(S)[0];if(!a)break;C.cgPlay(S,...a)}},
 '总放最前':S=>{for(;;){const A=acts(S);if(!A.length)break;A.sort((x,y)=>y[2]-x[2]);C.cgPlay(S,...A[0])}},
 '只堆总分':S=>{for(;;){let best=null,bv=-1;for(const a of acts(S)){const T=clone(S);C.cgPlay(T,...a);const v=C.cgScore(T).reduce((s,r)=>s+r.power,0)/Math.max(1,C.CD[S.hand[a[0]].id].e)+habBonus(S,a);if(v>bv){bv=v;best=a}}if(!best)break;C.cgPlay(S,...best)}},
 '只守一道':S=>{for(;;){const A=acts(S).filter(a=>a[1]===1||a[1]===-1);const a=A[0]||acts(S)[0];if(!a)break;C.cgPlay(S,...a)}},
 '看三道':S=>{const val=T=>C.cgScore(T).reduce((s,r,l)=>{const L=T.lanes[l];if(r.done)return s+30;const m=r.power-r.need;return s+(r.win?12+Math.min(m,3)*.3:Math.max(m,-8)*.8)+(r.win?0:(L.front<=1?-40:L.front<=2?-8:0))+r.power*.15},0);
  for(;;){let best=null,bv=val(S)+.01;for(const a of acts(S)){const T=clone(S);C.cgPlay(T,...a);const v=val(T)+habBonus(S,a);if(v>bv){bv=v;best=a}}if(!best){if(S.energy>=1){const i=S.hand.findIndex(k=>!C.CD[k.id].fx&&!C.cgTargets(S,k.id).length);if(i>=0&&C.cgSwap(S,i))continue}break}C.cgPlay(S,...best)}}};
const N=+process.argv[2]||300;
for(const name in P){const win=[0,0,0],reach=[0,0,0],turns=[[],[],[]];for(let n=0;n<N;n++){const S=C.cgInit();let g=0;while(g++<200){P[name](S);const st=S.stage,t=S.turn;C.cgEnd(S);if(S.over){reach[st]++;turns[st].push(t);if(S.over==='win'){win[st]++;if(S.offer)C.cgPick(S,0);else break}else break}}}
 console.log(name.padEnd(5),win.map((w,i)=>reach[i]?`水域${i+1} ${Math.round(w/reach[i]*100)}%（平均 ${(turns[i].reduce((a,b)=>a+b,0)/turns[i].length).toFixed(1)} 回合）`:'-').join('  '),' 通关',Math.round(win[2]/N*100)+'%')}
