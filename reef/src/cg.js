/* 牌局 v7：三条道（开阔水域 / 礁石 / 沙地），污染源沿着道一格格往礁心推进。规则层，无界面。
   · 每条道 5 格。生物只能放在它真正生活的地方；珊瑚只能长在礁石上。
   · 你的回合：花能量放牌 / 抽牌（1 点抽 2 张）。结束回合后，污染源离一条道最前面的生物 2 格以内时，这条道的生物一起自动开打。
   · 污染源每回合往前推一格，盖住的格子不能再放牌，盖到珊瑚珊瑚就死；前面有生物挡着就打它，打死了就顺势压上来；推到头就撞上礁心（礁心掉血，它也散掉）。
   · 净化掉污染源，整条道恢复干净，并有掉落。 */
const RNG=2,NL=3,NC=5,NS=NL*NC,ENERGY=3,HAND0=4,HANDMAX=7,DRAWCOST=1,DRAWN=2;
const ZN=['开阔水域','礁石','沙地'];
const CD={
 coral:{n:'珊瑚',e:1,terr:1,z:[1],art:'coral',lg:'只能长在礁石上。再打一张在已有的珊瑚上，它会向两边长。',fact:'珊瑚幼体要附着在坚硬的礁石上才能生长，所以沙地和开阔水域里没有珊瑚。'},
 clown:{n:'小丑鱼',e:1,a:2,h:3,home:1,hb:2,z:[1],art:'clown',lg:'住在礁石上。待在珊瑚里净化 +2、每回合回 1 血；不在珊瑚里每回合掉 1 血。',fact:'小丑鱼离不开礁上的海葵和珊瑚：那里是它的家，也是它躲避天敌的地方。'},
 urchin:{n:'海胆',e:1,a:1,h:6,thorn:1,z:[1],art:'urchin',lg:'住在礁石上。血厚，适合顶在最前面；污染源打它会被刺扎掉 1 血。',fact:'海胆夜里出来啃藻。海胆大量死亡的礁区，藻类很快就会盖过珊瑚。'},
 chromis:{n:'光鳃鱼',e:1,a:1,h:2,home:1,hb:1,school:1,z:[1],art:'chromis',lg:'住在礁石的珊瑚里。同一条道上每多一条光鳃鱼，净化 +1。',fact:'光鳃鱼成群悬在鹿角珊瑚上方，一有危险就整群缩回枝杈里。'},
 cleaner:{n:'裂唇鱼',e:2,a:1,h:2,home:1,hb:0,clean:1,z:[1],art:'cleaner',lg:'住在礁石的珊瑚里。它不打污染源：每回合给一个同伴回 2 血、解开渔网，并让它再出手一次。',fact:'裂唇鱼在固定的“清洁站”替别的鱼吃掉寄生虫，大鱼会排队等它。'},
 parrot:{n:'鹦嘴鱼',e:2,a:2,h:4,home:1,hb:1,algae:1,z:[1],art:'parrot',lg:'住在礁石上。打藻团伤害 ×2；啃掉一个藻团多得 1 点能量。',fact:'鹦嘴鱼刮食礁石上的藻类，磨碎的石灰质排出来就是白沙。'},
 butterfly:{n:'蝴蝶鱼',e:2,a:3,h:3,home:1,hb:1,z:[1],art:'butterfly',lg:'住在礁石的珊瑚里。净化高。',fact:'很多蝴蝶鱼以珊瑚虫为食，珊瑚死了，它们也跟着消失。'},
 eel:{n:'花园鳗',e:1,a:1,h:3,school:1,z:[2],art:'gardeneel',lg:'只住在沙地。同一条道上每多一条花园鳗，净化 +1。',fact:'花园鳗成群把尾巴插在沙里，迎着水流吃漂来的浮游生物，一受惊就整片缩回洞里。'},
 cucumber:{n:'海参',e:1,a:1,h:7,z:[2],art:'cucumber',lg:'只住在沙地。血厚，适合顶在最前面。',fact:'海参一边爬一边吞沙，把沙里的有机碎屑消化掉，排出来的沙更干净。'},
 fusilier:{n:'乌尾鮗',e:1,a:1,h:3,school:1,z:[0],art:'fusilier',lg:'只在开阔水域。同一条道上每多一条乌尾鮗，净化 +1。',fact:'乌尾鮗成大群在礁外的水层里巡游，白天吃浮游生物，晚上才回礁石缝里睡觉。'},
 jack:{n:'鲹',e:2,a:3,h:4,z:[0],art:'jack',lg:'只在开阔水域。净化高。',fact:'鲹是开阔水域里的快速猎手，常成群围着礁外的鱼群打转。'},
 turtle:{n:'绿海龟',e:3,a:2,h:9,push:1,z:[0,1,2],art:'turtle',lg:'三条道都能去。血最厚；每次出手把污染源撞退一格。',fact:'绿海龟到水面换气，到礁石上休息，到海草床吃草，三处都能见到它。'},
 plankton:{n:'浮游生物',e:0,fx:'plankton',art:'',lg:'这回合多 2 点能量。这一关里用掉就没有了。',fact:'浮游生物是整片海的口粮。光鳃鱼、花园鳗、乌尾鮗，甚至鲸鲨，都靠滤食它们为生。'},
 zoox:{n:'虫黄藻',e:1,fx:'zoox',art:'',lg:'选一格珊瑚，让它变茂盛：里面的鱼净化再 +1，每回合回 2 血。',fact:'珊瑚体内住着虫黄藻，它们晒太阳制造养分，珊瑚九成的能量来自它们。'},
 cleanup:{n:'净滩',e:1,fx:'cleanup',art:'',lg:'选一个污染源，直接清掉它 4 点。',fact:'人把垃圾和渔网清走，礁才有机会自己恢复。'}};
