/* 牌局 v8：三条道，污染源往礁心推进；一格可以住好几条鱼，结算时从左到右一条条把净化叠起来，最后一击打出去。规则层，无界面。
   · 生物只能放在它真正生活的地方；珊瑚只能长在礁石上，可以叠到 3 级。
   · 一格住满了还往里放：换掉你指的那条（没指就换最残的），它回弃牌堆。
   · 每回合可以免费挪一次：把场上一条鱼拖到另一格，满了就对换。
   · 空格住 1 条；1 级珊瑚住 2 条；2 级住 3 条；3 级住 3 条，并且左右两格也算“在珊瑚里”、能住 2 条。
   · 你的回合：花能量放牌 / 抽牌（1 点抽 2 张）。有些牌放下时立刻有效果。
   · 结束回合：有污染源、也有生物的道就结算——从左到右每条鱼把自己的净化加进去（有的会翻倍、有的让左边的鱼再算一次），总数一击打在污染源上。
   · 污染源每回合往前推一格，盖到珊瑚珊瑚就死；有生物挡着就打那一格里的每一个，打空了就顺势压上来；推到头撞礁心。 */
const RNG=99,NL=3,NC=5,NS=NL*NC,ENERGY=3,HAND0=4,HANDMAX=7,DRAWCOST=1,DRAWN=2,CAPS=[1,2,3,3];
const ZN=['开阔水域','礁石','沙地'];
/* a 净化 h 血；home 珊瑚鱼（在珊瑚里 +hb、每回合回 1 血，不在珊瑚里每回合掉 1 血）；school 左边每有一条同类 +1；
   play 放下时的效果；pair 成对翻倍；algae 对藻团翻倍；clean 让左边的鱼再算一次；push 撞退；thorn 反刺 */
