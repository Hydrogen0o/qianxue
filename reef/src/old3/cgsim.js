const C=require('./cg.js');const clone=o=>JSON.parse(JSON.stringify(o));
// greedy：每步选让“本回合得分”最高的动作；planner：额外看重能长期得分的建设
function turn(S,plan){for(;;){const lim=C.cgLimit(S);if(S.played>=lim)break;const left=C.CST[S.stage].turns-S.turn;let best=null,bv=C.cgScore(S).total*(plan?left+1:1)+.01;
  S.hand.forEach((k,i)=>{const d=C.CD[k.id];if(d.fx){if(!plan||left===0||C.cgScore(S).sum>=25){const T=clone(S);C.cgPlay(T,i,-1);const v=C.cgScore(T).total*(plan?left+1:1)-(plan?C.cgScore(S).sum*left:0);if(v>bv){bv=v;best=[i,-1]}}return}
   for(let s=0;s<C.SLOTS;s++){const T=clone(S);if(!C.cgPlay(T,i,s))continue;let v=C.cgScore(T).total*(plan?left+1:1);if(plan&&k.id==='coral')v+=6*left;if(plan&&k.id==='grouper')v+=left*left;if(v>bv){bv=v;best=[i,s]}}});
  if(!best)break;C.cgPlay(S,...best)}
 // 弃牌：greedy 全弃；planner 留有用的搭配牌
 for(let i=S.hand.length-1;i>=0;i--){const id=S.hand[i].id;const keep=plan&&(['spawn','anem','clown','cleaner','shark','grouper'].includes(id))&&S.hand.length<=3;if(!keep)C.cgDiscard(S,i)}}
function run(plan,targets){const S=C.cgInit();const res=[];let g=0;while(g++<60){turn(S,plan);const ev=C.cgEnd(S);if(S.over){res.push(S.total);if(S.over==='win'&&S.offer){C.cgPick(S,Math.floor(Math.random()*3))}else break}}return res}
const q=(a,p)=>a.slice().sort((x,y)=>x-y)[Math.floor(a.length*p)];
for(const plan of [0]){C.setT([1e9,1e9,1e9]);const A=[[],[],[]];
 // 量每关打满回合的原始分：强制过关
 for(let n=0;n<400;n++){const S=C.cgInit();for(let st=0;st<3;st++){S.stage=st;S.target=1e9;const save=S.cards;require('./cg.js');S.turn=0;S.total=0;S.slots=Array(5).fill(null);S.deck=save.map(k=>({id:k.id,u:k.u,b:0})).sort(()=>Math.random()-.5);S.hand=[];S.dis=[];S.over=null;S.played=0;S.x2=0;S.turn=1;while(S.hand.length<5)S.hand.push(S.deck.pop());
   while(!S.over){turn(S,plan);C.cgEnd(S)}A[st].push(S.total);S.cards.push({id:C.CPOOL[Math.floor(Math.random()*C.CPOOL.length)],u:9000+n*10+st,b:0})}}
 A.forEach((a,i)=>console.log(plan?'planner':'greedy ','stage'+(i+1),'q20/40/60/80',q(a,.2),q(a,.4),q(a,.6),q(a,.8)))}

