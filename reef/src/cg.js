/* 牌局 v6：你指挥生物去打具体的污染敌人。规则层，无界面。
   · 礁石上有 4 个位置。珊瑚是地形（只能在礁石上），生物一格一个，最靠右的是“前排”。
   · 你的回合：花能量放牌 / 抽牌（1 点抽 2 张）；每个生物可以行动一次：点它，再点要打的敌人。
   · 敌人头上写着它下回合要干什么；你结束回合后它们照做。打掉敌人有掉落。
   · 珊瑚鱼在珊瑚上：净化 +2（小丑鱼）/+1，每回合回 1 血；不在珊瑚上每回合掉 1 血。 */
const NS=4,MAXFOE=3,ENERGY=3,HAND0=4,HANDMAX=7,DRAWCOST=1,DRAWN=2;
const CD={
 coral:{n:'珊瑚',e:1,terr:1,art:'coral',lg:'只能长在礁石上。再打一张在已有的珊瑚上，它会向两边长。',fact:'珊瑚幼体要附着在坚硬的礁石上才能生长，所以沙地和开阔水域里没有珊瑚。'},
 clown:{n:'小丑鱼',e:1,a:2,h:3,home:1,hb:2,art:'clown',lg:'珊瑚鱼。在珊瑚上净化 +2、每回合回 1 血；离开珊瑚每回合掉 1 血。',fact:'小丑鱼离不开礁上的海葵和珊瑚：那里是它的家，也是它躲避天敌的地方。'},
 urchin:{n:'海胆',e:1,a:1,h:6,thorn:1,art:'urchin',lg:'血厚，适合顶在前排。谁打它，谁被刺扎掉 1 血。',fact:'海胆夜里出来啃藻。海胆大量死亡的礁区，藻类很快就会盖过珊瑚。'},
 chromis:{n:'光鳃鱼',e:1,a:1,h:2,home:1,hb:1,school:1,art:'chromis',lg:'珊瑚鱼。场上每多一条光鳃鱼，净化 +1。',fact:'光鳃鱼成群悬在鹿角珊瑚上方，一有危险就整群缩回枝杈里。'},
 cleaner:{n:'裂唇鱼',e:2,a:1,h:2,home:1,hb:0,clean:1,art:'cleaner',lg:'珊瑚鱼。它不打敌人：点它再点一个同伴，给同伴回 2 血、解开渔网，并让同伴这回合再行动一次。',fact:'裂唇鱼在固定的“清洁站”替别的鱼吃掉寄生虫，大鱼会排队等它。'},
 parrot:{n:'鹦嘴鱼',e:2,a:2,h:4,home:1,hb:1,algae:1,art:'parrot',lg:'珊瑚鱼。打藻团时伤害 ×2；啃掉一个藻团多得 1 点能量。',fact:'鹦嘴鱼刮食礁石上的藻类，磨碎的石灰质排出来就是白沙。'},
 butterfly:{n:'蝴蝶鱼',e:2,a:3,h:3,home:1,hb:1,art:'butterfly',lg:'珊瑚鱼。净化高。',fact:'很多蝴蝶鱼以珊瑚虫为食，珊瑚死了，它们也跟着消失。'},
 turtle:{n:'绿海龟',e:3,a:2,h:9,art:'turtle',lg:'血最厚的盾，不挑地方。',fact:'绿海龟到水面换气，到礁石上休息，到海草床吃草，三处都能见到它。'},
 plankton:{n:'浮游生物',e:0,fx:'plankton',art:'',lg:'这回合多 2 点能量。',fact:'浮游生物是整片海的口粮。光鳃鱼、花园鳗、沙丁鱼，甚至鲸鲨，都靠滤食它们为生。'},
 zoox:{n:'虫黄藻',e:1,fx:'zoox',art:'',lg:'选一格珊瑚，让它变茂盛：上面的珊瑚鱼净化再 +1，每回合回 2 血。',fact:'珊瑚体内住着虫黄藻，它们晒太阳制造养分，珊瑚九成的能量来自它们。'},
 cleanup:{n:'净滩',e:1,fx:'cleanup',art:'',lg:'选一个敌人，直接清掉它 3 点血。',fact:'人把垃圾和渔网清走，礁才有机会自己恢复。'}};
/* 敌人：plan 是它轮流要做的事 */
const FOE={
 algae:{n:'藻团',h:7,plan:[['atk',2]],lg:'每回合打你的前排 2 点。前面没人就打礁心；打穿了，多出来的伤害也落在礁心上。'},
 net:{n:'幽灵渔网',h:7,plan:[['net'],['atk',2]],lg:'缠住你净化最高的生物，让它下回合动不了。'},
 cots:{n:'长棘海星',h:13,plan:[['eat'],['atk',3]],lg:'专吃珊瑚：一口吃掉最靠前的一格珊瑚。'}};
