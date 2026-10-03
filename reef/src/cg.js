/* 牌局 v5：三个数值（费用 / 净化 / 血量）+ 珊瑚。规则层，无界面。
   · 手牌开局 3 张，不会自己补；花 1 点能量抽 2 张。
   · 任何牌都能放进任何一条道里干净的空格，一格一个生物。珊瑚是地形，铺在格子上。
   · 回合结束，每条道：够得着污染的生物把净化加起来。≥ 污染值 → 污染退一格（变浓）。
     不够 → 差多少，紧挨污染的那个生物就掉多少血；它死了，或者那格没人，污染进一格。
   · 珊瑚鱼在珊瑚上：净化 +1、每回合回 1 血；不在珊瑚上：每回合掉 1 血。 */
const NC=6,HAND0=3,HANDMAX=7,DRAWCOST=1,DRAWN=2;
const LANEN=['开阔水域','礁石','沙地'],LTYPE=['top','reef','sand'];
const CD={
 coral:{n:'珊瑚',e:1,terr:1,only:['reef'],art:'coral',lg:'只能长在礁石上。再打一张在已有的珊瑚上，它会沿着礁石向两边长。',fact:'珊瑚幼体要附着在坚硬的礁石上才能生长，所以沙地和开阔水域里没有珊瑚。'},
 clown:{n:'小丑鱼',e:1,a:2,h:3,r:2,home:'coral',hb:2,art:'clown',lg:'珊瑚鱼。在珊瑚上净化 +2、每回合回 1 血；离开珊瑚每回合掉 1 血。',fact:'小丑鱼离不开礁上的海葵和珊瑚：那里是它的家，也是它躲避天敌的地方。'},
 chromis:{n:'光鳃鱼',e:1,a:1,h:2,r:2,home:'coral',hb:1,school:1,art:'chromis',lg:'珊瑚鱼。同一条道里每多一条光鳃鱼，净化 +1。',fact:'光鳃鱼成群悬在鹿角珊瑚上方，一有危险就整群缩回枝杈里。'},
 butterfly:{n:'蝴蝶鱼',e:2,a:3,h:3,r:3,home:'coral',hb:1,art:'butterfly',lg:'珊瑚鱼。够得远，隔三格也能净化。',fact:'很多蝴蝶鱼以珊瑚虫为食，珊瑚死了，它们也跟着消失。'},
 parrot:{n:'鹦嘴鱼',e:2,a:1,h:4,r:2,home:'coral',hb:1,eat:2,art:'parrot',lg:'珊瑚鱼。每回合啃掉这条道 2 点污染。',fact:'鹦嘴鱼刮食礁石上的藻类，磨碎的石灰质排出来就是白沙。'},
 cleaner:{n:'裂唇鱼',e:2,a:1,h:2,r:2,home:'coral',hb:1,heal:2,art:'cleaner',lg:'珊瑚鱼。每回合给左右两边的生物各回 2 血。',fact:'裂唇鱼在固定的“清洁站”替别的鱼吃掉寄生虫，大鱼会排队等它。'},
 urchin:{n:'海胆',e:1,a:1,h:6,r:1,only:['reef','sand'],art:'urchin',lg:'贴着海底生活，只能放在礁石或沙地。血厚，适合顶在最前面。',fact:'海胆夜里出来啃藻。海胆大量死亡的礁区，藻类很快就会盖过珊瑚。'},
 eel:{n:'花园鳗',e:1,a:2,h:2,r:2,home:'sand',hb:1,only:['sand'],school:1,art:'gardeneel',lg:'住在沙洞里，只能放在沙地。每多一条花园鳗，净化 +1。',fact:'花园鳗成片住在沙洞里，只探出半截身子，迎着水流吃浮游生物。'},
 ray:{n:'蓝斑魟',e:2,a:3,h:5,r:2,home:'sand',hb:1,only:['reef','sand'],art:'ray',lg:'贴着海底游，只能放在礁石或沙地。在沙地上净化 +1。',fact:'蓝斑魟白天常躲在礁石下，涨潮时到沙地上翻沙找贝类吃。'},
 sardine:{n:'沙丁鱼',e:1,a:1,h:2,r:3,home:'top',hb:1,school:1,art:'sardine',lg:'开阔水域的鱼：在那里净化 +1，去别处每回合掉 1 血。每多一条沙丁鱼，净化 +1。',fact:'沙丁鱼成千上万挤成“饵球”，是鲹鱼、鲨鱼这些掠食者的主要食物。'},
 jack:{n:'鲹鱼',e:2,a:2,h:3,r:6,home:'top',hb:1,sup:1,art:'jack',lg:'开阔水域的鱼。游得远：整条道都够得着，还给上下相邻的道各 +1 净化。',fact:'鲹鱼白天聚成大鱼群，在礁外的蓝水里来回巡游。'},
 shark:{n:'礁鲨',e:4,a:4,h:6,r:6,home:'top',hb:1,sup:2,art:'shark',lg:'开阔水域的鱼。整条道都够得着，还给上下相邻的道各 +2 净化。',fact:'有鲨鱼巡游的礁，说明下面整条食物链是健康的。'},
 turtle:{n:'绿海龟',e:3,a:2,h:9,r:1,art:'turtle',lg:'哪条道都能去，不挑地方。血最厚的盾。',fact:'绿海龟到水面换气，到礁石上休息，到海草床吃草，三处都能见到它。'},
 plankton:{n:'浮游生物',e:0,fx:'plankton',art:'',lg:'一阵浮游生物漂过：这回合多 2 点能量。',fact:'浮游生物是整片海的口粮。光鳃鱼、花园鳗、沙丁鱼，甚至鲸鲨，都靠滤食它们为生。'},
 zoox:{n:'虫黄藻',e:1,fx:'zoox',art:'',lg:'选一格珊瑚，让它变茂盛：上面的珊瑚鱼净化再 +1，每回合多回 1 血。',fact:'珊瑚体内住着虫黄藻，它们晒太阳制造养分，珊瑚九成的能量来自它们。'},
 cleanup:{n:'净滩',e:2,fx:'cleanup',art:'',lg:'选一条道：把这条道的污染值减 3。',fact:'人把垃圾和渔网清走，礁才有机会自己恢复。'},
 breed:{n:'繁殖',e:2,fx:'breed',art:'',lg:'选一条在珊瑚上的珊瑚鱼，它旁边的空格里多出一条一样的。',fact:'很多礁鱼在满月前后集体产卵，珊瑚的枝杈是鱼苗最好的藏身处。'},
 flow:{n:'水流',e:1,fx:'flow',art:'',lg:'选一条道：这条道的生物全部被冲到最前面，紧贴污染排好。',fact:'洋流给礁带来浮游生物，也把鱼卵和幼体带到新的地方。'}};