const CD={
 anem:{n:'海葵',e:1,terr:'anem',z:[1],art:'anemone',lg:'只能长在礁石上，是小丑鱼的家。种下就一直在，被污染毁掉后这张牌会回到弃牌堆。同一格可以叠到 3 级：1 级住 2 条，2 级住 3 条；3 级时左右两格也算家、能住 2 条。',fact:'海葵用带刺细胞的触手捕食，小丑鱼身上有一层黏液不怕它，一家子就住在同一丛海葵里。'},
 coral:{n:'珊瑚',e:1,terr:'coral',z:[1],art:'coral',lg:'只能长在礁石上，是光鳃鱼、蝴蝶鱼这些珊瑚鱼的家。同一格可以叠到 3 级，规则和海葵一样。',fact:'珊瑚幼体要附着在坚硬的礁石上才能生长，所以沙地和开阔水域里没有珊瑚。珊瑚丛越大，能藏身的鱼越多。'},
 clown:{n:'小丑鱼',e:1,a:2,h:3,home:'anem',hb:2,z:[1],art:'clown',lg:'住在礁石上。待在海葵里净化 +2、每回合回 1 血；不在海葵里每回合掉 1 血。',fact:'小丑鱼一生都守着自己的海葵：海葵的毒触手替它挡天敌，它替海葵赶走啃触手的鱼。'},
 urchin:{n:'海胆',e:1,a:1,h:6,thorn:1,play:'graze',z:[1],art:'urchin',lg:'住在礁石上，血厚。放下时：啃藻，立刻清掉这条道污染源 2 点。污染源打它会被刺扎掉 1 血。',fact:'海胆夜里出来啃藻。海胆大量死亡的礁区，藻类很快就会盖过珊瑚。'},
 chromis:{n:'光鳃鱼',e:1,a:1,h:2,home:'coral',hb:1,school:1,z:[1],art:'chromis',lg:'住在礁石的珊瑚里。结算时，它左边每有一条光鳃鱼，净化 +1。',fact:'光鳃鱼成群悬在鹿角珊瑚上方，一有危险就整群缩回枝杈里。'},
 cleaner:{n:'裂唇鱼',e:2,a:0,h:3,clean:1,z:[1],art:'cleaner',lg:'住在礁石上。结算时：给它左边那条鱼回 2 血、解开渔网，并让它再算一次。',fact:'裂唇鱼在固定的“清洁站”替别的鱼吃掉寄生虫，大鱼会排队等它。'},
 parrot:{n:'鹦嘴鱼',e:2,a:2,h:5,algae:1,z:[1],art:'parrot',lg:'住在礁石上。结算时，如果污染源是藻团：把它左边已经叠起来的净化 ×2。所以要放在别的鱼右边。',fact:'鹦嘴鱼刮食礁石上的藻类，磨碎的石灰质排出来就是白沙。'},
 butterfly:{n:'蝴蝶鱼',e:2,a:2,h:3,home:'coral',hb:1,pair:1,z:[1],art:'butterfly',lg:'住在礁石的珊瑚里。结算时，如果它左边已经有一条蝴蝶鱼：把已经叠起来的净化 ×2。',fact:'很多蝴蝶鱼终生成对活动，一起巡视同一片珊瑚。珊瑚死了，它们也跟着消失。'},
 eel:{n:'花园鳗',e:1,a:1,h:3,gen:'e',z:[2],art:'gardeneel',lg:'只住在沙地。结算时：滤食浮游生物，下回合多 1 点能量。',fact:'花园鳗成群把尾巴插在沙里，迎着水流吃漂来的浮游生物，一受惊就整片缩回洞里。'},
 cucumber:{n:'海参',e:1,a:1,h:7,play:'heart',z:[2],art:'cucumber',lg:'只住在沙地，血厚。放下时：把沙滤干净，礁心 +1。',fact:'海参一边爬一边吞沙，把沙里的有机碎屑消化掉，排出来的沙更干净。'},
 fusilier:{n:'乌尾鮗',e:1,a:1,h:3,school:1,gen:'c',z:[0],art:'fusilier',lg:'只在开阔水域。结算时，它左边每有一条乌尾鮗，净化 +1；每凑齐 2 条，抽 1 张牌。',fact:'乌尾鮗成大群在礁外的水层里巡游，白天吃浮游生物，晚上才回礁石缝里睡觉。'},
 jack:{n:'鲹',e:2,a:3,h:4,play:'draw',z:[0],art:'jack',lg:'只在开阔水域，净化高。放下时：抽 1 张牌。',fact:'鲹是开阔水域里的快速猎手，常成群围着礁外的鱼群打转。'},
 turtle:{n:'绿海龟',e:3,a:2,h:9,play:'push',z:[0,1,2],art:'turtle',lg:'三条道都能去，血最厚。放下时：把这条道的污染源撞退一格。',fact:'绿海龟到水面换气，到礁石上休息，到海草床吃草，三处都能见到它。'},
 seagrass:{n:'海草',e:1,terr:'seagrass',z:[2],art:'seagrass',lg:'只能长在沙地上，可以叠到 3 级，让这一格多住几条（规则和海葵一样）。住在海草里的生物每回合回 1 血。',fact:'海草是真正开花的植物，根扎在沙里连成海草床，是幼鱼的育儿所，也是绿海龟和儒艮的食堂。'},
 sargassum:{n:'马尾藻',e:1,terr:'sargassum',z:[0],art:'sargassum',lg:'只能漂在开阔水域，可以叠到 3 级，让这一格多住几条。躲在马尾藻里的鱼不会被渔网缠住。',fact:'马尾藻靠气囊漂在海面，连成一片“漂浮的森林”，幼鱼和小海龟都躲在里面。'},
 manta:{n:'蝠鲼',e:2,a:2,h:5,play:'draw2',z:[0],art:'manta',lg:'只在开阔水域。放下时：抽 2 张牌。',fact:'蝠鲼张着大嘴滤食浮游生物，食物多的时候会一圈圈翻着筋斗吃。'},
 upwelling:{n:'上升流',e:0,fx:'upwelling',any:1,art:'',lg:'抽 2 张牌。这一关里用掉就没有了。',fact:'上升流把深处又冷又有营养的海水带到表层，浮游生物暴增，整条食物链都跟着热闹起来。'},
 plankton:{n:'浮游生物',e:0,fx:'plankton',any:1,art:'',lg:'这回合多 2 点能量。这一关里用掉就没有了。',fact:'浮游生物是整片海的口粮。光鳃鱼、花园鳗、乌尾鮗，甚至鲸鲨，都靠滤食它们为生。'},
 zoox:{n:'虫黄藻',e:1,fx:'zoox',art:'',lg:'选一格海葵或珊瑚，让它变茂盛：这一格里的每条鱼净化 +1，每回合回 2 血。',fact:'珊瑚和海葵体内都住着虫黄藻，它们晒太阳制造养分，珊瑚九成的能量来自它们。'},
 cleanup:{n:'净滩',e:1,fx:'cleanup',art:'',lg:'选一个污染源，直接清掉它 4 点。',fact:'人把垃圾和渔网清走，礁才有机会自己恢复。'}};