/* 污染源。plan 轮流：adv=往前推（有生物挡着就打它，到头就打礁心）；net=缠住本道最强的生物；eat=吃掉本道最靠前的珊瑚 */
const FOE={
 algae:{n:'藻团',h:8,atk:2,plan:['adv'],lg:'每回合往前推一格，盖住的珊瑚会死。有生物挡着就打它，打死了就顺势压上来；推到头就撞上礁心，礁心掉血，它也散掉。'},
 net:{n:'幽灵渔网',h:8,atk:2,plan:['net','adv'],lg:'一回合缠住这条道上最强的生物（它下回合动不了），一回合往前推。'},
 cots:{n:'长棘海星',h:12,atk:3,plan:['eat','adv'],lg:'只在礁石上。一回合隔空吃掉最靠前的一格珊瑚，一回合往前推。'}};
/* waves：[第几回合出现, 哪种, 哪条道, 血量] */
let LV=[
 {n:'礁石',heart:10,deck:{coral:4,clown:5,urchin:3},waves:[[1,'algae',1,10],[3,'algae',1,16],[5,'algae',1,22],[7,'algae',1,28]],fresh:['coral','clown','urchin'],foes:['algae']},
 {n:'沙地',heart:10,deck:{coral:4,clown:4,urchin:3,eel:4,cucumber:3,plankton:2},waves:[[1,'algae',1,10],[2,'algae',2,10],[4,'algae',1,16],[5,'algae',2,16],[7,'algae',1,22],[8,'algae',2,22],[10,'algae',1,28],[11,'algae',2,28]],fresh:['eel','cucumber','plankton'],foes:[]},
 {n:'开阔水域',heart:10,deck:{coral:4,clown:4,urchin:3,eel:3,cucumber:2,fusilier:4,turtle:2,plankton:2},waves:[[1,'algae',1,10],[2,'net',0,10],[3,'algae',2,10],[4,'cots',1,16],[5,'net',0,16],[6,'algae',2,16],[7,'algae',1,22],[8,'net',0,22],[9,'algae',2,22],[10,'cots',1,28],[11,'net',0,28],[12,'algae',2,28]],fresh:['fusilier','turtle'],foes:['net','cots']}];
