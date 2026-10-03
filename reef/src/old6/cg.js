/* 牌局 v3：能量是代价，得分最高的地方会招来藻类。规则层，无界面。
   1 每回合有能量（3 点，污染每退一圈 +1），打牌、换牌都花能量。
   2 生物住进对应的家；一个家最多住 2 个。
   3 回合结束：没被藻盖住的生物净化并长大 +1；污染每退一圈，藻类每回合就多盖一个家：专挑“净化最多、又没有守卫”的。
   4 吃藻的生物（鹦嘴鱼、海胆）住进去，就清掉藻并守住那个家。 */
const HANDN=5,ENERGY0=3,SWAPCOST=1,CAP=2;
const SPOTS=[
 {type:'blue',t:0},{type:'blue',t:0},{type:'blue',t:1},{type:'blue',t:2},
 {type:'bare',t:0},{type:'bare',t:0},{type:'bare',t:1},{type:'bare',t:3},
 {type:'sand',t:0},{type:'sand',t:2}];
const TIERS=[0,.18,.42,.68];
const CD={
 coral:{n:'鹿角珊瑚',e:1,p:1,hab:1,art:'coral',tx:'家 · 住 2 条礁鱼',lg:'种在荒礁上，是礁鱼的家，能住 2 条。',fact:'珊瑚搭起了整片礁的骨架。礁只占海底不到 1%，却养活了约四分之一的海洋鱼类。'},
 anem:{n:'海葵',e:1,p:1,hab:1,art:'anemone',tx:'家 · 住 2 条小丑鱼',lg:'种在荒礁上，是小丑鱼的家。住满一对时，两条都 ×2，而且会守住海葵不被藻盖。',fact:'海葵靠触手上的毒刺捕食。小丑鱼身上有一层黏液，不会被蜇。'},
 clown:{n:'小丑鱼',e:2,p:4,home:'anem',art:'clown',tx:'住海葵 · 成对 ×2 并守家',lg:'只能住进海葵。同一个海葵住满一对时，两条都 ×2，并且守住海葵不被藻盖。',fact:'小丑鱼会赶走靠近海葵的入侵者，哪怕对方比它大得多。'},
 chromis:{n:'光鳃鱼',e:1,p:2,home:'coral',art:'chromis',tx:'住珊瑚 · 每条同伴 +2',fact:'光鳃鱼成群悬在鹿角珊瑚上方，一有危险就整群缩回枝杈里。'},
 butterfly:{n:'蝴蝶鱼',e:2,p:4,home:'coral',art:'butterfly',tx:'住珊瑚 · 成对 ×2',lg:'住珊瑚。场上有另一条蝴蝶鱼时，得分 ×2。',fact:'很多蝴蝶鱼成对生活，一对常常相伴多年。'},
 cleaner:{n:'裂唇鱼',e:2,p:1,home:'coral',art:'cleaner',tx:'住珊瑚 · 最高分的鱼 ×2',lg:'住珊瑚。它开清洁站：场上得分最高的那条鱼 ×2。',fact:'裂唇鱼在固定的“清洁站”替别的鱼吃掉寄生虫，大鱼会排队等它。'},
 parrot:{n:'鹦嘴鱼',e:2,p:2,home:'coral',guard:1,art:'parrot',tx:'住珊瑚 · 吃藻守家',lg:'住珊瑚。它住进去就清掉那丛珊瑚上的藻，并且一直守着，藻类盖不上来。',fact:'鹦嘴鱼刮食礁石上的藻类，磨碎的石灰质排出来就是白沙。没有它，藻类很快会盖住珊瑚。'},
 grouper:{n:'石斑鱼',e:3,p:3,home:'coral',art:'grouper',tx:'住珊瑚 · 每回合长 3 分',lg:'住珊瑚。别的生物每回合长大 +1，它 +3。越早放越值。',fact:'石斑鱼领地性很强，常年守着同一块礁石，越长越大。'},
 eel:{n:'花园鳗',e:1,p:2,home:'sand',art:'gardeneel',tx:'住沙地 · 每条同伴 +3',fact:'花园鳗成片住在沙洞里，只探出半截身子，迎着水流吃浮游生物。'},
 urchin:{n:'海胆',e:1,p:1,home:'sand',guard:1,art:'urchin',tx:'住沙地 · 吃藻守家',lg:'住沙地。它住进去就清掉那片沙地上的藻，并且一直守着。',fact:'海胆夜里出来啃藻。海胆大量死亡的礁区，藻类很快就会盖过珊瑚。'},
 ray:{n:'蓝斑魟',e:2,p:5,home:'sand',art:'ray',tx:'住沙地 · 稳稳的 5 分',fact:'蓝斑魟白天常躲在礁石下，涨潮时到沙地上翻沙找贝类吃。'},
 sardine:{n:'沙丁鱼',e:1,p:1,home:'blue',art:'sardine',tx:'游蓝水 · 鲹鱼的食物',fact:'沙丁鱼成千上万挤成“饵球”，是鲹鱼、鲨鱼这些掠食者的主要食物。'},
 jack:{n:'鲹鱼',e:2,p:3,home:'blue',art:'jack',tx:'游蓝水 · 每条沙丁鱼 +3',fact:'鲹鱼白天聚成大鱼群，追着沙丁鱼这样的小鱼捕食。'},
 shark:{n:'礁鲨',e:4,p:6,home:'blue',art:'shark',tx:'游蓝水 · 每种生物 +2',lg:'游蓝水。场上每有一种不同的生物，+2 分。',fact:'有鲨鱼巡游的礁，说明下面整条食物链是健康的。'},
 turtle:{n:'绿海龟',e:3,p:7,home:'sand',art:'turtle',tx:'住沙地海草 · 稳稳 7 分',fact:'绿海龟成年后主要吃海草。它像割草机一样啃食，反而让海草床长得更健康。'},
 moray:{n:'海鳝',e:3,p:4,home:'coral',art:'moray',tx:'住珊瑚 · 有石斑鱼 ×3',fact:'石斑鱼会到洞口摇头“邀请”海鳝一起捕猎：海鳝钻缝赶鱼，石斑在外面堵。'},
 spawn:{n:'产卵季',e:2,p:0,fx:1,art:'',tx:'本回合 ×2',lg:'一次性：这个回合的总净化 ×2。留到礁上最热闹的时候。',fact:'很多礁鱼在满月前后集体产卵。'}};
