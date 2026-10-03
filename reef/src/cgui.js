/* ---------- 牌局界面 v5：费用 / 净化 / 血量 + 珊瑚 ---------- */
let mode='cg',S,csel=null,cinfo=null,cbusy=false,ctT=0,tdStarted=false,cdrag=null,cundo=[],cLv=0,cSeen={},lpT=0;
try{const s=JSON.parse(localStorage.getItem('reefCG5')||'{}');if(s.lv)cLv=Math.min(LV.length-1,s.lv);if(s.seen)cSeen=s.seen}catch(e){}
const csave=()=>{try{localStorage.setItem('reefCG5',JSON.stringify({lv:cLv,seen:cSeen}))}catch(e){}};
const cart=id=>CD[id].art?svg(P[CD[id].art]()):'';
const IC={undo:'<svg viewBox="0 0 24 24"><path d="M9 4 L4 9 L9 14 M4 9 H14 a6 6 0 0 1 0 12 H11" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 swap:'<svg viewBox="0 0 24 24"><path d="M4 9 a8 8 0 0 1 14 -3 M20 3 v4 h-4 M20 15 a8 8 0 0 1 -14 3 M4 21 v-4 h4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 heart:'<svg viewBox="0 0 24 24"><path d="M12 21 C4 15 2 11 2 7.5 A5 5 0 0 1 12 6 A5 5 0 0 1 22 7.5 C22 11 20 15 12 21Z" fill="currentColor"/></svg>',
 drop:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="currentColor"/><circle cx="9" cy="9" r="3" fill="#fff" opacity=".7"/></svg>'};
const FXART={plankton:'<svg viewBox="0 0 100 100"><g fill="#e9fbff"><circle cx="28" cy="34" r="7"/><circle cx="62" cy="26" r="5"/><circle cx="74" cy="58" r="8"/><circle cx="40" cy="66" r="6"/><circle cx="52" cy="46" r="4"/><circle cx="22" cy="62" r="4"/></g><path d="M28 34 l-9 -7 M62 26 l8 -7 M74 58 l10 5 M40 66 l-6 9" stroke="#e9fbff" stroke-width="2.5" stroke-linecap="round"/></svg>',
 zoox:'<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="#f2c14e"/><g stroke="#f2c14e" stroke-width="6" stroke-linecap="round"><path d="M50 6 V16 M50 84 V94 M6 50 H16 M84 50 H94 M19 19 l7 7 M74 74 l7 7 M81 19 l-7 7 M26 74 l-7 7"/></g><circle cx="42" cy="44" r="7" fill="#a9d94a"/><circle cx="58" cy="56" r="8" fill="#8fc43a"/></svg>',
 cleanup:'<svg viewBox="0 0 100 100"><path d="M30 34 H70 L64 88 H36Z" fill="#fff"/><path d="M24 30 H76" stroke="#fff" stroke-width="8" stroke-linecap="round"/><path d="M42 22 H58" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M43 46 V76 M57 46 V76" stroke="#7b6ad0" stroke-width="5" stroke-linecap="round"/></svg>',breed:'<svg viewBox="0 0 100 100"><circle cx="38" cy="52" r="20" fill="#ffd6e6"/><circle cx="62" cy="48" r="20" fill="#ffc2da"/><circle cx="38" cy="52" r="7" fill="#ff6fae"/><circle cx="62" cy="48" r="7" fill="#ff6fae"/></svg>',
 flow:'<svg viewBox="0 0 100 100"><path d="M10 35 Q30 20 50 35 T90 35 M10 55 Q30 40 50 55 T90 55 M10 75 Q30 60 50 75 T90 75" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M78 26 L92 35 L78 44" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'};
const artOf=id=>CD[id].fx?FXART[CD[id].fx]:cart(id);
const dots=r=>r>=6?'<i class="rg far"></i>':`<i class="rg">${'<s></s>'.repeat(r)}</i>`;
const handCard=(k,attr,extra)=>{const id=k.id||k,d=CD[id];return `<button class="cc ${d.fx?'h-fx':d.terr?'h-terr':'h-'+(d.home==='coral'?'reef':d.home||(d.only?'sand':'free'))} ${extra||''}" ${attr||''}><span class="orb">${d.e}</span><span class="art">${svg(artOf(id).replace(/^<svg[^>]*>|<\/svg>$/g,''))}</span><b>${d.n}</b>${d.a!=null?`<span class="st"><i class="sa">${d.a}</i><i class="sh">${d.h}</i>${dots(d.r)}</span>`:'<span class="st"></span>'}</button>`};
function csay(t,bad){document.querySelectorAll('.ctoast').forEach(e=>e.remove());const d=document.createElement('div');d.className='ctoast'+(bad?' bad':'');d.textContent=t;document.body.appendChild(d);clearTimeout(ctT);ctT=setTimeout(()=>d.remove(),2000)}
const LHs=()=>104;
function laneHTML(L,l,r,ok,opt){const LH=opt&&opt.h||LHs();let h=`<div class="lane ln-${l}" data-l="${l}" style="height:${LH}px">`;
 for(let c=0;c<NC;c++){const x=L.cells[c],pol=c>=L.front;h+=`<button class="cell ${pol?'pol':''} ${ok&&ok.has(l+','+c)?'tgt':''}" data-l="${l}" data-c="${c}" style="left:${c/NC*100}%" aria-label="第${l+1}道第${c+1}格">${x.coral&&!pol?`<span class="cor ${x.lush?'lush':''}">${cart('coral')}</span>`:''}</button>`}
 r.U.forEach(u=>{const s=LH>120?54:42,on=cinfo===u.k.u,max=u.d.h;h+=`<button class="sp ${u.inr?'':'far'} ${on?'on':''} ${u.d.home&&!u.on?'dry':''}" data-u="${u.k.u}" style="left:calc(${(u.col+.5)/NC*100}% - ${s/2}px);top:${LH*.5-s/2-4}px;width:${s}px;height:${s}px"><span class="sw" style="--dx:${3+u.k.u%4}px;--dy:${2+u.k.u%3}px;animation-duration:${2.6+(u.k.u%7)*.45}s;animation-delay:-${(u.k.u%9)*.5}s">${cart(u.k.id)}</span><i class="sa ${u.a>u.d.a?'up':''}">${u.inr?u.a:0}</i><i class="sh ${u.k.hp<max?'hurt':''}">${u.k.hp}</i></button>`});
 if(L.front<NC)h+=`<div class="mass" style="left:${L.front/NC*100}%"></div><div class="duel ${r.win?'w':'l'}" style="left:${L.front/NC*100}%"><b class="pw">${r.power}</b><i>${r.win?'▶':'◀'}</i><b class="pp">${r.need}</b></div>${!r.win&&r.front?`<span class="dmg" style="left:${(r.front.col+.5)/NC*100}%">−${r.short}</span>`:''}`;
 else if(L.pol)h+='<div class="clear">✓</div>';return h+'</div>'}
function crender(){const st=LV[S.lv],sc=cgScore(S),k=csel!=null?S.hand[csel]:(cdrag&&cdrag.moved?S.hand[cdrag.i]:null);
 const ok=new Set(k&&S.energy>=CD[k.id].e?cgTargets(S,k.id).flatMap(t=>LANEFX.includes(CD[k.id].fx)?Array.from({length:S.lanes[t.l].front},(_,c)=>t.l+','+c):[t.l+','+t.c]):[]);
 $('mInfo').innerHTML=`<button id="cLvB" class="lvb">${S.lv+1}/${LV.length} ${st.n}</button> <span class="pips">${Array.from({length:st.turns},(_,i)=>`<i class="${i<S.turn-1?'d':i===S.turn-1?'c':''}"></i>`).join('')}</span>`;
 $('cScene').innerHTML=S.lanes.map((L,l)=>laneHTML(L,l,sc[l],ok)).join('');
 let tx='';if(cinfo){let u=null;sc.forEach(r=>r.U.forEach(x=>{if(x.k.u===cinfo)u=x}));if(u)tx=`<b>${u.d.n}</b><i>${u.d.lg}</i>${u.inr?'':'<br><u>它现在离污染太远，够不着。</u>'}${u.d.home&&!u.on?`<br><u>它不在自己的家（${u.d.home==='coral'?'珊瑚':u.d.home==='top'?'开阔水域':'沙地'}），每回合掉 1 血。</u>`:''}`}
 else if(csel!=null){const d=CD[S.hand[csel].id];tx=`<b>${d.n}</b><i>${d.lg}</i>${S.energy<d.e?`<br><u>能量不够：要 ${d.e} 点，还剩 ${S.energy} 点。</u>`:!cgTargets(S,S.hand[csel].id).length?'<br><u>现在没有能用它的地方。</u>':''}`}
 $('cText').innerHTML=tx;
 $('cOrbs').innerHTML=Array.from({length:cgEnergy(S.turn)},(_,i)=>`<i class="${i<S.energy?'on':''}"></i>`).join('');
 $('cDeck').textContent=S.deck.length;$('cDisP').textContent=S.dis.length;
 const n=S.hand.length;$('cHand').innerHTML=S.hand.map((c,i)=>{const d=CD[c.id],dead=S.energy<d.e||!cgTargets(S,c.id).length,rot=(i-(n-1)/2)*2.4;return handCard(c,`data-h="${i}" style="--r:${rot}deg;--y:${Math.abs(i-(n-1)/2)*5}px"`,(csel===i?'sel ':'')+(dead?'dead':''))}).join('');
 if(!$('cUndo').firstChild){$('cUndo').innerHTML=IC.undo;$('cDis').innerHTML='<span class="dk"><i></i><i></i></span><b>+2</b>'}
 $('cDis').disabled=S.energy<1||S.hand.length>=7||(!S.deck.length&&!S.dis.length);$('cUndo').disabled=!cundo.length;$('cEnd').classList.toggle('ready',S.energy<1||(!S.hand.some(c=>CD[c.id].e<=S.energy&&cgTargets(S,c.id).length)&&$('cDis').disabled))}
const cwait=ms=>new Promise(r=>setTimeout(r,window.__fast?0:ms));
const rectOf=el=>{const r=el.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]};
const spEl=u=>document.querySelector(`#cScene .sp[data-u="${u}"]`);
function pop(at,txt,cls){const f=document.createElement('span');f.className='pop '+(cls||'');f.textContent=txt;f.style.left=at[0]+'px';f.style.top=at[1]+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),window.__fast?0:800)}
function shoot(from,to,cls){const f=document.createElement('i');f.className='shot '+(cls||'');f.style.transform=`translate(${from[0]}px,${from[1]}px)`;document.body.appendChild(f);requestAnimationFrame(()=>requestAnimationFrame(()=>{f.style.transform=`translate(${to[0]}px,${to[1]}px)`}));setTimeout(()=>f.remove(),window.__fast?0:330)}
function dash(el,to,ms){if(!el||!el.animate||window.__fast)return;const a=rectOf(el);el.animate([{transform:'translate(0,0)'},{transform:`translate(${to[0]-a[0]}px,${to[1]-a[1]}px) scale(1.15)`,offset:.5},{transform:'translate(0,0)'}],{duration:ms||520,easing:'ease-in-out'})}
function chint(){document.querySelectorAll('.hand-hint').forEach(e=>e.remove())}
/* 回合结算：一条道一条道演 */
async function cend(){if(cbusy||S.over)return;cbusy=true;csel=null;cinfo=null;cundo=[];crender();document.querySelectorAll('.hand-hint').forEach(e=>e.remove());const sc=cgScore(S),ev=cgEnd(S);
 for(let l=0;l<sc.length;l++){const r=sc[l],e=ev.lanes[l];if(r.done)continue;const lane=document.querySelector(`#cScene .lane[data-l="${l}"]`),duel=lane.querySelector('.duel'),pw=duel.querySelector('.pw'),pp=duel.querySelector('.pp'),front=rectOf(duel),cw=lane.getBoundingClientRect().width/NC;
  lane.classList.add('act');pw.textContent='0';let need=r.need+r.eat;pp.textContent=need;await cwait(160);
  for(const u of r.U){if(!u.inr||!u.d.eat)continue;dash(spEl(u.k.u),front,520);await cwait(260);need-=u.d.eat;pp.textContent=Math.max(0,need);pp.classList.remove('hit');void pp.offsetWidth;pp.classList.add('hit');pop(front,'−'+u.d.eat,'eat');tone(180,.16,'square',.05);await cwait(280)}
  let run=0;for(const u of r.U){const el=spEl(u.k.u);if(!u.inr||!u.a)continue;if(el){el.classList.remove('pulse');void el.offsetWidth;el.classList.add('pulse');shoot(rectOf(el),front,u.a>u.d.a?'big':'')}await cwait(110);run+=u.a;pw.textContent=run;tone(392+Math.min(run,30)*18,.07,'triangle',.06)}
  if(r.sup){await cwait(120);run+=r.sup;pw.textContent=run;pop([front[0]-30,front[1]-22],'+'+r.sup,'x2');tone(700,.1,'triangle',.06)}
  await cwait(240);const mass=lane.querySelector('.mass');
  if(e.move>0){duel.classList.add('won');mass.style.transform=`translateX(${cw}px)`;duel.style.transform=`translateX(${cw}px)`;tone(330,.35,'sine',.1,880)}
  else{duel.classList.add('lost');if(e.hit){const fe=spEl(r.front.k.u);shoot(front,rectOf(fe),'bad');await cwait(220);fe.classList.add('hurt');pop(rectOf(fe),'−'+e.hit[1],'bad');SFX.eaten();lane.classList.add('shake');await cwait(260);if(e.dead.includes(r.front.col))fe.classList.add('die')}
   if(e.move<0){mass.style.transform=`translateX(${-cw}px)`;duel.style.transform=`translateX(${-cw}px)`;if(!e.hit){SFX.eaten();lane.classList.add('shake')}}}
  await cwait(420);
  r.U.forEach(u=>{const el=spEl(u.k.u);if(!el)return;if(e.wither.includes(u.col)){pop(rectOf(el),'−1','bad');el.classList.add('hurt');if(e.dead.includes(u.col)&&!(e.hit&&u.col===e.hit[0]))el.classList.add('die')}else if(e.heal.includes(u.col))pop(rectOf(el),'+♥','heal')});
  if(e.wither.length||e.heal.length)await cwait(420);lane.classList.remove('act')}
 if(S.over){await cwait(300);cbusy=false;cfinish();return}crender();cbusy=false;chint()}