/* 关卡：一关只加一两样新东西 */
let LV=[
 {n:'一丛珊瑚',pl:[1],f0:5,p0:10,dn:2,up:0,turns:13,deck:{coral:4,clown:6,urchin:2},fresh:['coral','clown','urchin']},
 {n:'鱼群',pl:[1],f0:5,p0:11,dn:2,up:1,turns:14,deck:{coral:4,clown:4,chromis:5,urchin:2,zoox:2},fresh:['chromis','zoox']},
 {n:'开阔水域',pl:[0,1],f0:5,p0:10,dn:2,up:1,turns:14,deck:{coral:4,clown:4,chromis:3,urchin:2,zoox:1,sardine:4,jack:3,plankton:3},fresh:['sardine','jack','plankton']},
 {n:'沙地',pl:[0,1,2],f0:5,p0:10,dn:2,up:1,turns:15,deck:{coral:4,clown:4,chromis:3,urchin:3,zoox:1,sardine:3,jack:3,plankton:3,eel:4,ray:2,flow:2},fresh:['eel','ray','flow']},
 {n:'啃藻的鱼',pl:[0,1,2],f0:5,p0:11,dn:2,up:1,turns:15,deck:{coral:4,clown:4,chromis:3,urchin:2,zoox:2,sardine:3,jack:3,plankton:3,eel:3,ray:2,flow:2,parrot:2,butterfly:2,breed:2,cleanup:2},fresh:['parrot','butterfly','breed','cleanup']},
 {n:'大潮',pl:[0,1,2],f0:5,p0:12,dn:2,up:1,turns:16,deck:{coral:4,clown:4,chromis:3,urchin:2,zoox:2,sardine:3,jack:2,plankton:3,eel:3,ray:2,flow:2,parrot:2,butterfly:2,breed:2,cleanup:2,turtle:2,cleaner:2,shark:1},fresh:['turtle','cleaner','shark']}];
const cshuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
let CUID=0;const mkc=id=>({id,u:++CUID});
function cgInit(lv){const S={lv:lv||0};cgStage(S);return S}
function cgStage(S){const L=LV[S.lv];S.turn=0;S.over=null;S.lanes=Array.from({length:3},(_,li)=>({li,pol:L.pl.includes(li),front:L.pl.includes(li)?L.f0:NC,P:L.p0,cells:Array.from({length:NC},()=>({coral:false,lush:false,c:null}))}));
 const d=[];for(const k in L.deck)for(let i=0;i<L.deck[k];i++)d.push(mkc(k));S.deck=cshuf(d);S.hand=[];S.dis=[];
 ['coral','clown'].forEach(id=>{const i=S.deck.findIndex(k=>k.id===id);if(i>=0)S.hand.push(S.deck.splice(i,1)[0])});cgDraw(S,HAND0-S.hand.length);cgTurn(S)}