const POOL=['parrot','butterfly','turtle','zoox','cleanup','plankton','cleaner','chromis','jack','urchin','clown'];
const cshuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
let CUID=0;const mkc=id=>({id,u:++CUID});
const laneOf=c=>Math.floor(c/NC),colOf=c=>c%NC,ci=(l,col)=>l*NC+col;
const foeIn=(S,l)=>S.foes.find(f=>f.lane===l)||null;
const polluted=(S,c)=>{const f=foeIn(S,laneOf(c));return !!f&&f.p<=colOf(c)};
function cgInit(lv,extra){const S={lv:lv||0,extra:extra||[]};cgStage(S);return S}
function cgStage(S){const L=LV[S.lv];S.turn=1;S.over=null;S.heart=L.heart;S.energy=ENERGY;S.bonus=0;S.auto=false;S.cells=Array.from({length:NS},()=>({coral:false,lush:false,c:null}));S.foes=[];S.queue=L.waves.map(w=>({t:w[0],id:w[1],lane:w[2],h:w[3]||FOE[w[1]].h}));S.drops=[];
 const d=[];for(const k in L.deck)for(let i=0;i<L.deck[k];i++)d.push(mkc(k));S.extra.forEach(k=>d.push(mkc(k)));S.deck=cshuf(d);S.hand=[];S.dis=[];
 ['coral','clown','urchin'].forEach(id=>{const i=S.deck.findIndex(k=>k.id===id);if(i>=0)S.hand.push(S.deck.splice(i,1)[0])});cgDraw(S,HAND0-S.hand.length);cgSpawn(S)}
function cgDraw(S,n){for(let i=0;i<n;i++){if(S.hand.length>=HANDMAX)return;if(!S.deck.length){if(!S.dis.length)return;S.deck=cshuf(S.dis);S.dis=[]}S.hand.push(S.deck.pop())}}
function cgSpawn(S){const out=[];for(let i=0;i<S.queue.length;i++){const q=S.queue[i];if(q.t>S.turn)continue;const o=foeIn(S,q.lane);if(o){o.hp+=q.h;o.max=Math.max(o.max,o.hp);o.atk++;out.push({u:o.u,grow:q.h})}else{const f={id:q.id,u:++CUID,hp:q.h,max:q.h,atk:FOE[q.id].atk,step:0,lane:q.lane,p:NC};S.foes.push(f);out.push({u:f.u})}S.queue.splice(i,1);i--}return out}
/* 这条道下一个污染源还有几回合到（没有则 null） */
const nextIn=(S,l)=>{const q=S.queue.find(q=>q.lane===l);return q?{id:q.id,n:Math.max(1,q.t-S.turn),h:q.h}:null};
const frontCell=(S,l)=>{for(let col=NC-1;col>=0;col--)if(S.cells[ci(l,col)].c)return ci(l,col);return -1};
function atkOf(S,c){const x=S.cells[c],k=x.c;if(!k)return 0;const d=CD[k.id],l=laneOf(c);let n=0;if(d.school)for(let col=0;col<NC;col++){const o=S.cells[ci(l,col)].c;if(o&&o.id===k.id)n++}return d.a+(d.home&&x.coral?d.hb+(x.lush?1:0):0)+(d.school?n-1:0)}
/* 污染源这回合实际要做什么：['move'] ['atk',n,cell] ['heart',n] ['net',cell] ['eat',cell] */
function intent(S,f){const F=FOE[f.id],k=F.plan[f.step%F.plan.length],l=f.lane;
 if(k==='net'){let b=-1,bv=-1;for(let col=0;col<NC;col++){const c=ci(l,col),o=S.cells[c].c;if(o&&!o.net){const v=atkOf(S,c);if(v>bv){bv=v;b=c}}}if(b>=0)return ['net',b]}
 if(k==='eat'){for(let col=Math.min(NC,f.p)-1;col>=0;col--)if(S.cells[ci(l,col)].coral)return ['eat',ci(l,col)]}
 if(f.p===0)return ['heart',3+Math.floor(f.hp/10)];const c=ci(l,f.p-1);return S.cells[c].c?['atk',f.atk,c]:['move']}
/* 手牌能打到哪：{cell} 或 {foe} 或 {any:1} */
function cgTargets(S,id){const d=CD[id],o=[];if(d.fx==='plankton')return [{any:1}];if(d.fx==='cleanup')return S.foes.map((f,i)=>({foe:i}));
 for(let c=0;c<NS;c++){const x=S.cells[c],l=laneOf(c),col=colOf(c);if(polluted(S,c))continue;
  if(d.terr){if(l!==1)continue;if(!x.coral||[col-1,col+1].some(q=>q>=0&&q<NC&&!S.cells[ci(l,q)].coral&&!polluted(S,ci(l,q))))o.push({cell:c})}
  else if(d.fx==='zoox'){if(x.coral&&!x.lush)o.push({cell:c})}
  else if(d.z.includes(l)&&(!x.c||x.c.id!==id))o.push({cell:c})}return o}