function cfinish(){const st=LV[S.lv];if(S.over==='lose'){SFX.lose();ov(`<h1>${S.lanes.some(L=>L.front<=0)?'一条水道被污染占满了':'回合用完了'}</h1><p>紧挨污染的那个生物替大家挨打，选血厚的顶在前面。够不着污染的生物不出力，记得往前补。手牌不会自己来，留 1 点能量抽牌。</p><button class="go" data-cact="again">再试一次</button>`);return}
 SFX.win();const last=S.lv>=LV.length-1;ov(`<h1>${last?'整片礁净化完成':'净化完成'}</h1><button class="go" data-cact="${last?'again':'next'}">${last?'再玩一次':'下一关'}</button>`)}
function intro(){const st=LV[S.lv],fr=st.fresh.filter(id=>!cSeen[id]);if(!fr.length){chint();return}fr.forEach(id=>cSeen[id]=1);csave();ov(`<h1 style="font-size:20px">新的记忆卡</h1><div class="newc">${fr.map(id=>`<div>${handCard(id)}${demoHTML(id)}<p>${CD[id].lg}</p></div>`).join('')}</div><button class="go" data-cact="close">开始</button>`);demoRun()}
/* ---- 长按看效果：一小条水道，循环演示这张牌做什么 ---- */
const DEMO={
 coral:[{cor:[],cap:''},{cor:[2]},{cor:[2],tap:2},{cor:[1,2,3]},{cor:[1,2,3]}],
 clown:[{cor:[2],u:[[2,'clown',2,3]]},{cor:[2],u:[[2,'clown',4,3]],pop:[2,'+2']},{cor:[2],u:[[2,'clown',4,3],[1,'clown',2,3]]},{cor:[2],u:[[2,'clown',4,3],[1,'clown',2,2]],pop:[1,'−1♥'],bad:1},{cor:[2],u:[[2,'clown',4,3],[1,'clown',2,1]],pop:[1,'−1♥'],bad:1}],
 chromis:[{cor:[1,2],u:[[2,'chromis',2,2]]},{cor:[1,2],u:[[2,'chromis',3,2],[1,'chromis',3,2]],pop:[2,'+1']},{cor:[0,1,2],u:[[2,'chromis',4,2],[1,'chromis',4,2],[0,'chromis',4,2]],pop:[1,'+1']}],
 urchin:[{u:[[2,'urchin',1,6],[1,'clown',2,3]],P:5},{u:[[2,'urchin',1,3],[1,'clown',2,3]],P:5,pop:[2,'−3♥'],bad:1,hit:1},{u:[[2,'urchin',1,3],[1,'clown',2,3]],P:5}],
 turtle:[{u:[[2,'turtle',2,9]],P:6},{u:[[2,'turtle',2,5]],P:6,pop:[2,'−4♥'],bad:1,hit:1},{u:[[2,'turtle',2,5]],P:6}],
 butterfly:[{cor:[0],u:[[0,'butterfly',4,3]],P:3,rg:[0,3]},{cor:[0],u:[[0,'butterfly',4,3]],P:3,rg:[0,3],shot:0},{cor:[0],u:[[0,'butterfly',4,3]],P:3,front:4}],
 parrot:[{cor:[2],u:[[2,'parrot',2,4]],P:5},{cor:[2],u:[[2,'parrot',2,4]],P:3,pop:[3,'−2'],eat:1},{cor:[2],u:[[2,'parrot',2,4]],P:3}],
 cleaner:[{cor:[1],u:[[0,'urchin',1,2],[1,'cleaner',2,2],[2,'clown',2,1]]},{cor:[1],u:[[0,'urchin',1,4],[1,'cleaner',2,2],[2,'clown',2,3]],pop:[0,'+2♥'],pop2:[2,'+2♥']},{cor:[1],u:[[0,'urchin',1,4],[1,'cleaner',2,2],[2,'clown',2,3]]}],
 jack:[{u:[[0,'jack',2,3]],P:2,rg:[0,3]},{u:[[0,'jack',2,3]],P:2,rg:[0,3],shot:0,side:'+1'},{u:[[0,'jack',2,3]],P:2,front:4,side:'+1'}],
 shark:[{u:[[0,'shark',4,6]],P:4,rg:[0,3]},{u:[[0,'shark',4,6]],P:4,rg:[0,3],shot:0,side:'+2'},{u:[[0,'shark',4,6]],P:4,front:4,side:'+2'}],
 sardine:[{u:[[1,'sardine',2,2]],rg:[1,2]},{u:[[1,'sardine',3,2],[2,'sardine',3,2]],pop:[1,'+1']},{u:[[0,'sardine',4,2],[1,'sardine',4,2],[2,'sardine',4,2]],pop:[0,'+1']}],
 eel:[{u:[[2,'eel',3,2]]},{u:[[2,'eel',4,2],[1,'eel',4,2]],pop:[1,'+1']},{u:[[2,'eel',4,2],[1,'eel',4,2]]}],
 ray:[{u:[[2,'ray',4,5]],P:4},{u:[[2,'ray',4,5]],P:4,shot:2},{u:[[2,'ray',4,5]],P:4,front:4}],
 plankton:[{u:[[2,'clown',2,3]],en:3},{u:[[2,'clown',2,3]],en:5,pop:[2,'+2']},{u:[[2,'clown',2,3]],en:5}],
 zoox:[{cor:[2],u:[[2,'clown',4,3]]},{cor:[2],u:[[2,'clown',4,3]],tap:2},{cor:[2],lush:[2],u:[[2,'clown',5,3]],pop:[2,'+1']},{cor:[2],lush:[2],u:[[2,'clown',5,3]]}],
 cleanup:[{u:[[2,'urchin',1,6]],P:7},{u:[[2,'urchin',1,6]],P:7,tap:4},{u:[[2,'urchin',1,6]],P:4,pop:[3,'−3']},{u:[[2,'urchin',1,6]],P:4}],
 breed:[{cor:[1,2],u:[[2,'clown',4,3]]},{cor:[1,2],u:[[2,'clown',4,3]],tap:2},{cor:[1,2],u:[[2,'clown',4,3],[1,'clown',4,3]],pop:[1,'×2']},{cor:[1,2],u:[[2,'clown',4,3],[1,'clown',4,3]]}],
 flow:[{u:[[0,'clown',2,3],[1,'urchin',1,6]],front:5,far:1},{u:[[0,'clown',2,3],[1,'urchin',1,6]],front:5,far:1,flow:1},{u:[[3,'clown',2,3],[4,'urchin',1,6]],front:5},{u:[[3,'clown',2,3],[4,'urchin',1,6]],front:5}]};
