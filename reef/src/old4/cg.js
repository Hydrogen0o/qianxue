/* 牌局 v2：一片被污染的礁。把栖息地和生物拖进场景；生物留在场上，每回合净化并长大。净化越多，露出的地方越多。规则层，无界面。 */
const HANDN=5,PLAYN=3,SWAPN=3;
/* 场景里的位置：x,y 是百分比；t 是哪一档净化后露出来；type: bare 荒礁（可种珊瑚/海葵）、sand 沙地、blue 蓝水、grass 海草、cave 洞穴 */
const SPOTS=[
 {type:'bare',t:0,x:33,y:43},{type:'bare',t:0,x:53,y:50},{type:'sand',t:0,x:13,y:52},{type:'blue',t:0,x:84,y:33},{type:'blue',t:0,x:90,y:52},
 {type:'bare',t:1,x:40,y:62},{type:'sand',t:1,x:22,y:63},{type:'blue',t:1,x:80,y:67},{type:'sand',t:1,x:9,y:39},
 {type:'bare',t:2,x:61,y:66},{type:'grass',t:2,x:13,y:22},{type:'blue',t:2,x:86,y:15},{type:'sand',t:2,x:26,y:30},
 {type:'cave',t:3,x:17,y:89},{type:'bare',t:3,x:50,y:86},{type:'blue',t:3,x:85,y:86},{type:'bare',t:3,x:70,y:82}];
const TIERS=[0,.18,.42,.68];
const CD={
 coral:{n:'鹿角珊瑚',p:1,hab:1,art:'coral',tx:'能住 2 条礁鱼',lg:'种在荒礁上。种下后，光鳃鱼、蝴蝶鱼这些礁鱼才有地方住，一丛能住 2 条。',fact:'珊瑚搭起了整片礁的骨架。礁只占海底不到 1%，却养活了约四分之一的海洋鱼类。'},
 anem:{n:'海葵',p:1,hab:1,art:'anemone',tx:'能住 2 条小丑鱼',lg:'种在荒礁上。住进一对小丑鱼时，两条都 ×2。',fact:'海葵靠触手上的毒刺捕食。小丑鱼身上有一层黏液，不会被蜇。'},
 clown:{n:'小丑鱼',p:4,home:'anem',art:'clown',tx:'住海葵 · 成对 ×2',lg:'只能住进海葵。同一个海葵里住满一对时，两条都 ×2。',fact:'小丑鱼一辈子住在海葵里：它替海葵赶走天敌，海葵的毒触手保护它。'},
 chromis:{n:'光鳃鱼',p:1,home:'coral',art:'chromis',tx:'住珊瑚 · 每条同伴 +2',fact:'光鳃鱼成群悬在鹿角珊瑚上方，一有危险就整群缩回枝杈里。'},
 butterfly:{n:'蝴蝶鱼',p:3,home:'coral',art:'butterfly',tx:'住珊瑚 · 成对 ×2',lg:'住珊瑚。场上有另一条蝴蝶鱼时，得分 ×2。',fact:'很多蝴蝶鱼成对生活，一对常常相伴多年。'},
 cleaner:{n:'裂唇鱼',p:1,home:'coral',art:'cleaner',tx:'住珊瑚 · 最高分的鱼 ×2',lg:'住珊瑚。它开清洁站：场上得分最高的那条鱼 ×2。',fact:'裂唇鱼在固定的“清洁站”替别的鱼吃掉寄生虫，大鱼会排队等它。'},
 parrot:{n:'鹦嘴鱼',p:2,home:'coral',art:'parrot',tx:'住珊瑚 · 打出时抽 2 张',fact:'鹦嘴鱼刮食礁石上的藻类，磨碎的石灰质排出来就是白沙。'},
 grouper:{n:'石斑鱼',p:2,home:'coral',art:'grouper',tx:'住珊瑚 · 每回合长 3 分',lg:'住珊瑚。别的生物每回合长大 +1，它 +3。越早放越值。',fact:'石斑鱼领地性很强，常年守着同一块礁石，越长越大。'},
 eel:{n:'花园鳗',p:1,home:'sand',art:'gardeneel',tx:'住沙地 · 每条同伴 +3',fact:'花园鳗成片住在沙洞里，只探出半截身子，迎着水流吃浮游生物。'},
 ray:{n:'蓝斑魟',p:4,home:'sand',art:'ray',tx:'住沙地 · 稳稳的 4 分',fact:'蓝斑魟白天常躲在礁石下，涨潮时到沙地上翻沙找贝类吃。'},
 sardine:{n:'沙丁鱼',p:1,home:'blue',art:'sardine',tx:'游蓝水 · 鲹鱼的食物',fact:'沙丁鱼成千上万挤成“饵球”，是鲹鱼、鲨鱼这些掠食者的主要食物。'},
 jack:{n:'鲹鱼',p:2,home:'blue',art:'jack',tx:'游蓝水 · 每条沙丁鱼 +3',fact:'鲹鱼白天聚成大鱼群，追着沙丁鱼这样的小鱼捕食。'},
 shark:{n:'礁鲨',p:3,home:'blue',art:'shark',tx:'游蓝水 · 每种生物 +2',lg:'游蓝水。场上每有一种不同的生物，+2 分。',fact:'有鲨鱼巡游的礁，说明下面整条食物链是健康的。'},
 turtle:{n:'绿海龟',p:6,home:'grass',art:'turtle',tx:'去海草床 · 稳稳的 6 分',fact:'绿海龟成年后主要吃海草。它像割草机一样啃食，反而让海草床长得更健康。'},
 moray:{n:'海鳝',p:3,home:'cave',art:'moray',tx:'住洞穴 · 有石斑鱼 ×3',fact:'石斑鱼会到洞口摇头“邀请”海鳝一起捕猎：海鳝钻缝赶鱼，石斑在外面堵。'},
 spawn:{n:'产卵季',p:0,fx:1,art:'',tx:'本回合 ×2',lg:'一次性：这个回合的总净化 ×2。留到礁上最热闹的时候。',fact:'很多礁鱼在满月前后集体产卵。'}};