let LV=[
 {n:'藻团来了',heart:12,deck:{coral:4,clown:5,urchin:3},waves:[[1,'algae'],[3,'algae'],[5,'algae'],[7,'algae']],fresh:['coral','clown','urchin'],foes:['algae']},
 {n:'幽灵渔网',heart:12,deck:{coral:4,clown:4,urchin:3,chromis:4,plankton:2},waves:[[1,'algae'],[3,'net'],[4,'algae'],[6,'algae'],[7,'net'],[9,'algae'],[10,'algae']],fresh:['chromis','plankton'],foes:['net']},
 {n:'长棘海星',heart:12,deck:{coral:5,clown:4,urchin:3,chromis:4,plankton:2,cleaner:2},waves:[[1,'algae'],[3,'cots'],[4,'net'],[6,'algae'],[7,'algae'],[9,'cots'],[10,'net'],[11,'algae']],fresh:['cleaner'],foes:['cots']}];
const POOL=['parrot','butterfly','turtle','zoox','cleanup','plankton','cleaner','urchin','clown'];
const cshuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
let CUID=0;const mkc=id=>({id,u:++CUID});
function cgInit(lv,extra){const S={lv:lv||0,extra:extra||[]};cgStage(S);return S}
function cgStage(S){const L=LV[S.lv];S.turn=1;S.over=null;S.heart=L.heart;S.energy=ENERGY;S.cells=Array.from({length:NS},()=>({coral:false,lush:false,c:null}));S.foes=[];S.queue=L.waves.map(w=>({t:w[0],id:w[1]}));S.drops=[];
 const d=[];for(const k in L.deck)for(let i=0;i<L.deck[k];i++)d.push(mkc(k));S.extra.forEach(k=>d.push(mkc(k)));S.deck=cshuf(d);S.hand=[];S.dis=[];
 ['coral','clown','urchin'].forEach(id=>{const i=S.deck.findIndex(k=>k.id===id);if(i>=0)S.hand.push(S.deck.splice(i,1)[0])});cgDraw(S,HAND0-S.hand.length);cgSpawn(S)}
function cgDraw(S,n){for(let i=0;i<n;i++){if(S.hand.length>=HANDMAX)return;if(!S.deck.length){if(!S.dis.length)return;S.deck=cshuf(S.dis);S.dis=[]}S.hand.push(S.deck.pop())}}
function cgSpawn(S){const out=[];while(S.foes.length<MAXFOE&&S.queue.length&&S.queue[0].t<=S.turn){const q=S.queue.shift(),f={id:q.id,u:++CUID,hp:FOE[q.id].h,step:0};S.foes.push(f);out.push(f.u)}return out}
const intent=f=>FOE[f.id].plan[f.step%FOE[f.id].plan.length];
const frontCell=S=>{for(let c=NS-1;c>=0;c--)if(S.cells[c].c)return c;return -1};
function atkOf(S,c){const x=S.cells[c],k=x.c;if(!k)return 0;const d=CD[k.id];return d.a+(d.home&&x.coral?d.hb+(x.lush?1:0):0)+(d.school?S.cells.filter(y=>y.c&&y.c.id===k.id).length-1:0)}
/* 手牌能打到哪：{cell} 或 {foe} 或 {any:1} */
function cgTargets(S,id){const d=CD[id],o=[];if(d.fx==='plankton')return [{any:1}];if(d.fx==='cleanup')return S.foes.map((f,i)=>({foe:i}));
 for(let c=0;c<NS;c++){const x=S.cells[c];if(d.terr){if(!x.coral||[c-1,c+1].some(q=>S.cells[q]&&!S.cells[q].coral))o.push({cell:c})}else if(d.fx==='zoox'){if(x.coral&&!x.lush)o.push({cell:c})}else if(!x.c)o.push({cell:c})}return o}
function cgPlay(S,i,t){const k=S.hand[i];if(S.over||!k)return false;const d=CD[k.id];if(S.energy<d.e)return false;const T=cgTargets(S,k.id);
 if(d.fx==='plankton'){S.energy+=2}
 else if(d.fx==='cleanup'){if(!t||t.foe==null||!S.foes[t.foe])return false;hitFoe(S,t.foe,3,null)}
 else{if(!t||t.cell==null||!T.some(q=>q.cell===t.cell))return false;const x=S.cells[t.cell];
  if(d.terr){if(!x.coral)x.coral=true;else[t.cell-1,t.cell+1].forEach(q=>{if(S.cells[q])S.cells[q].coral=true})}else if(d.fx==='zoox')x.lush=true;else x.c={id:k.id,u:k.u,hp:d.h,ready:true,net:false}}
 S.energy-=d.e;S.hand.splice(i,1);if(d.terr||d.fx)S.dis.push(k);cgCheck(S);return true}