function demoFrame(id,n){const F=DEMO[id],f=F[n%F.length],front=f.front||3;let h='';for(let c=0;c<NC;c++)h+=`<i class="cell ${c>=front?'pol':''} ${f.rg&&c>f.rg[0]&&c<=f.rg[0]+f.rg[1]?'rgc':''}" style="left:${c/NC*100}%">${f.cor&&f.cor.includes(c)?`<span class="cor ${f.lush&&f.lush.includes(c)?'lush':''}">${cart('coral')}</span>`:''}</i>`;
 (f.u||[]).forEach(([c,sp,a,hp])=>{h+=`<span class="sp ${f.far?'far':''}" style="left:calc(${(c+.5)/NC*100}% - 17px);top:10px;width:34px;height:34px"><span class="sw" style="--dx:2px;--dy:1px">${cart(sp)}</span><i class="sa">${a}</i><i class="sh">${hp}</i></span>`});
 h+=`<div class="mass" style="left:${front/NC*100}%"></div>${f.P?`<b class="dp" style="left:${front/NC*100}%">${f.P}</b>`:''}`;
 if(f.pop)h+=`<span class="dpop ${f.bad?'bad':''}" style="left:${(f.pop[0]+.5)/NC*100}%">${f.pop[1]}</span>`;if(f.pop2)h+=`<span class="dpop" style="left:${(f.pop2[0]+.5)/NC*100}%">${f.pop2[1]}</span>`;
 if(f.tap!=null)h+=`<span class="dtap" style="left:${(f.tap+.5)/NC*100}%">👆</span>`;if(f.shot!=null)h+=`<i class="dshot" style="left:${(f.shot+.5)/NC*100}%;--to:${(front-f.shot-.5)*100/NC*3.4}px"></i>`;if(f.side)h+=`<span class="dside">↕ ${f.side}</span>`;if(f.flow)h+='<span class="dflow">➜➜➜</span>';if(f.en)h+=`<span class="den">${'<i></i>'.repeat(f.en)}</span>`;
 return h}