const HOMEN={coral:'珊瑚',anem:'海葵',sand:'沙地',blue:'蓝水',grass:'海草床',cave:'洞穴',bare:'荒礁'};
const CSTART=['coral','coral','coral','coral','anem','anem','clown','clown','clown','clown','chromis','chromis','chromis','chromis','butterfly','butterfly','cleaner','eel','eel','eel','eel','sardine','sardine','sardine','jack','jack','turtle','ray','spawn','spawn'];
const CPOOL=['shark','grouper','moray','ray','parrot','butterfly','coral','anem','spawn','jack','cleaner','clown'];
const CST=[{n:'浅滩',turns:7,tier0:0,rule:''},{n:'礁坡',turns:8,tier0:0,rule:'这片水域污染更重，要净化更多才会退。'},{n:'峭壁',turns:9,tier0:0,rule:'最后一片。把整片礁都种满。'}];
let CTARGET=[380,600,820];
const cshuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
let CUID=0;const cmk=id=>({id,u:++CUID,b:0});
function cgInit(){const S={stage:0,cards:CSTART.map(cmk)};cgStage(S);return S}
function cgStage(S){S.target=CTARGET[S.stage];S.turn=0;S.total=0;S.tier=0;S.spots=SPOTS.map((s,i)=>({i,type:s.type,t:s.t,x:s.x,y:s.y,hab:null,res:[],c:null}));
 S.deck=cshuf(S.cards.map(k=>({id:k.id,u:k.u,b:0})));S.hand=[];S.dis=[];S.over=null;S.offer=null;cgTurn(S)}
