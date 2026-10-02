/* 记忆礁 v0.1 规则引擎（浏览器与 node 共用，无界面） */
const HAB={
 coral:{n:'鹿角珊瑚',s:'珊瑚',art:'coral',tip:'住了鱼的珊瑚，每回合多产 1 点能量。'},
 anemone:{n:'海葵',s:'海葵',art:'anemone',tip:'小丑鱼的家。'},
 seafan:{n:'海扇',s:'海扇',art:'seafan',tip:'豆丁海马只住在海扇上。'},
 sponge:{n:'海绵',s:'海绵',art:'sponge',tip:'躄鱼和海蛞蝓待的地方。'},
 sand:{n:'沙地',s:'沙地',art:'',tip:'花园鳗、虾虎鱼、魟和海胆的家。'},
 seagrass:{n:'海草床',s:'海草',art:'seagrass',tip:'绿海龟来这里吃草。'},
 blue:{n:'开阔蓝水',s:'蓝水',art:'',tip:'鲹鱼、沙丁鱼和鲨鱼巡游的地方。'}};
const HABCOST=1,PURIFY=2,ROUNDS=6,HAND=5,ROWS=3,COLS=4;
const CARDS={
 clown:{n:'小丑鱼',full:'眼斑双锯鱼',sci:'Amphiprion ocellaris',g:'雀鲷科',home:'anemone',cost:1,pts:2,art:'clown',sk:'共生：每回合 +1 能量。相邻每有 1 个海葵，+2 分。',fact:'小丑鱼赶走来啃海葵的鱼，它的排泄物又是海葵的养料。它其实是雀鲷科的一员。'},
 chromis:{n:'光鳃鱼',full:'蓝绿光鳃鱼',sci:'Chromis viridis',g:'雀鲷科',home:'coral',cost:1,pts:1,art:'chromis',sk:'成群：场上每有 1 条光鳃鱼（含自己），+1 分。',fact:'成群悬在鹿角珊瑚上方吃浮游生物，一有危险就整群缩回枝杈里。'},
 butterfly:{n:'蝴蝶鱼',full:'丝蝴蝶鱼',sci:'Chaetodon auriga',g:'蝴蝶鱼科',home:'coral',cost:2,pts:3,art:'butterfly',sk:'成对：相邻有另一条蝴蝶鱼时，+4 分。',fact:'很多蝴蝶鱼成对生活，一对常常相伴多年，在礁上一前一后地游。'},
 parrot:{n:'鹦嘴鱼',full:'蓝头绿鹦嘴鱼',sci:'Chlorurus sordidus',g:'鹦嘴鱼科',home:'coral',cost:3,pts:3,art:'parrot',sk:'打出时：清除相邻 1 格污染，并把它变成沙地。',fact:'用鸟喙一样的牙刮食礁石上的藻类，咬下的石灰质磨碎后排出来，就是白沙。'},
 cleaner:{n:'裂唇鱼',full:'裂唇鱼',sci:'Labroides dimidiatus',g:'隆头鱼科',home:'coral',cost:2,pts:1,art:'cleaner',sk:'清洁站：相邻的鱼得分 ×2（不叠加）。',fact:'在固定的“清洁站”替别的鱼吃掉寄生虫和死皮，大鱼会排队等它。'},
 surgeon:{n:'刺尾鱼',full:'栉齿刺尾鱼',sci:'Ctenochaetus striatus',g:'刺尾鱼科',home:'coral',cost:3,pts:2,art:'surgeon',sk:'回合结束：清除相邻 1 格污染。',fact:'用刷子一样的牙齿刷走礁石表面的藻膜和碎屑，不让藻类盖住珊瑚。'},
 pygmy:{n:'豆丁海马',full:'巴氏豆丁海马',sci:'Hippocampus bargibanti',g:'海龙科',home:'seafan',cost:2,pts:6,art:'pygmy',sk:'伪装：不会被渔网缠住。',fact:'不到 2 厘米，一辈子只住在特定的海扇上，颜色和疙瘩都长得和海扇一样。'},
 frog:{n:'躄鱼',full:'康氏躄鱼',sci:'Antennarius commerson',g:'躄鱼科',home:'sponge',cost:3,pts:3,art:'frogfish',sk:'伏击：相邻每有 1 条费用 ≤1 的鱼，+3 分。',fact:'装成一块海绵，晃动头上的“钓竿”引小鱼靠近，然后一口吞下。'},
 nudi:{n:'海蛞蝓',full:'安娜多彩海蛞蝓',sci:'Chromodoris annae',g:'多彩海蛞蝓科',home:'sponge',cost:2,pts:2,art:'nudi',sk:'警戒色：倍率 +1。',fact:'以海绵为食。鲜艳的颜色是在警告捕食者：我不好吃。'},
 eel:{n:'花园鳗',full:'哈氏异康吉鳗',sci:'Heteroconger hassi',g:'康吉鳗科',home:'sand',cost:1,pts:1,art:'gardeneel',sk:'群居：相邻每有 1 条花园鳗，+2 分。',fact:'成片住在沙地的洞里，只探出半截身子迎着水流吃浮游生物。'},
 goby:{n:'虾虎鱼',full:'虾虎鱼与枪虾',sci:'Amblyeleotris · Alpheus',g:'虾虎鱼科',home:'sand',cost:2,pts:3,art:'goby',sk:'搭档：打出时抽 1 张牌。',fact:'枪虾视力差，负责挖洞；虾虎鱼在洞口放哨，一摆尾巴两个一起躲进去。'},
 ray:{n:'蓝斑魟',full:'蓝斑条尾魟',sci:'Taeniura lymma',g:'魟科',home:'sand',cost:2,pts:4,art:'ray',sk:'翻沙：打出时 +1 能量。',fact:'白天常躲在礁石下，涨潮时到沙地上翻沙找贝类和虫子吃。'},
 jack:{n:'鲹鱼',full:'六带鲹',sci:'Caranx sexfasciatus',g:'鲹科',home:'blue',cost:2,pts:2,art:'jack',sk:'鱼群：场上每有 1 条其他鲹鱼，+3 分。',fact:'白天聚成缓慢旋转的大鱼群，晚上才分散开去捕食。'},
 sardine:{n:'沙丁鱼',full:'沙丁鱼',sci:'Sardinella',g:'鲱科',home:'blue',cost:1,pts:1,art:'sardine',sk:'饵球：相邻的鲹鱼和鲨鱼各 +3 分。',fact:'成千上万条挤成“饵球”，是鲹鱼、鲨鱼等掠食者的主要食物。'},
 shark:{n:'黑鳍礁鲨',full:'黑鳍礁鲨',sci:'Carcharhinus melanopterus',g:'真鲨科',home:'blue',cost:5,pts:6,art:'shark',need:4,sk:'顶级掠食者：场上已有 4 条鱼才能打出。每有 3 条其他鱼，倍率 +1。',fact:'浅礁的顶级掠食者。有鲨鱼的礁，说明下面整条食物链是健康的。'},
 turtle:{n:'绿海龟',full:'绿海龟',sci:'Chelonia mydas',g:'海龟科',home:'seagrass',cost:4,pts:5,art:'turtle',sk:'旗舰物种：倍率 +1。',fact:'成年后主要吃海草。它像割草机一样啃食，反而让海草床长得更健康。'},
 moray:{n:'海鳝',full:'爪哇裸胸鳝',sci:'Gymnothorax javanicus',g:'海鳝科',home:'coral',cost:3,pts:4,art:'moray',sk:'合作捕猎：场上有石斑鱼时，+5 分。',fact:'石斑鱼会到洞口摇头“邀请”海鳝：海鳝钻缝赶鱼，石斑在外面堵。'},
 grouper:{n:'石斑鱼',full:'豹纹鳃棘鲈',sci:'Plectropomus leopardus',g:'鮨科',home:'coral',cost:3,pts:4,art:'grouper',sk:'合作捕猎：场上有海鳝时，+5 分。',fact:'会用倒立、摇头等动作向海鳝指出猎物藏在哪条缝里。'},
 urchin:{n:'海胆',full:'冠刺棘海胆',sci:'Diadema setosum',g:'冠海胆科',home:'sand',cost:1,pts:1,art:'urchin',sk:'啃藻：相邻的格子不会被藻类盖住。',fact:'夜里出来啃藻。海胆大量死亡的礁区，藻类很快就会盖过珊瑚。'},
 lion:{n:'狮子鱼',full:'魔鬼蓑鲉',sci:'Pterois volitans',g:'鲉科',home:'coral',cost:2,pts:6,art:'lionfish',sk:'贪吃：相邻费用 ≤1 的鱼不得分。',fact:'张开胸鳍把小鱼逼到角落再一口吸入。背鳍的毒刺让它几乎没有天敌。'},
 current:{type:'fx',n:'洋流',cost:0,art:'',sk:'抽 2 张牌。',fact:'洋流带来浮游生物，也带来新的鱼。'},
 cleanup:{type:'fx',n:'净滩',cost:1,art:'',sk:'清除 1 格污染。',fact:'人把垃圾捡走，礁才有机会自己恢复。'},
 spawn:{type:'fx',n:'产卵季',cost:2,art:'',sk:'本回合倍率 +2。',fact:'很多礁鱼在满月前后集体产卵。'}};