/* 污染源。plan 轮流：adv=往前推（有生物挡着就打它，到头就打礁心）；net=缠住本道最强的生物；eat=把本道最靠前的珊瑚啃掉一级 */
const FOE={
 algae:{n:'藻团',h:8,atk:2,plan:['adv'],lg:'每回合往前推一格，盖住的海葵和珊瑚会死。有生物挡着就打那一格里的每一个，打空了就顺势压上来；推到头就撞上礁心，礁心掉血，它也散掉。'},
 net:{n:'幽灵渔网',h:8,atk:2,plan:['net','adv'],lg:'一回合缠住这条道上最强的生物（它下回合动不了），一回合往前推。'},
 cots:{n:'长棘海星',h:12,atk:3,plan:['eat','adv'],lg:'只在礁石上。一回合把最靠前的珊瑚啃掉一级，一回合往前推。'}};
/* waves：[第几回合出现, 哪种, 哪条道, 血量] */
/* waves：[第几回合出现, 哪种, 哪条道, 血量, 厚度]；厚度=每次结算的那一击先被挡掉这么多；第 6 项可以单独给攻击力；hand 开局手牌；top 牌堆顶（按抽到的先后） */
let LV=[
 {n:'浅礁',heart:10,hand:['anem','clown'],top:['clown','anem','urchin','eel','clown','cucumber','parrot','fusilier','eel','fusilier','anem','clown'],deck:{anem:4,clown:6,urchin:3,parrot:2,eel:3,cucumber:2,fusilier:4,upwelling:1},
  waves:[[1,'algae',1,4],[2,'algae',1,11],[4,'algae',2,6],[5,'algae',1,19,2],[6,'algae',0,5],[7,'algae',2,10],[8,'algae',1,32,4,3],[9,'algae',0,8],[10,'algae',2,13,1],[11,'algae',1,64,6,3],[12,'algae',0,11]],fresh:['anem','clown','urchin','eel','cucumber','parrot','fusilier','upwelling'],foes:['algae']},
 {n:'幽灵渔网',heart:12,hand:['anem','clown','urchin','eel'],deck:{anem:4,clown:5,urchin:3,parrot:2,eel:4,cucumber:2,fusilier:4,seagrass:2,sargassum:2,jack:2,upwelling:2,plankton:2,turtle:1},
  waves:[[1,'algae',1,10,2],[2,'algae',2,8],[3,'net',0,6],[4,'algae',1,14,3],[5,'algae',2,10],[6,'net',0,8],[7,'algae',1,18,5],[8,'algae',2,13,1],[9,'net',0,10,1],[10,'algae',1,23,7],[11,'algae',2,14,1],[12,'net',0,11,1]],fresh:['seagrass','sargassum','upwelling','jack','plankton','turtle'],foes:['net']},
 {n:'长棘海星',heart:12,hand:['anem','clown','urchin','eel'],deck:{anem:3,clown:4,urchin:3,parrot:1,coral:3,butterfly:3,cleaner:1,eel:3,cucumber:2,seagrass:2,fusilier:4,sargassum:2,manta:1,turtle:2,upwelling:2,plankton:2},waves:[[1,'algae',1,10,2],[2,'net',0,8],[3,'algae',2,8],[4,'cots',1,14,4],[5,'net',0,10],[6,'algae',2,10],[7,'algae',1,17,6],[8,'net',0,12,1],[9,'algae',2,12,1],[10,'cots',1,22,8],[11,'net',0,14,1],[12,'algae',2,14,1]],fresh:['coral','butterfly','cleaner','manta'],foes:['net','cots']}];