const HOMEN={coral:'珊瑚',anem:'海葵',sand:'沙地',blue:'蓝水',grass:'海草床',cave:'洞穴',bare:'荒礁'};
const CSTART=['coral','coral','coral','coral','anem','anem','clown','clown','clown','clown','chromis','chromis','chromis','chromis','butterfly','butterfly','cleaner','parrot','parrot','eel','eel','eel','eel','urchin','urchin','sardine','sardine','sardine','jack','jack','turtle','spawn'];
const CPOOL=['shark','grouper','moray','ray','parrot','butterfly','coral','anem','spawn','jack','cleaner','clown','urchin'];
const CST=[{n:'浅滩',turns:7,rule:''},{n:'礁坡',turns:8,rule:'这片水域污染更重，要净化更多才会退。'},{n:'峭壁',turns:9,rule:'最后一片，也是污染最重的一片。'}];
let CTARGET=[190,290,390];
const cshuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
let CUID=0;const cmk=id=>({id,u:++CUID,b:0});
function cgInit(){const S={stage:0,cards:CSTART.map(cmk)};cgStage(S);return S}
function cgStage(S){S.target=CTARGET[S.stage];S.turn=0;S.total=0;S.tier=0;S.spots=SPOTS.map((s,i)=>({i,type:s.type,t:s.t,hab:null,res:[],c:null,alg:false}));
 S.deck=cshuf(S.cards.map(k=>({id:k.id,u:k.u,b:0})));S.hand=[];S.dis=[];S.over=null;S.offer=null;
 /* 开局手牌保证有一丛珊瑚和一个海葵 */
 ['coral','anem'].forEach(id=>{const i=S.deck.findIndex(k=>k.id===id);if(i>=0)S.hand.push(S.deck.splice(i,1)[0])});cgTurn(S)}
function cgDraw(S,n){for(let i=0;i<n;i++){if(!S.deck.length){if(!S.dis.length)return;S.deck=cshuf(S.dis);S.dis=[]}S.hand.push(S.deck.pop())}}
function cgTurn(S){S.turn++;S.energy=ENERGY0+S.tier;S.x2=0;cgDraw(S,Math.max(0,HANDN-S.hand.length))}
/* “家”= 种了栖息地的荒礁，或一片沙地；它们会被藻盖。蓝水、海草床、洞穴不会。 */
const isHome=sp=>(sp.type==='bare'&&!!sp.hab)||sp.type==='sand';
const homeKind=sp=>sp.type==='sand'?'sand':sp.hab?sp.hab.id:null;
const guarded=sp=>sp.res.some(c=>CD[c.id].guard)||(sp.hab&&sp.hab.id==='anem'&&sp.res.filter(c=>c.id==='clown').length===2);
function cgAll(S){const A=[];S.spots.forEach(sp=>{if(sp.hab)A.push({c:sp.hab,sp,k:'hab'});sp.res.forEach((c,j)=>A.push({c,sp,k:'res',j}));if(sp.c)A.push({c:sp.c,sp,k:'solo'})});return A}
function cgCan(S,id,sp){const d=CD[id];if(d.fx||sp.t>S.tier)return false;if(d.hab)return sp.type==='bare'&&!sp.hab;
 if(d.home==='coral'||d.home==='anem'||d.home==='sand')return homeKind(sp)===d.home&&sp.res.length<CAP&&(!sp.alg||!!d.guard);return sp.type===d.home&&!sp.c}