const START=['clown','clown','chromis','chromis','chromis','butterfly','butterfly','eel','eel','eel','jack','jack','sardine','sardine','urchin','parrot','cleaner','ray','current','cleanup'];
const POOL=['surgeon','pygmy','frog','nudi','goby','shark','turtle','moray','grouper','lion','parrot','cleaner','spawn','cleanup','butterfly','jack','sardine','chromis'];
const LV=[
 {n:'浅滩',sub:'藻类暴发',target:240,spread:1,rule:'每回合结束，藻类盖住 1 个没有鱼的格子。'},
 {n:'礁坡',sub:'幽灵渔网',target:380,spread:1,net:1,rule:'藻类照常蔓延。另外，每回合得分最高的鱼会被渔网缠住，下回合不得分。'},
 {n:'峭壁',sub:'珊瑚白化',target:650,spread:2,bleach:1,rule:'藻类每回合蔓延 2 格。没有鱼住的珊瑚，回合结束时白化死亡。'}];
let UIDC=0;const mk=id=>({id,uid:++UIDC});
const shuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const adj=(r,c)=>[[r-1,c],[r+1,c],[r,c-1],[r,c+1]].filter(([a,b])=>a>=0&&a<ROWS&&b>=0&&b<COLS);
const each=(S,f)=>{for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)f(S.grid[r][c],r,c)};
const fishes=S=>{const F=[];each(S,(x,r,c)=>{if(x.fish)F.push({r,c,x,id:x.fish.id,d:CARDS[x.fish.id]})});return F};
function newRun(){const S={level:0,cards:START.map(mk)};startLevel(S);return S}
function startLevel(S){const L=LV[S.level];S.round=0;S.score=0;S.target=L.target;S.phase='play';S.pending=null;S.grid=[];
 for(let r=0;r<ROWS;r++){S.grid.push([]);for(let c=0;c<COLS;c++)S.grid[r].push({pol:!(c===0||(c===1&&r===1)),base:null,fish:null})}
 S.deck=shuf(S.cards.map(k=>({id:k.id,uid:k.uid})));S.hand=[];S.discard=[];startRound(S)}