const POOL=['parrot','butterfly','turtle','zoox','cleanup','plankton','cleaner','chromis','coral','jack','urchin','clown','anem','seagrass','sargassum','upwelling','manta'];
const cshuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
let CUID=0;const mkc=id=>({id,u:++CUID});
const laneOf=c=>Math.floor(c/NC),colOf=c=>c%NC,ci=(l,col)=>l*NC+col;
const foeIn=(S,l)=>S.foes.find(f=>f.lane===l)||null;
const polluted=(S,c)=>{const f=foeIn(S,laneOf(c));return !!f&&f.p<=colOf(c)};
const nb=c=>[colOf(c)-1,colOf(c)+1].filter(q=>q>=0&&q<NC).map(q=>ci(laneOf(c),q));
/* 这格算不算这种鱼的家（kind：'anem' 海葵 / 'coral' 珊瑚）：自己这格长着它，或自己空着而隔壁是 3 级的它 */
const inHome=(S,c,kind)=>{const x=S.cells[c];return (x.coral>0?x.kind===kind:nb(c).some(q=>S.cells[q].coral>=3&&S.cells[q].kind===kind))};
const sideKind=(S,c)=>{const q=nb(c).find(q=>S.cells[q].coral>=3);return q==null?null:S.cells[q].kind};
const capOf=(S,c)=>Math.max(CAPS[S.cells[c].coral],nb(c).some(q=>S.cells[q].coral>=3)?2:1);
function cgInit(lv,extra){const S={lv:lv||0,extra:extra||[]};cgStage(S);return S}
function cgStage(S){const L=LV[S.lv];S.turn=1;S.over=null;S.heart=S.heartMax=L.heart;S.energy=ENERGY;S.bonus=0;S.auto=false;S.cells=Array.from({length:NS},()=>({coral:0,kind:null,lush:false,cs:[]}));S.total=L.waves.length;S.done=0;S.foes=[];S.queue=L.waves.map(w=>({t:w[0],id:w[1],lane:w[2],h:w[3]||FOE[w[1]].h,arm:w[4]||0,atk:w[5]||FOE[w[1]].atk}));S.drops=[];S.pfx=null;S.gift=0;S.moves=1;
 const d=[];for(const k in L.deck)for(let i=0;i<L.deck[k];i++)d.push(mkc(k));S.extra.forEach(k=>d.push(mkc(k)));S.deck=cshuf(d);S.hand=[];S.dis=[];
 const take=id=>{const i=S.deck.findIndex(k=>k.id===id);return i>=0?S.deck.splice(i,1)[0]:null};(L.hand||[]).forEach(id=>{const k=take(id);if(k)S.hand.push(k)});const top=(L.top||[]).map(take).filter(Boolean);S.deck.push(...top.reverse());cgSpawn(S)}
