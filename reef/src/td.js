/* 守礁：水道防守（规则层，无界面；浏览器与 node 共用）。x 以“格”为单位，0=礁石一侧，COLS=外海一侧 */
const COLS=6;
const UNITS={
 parrot:{n:'鹦嘴鱼',cost:100,hp:70,cd:5,art:'parrot',shoot:1.4,dmg:{algae:20,big:20,cots:5},role:'啃藻',fact:'鹦嘴鱼用鸟喙一样的牙刮食礁石上的藻类，磨碎的石灰质排出来就是白沙。'},
 coral:{n:'珊瑚',cost:50,hp:60,cd:5,art:'coral',sun:8,role:'产能量',fact:'珊瑚体内住着共生藻，晒到太阳就能制造养分。所以造礁珊瑚只长在阳光照得到的浅海。'},
 urchin:{n:'海胆',cost:50,hp:420,cd:14,art:'urchin',graze:9,role:'挡在前面',fact:'海胆夜里出来啃藻。海胆大量死亡的礁区，藻类很快就会盖过珊瑚。'},
 trigger:{n:'炮弹鱼',cost:150,hp:80,cd:7,art:'trigger',shoot:1.5,dmg:{algae:10,big:10,cots:60},role:'专吃海星',fact:'长棘海星浑身毒刺，天敌很少。炮弹鱼、苏眉鱼和大法螺是少数敢吃它的动物。'},
 shark:{n:'礁鲨',cost:150,hp:1,cd:30,art:'shark',dash:1,role:'冲过整条水道',fact:'有鲨鱼巡游的礁，说明下面整条食物链是健康的。'}};
const FOES={
 algae:{n:'藻团',hp:100,sp:.16,eat:20},
 big:{n:'大藻团',hp:300,sp:.12,eat:26},
 cots:{n:'长棘海星',hp:170,sp:.24,eat:60}};
const TDL=[
 {t:'第一条水道',rows:1,cards:['parrot'],e0:150,sky:5,tip:'藻团正朝礁石漂来。点“鹦嘴鱼”，再点水道里的一格。落下来的光点一下就能收集。',script:[[9,'algae'],[21,'algae'],[30,'algae'],[37,'algae'],[43,'algae'],[48,'algae']],fin:[55,['algae','algae','algae','algae']],unlock:'coral'},
 {t:'晒太阳',rows:3,cards:['coral','parrot'],e0:100,sky:7,tip:'珊瑚晒太阳会产出能量。先种几丛珊瑚，再放鹦嘴鱼。',gen:{start:18,gap:[8,4.2],dur:75},fin:['algae','algae','algae','algae','algae','algae'],unlock:'urchin'},
 {t:'大藻团',rows:5,cards:['coral','parrot','urchin'],e0:100,sky:7,tip:'大藻团很难啃完。把海胆放在前面挡住它，让后面的鹦嘴鱼慢慢啃。',gen:{start:16,gap:[7,3.6],dur:95,big:[35,.3]},fin:['algae','algae','big','algae','big','algae','algae','big','algae'],unlock:'trigger'},
 {t:'长棘海星',rows:5,cards:['coral','parrot','urchin','trigger'],e0:100,sky:7,tip:'长棘海星专吃珊瑚，鹦嘴鱼几乎咬不动它。炮弹鱼才是它的天敌。',gen:{start:18,gap:[8,4.4],dur:100,big:[45,.2],cots:[26,.33]},fin:['algae','cots','big','algae','cots','algae','cots','big','algae','cots'],unlock:'shark'},
 {t:'大潮',rows:5,cards:['coral','parrot','urchin','trigger','shark'],e0:125,sky:7,tip:'礁鲨会冲过整条水道，清掉一路。留到最危险的时候再用。',gen:{start:16,gap:[7,3.4],dur:115,big:[35,.25],cots:[24,.3]},fin:['algae','cots','big','algae','cots','algae','cots','big','algae','cots','big','algae','algae','cots']}];
function tdScript(L){if(L.script){const s=L.script.map(e=>[e[0],e[1],0]);L.fin[1].forEach((k,i)=>s.push([L.fin[0]+i*1.6,k,0,1]));return {s,finT:L.fin[0]}}
 const g=L.gen,s=[];let t=g.start;while(t<g.dur){const p=(t-g.start)/(g.dur-g.start);let k='algae';if(g.cots&&t>g.cots[0]&&Math.random()<g.cots[1])k='cots';else if(g.big&&t>g.big[0]&&Math.random()<g.big[1])k='big';
  s.push([t,k,Math.floor(Math.random()*L.rows)]);t+=(g.gap[0]+(g.gap[1]-g.gap[0])*p)*(.8+Math.random()*.4)}
 const finT=g.dur+6;L.fin.forEach((k,i)=>s.push([finT+i*1.1,k,i%L.rows===0?Math.floor(Math.random()*L.rows):(i*2)%L.rows,1]));return {s,finT}}
function tdNew(li){const L=TDL[li],sc=tdScript(L);let id=0;
 const G={li,L,t:0,energy:L.e0,units:[],foes:[],shots:[],suns:[],mow:Array(L.rows).fill(true),cd:{},script:sc.s.sort((a,b)=>a[0]-b[0]),finT:sc.finT,si:0,sky:3,over:null,ev:[],total:sc.s.length,killed:0,nid:()=>++id};
 L.cards.forEach(k=>G.cd[k]=0);return G}