const cgTargets=(S,id)=>S.spots.filter(sp=>cgCan(S,id,sp));
function cgScore(S){const A=cgAll(S),cnt={};A.forEach(a=>{if(!a.sp.alg)cnt[a.c.id]=(cnt[a.c.id]||0)+1});const kinds=Object.keys(cnt).length;
 A.forEach(a=>{const c=a.c;if(a.sp.alg){a.p=0;a.off=1;return}let p=CD[c.id].p+c.b;
  if(c.id==='chromis')p+=2*(cnt.chromis-1);if(c.id==='eel')p+=3*(cnt.eel-1);if(c.id==='jack')p+=3*(cnt.sardine||0);if(c.id==='shark')p+=2*kinds;
  if(c.id==='clown'&&a.sp.res.filter(x=>x.id==='clown').length===2)p*=2;if(c.id==='butterfly'&&cnt.butterfly>1)p*=2;if(c.id==='moray'&&cnt.grouper)p*=3;a.p=p});
 for(let n=0;n<(cnt.cleaner||0);n++){const top=A.filter(a=>a.c.id!=='cleaner'&&!a.off).sort((x,y)=>y.p-x.p)[0];if(top){top.p*=2;top.x2=1}}
 const sum=A.reduce((s,a)=>s+a.p,0);return {A,sum,total:sum*(S.x2?2:1)}}
/* 藻类下一步会盖哪里：净化最多、没守卫、还没被盖的家 */
function cgThreat(S,n){if(S.tier<1&&!n)return [];const sc=cgScore(S),v={};sc.A.forEach(a=>{v[a.sp.i]=(v[a.sp.i]||0)+a.p});
 return S.spots.filter(sp=>sp.t<=S.tier&&isHome(sp)&&!sp.alg&&!guarded(sp)&&(v[sp.i]||0)>0).sort((a,b)=>(v[b.i]-v[a.i])||(a.i-b.i)).slice(0,n||S.tier)}
function cgPlay(S,i,si){const k=S.hand[i];if(S.over||!k)return false;const d=CD[k.id];if(S.energy<d.e)return false;
 if(d.fx){S.hand.splice(i,1);S.dis.push(k);S.energy-=d.e;S.x2=1;return true}
 const sp=S.spots[si];if(!sp||!cgCan(S,k.id,sp))return false;S.hand.splice(i,1);S.energy-=d.e;const c={id:k.id,u:k.u,b:0};if(d.hab)sp.hab=c;else if(sp.type==='bare'||sp.type==='sand'){sp.res.push(c);if(d.guard)sp.alg=false}else sp.c=c;return true}
function cgSwap(S,i){if(S.over||!S.hand[i]||S.energy<SWAPCOST)return false;S.energy-=SWAPCOST;S.dis.push(S.hand.splice(i,1)[0]);cgDraw(S,1);return true}
function cgRemove(S,si,k,j){const sp=S.spots[si];if(S.over||!sp)return false;const out=c=>S.dis.push({id:c.id,u:c.u,b:0});
 if(k==='hab'&&sp.hab){out(sp.hab);sp.res.forEach(out);sp.hab=null;sp.res=[];sp.alg=false;return true}if(k==='res'&&sp.res[j]){out(sp.res.splice(j,1)[0]);return true}if(k==='solo'&&sp.c){out(sp.c);sp.c=null;return true}return false}
function cgEnd(S){if(S.over)return null;const st=CST[S.stage],sc=cgScore(S),ev={sc,tier:null,alg:[]};S.total+=sc.total;cgAll(S).forEach(a=>{if(!a.sp.alg)a.c.b+=a.c.id==='grouper'?3:1});
 let t=0;TIERS.forEach((f,i)=>{if(S.total>=f*S.target)t=i});if(t>S.tier){S.tier=t;ev.tier=t}
 if(S.total>=S.target){S.over='win';S.tier=3;if(S.stage<CST.length-1)S.offer=cshuf(CPOOL.slice()).filter((v,i,a)=>a.indexOf(v)===i).slice(0,3);return ev}
 if(S.turn>=st.turns){S.over='lose';return ev}
 cgThreat(S).forEach(sp=>{sp.alg=true;ev.alg.push(sp.i)});cgTurn(S);return ev}
function cgPick(S,i){if(!S.offer||!S.offer[i])return false;S.cards.push(cmk(S.offer[i]));S.stage++;cgStage(S);return true}
const CG={SPOTS,TIERS,CD,HOMEN,CSTART,CPOOL,CST,cgInit,cgAll,cgCan,cgTargets,cgScore,cgThreat,cgPlay,cgSwap,cgRemove,cgEnd,cgPick,isHome,guarded,setT:t=>{CTARGET=t},getT:()=>CTARGET};
if(typeof module!=='undefined')module.exports=CG;
