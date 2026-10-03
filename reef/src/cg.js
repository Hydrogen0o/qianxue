/* 牌局 v4：三条水道的拉锯。规则层，无界面。
   1 每回合有能量，打牌花能量。生物只能放进自己那条水道里还干净的格子，一格最多 2 个（小丑鱼要先有海葵）。
   2 回合结束，每条水道比大小：这条道的净化力 ≥ 污染值，污染退一格；不够，污染进一格，盖住那格里的生物。
   3 紧挨污染的那一格是前线：里面的生物净化力 ×2，但污染一进就先盖住它们。
   4 污染被逼退时变浓，推进后变稀。三条道都推干净就赢，任何一条道被占满就输。 */
const NC=6,HANDN=5,SWAPCOST=1,CAP=2;
const LANES=[['blue','蓝水'],['reef','礁石'],['sand','沙地']];
const CD={
 anem:{n:'海葵',e:1,p:1,hab:1,ln:['reef'],art:'anemone',lg:'小丑鱼的家，住 2 条。',fact:'海葵靠触手上的毒刺捕食。小丑鱼身上有一层黏液，不会被蜇。'},
 clown:{n:'小丑鱼',e:2,p:3,home:'anem',ln:['reef'],art:'clown',lg:'住海葵。同一个海葵里住满一对，两条都 ×2。',fact:'小丑鱼会赶走靠近海葵的入侵者，哪怕对方比它大得多。'},
 chromis:{n:'光鳃鱼',e:1,p:1,ln:['reef'],art:'chromis',lg:'住礁石。这条道里每多一条光鳃鱼，每条都 +1。',fact:'光鳃鱼成群悬在鹿角珊瑚上方，一有危险就整群缩回枝杈里。'},
 butterfly:{n:'蝴蝶鱼',e:2,p:3,ln:['reef'],art:'butterfly',lg:'住礁石。这条道里有另一条蝴蝶鱼时 ×2。',fact:'很多蝴蝶鱼成对生活，一对常常相伴多年。'},
 cleaner:{n:'裂唇鱼',e:2,p:1,ln:['reef','blue'],art:'cleaner',lg:'礁石、蓝水都能去。给所在水道最强的鱼做清洁，让它 ×2。',fact:'裂唇鱼在固定的“清洁站”替别的鱼吃掉寄生虫，大鱼会排队等它。'},
 parrot:{n:'鹦嘴鱼',e:2,p:2,ln:['reef','sand'],eat:3,art:'parrot',lg:'礁石、沙地都能去。每回合啃掉所在水道 3 点污染。',fact:'鹦嘴鱼刮食礁石上的藻类，磨碎的石灰质排出来就是白沙。'},
 grouper:{n:'石斑鱼',e:3,p:4,ln:['reef'],grow:2,art:'grouper',lg:'住礁石。每回合长大 +2。',fact:'石斑鱼领地性很强，常年守着同一块礁石，越长越大。'},
 moray:{n:'海鳝',e:3,p:4,ln:['reef'],art:'moray',lg:'住礁石。这条道里有石斑鱼时 ×2。',fact:'石斑鱼会到洞口摇头“邀请”海鳝一起捕猎：海鳝钻缝赶鱼，石斑在外面堵。'},
 eel:{n:'花园鳗',e:1,p:1,ln:['sand'],art:'gardeneel',lg:'住沙地。每多一条花园鳗，每条都 +2。',fact:'花园鳗成片住在沙洞里，只探出半截身子，迎着水流吃浮游生物。'},
 urchin:{n:'海胆',e:1,p:1,ln:['sand','reef'],eat:2,art:'urchin',lg:'沙地、礁石都能住。每回合啃掉所在水道 2 点污染。',fact:'海胆夜里出来啃藻。海胆大量死亡的礁区，藻类很快就会盖过珊瑚。'},
 ray:{n:'蓝斑魟',e:2,p:4,ln:['sand','reef'],art:'ray',lg:'沙地、礁石都能去。',fact:'蓝斑魟白天常躲在礁石下，涨潮时到沙地上翻沙找贝类吃。'},
 turtle:{n:'绿海龟',e:3,p:6,ln:['sand','reef','blue'],art:'turtle',lg:'三条水道都能去。',fact:'绿海龟成年后主要吃海草。它像割草机一样啃食，反而让海草床长得更健康。'},
 sardine:{n:'沙丁鱼',e:1,p:1,ln:['blue'],art:'sardine',lg:'游蓝水。',fact:'沙丁鱼成千上万挤成“饵球”，是鲹鱼、鲨鱼这些掠食者的主要食物。'},
 jack:{n:'鲹鱼',e:2,p:2,ln:['blue','reef'],art:'jack',lg:'蓝水、礁石都能去。所在水道每有一条沙丁鱼 +2。',fact:'鲹鱼白天聚成大鱼群，追着沙丁鱼这样的小鱼捕食。'},
 shark:{n:'礁鲨',e:4,p:5,ln:['blue','reef'],art:'shark',lg:'蓝水、礁石都能去。所在水道每有一条别的鱼 +2。',fact:'有鲨鱼巡游的礁，说明下面整条食物链是健康的。'},
 spawn:{n:'产卵季',e:2,p:0,fx:1,art:'',lg:'一次性：这个回合三条水道的净化力都 ×2。',fact:'很多礁鱼在满月前后集体产卵。'}};