function cgDraw(S,n){for(let i=0;i<n;i++){if(!S.deck.length){if(!S.dis.length)return;S.deck=cshuf(S.dis);S.dis=[]}S.hand.push(S.deck.pop())}}
const cgEnergy=t=>Math.min(6,3+Math.floor((t-1)/2));
function cgTurn(S){S.turn++;S.energy=cgEnergy(S.turn)}
/* 手牌不会自己补：花能量才能抽 2 张 */
function cgDrawAct(S){if(S.over||S.energy<DRAWCOST||S.hand.length>=HANDMAX||(!S.deck.length&&!S.dis.length))return false;S.energy-=DRAWCOST;cgDraw(S,Math.min(DRAWN,HANDMAX-S.hand.length));return true}
const nb=(S,l,c)=>[[l,c-1],[l,c+1],[l-1,c],[l+1,c]].filter(([a,b])=>S.lanes[a]&&b>=0&&b<S.lanes[a].front);
const nbRow=(S,l,c)=>[[l,c-1],[l,c+1]].filter(([a,b])=>b>=0&&b<S.lanes[a].front);
const laneOk=(d,l)=>!d.only||d.only.includes(LTYPE[l]);
/* 一张牌能打到哪些格子 */
function cgTargets(S,id){const d=CD[id],o=[];if(d.fx==='flow'||d.fx==='cleanup'){S.lanes.forEach((L,l)=>{if(L.front<NC&&(d.fx==='cleanup'||L.cells.some((x,q)=>q<L.front&&x.c)))o.push({l,c:Math.max(0,L.front-1)})});return o}
 if(d.fx==='plankton'){S.lanes.forEach((L,l)=>o.push({l,c:0}));return o}
 S.lanes.forEach((L,l)=>{if(!d.fx&&!laneOk(d,l))return;for(let c=0;c<L.front;c++){const x=L.cells[c];if(d.terr){if(!x.coral||nbRow(S,l,c).some(([a,b])=>!S.lanes[a].cells[b].coral))o.push({l,c})}
  else if(d.fx==='zoox'){if(x.coral&&!x.lush)o.push({l,c})}
  else if(d.fx==='breed'){if(x.c&&x.coral&&CD[x.c.id].home==='coral'&&nbRow(S,l,c).some(([a,b])=>!S.lanes[a].cells[b].c))o.push({l,c})}else if(!x.c)o.push({l,c})}});return o}
const LANEFX=['flow','cleanup','plankton'];
const cgCan=(S,id,l,c)=>cgTargets(S,id).some(t=>t.l===l&&(LANEFX.includes(CD[id].fx)||t.c===c));
/* 每条道的战况预告 */
function cgLane(S,l){const L=S.lanes[l],U=[];for(let c=0;c<L.front;c++){const x=L.cells[c];if(x.c){const d=CD[x.c.id];U.push({k:x.c,d,col:c,lush:x.lush,on:!d.home||(d.home==='coral'?x.coral:d.home===LTYPE[l])})}}
 let eat=0;U.forEach(u=>{u.dist=L.front-u.col;u.inr=u.dist<=u.d.r;u.a=u.d.a+(u.d.home&&u.on?u.d.hb+(u.d.home==='coral'&&u.lush?1:0):0)+(u.d.school?U.filter(o=>o.k.id===u.k.id).length-1:0);if(u.inr&&u.d.eat)eat+=u.d.eat});
 let sup=0;[l-1,l+1].forEach(a=>{const M=S.lanes[a];if(M)for(let c=0;c<M.front;c++){const k=M.cells[c].c;if(k&&CD[k.id].sup)sup+=CD[k.id].sup}});
 const power=U.reduce((s,u)=>s+(u.inr?u.a:0),0)+sup,need=Math.max(0,L.P-eat),done=L.front>=NC,front=U.find(u=>u.col===L.front-1)||null,win=done?null:power>=need,short=win?0:need-power;
 return {U,power,sup,eat,need,done,win,short,front,dies:!win&&!done&&front?front.k.hp-short<=0:false,adv:!win&&!done&&(!front||front.k.hp-short<=0)}}