function income(S){let e=3+S.level;each(S,x=>{if(x.fish&&x.base==='coral')e++;if(x.fish&&x.fish.id==='clown')e++});return e}
function draw(S,n){for(let i=0;i<n;i++){if(!S.deck.length){if(!S.discard.length)return;S.deck=shuf(S.discard);S.discard=[]}S.hand.push(S.deck.pop())}}
function startRound(S){S.round++;S.energy=income(S);S.disc=false;S.multBonus=0;draw(S,Math.max(0,HAND-S.hand.length))}
function score(S){const F=fishes(S),cnt={};F.forEach(f=>{cnt[f.id]=(cnt[f.id]||0)+1;f.pts=f.d.pts;f.why=[]});
 const at=(r,c)=>F.find(f=>f.r===r&&f.c===c),nb=f=>adj(f.r,f.c).map(([r,c])=>at(r,c)).filter(Boolean),add=(f,n,w)=>{if(n){f.pts+=n;f.why.push(w+' +'+n)}};
 F.forEach(f=>{const N=nb(f);
  if(f.id==='clown')add(f,2*adj(f.r,f.c).filter(([r,c])=>S.grid[r][c].base==='anemone'&&!S.grid[r][c].pol).length,'相邻海葵');
  if(f.id==='chromis')add(f,cnt.chromis,'成群');
  if(f.id==='butterfly'&&N.some(o=>o.id==='butterfly'))add(f,4,'成对');
  if(f.id==='frog')add(f,3*N.filter(o=>o.d.cost<=1).length,'伏击');
  if(f.id==='eel')add(f,2*N.filter(o=>o.id==='eel').length,'群居');
  if(f.id==='jack')add(f,3*(cnt.jack-1),'鱼群');
  if(f.id==='moray'&&cnt.grouper)add(f,5,'合作捕猎');
  if(f.id==='grouper'&&cnt.moray)add(f,5,'合作捕猎');
  if(f.id==='sardine')N.forEach(o=>{if(o.id==='jack'||o.id==='shark')add(o,3,'饵球')})});
 F.forEach(f=>{if(f.id==='lion')nb(f).forEach(o=>{if(o.d.cost<=1){o.zero='被狮子鱼盯上'}})});
 F.forEach(f=>{if(f.x.fish.net)f.zero='被渔网缠住'});
 F.forEach(f=>{if(f.zero){f.pts=0;f.why=[f.zero]}else if(nb(f).some(o=>o.id==='cleaner')){f.pts*=2;f.why.push('清洁站 ×2')}});
 const groups=[...new Set(F.map(f=>f.d.g))];let mult=groups.length;const mw=[groups.length+' 个类群'];
 const bump=(n,w)=>{if(n){mult+=n;mw.push(w+' +'+n)}};bump(cnt.nudi||0,'海蛞蝓');bump(cnt.turtle||0,'绿海龟');if(cnt.shark)bump(cnt.shark*Math.floor((F.length-1)/3),'礁鲨');bump(S.multBonus,'产卵季');
 const chips=F.reduce((a,f)=>a+f.pts,0);return {F,chips,mult,mw,groups,total:chips*mult}}