const unitAt=(G,r,c)=>G.units.find(u=>u.r===r&&u.c===c);
function tdCan(G,k,r,c){const U=UNITS[k];if(G.over||G.energy<U.cost||G.cd[k]>0||r<0||r>=G.L.rows||c<0||c>=COLS)return false;return U.dash?true:!unitAt(G,r,c)}
function tdPlace(G,k,r,c){if(!tdCan(G,k,r,c))return false;const U=UNITS[k];G.energy-=U.cost;G.cd[k]=U.cd;
 if(U.dash){G.shots.push({id:G.nid(),r,x:-.6,dash:1,v:5});G.ev.push(['dash',r]);return true}
 G.units.push({id:G.nid(),k,r,c,hp:U.hp,t:U.shoot?U.shoot*.6:0,st:U.sun?U.sun*.45:0});G.ev.push(['place',r,c]);return true}
function tdSun(G,id){const i=G.suns.findIndex(s=>s.id===id);if(i<0)return false;G.energy+=G.suns[i].v;G.suns.splice(i,1);G.ev.push(['sun']);return true}
function tdStep(G,dt){if(G.over)return;G.t+=dt;const L=G.L;for(const k in G.cd)G.cd[k]=Math.max(0,G.cd[k]-dt);
 while(G.si<G.script.length&&G.script[G.si][0]<=G.t){const e=G.script[G.si++],F=FOES[e[1]];if(e[3]&&!G.finOn){G.finOn=1;G.ev.push(['wave'])}G.foes.push({id:G.nid(),k:e[1],r:e[2],x:COLS+.4+Math.random()*.3,hp:F.hp,ph:Math.random()*6})}
 G.sky-=dt;if(G.sky<=0){G.sky=L.sky;G.suns.push({id:G.nid(),x:.5+Math.random()*(COLS-1),y:-.6,ty:-.15+Math.random()*(L.rows-.7),life:10,v:25})}
 for(const s of G.suns){if(s.y<s.ty)s.y=Math.min(s.ty,s.y+dt*1.1);else s.life-=dt}G.suns=G.suns.filter(s=>s.life>0);
 for(const u of G.units){const U=UNITS[u.k];
  if(U.sun){u.st+=dt;if(u.st>=U.sun){u.st=0;G.suns.push({id:G.nid(),x:u.c+.5,y:u.r+.2,ty:u.r+.2,life:10,v:25,born:1})}}
  if(U.shoot){u.t+=dt;if(u.t>=U.shoot&&G.foes.some(f=>f.r===u.r&&f.x>u.c+.3&&f.x<COLS+.3)){u.t=0;G.shots.push({id:G.nid(),r:u.r,x:u.c+.8,k:u.k,v:4.2})}}}
 for(const s of G.shots){s.x+=s.v*dt;
  if(s.dash){for(const f of G.foes)if(f.r===s.r&&Math.abs(f.x-s.x)<.6&&f.hp>0){f.hp=0;G.ev.push(['die',f.r,f.x,f.k])}if(s.x>COLS+1)s.dead=1;continue}
  const f=G.foes.filter(f=>f.r===s.r&&f.hp>0&&f.x<=s.x+.15&&f.x>=s.x-.6).sort((a,b)=>a.x-b.x)[0];
  if(f){f.hp-=UNITS[s.k].dmg[f.k];f.hit=G.t;s.dead=1;G.ev.push(['hit']);if(f.hp<=0)G.ev.push(['die',f.r,f.x,f.k])}else if(s.x>COLS+.5)s.dead=1}
 G.shots=G.shots.filter(s=>!s.dead);
 for(const f of G.foes){if(f.hp<=0)continue;const F=FOES[f.k],u=G.units.filter(u=>u.r===f.r&&f.x<=u.c+.9&&f.x>=u.c-.1).sort((a,b)=>b.c-a.c)[0];
  if(u){f.eat=1;u.hp-=F.eat*dt;u.bit=G.t;const U=UNITS[u.k];if(U.graze&&f.k!=='cots'){f.hp-=U.graze*dt;if(f.hp<=0)G.ev.push(['die',f.r,f.x,f.k])}if(u.hp<=0){u.dead=1;G.ev.push(['eaten',u.r,u.c])}}
  else{f.eat=0;f.x-=F.sp*dt}
  if(f.x<-.25){if(G.mow[f.r]){G.mow[f.r]=false;G.shots.push({id:G.nid(),r:f.r,x:-.6,dash:1,mow:1,v:6});G.ev.push(['mow',f.r])}else{G.over='lose';G.ev.push(['lose'])}}}
 G.units=G.units.filter(u=>!u.dead);const n0=G.foes.length;G.foes=G.foes.filter(f=>f.hp>0);G.killed+=n0-G.foes.length;
 if(!G.over&&G.si>=G.script.length&&!G.foes.length){G.over='win';G.ev.push(['win'])}}
const TD={COLS,UNITS,FOES,TDL,tdNew,tdCan,tdPlace,tdSun,tdStep,unitAt};
if(typeof module!=='undefined')module.exports=TD;
