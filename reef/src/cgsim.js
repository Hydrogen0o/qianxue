/* 用简单策略攻击规则（stress-testing-game-concepts 的做法）：不看局面的策略不该赢，看局面的策略应该明显更好 */
const C=require('./cg.js');const clone=o=>JSON.parse(JSON.stringify(o));
const acts=S=>{const A=[];S.hand.forEach((k,i)=>{const d=C.CD[k.id];if(S.energy<d.e)return;if(d.fx)A.push([i,-1]);else C.cgTargets(S,k.id).forEach(sp=>A.push([i,sp.i]))});return A};
const P={
 // 哪亮点哪：第一张打得起的牌，放到第一个亮的位置；不看局面
 '哪亮点哪':S=>{for(;;){const a=acts(S)[0];if(!a)break;C.cgPlay(S,...a)}},
 // 只挑眼前净化最多的动作
 '只看眼前':S=>{for(;;){let best=null,bv=-1;for(const a of acts(S)){const T=clone(S);C.cgPlay(T,...a);const d=C.CD[S.hand[a[0]].id];let v=C.cgScore(T).total/Math.max(1,d.e)+(d.hab?S.hand.filter(h=>C.CD[h.id].home===S.hand[a[0]].id).length*2+.5:0);if(v>bv){bv=v;best=a}}if(!best)break;C.cgPlay(S,...best)}},
 // 永远先守：有守卫牌就先放到会被盖/已被盖的家，其余随便
 '永远先守':S=>{for(;;){const A=acts(S);if(!A.length)break;const th=C.cgThreat(S,9).map(s=>s.i),g=A.find(a=>C.CD[S.hand[a[0]].id].guard&&(S.spots[a[1]].alg||th.includes(a[1])));C.cgPlay(S,...(g||A[0]))}},
 // 看局面：把“藻类盖完之后、下回合还能净化多少”也算进去
 '看局面':S=>{const val=T=>{const now=C.cgScore(T).total;const U=clone(T);C.cgThreat(U).forEach(sp=>{U.spots[sp.i].alg=true});U.x2=0;return now+C.cgScore(U).sum*1.6};
  for(;;){let best=null,bv=val(S)+.01;for(const a of acts(S)){const T=clone(S);C.cgPlay(T,...a);const d=C.CD[S.hand[a[0]].id];let v=val(T)+(d.hab?S.hand.filter(h=>C.CD[h.id].home===S.hand[a[0]].id).length*3+1:0);if(d.fx&&C.CST[S.stage].turns-S.turn>1&&C.cgScore(S).sum<60)v=-1;if(v>bv){bv=v;best=a}}if(!best){if(S.energy>=1){const i=S.hand.findIndex(k=>!C.CD[k.id].fx&&!C.cgTargets(S,k.id).length);if(i>=0&&C.cgSwap(S,i))continue}break}C.cgPlay(S,...best)}}};
const q=(a,p)=>a.slice().sort((x,y)=>x-y)[Math.floor(a.length*p)];const N=+process.argv[2]||200;
const T0=C.getT();
for(const name in P){C.setT([1e9,1e9,1e9]);const A=[[],[],[]];
 for(let n=0;n<N;n++){const S=C.cgInit();for(let st=0;st<3;st++){S.target=T0[st];while(!S.over){P[name](S);C.cgEnd(S);if(S.over==='win'&&S.turn<C.CST[st].turns){S.over=null;S.offer=null;C.cgThreat(S).forEach(sp=>sp.alg=true);S.turn++;S.energy=3+S.tier;S.x2=0;while(S.hand.length<5&&(S.deck.length||S.dis.length)){if(!S.deck.length){S.deck=S.dis;S.dis=[]}S.hand.push(S.deck.pop())}}}
  A[st].push(S.total);if(st<2){S.over='win';S.offer=[C.CPOOL[Math.floor(Math.random()*C.CPOOL.length)]];C.cgPick(S,0)}}}
 console.log(name.padEnd(6),A.map((a,i)=>`水域${i+1} 中位 ${q(a,.5)}（过关率 ${Math.round(a.filter(v=>v>=T0[i]).length/N*100)}%）`).join('  '))}