const demoLn=id=>{const d=CD[id];return d.home==='top'?0:d.home==='sand'?2:1};
const demoHTML=id=>DEMO[id]?`<div class="demo lane ln-${demoLn(id)}" data-demo="${id}">${demoFrame(id,0)}</div>`:'';
let demoT=0;function demoRun(){clearInterval(demoT);let n=0;demoT=setInterval(()=>{const els=document.querySelectorAll('#ov .demo');if(!els.length||$('ov').hidden){clearInterval(demoT);return}n++;els.forEach(e=>{e.innerHTML=demoFrame(e.dataset.demo,n)})},950)}
function showCard(id){const d=CD[id];ov(`<div class="newc one"><div>${handCard(id)}${demoHTML(id)}<p>${d.lg}</p><p class="fa">${d.fact}</p></div></div>${d.a!=null?`<p class="leg"><i class="sa">${d.a}</i> 净化　<i class="sh">${d.h}</i> 血量　${dots(d.r)} ${d.r>=6?'整条道都够得着':'够得着 '+d.r+' 格'}</p>`:''}<button class="go" data-cact="close">知道了</button>`);demoRun()}
function cplay(i,l,c){const snap=JSON.stringify(S),id=S.hand[i]&&S.hand[i].id,u=S.hand[i]&&S.hand[i].u;if(cgPlay(S,i,l,c)){cundo.push(snap);csel=null;cinfo=null;SFX.place();crender();chint();const el=CD[id].terr||CD[id].fx?document.querySelector(`#cScene .cell[data-l="${l}"][data-c="${c}"]`):spEl(u);if(el){el.classList.add('drop');const r=rectOf(el);for(let n=0;n<5;n++){const b=document.createElement('i');b.className='bub2';b.style.left=r[0]+(Math.random()*30-15)+'px';b.style.top=r[1]+'px';b.style.animationDelay=n*.05+'s';document.body.appendChild(b);setTimeout(()=>b.remove(),900)}}return true}return false}
function cwhy(k,l,c){const d=CD[k.id];if(S.energy<d.e)return '能量不够：它要 '+d.e+' 点';if(l==null)return '拖到发亮的格子里';const L=S.lanes[l];if(!d.fx&&!laneOk(d,l))return d.terr?'珊瑚只能长在礁石上':d.n+'贴着海底生活，'+(d.only.length>1?'只能放在礁石或沙地':'只能放在沙地');if(c>=L.front)return '这格被污染占着';const x=L.cells[c];if(d.terr)return '这丛珊瑚两边已经长满了';if(d.fx==='zoox')return '虫黄藻要用在一格珊瑚上';if(d.fx==='flow')return '这条道上没有能冲的生物';if(d.fx==='cleanup')return '这条道没有污染';if(d.fx==='breed')return '繁殖要选一条在珊瑚上的珊瑚鱼，旁边还得有空格';return x.c?'这格已经有生物了':'放不了'}
document.addEventListener('pointerdown',e=>{if(mode!=='cg'||cbusy||!S||S.over)return;const c=e.target.closest('#cHand .cc');if(!c)return;document.querySelectorAll('.hand-hint').forEach(x=>x.remove());cdrag={i:+c.dataset.h,x0:e.clientX,y0:e.clientY,moved:false,ghost:null,pid:e.pointerId,long:false};try{c.setPointerCapture(e.pointerId)}catch(_){}
 clearTimeout(lpT);const i=cdrag.i;lpT=setTimeout(()=>{if(cdrag&&!cdrag.moved&&cdrag.i===i){cdrag.long=true;const id=S.hand[i].id;cdrag=null;showCard(id)}},480)});
