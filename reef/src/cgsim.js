/* 用简单策略攻击 v5 规则：不看局面的打法不该赢 */
const C=require('./cg.js');const clone=o=>JSON.parse(JSON.stringify(o));
const acts=S=>{const A=[];S.hand.forEach((k,i)=>{if(S.energy<C.CD[k.id].e)return;C.cgTargets(S,k.id).forEach(t=>A.push([i,t.l,t.c]))});return A};
const val=T=>{let v=0;C.cgScore(T).forEach((r,l)=>{const L=T.lanes[l];if(r.done){v+=40;return}v+=L.front*6;if(r.win)v+=14;else{v-=r.adv?(L.front<=1?80:16):3;v-=Math.min(r.short,6)}v+=r.power*.6;r.U.forEach(u=>{v+=u.k.hp*.15+(u.d.reef?(u.on?1.2:-1.5):0)})});T.lanes.forEach(L=>L.cells.forEach((x,c)=>{if(c<L.front&&x.coral)v+=.5}));return v};
const P={
 '哪亮点哪':S=>{for(;;){const a=acts(S)[0];if(!a)break;C.cgPlay(S,...a)}},
 '随机乱放':S=>{for(;;){const A=acts(S);if(!A.length)break;C.cgPlay(S,...A[Math.floor(Math.random()*A.length)])}},
 '总放最前':S=>{for(;;){const A=acts(S);if(!A.length)break;A.sort((x,y)=>y[2]-x[2]);C.cgPlay(S,...A[0])}},
 '看局面':S=>{for(;;){let best=null,bv=val(S)+.01;for(const a of acts(S)){const T=clone(S);C.cgPlay(T,...a);const v=val(T);if(v>bv){bv=v;best=a}}if(!best)break;C.cgPlay(S,...best)}}};
const N=+process.argv[2]||200,LV=C.getLV();
for(const name in P){const out=[];for(let lv=0;lv<LV.length;lv++){let w=0,t=0;for(let n=0;n<N;n++){const S=C.cgInit(lv);while(!S.over){P[name](S);C.cgEnd(S)}if(S.over==='win')w++;t+=S.turn}out.push(`关${lv+1} ${Math.round(w/N*100)}%(${(t/N).toFixed(1)})`)}console.log(name.padEnd(5),out.join('  '))}