function cgDraw(S,n){for(let i=0;i<n;i++){if(!S.deck.length){if(!S.dis.length)return;S.deck=cshuf(S.dis);S.dis=[]}S.hand.push(S.deck.pop())}}
function cgTurn(S){S.turn++;S.played=0;S.swaps=SWAPN;S.x2=0;cgDraw(S,Math.max(0,HANDN-S.hand.length))}
/* 场上所有生物：{c:牌, sp:位置, k:'hab'|'res'|'solo', j} */
function cgAll(S){const A=[];S.spots.forEach(sp=>{if(sp.hab)A.push({c:sp.hab,sp,k:'hab'});sp.res.forEach((c,j)=>A.push({c,sp,k:'res',j}));if(sp.c)A.push({c:sp.c,sp,k:'solo'})});return A}
function cgCan(S,id,sp){const d=CD[id];if(d.fx||sp.t>S.tier)return false;if(d.hab)return sp.type==='bare'&&!sp.hab;if(d.home==='coral'||d.home==='anem')return !!sp.hab&&sp.hab.id===d.home&&sp.res.length<2;return sp.type===d.home&&!sp.c}
const cgTargets=(S,id)=>S.spots.filter(sp=>cgCan(S,id,sp));
function cgScore(S){const A=cgAll(S),cnt={};A.forEach(a=>cnt[a.c.id]=(cnt[a.c.id]||0)+1);const kinds=Object.keys(cnt).length;
 A.forEach(a=>{const c=a.c;let p=CD[c.id].p+c.b;
  if(c.id==='chromis')p+=2*(cnt.chromis-1);if(c.id==='eel')p+=3*(cnt.eel-1);if(c.id==='jack')p+=3*(cnt.sardine||0);if(c.id==='shark')p+=2*kinds;
  if(c.id==='clown'&&a.sp.res.length===2)p*=2;if(c.id==='butterfly'&&cnt.butterfly>1)p*=2;if(c.id==='moray'&&cnt.grouper)p*=3;a.p=p});
 for(let n=0;n<(cnt.cleaner||0);n++){const top=A.filter(a=>a.c.id!=='cleaner').sort((x,y)=>y.p-x.p)[0];if(top){top.p*=2;top.x2=1}}
 const sum=A.reduce((s,a)=>s+a.p,0);return {A,sum,total:sum*(S.x2?2:1)}}
function cgPlay(S,i,si){const k=S.hand[i];if(S.over||!k||S.played>=PLAYN)return false;const d=CD[k.id];
 if(d.fx){S.hand.splice(i,1);S.dis.push(k);S.played++;S.x2=1;return true}
 const sp=S.spots[si];if(!sp||!cgCan(S,k.id,sp))return false;S.hand.splice(i,1);const c={id:k.id,u:k.u,b:0};if(d.hab)sp.hab=c;else if(d.home==='coral'||d.home==='anem')sp.res.push(c);else sp.c=c;S.played++;if(k.id==='parrot')cgDraw(S,2);return true}
function cgSwap(S,i){if(S.over||!S.hand[i]||S.swaps<=0)return false;S.dis.push(S.hand.splice(i,1)[0]);S.swaps--;cgDraw(S,1);return true}
/* 移走场上的生物（不花次数）。移走栖息地时，住在里面的也一起走 */
function cgRemove(S,si,k,j){const sp=S.spots[si];if(S.over||!sp)return false;const out=c=>S.dis.push({id:c.id,u:c.u,b:0});
 if(k==='hab'&&sp.hab){out(sp.hab);sp.res.forEach(out);sp.hab=null;sp.res=[];return true}if(k==='res'&&sp.res[j]){out(sp.res.splice(j,1)[0]);return true}if(k==='solo'&&sp.c){out(sp.c);sp.c=null;return true}return false}
function cgEnd(S){if(S.over)return null;const st=CST[S.stage],sc=cgScore(S),ev={sc,tier:null};S.total+=sc.total;cgAll(S).forEach(a=>{a.c.b+=a.c.id==='grouper'?3:1});
 let t=0;TIERS.forEach((f,i)=>{if(S.total>=f*S.target)t=i});if(t>S.tier){S.tier=t;ev.tier=t}
 if(S.total>=S.target){S.over='win';S.tier=3;if(S.stage<CST.length-1)S.offer=cshuf(CPOOL.slice()).filter((v,i,a)=>a.indexOf(v)===i).slice(0,3);return ev}
 if(S.turn>=st.turns){S.over='lose';return ev}cgTurn(S);return ev}
function cgPick(S,i){if(!S.offer||!S.offer[i])return false;S.cards.push(cmk(S.offer[i]));S.stage++;cgStage(S);return true}
const CG={SPOTS,TIERS,CD,HOMEN,CSTART,CPOOL,CST,PLAYN,cgInit,cgAll,cgCan,cgTargets,cgScore,cgPlay,cgSwap,cgRemove,cgEnd,cgPick,setT:t=>{CTARGET=t}};
if(typeof module!=='undefined')module.exports=CG;