const cellAt=(x,y)=>{const u=document.elementsFromPoint(x,y).find(n=>n.classList&&n.classList.contains('cell')&&n.closest('#cScene'));return u?{l:+u.dataset.l,c:+u.dataset.c,el:u}:null};
document.addEventListener('pointermove',e=>{if(!cdrag||e.pointerId!==cdrag.pid)return;if(!cdrag.moved){if(Math.hypot(e.clientX-cdrag.x0,e.clientY-cdrag.y0)<9)return;cdrag.moved=true;clearTimeout(lpT);csel=null;cinfo=null;const src=document.querySelector(`#cHand .cc[data-h="${cdrag.i}"]`),g=src.cloneNode(true);g.classList.add('ghost');g.classList.remove('sel','dead');g.removeAttribute('data-h');g.style.cssText='';document.body.appendChild(g);cdrag.ghost=g;crender();const s2=document.querySelector(`#cHand .cc[data-h="${cdrag.i}"]`);if(s2)s2.classList.add('lift')}
 cdrag.ghost.style.transform=`translate(${e.clientX-37}px,${e.clientY-100}px) rotate(${Math.max(-8,Math.min(8,(e.clientX-cdrag.x0)*.05))}deg) scale(.85)`;
 document.querySelectorAll('.cell.over').forEach(x=>x.classList.remove('over'));const t=cellAt(e.clientX,e.clientY-56);if(t&&t.el.classList.contains('tgt'))t.el.classList.add('over');e.preventDefault()},{passive:false});