function cgDraw(S,n){for(let i=0;i<n;i++){if(S.hand.length>=HANDMAX)return;if(!S.deck.length){if(!S.dis.length)return;S.deck=cshuf(S.dis);S.dis=[]}S.hand.push(S.deck.pop())}}
function cgSpawn(S){const out=[];for(let i=0;i<S.queue.length;i++){const q=S.queue[i];if(q.t>S.turn)continue;const o=foeIn(S,q.lane);if(o){o.hp+=q.h;o.max=Math.max(o.max,o.hp);o.atk=Math.max(o.atk,q.atk)+1;o.n++;o.arm=Math.max(o.arm,q.arm);out.push({u:o.u,grow:q.h})}else{const f={id:q.id,u:++CUID,hp:q.h,max:q.h,atk:q.atk,arm:q.arm,n:1,step:0,lane:q.lane,p:NC};S.foes.push(f);out.push({u:f.u})}S.queue.splice(i,1);i--}return out}
const nextIn=(S,l)=>{const q=S.queue.find(q=>q.lane===l);return q?{id:q.id,n:Math.max(1,q.t-S.turn),h:q.h,arm:q.arm}:null};
const frontCell=(S,l)=>{for(let col=NC-1;col>=0;col--)if(S.cells[ci(l,col)].cs.length)return ci(l,col);return -1};
const inReach=(S,l)=>{const f=foeIn(S,l),fc=frontCell(S,l);return !!f&&fc>=0&&f.p-colOf(fc)<=RNG};
/* 每条鱼现在值多少净化（给界面显示用） */
function valOf(S,c,k){const d=CD[k.id],x=S.cells[c];if(d.clean)return 0;let n=0;if(d.school){const l=laneOf(c);outer:for(let col=0;col<NC;col++)for(const o of S.cells[ci(l,col)].cs){if(o===k)break outer;if(o.id===k.id)n++}}return d.a+(d.home&&inHome(S,c,d.home)?d.hb:0)+(x.lush?1:0)+n}
/* 污染源这回合实际要做什么：['move'] ['atk',n,cell] ['heart',n] ['net',cell,u] ['eat',cell] */
function intent(S,f){const F=FOE[f.id],k=F.plan[f.step%F.plan.length],l=f.lane;
 if(k==='net'){let b=null,bv=-1,bc=-1;for(let col=0;col<NC;col++){const c=ci(l,col);for(const o of S.cells[c].cs)if(!o.net&&S.cells[c].kind!=='sargassum'){const v=valOf(S,c,o);if(v>bv){bv=v;b=o;bc=c}}}if(b)return ['net',bc,b.u]}
 if(k==='eat'){for(let col=Math.min(NC,f.p)-1;col>=0;col--)if(S.cells[ci(l,col)].coral>0&&S.cells[ci(l,col)].kind==='coral')return ['eat',ci(l,col)]}
 if(f.p===0)return ['heart',f.atk+2];const c=ci(l,f.p-1);return S.cells[c].cs.length?['atk',f.atk,c]:['move']}
/* 一条道的结算（不改局面）：从左到右，每条鱼一步。返回 {steps:[{u,cell,op:'+'|'x'|'net'|'re',v,tot}],tot} */
function calcLane(S,l){const f=foeIn(S,l),steps=[],seen={};let tot=0,last=null;
 const add=(k,c,re)=>{const d=CD[k.id],x=S.cells[c],had=seen[k.id]||0,v=d.a+(d.home&&inHome(S,c,d.home)?d.hb:0)+(x.lush?1:0)+(d.school?had:0);seen[k.id]=had+1;if(v){tot+=v;steps.push({u:k.u,cell:c,op:'+',v,tot,re})}if(d.gen==='e')steps.push({u:k.u,cell:c,op:'e',v:1,tot,re});if(d.gen==='c'&&(had+1)%2===0)steps.push({u:k.u,cell:c,op:'c',v:1,tot,re});
  if(d.pair&&had>=1){tot*=2;steps.push({u:k.u,cell:c,op:'x',v:2,tot,re})}if(d.algae&&f&&f.id==='algae'){tot*=2;steps.push({u:k.u,cell:c,op:'x',v:2,tot,re})}};
 for(let col=0;col<NC;col++){const c=ci(l,col);for(const k of S.cells[c].cs){const d=CD[k.id];
   if(d.clean){if(k.net){steps.push({u:k.u,cell:c,op:'net',tot});continue}if(last){steps.push({u:k.u,cell:c,op:'re',tu:last.k.u,tcell:last.c,tot});add(last.k,last.c,1)}continue}
   last={k,c};if(k.net){steps.push({u:k.u,cell:c,op:'net',tot});continue}add(k,c,0)}}
 return {steps,tot}}