function cgPlay(S,i,t){const k=S.hand[i];if(S.over||!k)return false;const d=CD[k.id];if(S.energy<d.e)return false;const T=cgTargets(S,k.id);
 if(d.fx==='plankton'){S.energy+=2}
 else if(d.fx==='cleanup'){if(!t||t.foe==null||!S.foes[t.foe])return false;hitFoe(S,t.foe,4,null)}
 else{if(!t||t.cell==null||!T.some(q=>q.cell===t.cell))return false;const x=S.cells[t.cell],l=laneOf(t.cell),col=colOf(t.cell);
  if(d.terr){if(!x.coral)x.coral=true;else[col-1,col+1].forEach(q=>{if(q>=0&&q<NC&&!polluted(S,ci(l,q)))S.cells[ci(l,q)].coral=true})}else if(d.fx==='zoox')x.lush=true;else{if(x.c)S.dis.push({id:x.c.id,u:x.c.u});x.c={id:k.id,u:k.u,hp:d.h,ready:true,net:false}}}
 S.energy-=d.e;S.hand.splice(i,1);if(d.terr||(d.fx&&d.fx!=='plankton'))S.dis.push(k);cgCheck(S);return true}
/* 抽牌：1 点能量抽 2 张；手牌放不下时，最旧的牌先回弃牌堆 */
function cgDrawAct(S){if(S.over||S.energy<DRAWCOST||(!S.deck.length&&!S.dis.length&&S.hand.length<=HANDMAX-DRAWN))return false;S.energy-=DRAWCOST;let out=0;while(S.hand.length>HANDMAX-DRAWN){S.dis.push(S.hand.shift());out++}cgDraw(S,DRAWN);return {out}}
const gainE=S=>{if(S.auto)S.bonus=(S.bonus||0)+1;else S.energy++};
function hitFoe(S,fi,dmg,byCell){const f=S.foes[fi];f.hp-=dmg;if(f.hp<=0){S.foes.splice(fi,1);const k=byCell!=null&&S.cells[byCell].c;const drop=Math.random()<.5?'energy':'card';if(drop==='energy')gainE(S);else cgDraw(S,1);S.drops.push({u:f.u,drop});if(k&&CD[k.id].algae&&f.id==='algae'){gainE(S);S.drops.push({u:f.u,drop:'energy'})}return true}return false}
/* 够得着：污染源离这条道最前面的生物 RNG 格以内，整条道一起开打 */
const inReach=(S,c)=>{const l=laneOf(c),f=foeIn(S,l),fc=frontCell(S,l);return !!f&&fc>=0&&f.p-colOf(fc)<=RNG};
function cgCanAct(S,c){const k=S.cells[c]&&S.cells[c].c;return !!k&&k.ready&&!k.net&&!S.over}
function cgAttack(S,c,fi){const f=S.foes[fi];if(!cgCanAct(S,c)||!f||f.lane!==laneOf(c)||!inReach(S,c))return null;const k=S.cells[c].c,d=CD[k.id];if(d.clean)return null;let dmg=atkOf(S,c);if(d.algae&&f.id==='algae')dmg*=2;k.ready=false;const dead=hitFoe(S,fi,dmg,c);let push=0;if(!dead&&d.push&&f.p<NC){f.p++;push=1}cgCheck(S);return {dmg,dead,push}}
function cgClean(S,c,c2){if(!cgCanAct(S,c)||c===c2)return false;const k=S.cells[c].c,o=S.cells[c2]&&S.cells[c2].c;if(!CD[k.id].clean||!o)return false;k.ready=false;o.hp=Math.min(CD[o.id].h,o.hp+2);o.net=false;o.ready=true;return true}
/* 结束回合：没出手的生物自己出手，打自己这条道上的污染源；裂唇鱼先救被网住的，再帮最强的同伴多打一次 */
function cgAutoNext(S){if(S.over)return null;S.auto=true;
 for(let c=0;c<NS;c++){if(!cgCanAct(S,c)||CD[S.cells[c].c.id].clean)continue;const fi=S.foes.findIndex(f=>f.lane===laneOf(c));if(fi>=0&&inReach(S,c))return {atk:[c,fi]}}
 for(let c=0;c<NS;c++){if(!cgCanAct(S,c)||!CD[S.cells[c].c.id].clean)continue;let b=-1,bv=-1;for(let q=0;q<NS;q++){const o=S.cells[q].c;if(!o||q===c||CD[o.id].clean)continue;const hasF=inReach(S,q),hurt=o.hp<CD[o.id].h;if(!o.net&&!hasF&&!hurt)continue;const v=o.net?100:(hasF?atkOf(S,q):0)+(hurt?.5:0);if(v>bv){bv=v;b=q}}if(b>=0)return {clean:[c,b]}}
 return null}