const frontier=S=>{const o=[];each(S,(x,r,c)=>{if(x.pol&&adj(r,c).some(([a,b])=>!S.grid[a][b].pol))o.push([r,c])});return o};
const baseCells=S=>{const o=[];each(S,(x,r,c)=>{if(!x.pol&&!x.base)o.push([r,c])});return o};
function fishCells(S,id){const d=CARDS[id],o=[];if(d.need&&fishes(S).length<d.need)return o;each(S,(x,r,c)=>{if(!x.pol&&x.base===d.home&&!x.fish)o.push([r,c])});return o}
function placeBase(S,key,r,c){const x=S.grid[r][c];if(S.pending||S.energy<HABCOST||x.pol||x.base)return false;S.energy-=HABCOST;x.base=key;return true}
function playFish(S,i,r,c){const k=S.hand[i];if(S.pending||!k)return false;const d=CARDS[k.id];if(d.type==='fx'||S.energy<d.cost||!fishCells(S,k.id).some(p=>p[0]===r&&p[1]===c))return false;
 S.energy-=d.cost;S.hand.splice(i,1);S.grid[r][c].fish={id:k.id,uid:k.uid};
 if(k.id==='parrot'){const cs=adj(r,c).filter(([a,b])=>S.grid[a][b].pol);if(cs.length)S.pending={cells:cs,cost:0,conv:'sand',msg:'鹦嘴鱼：选相邻的一格污染啃掉'}}
 if(k.id==='goby')draw(S,1);if(k.id==='ray')S.energy++;return true}