/* 手牌能打到哪：{cell} 或 {foe} 或 {any:1} */
function cgTargets(S,id){const d=CD[id],o=[];if(d.any)return [{any:1}];if(d.fx==='cleanup')return S.foes.map((f,i)=>({foe:i}));
 for(let c=0;c<NS;c++){const x=S.cells[c],l=laneOf(c);if(polluted(S,c))continue;
  if(d.terr){if(d.z.includes(l)&&(x.coral===0||(x.kind===d.terr&&x.coral<3)))o.push({cell:c})}
  else if(d.fx==='zoox'){if(x.coral>0&&!x.lush)o.push({cell:c})}
  else if(d.z.includes(l))o.push(x.cs.length<capOf(S,c)?{cell:c}:{cell:c,swap:1})}return o}
const weakest=x=>x.cs.slice().sort((a,b)=>a.hp/CD[a.id].h-b.hp/CD[b.id].h||a.hp-b.hp)[0];
const findCr=(S,u)=>{for(let c=0;c<NS;c++){const k=S.cells[c].cs.find(o=>o.u===u);if(k)return {c,k}}return null};
/* 挪位：每回合 1 次，不花能量。把场上一条鱼拖到它能住的另一格；那格满了就和你指的那条（或最残的那条）对换 */
function cgMoveTargets(S,u){const r=findCr(S,u);if(!r||S.over||S.moves<=0||r.k.net)return [];const d=CD[r.k.id],o=[];for(let c=0;c<NS;c++){if(c===r.c||polluted(S,c)||!d.z.includes(laneOf(c)))continue;const x=S.cells[c];if(x.cs.length<capOf(S,c))o.push({cell:c});else if(x.cs.some(v=>CD[v.id].z.includes(laneOf(r.c))))o.push({cell:c,swap:1})}return o}
function cgMove(S,u,cell,ru){const r=findCr(S,u),T=cgMoveTargets(S,u).find(t=>t.cell===cell);if(!r||!T)return false;const a=S.cells[r.c],b=S.cells[cell];a.cs.splice(a.cs.indexOf(r.k),1);if(T.swap){const ok=b.cs.filter(v=>CD[v.id].z.includes(laneOf(r.c))),v=ok.find(v=>v.u===ru)||weakest({cs:ok});b.cs.splice(b.cs.indexOf(v),1);a.cs.push(v)}b.cs.push(r.k);S.moves--;return true}
function cgPlay(S,i,t){const k=S.hand[i];if(S.over||!k)return false;const d=CD[k.id];if(S.energy<d.e)return false;const T=cgTargets(S,k.id);S.pfx=null;
 if(d.fx==='plankton'){S.energy+=2}
 else if(d.fx==='upwelling'){S.energy-=d.e;S.hand.splice(i,1);cgDraw(S,2);S.pfx={t:'draw',n:2};return true}
 else if(d.fx==='cleanup'){if(!t||t.foe==null||!S.foes[t.foe])return false;hitFoe(S,t.foe,4)}
 else{if(!t||t.cell==null||!T.some(q=>q.cell===t.cell))return false;const x=S.cells[t.cell],l=laneOf(t.cell);
  if(d.terr){x.coral++;x.kind=d.terr}else if(d.fx==='zoox')x.lush=true;
  else{S.swapped=null;if(x.cs.length>=capOf(S,t.cell)){const o=x.cs.find(o=>o.u===t.ru)||weakest(x);x.cs.splice(x.cs.indexOf(o),1);S.dis.push({id:o.id,u:o.u});S.swapped=o.id}x.cs.push({id:k.id,u:k.u,hp:d.h,net:false});const fi=S.foes.findIndex(f=>f.lane===l),f=S.foes[fi];
   if(d.play==='graze'&&f){S.pfx={t:'hit',u:f.u,dmg:2};hitFoe(S,fi,2)}
   else if(d.play==='push'&&f&&f.p<NC){f.p++;S.pfx={t:'push',u:f.u}}
   else if(d.play==='heart'&&S.heart<S.heartMax){S.heart++;S.pfx={t:'heart'}}
   else if(d.play==='draw'||d.play==='draw2'){const n=d.play==='draw2'?2:1;S.energy-=d.e;S.hand.splice(i,1);cgDraw(S,n);S.pfx={t:'draw',n};cgCheck(S);return true}}}
 S.energy-=d.e;S.hand.splice(i,1);if(d.fx&&d.fx!=='plankton')S.dis.push(k);cgCheck(S);return true}