function cgDrawAct(S){if(S.over||S.energy<DRAWCOST||S.hand.length>=HANDMAX||(!S.deck.length&&!S.dis.length))return false;S.energy-=DRAWCOST;cgDraw(S,DRAWN);return true}
function hitFoe(S,fi,dmg,byCell){const f=S.foes[fi];f.hp-=dmg;if(f.hp<=0){S.foes.splice(fi,1);const k=byCell!=null&&S.cells[byCell].c;const drop=Math.random()<.5?'energy':'card';if(drop==='energy')S.energy++;else cgDraw(S,1);S.drops.push({u:f.u,drop});if(k&&CD[k.id].algae&&f.id==='algae'){S.energy++;S.drops.push({u:f.u,drop:'energy'})}return true}return false}
/* 生物行动：打敌人，或（裂唇鱼）清洁同伴 */
function cgCanAct(S,c){const k=S.cells[c]&&S.cells[c].c;return !!k&&k.ready&&!k.net&&!S.over}
function cgAttack(S,c,fi){if(!cgCanAct(S,c)||!S.foes[fi])return null;const k=S.cells[c].c,d=CD[k.id];if(d.clean)return null;let dmg=atkOf(S,c);if(d.algae&&S.foes[fi].id==='algae')dmg*=2;k.ready=false;const dead=hitFoe(S,fi,dmg,c);cgCheck(S);return {dmg,dead}}
function cgClean(S,c,c2){if(!cgCanAct(S,c)||c===c2)return false;const k=S.cells[c].c,o=S.cells[c2]&&S.cells[c2].c;if(!CD[k.id].clean||!o)return false;k.ready=false;o.hp=Math.min(CD[o.id].h,o.hp+2);o.net=false;o.ready=true;return true}
function cgCheck(S){if(!S.over&&!S.foes.length&&!S.queue.length)S.over='win'}
function cgEnd(S){if(S.over)return null;const ev=[];
 for(const f of S.foes.slice()){const it=intent(f);f.step++;
  if(it[0]==='atk'){const c=frontCell(S);if(c<0){S.heart-=it[1];ev.push({t:'heart',u:f.u,dmg:it[1]})}else{const k=S.cells[c].c,over=Math.max(0,it[1]-k.hp);k.hp-=it[1];const e={t:'atk',u:f.u,cell:c,dmg:it[1],dead:k.hp<=0,over};if(over)S.heart-=over;if(CD[k.id].thorn){f.hp-=CD[k.id].thorn;e.thorn=CD[k.id].thorn;if(f.hp<=0){S.foes.splice(S.foes.indexOf(f),1);e.fdead=1}}if(k.hp<=0){S.dis.push({id:k.id,u:k.u});S.cells[c].c=null}ev.push(e)}}
  else if(it[0]==='net'){let b=-1,bv=-1;for(let c=0;c<NS;c++)if(S.cells[c].c&&!S.cells[c].c.net){const v=atkOf(S,c);if(v>bv){bv=v;b=c}}if(b>=0){S.cells[b].c.net=true;S.cells[b].c.netNew=true;ev.push({t:'net',u:f.u,cell:b})}else ev.push({t:'idle',u:f.u})}
  else if(it[0]==='eat'){let b=-1;for(let c=NS-1;c>=0;c--)if(S.cells[c].coral){b=c;break}if(b>=0){S.cells[b].coral=false;S.cells[b].lush=false;ev.push({t:'eat',u:f.u,cell:b})}else{const c=frontCell(S);if(c<0){S.heart-=1;ev.push({t:'heart',u:f.u,dmg:1})}else ev.push({t:'idle',u:f.u})}}
  if(S.heart<=0){S.heart=0;S.over='lose';return ev}}
 /* 回合末：珊瑚鱼回血 / 掉血，解开上回合的网，全员恢复行动 */
 for(let c=0;c<NS;c++){const x=S.cells[c],k=x.c;if(!k)continue;const d=CD[k.id];if(d.home){if(x.coral){if(k.hp<d.h){k.hp=Math.min(d.h,k.hp+(x.lush?2:1));ev.push({t:'heal',cell:c})}}else{k.hp--;const e={t:'dry',cell:c,dead:k.hp<=0};if(k.hp<=0){S.dis.push({id:k.id,u:k.u});x.c=null}ev.push(e)}}
  if(x.c){if(k.netNew)k.netNew=false;else k.net=false;k.ready=true}}
 S.turn++;S.energy=ENERGY;const sp=cgSpawn(S);if(sp.length)ev.push({t:'spawn',us:sp});cgCheck(S);return ev}
const CG={NS,CD,FOE,POOL,cgInit,cgStage,cgTargets,cgPlay,cgDrawAct,cgAttack,cgClean,cgCanAct,cgEnd,atkOf,intent,frontCell,getLV:()=>LV};
if(typeof module!=='undefined')module.exports=CG;