function cgAutoAll(S){let a,g=0;while((a=cgAutoNext(S))&&g++<60){if(a.atk)cgAttack(S,...a.atk);else cgClean(S,...a.clean)}}
function cgCheck(S){if(!S.over&&!S.foes.length&&!S.queue.length)S.over='win'}
function cgEnd(S){if(S.over)return null;const ev=[],kill=(c)=>{const k=S.cells[c].c;S.dis.push({id:k.id,u:k.u});S.cells[c].c=null};
 for(const f of S.foes.slice().sort((a,b)=>a.lane-b.lane)){const it=intent(S,f);f.step++;
  if(it[0]==='heart'){S.heart-=it[1];S.foes.splice(S.foes.indexOf(f),1);ev.push({t:'heart',u:f.u,dmg:it[1]})}
  else if(it[0]==='move'){f.p--;const c=ci(f.lane,f.p),x=S.cells[c],e={t:'move',u:f.u,lane:f.lane,p:f.p,cell:c,bleach:x.coral};x.coral=false;x.lush=false;ev.push(e)}
  else if(it[0]==='atk'){const c=it[2],k=S.cells[c].c;k.hp-=it[1];const e={t:'atk',u:f.u,cell:c,dmg:it[1],dead:k.hp<=0};if(CD[k.id].thorn){f.hp-=CD[k.id].thorn;e.thorn=CD[k.id].thorn;if(f.hp<=0){S.foes.splice(S.foes.indexOf(f),1);e.fdead=1}}if(k.hp<=0){kill(c);if(!e.fdead){f.p--;e.adv=1;e.bleach=S.cells[c].coral;S.cells[c].coral=false;S.cells[c].lush=false}}ev.push(e)}
  else if(it[0]==='net'){const k=S.cells[it[1]].c;k.net=true;k.netNew=true;ev.push({t:'net',u:f.u,cell:it[1]})}
  else if(it[0]==='eat'){const x=S.cells[it[1]];x.coral=false;x.lush=false;ev.push({t:'eat',u:f.u,cell:it[1]})}
  if(S.heart<=0){S.heart=0;S.over='lose';return ev}}
 /* 回合末：珊瑚鱼回血 / 掉血，解开上回合的网，全员恢复行动 */
 for(let c=0;c<NS;c++){const x=S.cells[c],k=x.c;if(!k)continue;const d=CD[k.id];if(d.home){if(x.coral){if(k.hp<d.h){k.hp=Math.min(d.h,k.hp+(x.lush?2:1));ev.push({t:'heal',cell:c})}}else{k.hp--;const e={t:'dry',cell:c,dead:k.hp<=0};if(k.hp<=0)kill(c);ev.push(e)}}
  if(x.c){if(k.netNew)k.netNew=false;else k.net=false;k.ready=true}}
 S.turn++;S.energy=ENERGY+(S.bonus||0);S.bonus=0;S.auto=false;const sp=cgSpawn(S);if(sp.length)ev.push({t:'spawn',us:sp});cgCheck(S);return ev}
const CG={NL,NC,NS,CD,FOE,POOL,ZN,cgInit,cgStage,cgTargets,cgPlay,cgDrawAct,cgAttack,cgClean,cgCanAct,cgEnd,cgAutoNext,cgAutoAll,atkOf,intent,frontCell,foeIn,polluted,inReach,RNG,nextIn,laneOf,colOf,ci,getLV:()=>LV};
if(typeof module!=='undefined')module.exports=CG;