function cdrop(e){clearTimeout(lpT);if(!cdrag||e.pointerId!==cdrag.pid)return;const d=cdrag;cdrag=null;if(d.ghost)d.ghost.remove();
 if(!d.moved){csel=csel===d.i?null:d.i;cinfo=null;crender();return}
 const k=S.hand[d.i],r=$('cScene').getBoundingClientRect();if(e.clientY-56>r.bottom+20){crender();chint();return}
 const t=cellAt(e.clientX,e.clientY-56);if(t&&cplay(d.i,t.l,t.c))return;
 csay(cwhy(k,t?t.l:null,t?t.c:null),1);tone(140,.12,'square',.04);csel=d.i;crender()}
document.addEventListener('pointerup',cdrop);document.addEventListener('pointercancel',e=>{clearTimeout(lpT);if(cdrag&&e.pointerId===cdrag.pid){if(cdrag.ghost)cdrag.ghost.remove();cdrag=null;crender()}});
document.addEventListener('contextmenu',e=>{if(e.target.closest&&e.target.closest('#cHand'))e.preventDefault()});
function cstart(lv){cLv=lv;csave();S=cgInit(lv);csel=cinfo=null;cundo=[];$('ov').hidden=true;crender();intro()}
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const d=t.dataset;
 if(t.id==='mA'||t.id==='mB'){mode=t.id==='mA'?'cg':'td';$('mA').className=mode==='cg'?'on':'';$('mB').className=mode==='td'?'on':'';$('mCG').hidden=mode!=='cg';$('mTD').hidden=mode!=='td';$('ov').hidden=true;document.querySelectorAll('.hand-hint').forEach(x=>x.remove());try{localStorage.setItem('reefMode',mode)}catch(e){}
  if(mode==='td'){$('mInfo').textContent='';if(!tdStarted){tdStarted=true;start()}}else{crender();chint()}return}
 if(mode!=='cg')return;
 if(d.cact==='close'){$('ov').hidden=true;clearInterval(demoT);chint();return}
 if(d.cact==='again'){cstart(S.lv);return}
 if(d.cact==='next'){cstart(Math.min(LV.length-1,S.lv+1));return}
 if(d.golv!=null){cstart(+d.golv);return}
 if(t.id==='cLvB'){ov(`<h1 style="font-size:20px">选关</h1><div class="lvs">${LV.map((l,i)=>`<button class="go ${i===S.lv?'':'alt'}" data-golv="${i}">${i+1}　${l.n}</button>`).join('')}</div><button class="go alt" data-cact="close">返回</button>`);return}
 if(cbusy||S.over)return;
 if(t.id==='cUndo'){if(cundo.length){S=JSON.parse(cundo.pop());csel=cinfo=null;crender()}return}
 if(t.id==='cDis'){const n0=S.hand.length;if(cgDrawAct(S)){csel=null;cundo=[];SFX.sun();crender();document.querySelectorAll('#cHand .cc').forEach((c,i)=>{if(i>=n0)c.classList.add('drop')})}return}
 if(t.id==='cEnd'){cend();return}
 if(d.u&&t.closest('#cScene')){const u=+d.u;if(csel!=null){const el=t.getBoundingClientRect(),q=cellAt(el.left+el.width/2,el.top+el.height/2);if(q&&cplay(csel,q.l,q.c))return}csel=null;cinfo=cinfo===u?null:u;crender();return}
 if(d.c!=null&&d.l!=null&&t.closest('#cScene')){const l=+d.l,c=+d.c;if(csel!=null){const k=S.hand[csel];if(cplay(csel,l,c))return;csay(cwhy(k,l,c),1);tone(140,.12,'square',.04)}else if(cinfo){cinfo=null;crender()}}});
cstart(cLv);
try{if(localStorage.getItem('reefMode')==='td')$('mB').click()}catch(e){}