const CSTART=['anem','anem','anem','clown','clown','clown','clown','chromis','chromis','chromis','chromis','butterfly','butterfly','cleaner','parrot','parrot','eel','eel','eel','eel','urchin','urchin','ray','sardine','sardine','sardine','sardine','jack','jack','jack','turtle','spawn'];
const CPOOL=['shark','grouper','moray','ray','parrot','butterfly','spawn','jack','cleaner','clown','urchin','turtle'];
let CFG=[{n:'浅滩',turns:9,p0:3,g:0,up:3,front:3},{n:'礁坡',turns:10,p0:3,g:0,up:4,front:3},{n:'峭壁',turns:11,p0:4,g:0,up:4,front:3}];
const cshuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
let CUID=0;const cmk=id=>({id,u:++CUID,b:0});
function cgInit(){const S={stage:0,cards:CSTART.map(cmk)};cgStage(S);return S}
function cgStage(S){const c=CFG[S.stage];S.turn=0;S.lanes=LANES.map(([type],li)=>({li,type,front:c.front,P:c.p0,cells:Array.from({length:NC},()=>({hab:null,res:[]}))}));
 S.deck=cshuf(S.cards.map(k=>({id:k.id,u:k.u,b:0})));S.hand=[];S.dis=[];S.over=null;S.offer=null;
 ['sardine','chromis','eel'].forEach(id=>{const i=S.deck.findIndex(k=>k.id===id);if(i>=0)S.hand.push(S.deck.splice(i,1)[0])});cgTurn(S)}
function cgDraw(S,n){for(let i=0;i<n;i++){if(!S.deck.length){if(!S.dis.length)return;S.deck=cshuf(S.dis);S.dis=[]}S.hand.push(S.deck.pop())}}
const cgEnergy=t=>Math.min(6,3+Math.floor((t-1)/2));
function cgTurn(S){S.turn++;S.energy=cgEnergy(S.turn);S.x2=0;cgDraw(S,Math.max(0,HANDN-S.hand.length))}
/* 目标格：{l:水道序号,c:格子} */
function cgCan(S,id,l,c){const d=CD[id],L=S.lanes[l];if(d.fx||!L||!d.ln.includes(L.type)||c>=L.front)return false;const x=L.cells[c];
 if(d.hab)return !x.hab&&!x.res.length;if(d.home)return !!x.hab&&x.hab.id===d.home&&x.res.length<CAP;return x.res.length<CAP}
