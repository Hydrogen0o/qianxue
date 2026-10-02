const R=require('./engine.js');const clone=S=>JSON.parse(JSON.stringify(S));
const val=S=>{const left=R.ROUNDS-S.round;return R.score(S).total*(left+1)+R.income(S)*5*left+S.energy*.1};
function acts(S){const A=[];S.hand.forEach((k,i)=>{const d=R.CARDS[k.id];if(d.type==='fx'){if(k.id==='current'&&S.energy>=d.cost)A.push(T=>R.playFx(T,i));return}
  if(S.energy>=d.cost)R.fishCells(S,k.id).forEach(([r,c])=>A.push(T=>R.playFish(T,i,r,c)));
  if(S.energy>=d.cost+1&&!(d.need&&R.fishes(S).length<d.need))R.baseCells(S).forEach(([r,c])=>A.push(T=>R.placeBase(T,d.home,r,c)&&R.playFish(T,i,r,c)))});return A}
function turn(S,smart){for(let g=0;g<30;g++){const v0=val(S);let best=null,bv=v0;for(const a of acts(S)){const T=clone(S);if(!a(T))continue;if(T.pending)R.resolve(T,...T.pending.cells[0]);const v=val(T)+(smart?0:Math.random()*8);if(v>bv){bv=v;best=a}}
  if(best){best(S);if(S.pending)R.resolve(S,...S.pending.cells[0]);continue}
  const ci=S.hand.findIndex(k=>k.id==='cleanup');if(ci>=0&&!R.baseCells(S).length&&S.energy>=1&&R.frontier(S).length){R.playFx(S,ci);R.resolve(S,...S.pending.cells[0]);continue}
  if(!R.baseCells(S).length&&S.energy>=2&&R.frontier(S).length){R.purify(S);R.resolve(S,...S.pending.cells[0]);continue}
  const si=S.hand.findIndex(k=>k.id==='spawn');if(si>=0&&S.energy>=2&&R.score(S).chips>=15){R.playFx(S,si);continue}
  if(!S.disc&&S.hand.length){R.swap(S,0);continue}break}}
if(process.argv[3])R.LV.forEach(l=>l.target=1e9);const N=+process.argv[2]||300,res=[[],[],[]],reach=[0,0,0],win=[0,0,0];
for(let n=0;n<N;n++){const S=R.newRun();let guard=0;const per=[];
 while(guard++<200){if(S.phase==='play'){turn(S,1);const lv=S.level,rd=S.round;const before=S.score;R.endRound(S);if(S.phase!=='play'||S.level!==lv||S.round===1){} if(S.phase!=='play'){res[lv].push([S.score,rd]);reach[lv]++;if(S.phase!=='lost')win[lv]++}}
  else if(S.phase==='reward'){R.pickReward(S,Math.floor(Math.random()*3))}else if(S.phase==='lost'&&process.argv[3]&&S.level<2){S.phase='reward';S.picks=3;S.offer=R.POOL.slice(0,3)}else break}}
const q=(a,p)=>a.slice().sort((x,y)=>x-y)[Math.floor(a.length*p)];
res.forEach((a,i)=>{if(!a.length)return;const s=a.map(x=>x[0]);console.log('L'+(i+1),'reach',reach[i],'win',win[i],(win[i]/reach[i]*100).toFixed(0)+'%','final score q10/50/90',q(s,.1),q(s,.5),q(s,.9),'avg rounds',(a.reduce((x,y)=>x+y[1],0)/a.length).toFixed(1))});