const cgScore=S=>S.lanes.map((_,l)=>cgLane(S,l));
function cgPlay(S,i,l,c){const k=S.hand[i];if(S.over||!k)return false;const d=CD[k.id];if(S.energy<d.e||!cgCan(S,k.id,l,c))return false;const L=S.lanes[l],x=L.cells[c];
 if(d.terr){if(!x.coral)x.coral=true;else nbRow(S,l,c).forEach(([a,b])=>{S.lanes[a].cells[b].coral=true})}
 else if(d.fx==='breed'){const t=nbRow(S,l,c).filter(([a,b])=>!S.lanes[a].cells[b].c).sort((p,q)=>(S.lanes[q[0]].cells[q[1]].coral-S.lanes[p[0]].cells[p[1]].coral)||(q[1]-p[1]))[0];S.lanes[t[0]].cells[t[1]].c={id:x.c.id,u:++CUID,hp:CD[x.c.id].h}}
 else if(d.fx==='plankton')S.energy+=2;
 else if(d.fx==='zoox')x.lush=true;
 else if(d.fx==='cleanup')L.P=Math.max(1,L.P-3);
 else if(d.fx==='flow'){const us=[];for(let q=0;q<L.front;q++)if(L.cells[q].c){us.push(L.cells[q].c);L.cells[q].c=null}us.reverse().forEach((u,n)=>{L.cells[L.front-1-n].c=u})}
 else x.c={id:k.id,u:k.u,hp:d.h};
 S.energy-=d.e;S.hand.splice(i,1);if(d.terr||d.fx)S.dis.push(k);return true}
/* 花 1 点能量让场上的生物游到另一格；目标格有生物就互换位置 */
const MOVECOST=1;
function cgCanMove(S,l,c,l2,c2){const A=S.lanes[l],B=S.lanes[l2];if(S.over||!A||!B||S.energy<MOVECOST||(l===l2&&c===c2)||c>=A.front||c2>=B.front)return false;const k=A.cells[c].c,o=B.cells[c2].c;if(!k||!laneOk(CD[k.id],l2))return false;return !o||laneOk(CD[o.id],l)}
function cgMove(S,l,c,l2,c2){if(!cgCanMove(S,l,c,l2,c2))return false;const a=S.lanes[l].cells[c],b=S.lanes[l2].cells[c2],t=a.c;a.c=b.c;b.c=t;S.energy-=MOVECOST;return true}
function cgEnd(S){if(S.over)return null;const cf=LV[S.lv],sc=cgScore(S),ev={sc,lanes:[]};
 S.lanes.forEach((L,l)=>{const r=sc[l],e={move:0,hit:null,dead:[],heal:[],wither:[]};ev.lanes.push(e);if(r.done)return;
  if(r.win){L.front++;L.P+=cf.up;e.move=1}else{if(r.front){r.front.k.hp-=r.short;e.hit=[r.front.col,r.short];if(r.front.k.hp<=0){L.cells[r.front.col].c=null;S.dis.push({id:r.front.k.id,u:r.front.k.u});e.dead.push(r.front.col)}}
   if(r.adv){L.front--;const x=L.cells[L.front];x.coral=false;x.lush=false;if(x.c){S.dis.push({id:x.c.id,u:x.c.u});x.c=null}L.P=Math.max(1,L.P-(cf.dn||1));e.move=-1}}
  /* 珊瑚鱼：在珊瑚上回血，不在就掉血；裂唇鱼给两边回血 */
  for(let c=0;c<L.front;c++){const x=L.cells[c],k=x.c;if(!k)continue;const d=CD[k.id];if(d.heal)[c-1,c+1].forEach(q=>{const o=L.cells[q]&&q<L.front&&L.cells[q].c;if(o&&o.hp<CD[o.id].h){o.hp=Math.min(CD[o.id].h,o.hp+d.heal);e.heal.push(q)}})}
  for(let c=0;c<L.front;c++){const x=L.cells[c],k=x.c;if(!k)continue;const d=CD[k.id];if(!d.home)continue;const on=d.home==='coral'?x.coral:d.home===LTYPE[l];if(on){if(d.home==='coral'&&k.hp<d.h){k.hp=Math.min(d.h,k.hp+(x.lush?2:1));e.heal.push(c)}}else{k.hp--;e.wither.push(c);if(k.hp<=0){x.c=null;S.dis.push({id:k.id,u:k.u});e.dead.push(c)}}}});
 if(S.lanes.some(L=>L.front<=0)){S.over='lose';return ev}
 if(S.lanes.every(L=>L.front>=NC)){S.over='win';return ev}
 if(S.turn>=cf.turns){S.over='lose';ev.timeout=1;return ev}cgTurn(S);return ev}
const CG={NC,CD,LANEN,LTYPE,laneOk,cgInit,cgStage,cgTargets,cgCan,cgLane,cgScore,cgPlay,cgDrawAct,cgMove,cgCanMove,cgEnd,cgEnergy,getLV:()=>LV};
if(typeof module!=='undefined')module.exports=CG;