function cgTargets(S,id){const o=[];S.lanes.forEach((L,l)=>{for(let c=0;c<L.front;c++)if(cgCan(S,id,l,c))o.push({l,c})});return o}
function cgLane(S,l){const L=S.lanes[l],A=[];for(let c=0;c<NC;c++){const x=L.cells[c],off=c>=L.front;if(x.hab)A.push({c:x.hab,l,col:c,k:'hab',off});x.res.forEach((k,j)=>A.push({c:k,l,col:c,k:'res',j,off}))}
 const on=A.filter(a=>!a.off),cnt={};on.forEach(a=>cnt[a.c.id]=(cnt[a.c.id]||0)+1);
 A.forEach(a=>{if(a.off){a.p=0;return}const id=a.c.id;let p=CD[id].p+a.c.b;a.fx=[];
  if(id==='chromis'&&cnt.chromis>1){p+=cnt.chromis-1;a.fx.push('school')}if(id==='eel'&&cnt.eel>1){p+=2*(cnt.eel-1);a.fx.push('school')}
  if(id==='jack'&&cnt.sardine){p+=2*cnt.sardine;a.fx.push('hunt')}if(id==='shark'&&on.length>1){p+=2*(on.length-1);a.fx.push('hunt')}
  if(id==='clown'&&L.cells[a.col].res.filter(x=>x.id==='clown').length===2){p*=2;a.fx.push('pair')}if(id==='butterfly'&&cnt.butterfly>1){p*=2;a.fx.push('pair')}if(id==='moray'&&cnt.grouper){p*=2;a.fx.push('pair')}a.p=p});
 for(let n=0;n<(cnt.cleaner||0);n++){const top=on.filter(a=>a.c.id!=='cleaner'&&!a.cl).sort((x,y)=>y.p-x.p)[0];if(top){top.p*=2;top.cl=1}}
 /* 前线：紧挨污染的那一格里，生物净化力 ×2 */
 if(L.front<NC)on.forEach(a=>{if(a.col===L.front-1){a.p*=2;a.fr=1}});
 const eat=on.reduce((s,a)=>s+(CD[a.c.id].eat||0),0),power=on.reduce((s,a)=>s+a.p,0)*(S.x2?2:1),need=Math.max(0,L.P-eat);
 return {A,power,eat,need,win:L.front<NC?power>=need:null,done:L.front>=NC}}
const cgScore=S=>S.lanes.map((_,l)=>cgLane(S,l));
function cgPlay(S,i,l,c){const k=S.hand[i];if(S.over||!k)return false;const d=CD[k.id];if(S.energy<d.e)return false;
 if(d.fx){S.hand.splice(i,1);S.dis.push(k);S.energy-=d.e;S.x2=1;return true}
 if(!cgCan(S,k.id,l,c))return false;S.hand.splice(i,1);S.energy-=d.e;const x=S.lanes[l].cells[c],card={id:k.id,u:k.u,b:0};if(d.hab)x.hab=card;else x.res.push(card);return true}
function cgSwap(S,i){if(S.over||!S.hand[i]||S.energy<SWAPCOST)return false;S.energy-=SWAPCOST;S.dis.push(S.hand.splice(i,1)[0]);cgDraw(S,1);return true}
function cgEnd(S){if(S.over)return null;const cf=CFG[S.stage],sc=cgScore(S),ev={sc,moves:[]};
 S.lanes.forEach((L,l)=>{const r=sc[l];if(r.done){ev.moves.push(0);return}r.A.forEach(a=>{if(!a.off&&CD[a.c.id].grow)a.c.b+=CD[a.c.id].grow});
  if(r.win){L.front++;L.P+=cf.up;ev.moves.push(1)}else{L.front--;L.P=Math.max(1,L.P-1);ev.moves.push(-1)}L.P+=cf.g});
 if(S.lanes.some(L=>L.front<=0)){S.over='lose';return ev}
 if(S.lanes.every(L=>L.front>=NC)){S.over='win';if(S.stage<CFG.length-1)S.offer=cshuf(CPOOL.slice()).slice(0,3);return ev}
 if(S.turn>=cf.turns){S.over='lose';ev.timeout=1;return ev}cgTurn(S);return ev}
function cgPick(S,i){if(!S.offer||!S.offer[i])return false;S.cards.push(cmk(S.offer[i]));S.stage++;cgStage(S);return true}
const CG={NC,LANES,CD,CSTART,CPOOL,cgInit,cgCan,cgTargets,cgLane,cgScore,cgPlay,cgSwap,cgEnd,cgPick,cgEnergy,setCFG:c=>{CFG=c},getCFG:()=>CFG};
if(typeof module!=='undefined')module.exports=CG;
