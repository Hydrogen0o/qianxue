const C=require('./cg.js');const clone=o=>JSON.parse(JSON.stringify(o));
// 贪心：每步选让“本回合净化”最高的动作；栖息地按“能让手里的鱼住进去”估值
function turn(S,stats){for(;;){if(S.played>=C.PLAYN)break;let best=null,bv=C.cgScore(S).total+.01;const left=C.CST[S.stage].turns-S.turn;
  S.hand.forEach((k,i)=>{const d=C.CD[k.id];if(d.fx){if(left===0||C.cgScore(S).sum>=40){const v=C.cgScore(S).sum*2+1;if(v>bv){bv=v;best=[i,-1]}}return}
   C.cgTargets(S,k.id).slice(0,3).forEach(sp=>{const T=clone(S);C.cgPlay(T,i,sp.i);let v=C.cgScore(T).total;if(d.hab){const want=S.hand.filter(h=>C.CD[h.id].home===k.id).length;v+=want*4+1}if(v>bv){bv=v;best=[i,sp.i]}})});
  if(!best)break;C.cgPlay(S,...best)}
 // 换掉打不出去的牌
 for(let n=0;n<3;n++){const i=S.hand.findIndex(k=>!C.CD[k.id].fx&&!C.cgTargets(S,k.id).length);if(i<0||!C.cgSwap(S,i))break;if(S.played<C.PLAYN){const j=S.hand.length-1,k=S.hand[j],tg=C.CD[k.id].fx?[]:C.cgTargets(S,k.id);if(tg.length)C.cgPlay(S,j,tg[0].i)}}
 if(stats){stats.stuck+=S.played===0?1:0;stats.turns++}}
const q=(a,p)=>a.slice().sort((x,y)=>x-y)[Math.floor(a.length*p)];
C.setT([1e9,1e9,1e9]);const A=[[],[],[]],stats={stuck:0,turns:0};
for(let n=0;n<400;n++){const S=C.cgInit();for(let st=0;st<3;st++){// 用真实目标决定露出节奏，但不提前结束
  const real=[380,600,820][st];S.target=real;let tot=0;while(!S.over){turn(S,stats);const t=S.total;S.target=real;C.cgEnd(S);if(S.over==='win'&&S.turn<C.CST[st].turns){S.over=null;S.offer=null;S.turn++;S.played=0;S.swaps=2;S.x2=0;while(S.hand.length<5&&(S.deck.length||S.dis.length)){if(!S.deck.length){S.deck=S.dis;S.dis=[]}S.hand.push(S.deck.pop())}}}
  A[st].push(S.total);if(st<2){S.over='win';S.offer=[C.CPOOL[Math.floor(Math.random()*C.CPOOL.length)]];C.cgPick(S,0)}}}
A.forEach((a,i)=>console.log('stage'+(i+1),'q20/40/60/80',q(a,.2),q(a,.4),q(a,.6),q(a,.8)));console.log('一张都打不出的回合占比',(stats.stuck/stats.turns*100).toFixed(1)+'%');
