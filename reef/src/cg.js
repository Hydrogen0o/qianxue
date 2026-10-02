/* 牌局：5 个礁位，生物留在场上每回合得分并长大 +1；每回合 5 张牌最多打 2 张。规则层，无界面。 */
const SLOTS=5,HANDN=5,PLAYN=2;
const CD={
 clown:{n:'小丑鱼',p:2,art:'clown',tx:'有海葵就翻倍',fact:'小丑鱼一辈子住在海葵里：它替海葵赶走天敌，海葵的毒触手保护它。'},
 anem:{n:'海葵',p:0,art:'anemone',tx:'小丑鱼 ×2',fact:'海葵自己不会动，靠触手上的毒刺捕食。小丑鱼身上有一层黏液，不会被蜇。'},
 chromis:{n:'光鳃鱼',p:1,art:'chromis',tx:'每条同伴 +2',fact:'光鳃鱼成群悬在鹿角珊瑚上方，一有危险就整群缩回枝杈里。'},
 coral:{n:'鹿角珊瑚',p:0,art:'coral',tx:'每回合多打1张',fact:'珊瑚搭起了整片礁的骨架。礁只占海底不到 1%，却养活了约四分之一的海洋鱼类。'},
 cleaner:{n:'裂唇鱼',p:1,art:'cleaner',tx:'左右的鱼 ×2',fact:'裂唇鱼在固定的“清洁站”替别的鱼吃掉寄生虫，大鱼会排队等它。'},
 sardine:{n:'沙丁鱼',p:1,art:'sardine',tx:'鲹鱼的食物',fact:'沙丁鱼成千上万挤成“饵球”，是鲹鱼、鲨鱼这些掠食者的主要食物。'},
 jack:{n:'鲹鱼',p:2,art:'jack',tx:'每条沙丁鱼 +3',fact:'鲹鱼白天聚成大鱼群，追着沙丁鱼这样的小鱼捕食。'},
 eel:{n:'花园鳗',p:1,art:'gardeneel',tx:'挨着同伴 +3',fact:'花园鳗成片住在沙洞里，只探出半截身子，迎着水流吃浮游生物。'},
 turtle:{n:'绿海龟',p:5,art:'turtle',tx:'稳稳的 5 分',fact:'绿海龟成年后主要吃海草。它像割草机一样啃食，反而让海草床长得更健康。'},
 butterfly:{n:'蝴蝶鱼',p:3,art:'butterfly',tx:'成对 ×2',lg:'挨着另一条蝴蝶鱼时，得分 ×2。',fact:'很多蝴蝶鱼成对生活，一对常常相伴多年。'},
 spawn:{n:'产卵季',p:0,fx:1,art:'',tx:'本回合 ×2',lg:'一次性：这个回合的总得分 ×2。用完就没了，留到礁上最热闹的时候。',fact:'很多礁鱼在满月前后集体产卵。'},
 shark:{n:'礁鲨',p:3,art:'shark',tx:'每种生物 +3',lg:'礁上每有一种不同的生物，+3 分。',fact:'有鲨鱼巡游的礁，说明下面整条食物链是健康的。'},
 grouper:{n:'石斑鱼',p:2,art:'grouper',tx:'每回合长 3 分',lg:'别的生物每回合长大 +1，它 +3。越早放越值。',fact:'石斑鱼领地性很强，常年守着同一块礁石，越长越大。'},
 moray:{n:'海鳝',p:2,art:'moray',tx:'有石斑鱼 ×3',fact:'石斑鱼会到洞口摇头“邀请”海鳝一起捕猎：海鳝钻缝赶鱼，石斑在外面堵。'},
 nudi:{n:'海蛞蝓',p:1,art:'nudi',tx:'留手牌各 +3',lg:'回合结束时，手里每留着 1 张牌，+3 分。',fact:'海蛞蝓爬得很慢。鲜艳的颜色是在警告捕食者：我有毒。'},
 parrot:{n:'鹦嘴鱼',p:2,art:'parrot',tx:'打出时抽 2 张',fact:'鹦嘴鱼刮食礁石上的藻类，磨碎的石灰质排出来就是白沙。'},
 frog:{n:'躄鱼',p:3,art:'frogfish',tx:'吃掉左边的鱼',lg:'每回合结束吃掉左边礁位上的生物，把它的基础分永久加到自己身上。',fact:'躄鱼装成一块海绵，晃动头上的“钓竿”引小鱼靠近，然后一口吞下。'}};
const CSTART=['clown','clown','clown','anem','anem','chromis','chromis','chromis','sardine','sardine','jack','turtle','coral','eel','eel','cleaner','spawn'];
const CPOOL=['shark','grouper','moray','nudi','parrot','frog','anem','cleaner','spawn','turtle','butterfly','butterfly','jack','coral','eel'];
const CST=[
 {n:'浅滩',turns:6,rule:''},
 {n:'礁坡',turns:7,block:2,rule:'藻类盖住了正中间的礁位，那一格不能用。'},
 {n:'峭壁',turns:8,wash:1,rule:'急流：每回合结束，最右边礁位上的生物被冲走。'}];
const cshuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
let CUID=0;const cmk=id=>({id,u:++CUID,b:0});
function cgNew(){const S={stage:0,cards:CSTART.map(cmk)};cgStage(S);return S}
function cgStage(S){S.turn=0;S.total=0;S.slots=Array(SLOTS).fill(null);S.deck=cshuf(S.cards.map(k=>({id:k.id,u:k.u,b:0})));S.hand=[];S.dis=[];S.over=null;S.offer=null;cgTurn(S)}
function cgDraw(S,n){for(let i=0;i<n;i++){if(!S.deck.length){if(!S.dis.length)return;S.deck=cshuf(S.dis);S.dis=[]}S.hand.push(S.deck.pop())}}
function cgTurn(S){S.turn++;S.played=0;S.x2=0;cgDraw(S,Math.max(0,HANDN-S.hand.length))}
const cgLimit=S=>PLAYN+S.slots.filter(c=>c&&c.id==='coral').length;
function cgScore(S){const B=S.slots,cnt={};B.forEach(c=>{if(c)cnt[c.id]=(cnt[c.id]||0)+1});const kinds=Object.keys(cnt).length,hold=S.hand.length;
 const F=B.map((c,i)=>{if(!c)return null;let p=CD[c.id].p+c.b;const L=B[i-1],R=B[i+1];
  if(c.id==='chromis')p+=2*(cnt.chromis-1);if(c.id==='jack')p+=3*(cnt.sardine||0);
  if(c.id==='eel')p+=3*((L&&L.id==='eel'?1:0)+(R&&R.id==='eel'?1:0));if(c.id==='shark')p+=3*kinds;if(c.id==='nudi')p+=3*hold;
  if(c.id==='clown')p*=Math.pow(2,cnt.anem||0);if(c.id==='butterfly'&&((L&&L.id==='butterfly')||(R&&R.id==='butterfly')))p*=2;if(c.id==='moray'&&cnt.grouper)p*=3;
  if(c.id!=='cleaner'&&((L&&L.id==='cleaner')||(R&&R.id==='cleaner')))p*=2;if(c.net)p=0;return p});
 const sum=F.reduce((a,p)=>a+(p||0),0);return {F,sum,total:sum*(S.x2?2:1)}}
function cgPlay(S,i,slot){const k=S.hand[i];if(S.over||!k||S.played>=cgLimit(S))return false;
 if(CD[k.id].fx){S.hand.splice(i,1);S.dis.push(k);S.played++;if(k.id==='spawn')S.x2=1;return true}
 if(slot<0||slot>=SLOTS||slot===CST[S.stage].block)return false;const old=S.slots[slot];if(old)S.dis.push({id:old.id,u:old.u,b:0});S.hand.splice(i,1);S.slots[slot]={id:k.id,u:k.u,b:0};S.played++;if(k.id==='parrot')cgDraw(S,2);return true}
function cgDiscard(S,i){if(S.over||!S.hand[i])return false;S.dis.push(S.hand.splice(i,1)[0]);return true}
function cgEnd(S){if(S.over)return null;const st=CST[S.stage],sc=cgScore(S),ev={sc,net:null,wash:null,ate:[]};S.total+=sc.total;S.slots.forEach(c=>{if(c)delete c.net});
 S.slots.forEach((c,i)=>{if(!c)return;c.b+=c.id==='grouper'?3:1;if(c.id==='frog'&&i>0&&S.slots[i-1]){const v=S.slots[i-1];c.b+=CD[v.id].p+v.b;S.dis.push({id:v.id,u:v.u,b:0});S.slots[i-1]=null;ev.ate.push(i-1)}});
 if(S.total>=S.target){S.over='win';if(S.stage<CST.length-1)S.offer=cshuf(CPOOL.slice()).filter((v,i,a)=>a.indexOf(v)===i).slice(0,3);return ev}
 if(S.turn>=st.turns){S.over='lose';return ev}
 if(st.net){let b=-1,bi=-1;sc.F.forEach((p,i)=>{if(p!=null&&p>b&&S.slots[i]){b=p;bi=i}});if(bi>=0&&b>0){S.slots[bi].net=1;ev.net=bi}}
 if(st.wash&&S.slots[SLOTS-1]){const v=S.slots[SLOTS-1];S.dis.push({id:v.id,u:v.u,b:0});S.slots[SLOTS-1]=null;ev.wash=SLOTS-1}
 cgTurn(S);return ev}
function cgPick(S,i){if(!S.offer||!S.offer[i])return false;S.cards.push(cmk(S.offer[i]));S.stage++;S.target=CTARGET[S.stage];cgStage(S);return true}
let CTARGET=[220,260,400];
const cgInit=()=>{const S=cgNew();S.target=CTARGET[0];return S};
const CG={SLOTS,CD,CSTART,CPOOL,CST,cgInit,cgScore,cgPlay,cgDiscard,cgEnd,cgPick,cgLimit,setT:t=>{CTARGET=t}};
if(typeof module!=='undefined')module.exports=CG;