function playFx(S,i){const k=S.hand[i];if(S.pending||!k)return false;const d=CARDS[k.id];if(d.type!=='fx'||S.energy<d.cost)return false;
 if(k.id==='cleanup'){const cs=frontier(S);if(!cs.length)return false;S.pending={cells:cs,cost:0,msg:'净滩：选一格污染清除'}}
 S.energy-=d.cost;S.discard.push(S.hand.splice(i,1)[0]);if(k.id==='current')draw(S,2);if(k.id==='spawn')S.multBonus+=2;return true}
function purify(S){if(S.pending||S.energy<PURIFY)return false;const cs=frontier(S);if(!cs.length)return false;S.pending={cells:cs,cost:PURIFY,cancel:1,msg:'选一格污染清除（花 '+PURIFY+' 能量）'};return true}
function resolve(S,r,c){const p=S.pending;if(!p||!p.cells.some(q=>q[0]===r&&q[1]===c))return false;const x=S.grid[r][c];x.pol=false;if(p.conv)x.base=p.conv;S.energy-=p.cost;S.pending=null;return true}
function cancel(S){if(S.pending&&S.pending.cancel){S.pending=null;return true}return false}
function swap(S,i){if(S.pending||S.disc||!S.hand[i])return false;S.discard.push(S.hand.splice(i,1)[0]);draw(S,1);S.disc=true;return true}
function endRound(S){if(S.pending)S.pending=null;const L=LV[S.level],ev={score:score(S),cleared:[],spread:[],bleach:[],net:null};S.score+=ev.score.total;
 each(S,x=>{if(x.fish)delete x.fish.net});
 fishes(S).filter(f=>f.id==='surgeon').forEach(f=>{const cs=adj(f.r,f.c).filter(([a,b])=>S.grid[a][b].pol);if(cs.length){const p=cs[Math.floor(Math.random()*cs.length)];S.grid[p[0]][p[1]].pol=false;ev.cleared.push(p)}});
 if(S.score>=S.target){S.phase=S.level===LV.length-1?'won':'reward';if(S.phase==='reward'){S.picks=3;rollReward(S)}return ev}
 if(S.round>=ROUNDS){S.phase='lost';return ev}
 for(let n=0;n<L.spread;n++){const guard=(r,c)=>adj(r,c).some(([a,b])=>S.grid[a][b].fish&&S.grid[a][b].fish.id==='urchin'),A=[],B=[];
  each(S,(x,r,c)=>{if(!x.pol&&!x.fish&&!guard(r,c)&&adj(r,c).some(([a,b])=>S.grid[a][b].pol))(x.base?B:A).push([r,c])});const P=A.length?A:B;
  if(P.length){const p=P[Math.floor(Math.random()*P.length)],x=S.grid[p[0]][p[1]];ev.spread.push([p[0],p[1],x.base]);x.pol=true;x.base=null}}
 if(L.bleach)each(S,(x,r,c)=>{if(!x.pol&&x.base==='coral'&&!x.fish){x.pol=true;x.base=null;ev.bleach.push([r,c])}});
 if(L.net){const C=ev.score.F.filter(f=>f.id!=='pygmy'&&f.pts>0).sort((a,b)=>b.pts-a.pts)[0];if(C){C.x.fish.net=true;ev.net=[C.r,C.c]}}
 startRound(S);return ev}
function rollReward(S){S.offer=shuf(POOL.slice()).filter((v,i,a)=>a.indexOf(v)===i).slice(0,3)}
function pickReward(S,i){if(S.phase!=='reward'||!S.offer[i])return false;S.cards.push(mk(S.offer[i]));S.picks--;if(S.picks>0)rollReward(S);else{S.level++;startLevel(S)}return true}
const RE={HAB,CARDS,LV,START,POOL,HABCOST,PURIFY,ROUNDS,ROWS,COLS,adj,each,fishes,newRun,startLevel,income,score,frontier,baseCells,fishCells,placeBase,playFish,playFx,purify,resolve,cancel,swap,endRound,pickReward};
if(typeof module!=='undefined')module.exports=RE;