/* 抽牌：1 点能量抽 2 张；手牌放不下时，最旧的牌先回弃牌堆 */
function cgDrawAct(S){if(S.over||S.energy<DRAWCOST||(!S.deck.length&&!S.dis.length&&S.hand.length<=HANDMAX-DRAWN))return false;S.energy-=DRAWCOST;let out=0;while(S.hand.length>HANDMAX-DRAWN){S.dis.push(S.hand.shift());out++}cgDraw(S,DRAWN);return {out}}
const gainE=S=>{if(S.auto)S.bonus=(S.bonus||0)+1;else S.energy++};
const gone=(S,f)=>{S.foes.splice(S.foes.indexOf(f),1);S.done+=f.n};
function hitFoe(S,fi,dmg){const f=S.foes[fi];f.hp-=dmg;if(f.hp<=0){gone(S,f);const first=S.done===f.n&&!S.gift;if(first){S.gift=1;cgDraw(S,2);S.drops.push({u:f.u,drop:'card'},{u:f.u,drop:'card'});return true}const drop=Math.random()<.5?'energy':'card';if(drop==='energy')gainE(S);else cgDraw(S,1);S.drops.push({u:f.u,drop});return true}return false}
/* 结束回合第一步：有生物的道逐条结算。产出（能量、抽牌）每回合都有；有污染源时把净化总数一击打出去，先被厚度挡掉一部分。
   返回 [{lane,u,steps,tot,arm,dmg,dead,push,p}]，没有污染源时 u 为 null */
function cgSettle(S){if(S.over)return [];S.auto=true;const out=[];
 for(let l=0;l<NL;l++){if(frontCell(S,l)<0)continue;const f=foeIn(S,l),r=calcLane(S,l);
  for(const st of r.steps){if(st.op==='e')S.bonus=(S.bonus||0)+st.v;else if(st.op==='c')cgDraw(S,st.v);else if(st.op==='re'){const k=S.cells[st.tcell].cs.find(o=>o.u===st.tu);if(k){k.hp=Math.min(CD[k.id].h,k.hp+2);k.net=false;k.netNew=false}}}
  if(!f){if(r.steps.some(st=>st.op==='e'||st.op==='c'||st.op==='re'))out.push({lane:l,u:null,steps:r.steps.filter(st=>st.op!=='+'&&st.op!=='x'&&st.op!=='net')});continue}
  if(!r.steps.length)continue;const dmg=Math.max(0,r.tot-f.arm),dead=dmg>0?hitFoe(S,S.foes.indexOf(f),dmg):false;let push=0;if(!dead)for(let col=0;col<NC;col++)for(const k of S.cells[ci(l,col)].cs)if(CD[k.id].push&&!k.net&&f.p<NC){f.p++;push++}
  out.push({lane:l,u:f.u,steps:r.steps,tot:r.tot,arm:f.arm,dmg,dead,push,p:f.p})}
 cgCheck(S);return out}
function cgCheck(S){if(!S.over&&!S.foes.length&&!S.queue.length)S.over='win'}
/* 珊瑚变小后住不下的鱼游走（回弃牌堆） */
function fixCap(S,ev){for(let c=0;c<NS;c++){const x=S.cells[c];while(x.cs.length>capOf(S,c)){const k=x.cs.pop();S.dis.push({id:k.id,u:k.u});ev.push({t:'leave',cell:c,ku:k.u})}}}
/* 被污染毁掉的海葵 / 珊瑚，牌回到弃牌堆，之后还能再抽到 */
const back=(S,x,n)=>{for(let i=0;i<n&&x.kind;i++)S.dis.push(mkc(x.kind))};
function cgEnd(S){if(S.over)return null;const ev=[],kill=(c,k)=>{const x=S.cells[c];x.cs.splice(x.cs.indexOf(k),1);S.dis.push({id:k.id,u:k.u})};
 for(const f of S.foes.slice().sort((a,b)=>a.lane-b.lane)){const it=intent(S,f);f.step++;
  if(it[0]==='heart'){S.heart-=it[1];gone(S,f);ev.push({t:'heart',u:f.u,dmg:it[1]})}
  else if(it[0]==='move'){f.p--;const c=ci(f.lane,f.p),x=S.cells[c],e={t:'move',u:f.u,lane:f.lane,p:f.p,cell:c,bleach:x.coral>0};back(S,x,x.coral);x.coral=0;x.kind=null;x.lush=false;ev.push(e);fixCap(S,ev)}
  else if(it[0]==='atk'){const c=it[2],x=S.cells[c],e={t:'atk',u:f.u,cell:c,dmg:it[1],hits:[]};
   for(const k of x.cs.slice()){k.hp-=it[1];e.hits.push({ku:k.u,dead:k.hp<=0});if(CD[k.id].thorn&&!e.fdead){f.hp-=CD[k.id].thorn;e.thorn=(e.thorn||0)+CD[k.id].thorn;if(f.hp<=0){gone(S,f);e.fdead=1}}if(k.hp<=0)kill(c,k)}
   if(!e.fdead&&!x.cs.length){f.p--;e.adv=1;e.bleach=x.coral>0;back(S,x,x.coral);x.coral=0;x.kind=null;x.lush=false}ev.push(e);if(e.adv)fixCap(S,ev)}
  else if(it[0]==='net'){const k=S.cells[it[1]].cs.find(o=>o.u===it[2]);k.net=true;k.netNew=true;ev.push({t:'net',u:f.u,cell:it[1],ku:k.u})}
  else if(it[0]==='eat'){const x=S.cells[it[1]];back(S,x,1);x.coral--;if(!x.coral){x.lush=false;x.kind=null}ev.push({t:'eat',u:f.u,cell:it[1],left:x.coral});fixCap(S,ev)}
  if(S.heart<=0){S.heart=0;S.over='lose';return ev}}
 /* 回合末：珊瑚鱼回血 / 掉血，解开上回合的网 */
 for(let c=0;c<NS;c++){const x=S.cells[c];for(const k of x.cs.slice()){const d=CD[k.id];if(d.home){if(inHome(S,c,d.home)){if(k.hp<d.h){k.hp=Math.min(d.h,k.hp+(x.lush?2:1));ev.push({t:'heal',cell:c,ku:k.u})}}else{k.hp--;const e={t:'dry',cell:c,ku:k.u,dead:k.hp<=0};if(k.hp<=0)kill(c,k);ev.push(e)}}
   if(x.kind==='seagrass'&&k.hp>0&&k.hp<d.h){k.hp++;ev.push({t:'heal',cell:c,ku:k.u})}
   if(k.netNew)k.netNew=false;else k.net=false}}
 S.turn++;S.moves=1;S.energy=ENERGY+(S.bonus||0);S.bonus=0;S.auto=false;const sp=cgSpawn(S);if(sp.length)ev.push({t:'spawn',us:sp});cgCheck(S);return ev}
const CG={NL,NC,NS,CD,FOE,POOL,ZN,RNG,cgInit,cgStage,cgTargets,cgPlay,cgDrawAct,cgSettle,cgEnd,cgMove,cgMoveTargets,calcLane,valOf,capOf,inHome,sideKind,intent,frontCell,foeIn,polluted,inReach,nextIn,laneOf,colOf,ci,getLV:()=>LV};
if(typeof module!=='undefined')module.exports=CG;
