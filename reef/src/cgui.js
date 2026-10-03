/* ---------- 牌局界面 v6：你指挥生物打敌人 ---------- */
mode='cg';let S,csel=null,cact=null,cinfo=null,cbusy=false,ctT=0,tdStarted=false,cdrag=null,cLv=0,cExtra=[],cSeen={},lpT=0;
try{const s=JSON.parse(localStorage.getItem('reefCG6')||'{}');if(s.lv)cLv=Math.min(LV.length-1,s.lv);if(s.seen)cSeen=s.seen;if(s.extra)cExtra=s.extra}catch(e){}
const csave=()=>{try{localStorage.setItem('reefCG6',JSON.stringify({lv:cLv,seen:cSeen,extra:cExtra}))}catch(e){}};
const cart=id=>CD[id].art?svg(P[CD[id].art]()):'';
const FXART={plankton:'<g fill="#e9fbff"><circle cx="28" cy="34" r="7"/><circle cx="62" cy="26" r="5"/><circle cx="74" cy="58" r="8"/><circle cx="40" cy="66" r="6"/><circle cx="52" cy="46" r="4"/><circle cx="22" cy="62" r="4"/></g>',
 zoox:'<circle cx="50" cy="50" r="30" fill="#f2c14e"/><g stroke="#f2c14e" stroke-width="6" stroke-linecap="round"><path d="M50 6 V16 M50 84 V94 M6 50 H16 M84 50 H94 M19 19 l7 7 M74 74 l7 7 M81 19 l-7 7 M26 74 l-7 7"/></g><circle cx="42" cy="44" r="7" fill="#a9d94a"/><circle cx="58" cy="56" r="8" fill="#8fc43a"/>',
 cleanup:'<path d="M30 34 H70 L64 88 H36Z" fill="#fff"/><path d="M24 30 H76" stroke="#fff" stroke-width="8" stroke-linecap="round"/><path d="M42 22 H58" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M43 46 V76 M57 46 V76" stroke="#7b6ad0" stroke-width="5" stroke-linecap="round"/>'};
const FART={algae:()=>ALG(false),cots:()=>P.cots(),net:()=>'<g fill="none" stroke="#c9d3d6" stroke-width="3.5"><path d="M14 20 Q50 6 86 20 Q94 50 86 80 Q50 94 14 80 Q6 50 14 20Z"/><path d="M14 20 L86 80 M86 20 L14 80 M50 8 V92 M8 50 H92 M30 13 L70 87 M70 13 L30 87"/></g><circle cx="50" cy="50" r="46" fill="rgba(180,200,205,.12)"/><circle cx="38" cy="44" r="7" fill="#fff"/><circle cx="36" cy="45" r="3.2" fill="#111"/><circle cx="62" cy="44" r="7" fill="#fff"/><circle cx="60" cy="45" r="3.2" fill="#111"/><path d="M30 34 L44 39 M70 34 L56 39" stroke="#2a3338" stroke-width="4" stroke-linecap="round"/>'};
const II={atk:'<svg viewBox="0 0 24 24"><path d="M4 20 L14 10 M12 6 L18 12 M16 4 L20 8 L18 10 L14 6Z M4 20 L7 20 L7 17" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 net:'<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12 H21 M12 3 V21 M6 6 L18 18 M18 6 L6 18"/></g></svg>',
 eat:'<svg viewBox="0 0 24 24"><path d="M12 21 V12 M12 12 L7 6 M12 12 L17 6 M12 15 L8 12 M12 15 L16 12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M3 4 L21 20" stroke="#ff7a59" stroke-width="3" stroke-linecap="round"/></svg>',
 heart:'<svg viewBox="0 0 24 24"><path d="M12 21 C4 15 2 11 2 7.5 A5 5 0 0 1 12 6 A5 5 0 0 1 22 7.5 C22 11 20 15 12 21Z" fill="currentColor"/></svg>'};
const handCard=(k,attr,extra)=>{const id=k.id||k,d=CD[id];return `<button class="cc ${d.fx?'h-fx':d.terr?'h-terr':d.home?'h-reef':'h-free'} ${extra||''}" ${attr||''}><span class="orb">${d.e}</span><span class="art">${svg(d.fx?FXART[d.fx]:P[d.art]())}</span><b>${d.n}</b>${d.a!=null?`<span class="st"><i class="sa">${d.clean?'+':d.a}</i><i class="sh">${d.h}</i></span>`:'<span class="st"></span>'}</button>`};
function csay(t,bad){document.querySelectorAll('.ctoast').forEach(e=>e.remove());const d=document.createElement('div');d.className='ctoast'+(bad?' bad':'');d.textContent=t;document.body.appendChild(d);clearTimeout(ctT);ctT=setTimeout(()=>d.remove(),2000)}
const FY=[20,50,80];
function crender(){const st=LV[S.lv],k=csel!=null?S.hand[csel]:(cdrag&&cdrag.moved?S.hand[cdrag.i]:null),T=k&&S.energy>=CD[k.id].e?cgTargets(S,k.id):[],okc=new Set(T.filter(t=>t.cell!=null).map(t=>t.cell)),okf=new Set(T.filter(t=>t.foe!=null).map(t=>t.foe)),any=T.some(t=>t.any),fc=frontCell(S);
 const actor=cact!=null&&cgCanAct(S,cact)?S.cells[cact].c:null,cleanMode=actor&&CD[actor.id].clean;
 $('mInfo').innerHTML=`<button id="cLvB" class="lvb">${S.lv+1}/${LV.length} ${st.n}</button>`;
 let h=`<div class="zone z-top"></div><div class="zone z-reef"><div class="heartb" id="cHeart"><span>${II.heart}</span><b>${S.heart}</b></div>`;
 for(let c=0;c<NS;c++){const x=S.cells[c],u=x.c;h+=`<button class="slot ${okc.has(c)?'tgt':''} ${cleanMode&&u&&c!==cact?'ally':''}" data-cell="${c}" style="left:${10+c*15.5}%" aria-label="礁石第${c+1}格">${x.coral?`<span class="cor ${x.lush?'lush':''}">${cart('coral')}</span>`:''}`;
   if(u){const d=CD[u.id],a=atkOf(S,c),can=cgCanAct(S,c)&&!S.over;h+=`<span class="cr ${can?'rdy':''} ${cact===c?'act':''} ${u.net?'netted':''} ${d.home&&!x.coral?'dry':''}" data-u="${u.u}"><span class="sw" style="animation-duration:${2.6+(u.u%7)*.45}s;animation-delay:-${(u.u%9)*.5}s">${cart(u.id)}</span>${u.net?`<span class="nt">${II.net}</span>`:''}<i class="sa ${a>d.a?'up':''}">${d.clean?'+':a}</i><i class="sh ${u.hp<d.h?'hurt':''}">${u.hp}</i>${c===fc?'<i class="fr"></i>':''}</span>`}
   h+='</button>'}
 h+='</div><div class="zone z-sand"></div>';
 S.foes.forEach((f,i)=>{const it=intent(f),F=FOE[f.id];h+=`<button class="foe ${actor&&!cleanMode?'tg':''} ${okf.has(i)?'tgt':''} ${cinfo==='f'+f.u?'on':''}" data-foe="${i}" data-fu="${f.u}" style="top:${FY[i]}%"><span class="it i-${it[0]}">${II[it[0]]}${it[1]?`<b>${it[1]}</b>`:''}</span><span class="fa">${svg(FART[f.id]())}</span><span class="hpb"><i style="width:${f.hp/F.h*100}%"></i><b>${f.hp}</b></span></button>`});
 if(S.queue.length)h+=`<div class="incoming">+${S.queue.length}</div>`;
 if(any)h+='<button class="anyt" data-any="1" aria-label="使用"></button>';
 $('cScene').innerHTML=h;
 let tx='';if(csel!=null){const d=CD[S.hand[csel].id];tx=`<b>${d.n}</b><i>${d.lg}</i>${S.energy<d.e?`<br><u>能量不够：要 ${d.e} 点。</u>`:!T.length?'<br><u>现在没有能用它的地方。</u>':''}`}
 else if(actor)tx=cleanMode?`<b>${CD[actor.id].n}</b><i>点一个同伴：回 2 血、解网，并让它再行动一次。</i>`:`<b>${CD[actor.id].n}</b><i>点一个敌人，打它 ${atkOf(S,cact)} 点。</i>`;
 else if(cinfo&&String(cinfo)[0]==='f'){const f=S.foes.find(x=>'f'+x.u===cinfo);if(f)tx=`<b>${FOE[f.id].n}</b><i>${FOE[f.id].lg}</i>`}
 else if(cinfo!=null&&S.cells[cinfo]&&S.cells[cinfo].c){const u=S.cells[cinfo].c,d=CD[u.id];tx=`<b>${d.n}</b><i>${d.lg}</i>${u.net?'<br><u>被渔网缠住了，这回合动不了。</u>':!u.ready?'<br><u>这回合已经行动过了。</u>':''}`}
 if(!tx&&S.lv===0&&!S.over){const hasCr=S.cells.some(x=>x.c),playable=S.hand.some(c=>CD[c.id].e<=S.energy&&cgTargets(S,c.id).length);
  tx='<em class="coach">'+(!hasCr&&playable?'把牌拖到礁石上':playable?'还能放牌':cgCanDraw()?'能量还有剩：点牌堆抽 2 张':'结束回合，鱼会自己出手')+'</em>'}
 $('cText').innerHTML=tx;
 $('cOrbs').innerHTML=Array.from({length:Math.max(3,S.energy)},(_,i)=>`<i class="${i<S.energy?'on':''}"></i>`).join('');
 $('cDeck').textContent=S.deck.length;$('cDisP').textContent=S.dis.length;
 const n=S.hand.length;$('cHand').innerHTML=S.hand.map((c,i)=>{const d=CD[c.id],dead=S.energy<d.e||!cgTargets(S,c.id).length,rot=(i-(n-1)/2)*2.4;return handCard(c,`data-h="${i}" style="--r:${rot}deg;--y:${Math.abs(i-(n-1)/2)*5}px"`,(csel===i?'sel ':'')+(dead?'dead':''))}).join('');
 if(!$('cDis').firstChild)$('cDis').innerHTML='<span class="dk"><i></i><i></i></span><b>+2</b>';
 $('cUndo').hidden=true;$('cDis').disabled=S.energy<1||S.hand.length>=7||(!S.deck.length&&!S.dis.length);
 const canAct=ccanAct();
 $('cEnd').classList.toggle('ready',!S.hand.some(c=>CD[c.id].e<=S.energy&&cgTargets(S,c.id).length))}
const cgCanDraw=()=>!(S.energy<1||S.hand.length>=7||(!S.deck.length&&!S.dis.length));
const ccanAct=()=>S.cells.some((x,c)=>cgCanAct(S,c)&&(CD[x.c.id].clean?S.cells.some((y,q)=>q!==c&&y.c):S.foes.length));let cwarnT=-1;
const cwait=ms=>new Promise(r=>setTimeout(r,window.__fast?0:ms));
const rectOf=el=>{const r=el.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]};
const crEl=u=>document.querySelector(`#cScene .cr[data-u="${u}"]`),foeEl=u=>document.querySelector(`#cScene .foe[data-fu="${u}"]`);
function pop(at,txt,cls){const f=document.createElement('span');f.className='pop '+(cls||'');f.textContent=txt;f.style.left=at[0]+'px';f.style.top=at[1]+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),window.__fast?0:800)}
function burst(at,n,cls){for(let i=0;i<(n||8);i++){const b=document.createElement('i');b.className='bt '+(cls||'');b.style.left=at[0]+'px';b.style.top=at[1]+'px';const a=Math.random()*6.28,r=24+Math.random()*30;b.style.setProperty('--dx',Math.cos(a)*r+'px');b.style.setProperty('--dy',Math.sin(a)*r+'px');document.body.appendChild(b);setTimeout(()=>b.remove(),600)}}
function flyTo(from,toEl,cls){const to=rectOf(toEl),f=document.createElement('i');f.className='drop2 '+cls;f.style.transform=`translate(${from[0]}px,${from[1]}px)`;document.body.appendChild(f);requestAnimationFrame(()=>requestAnimationFrame(()=>{f.style.transform=`translate(${to[0]}px,${to[1]}px) scale(.7)`}));setTimeout(()=>{f.remove();toEl.classList.remove('bump');void toEl.offsetWidth;toEl.classList.add('bump')},window.__fast?0:520)}
function lunge(el,to,ms){if(!el||!el.animate||window.__fast)return;const a=rectOf(el);el.animate([{transform:'translate(0,0)'},{transform:`translate(${(to[0]-a[0])*.8}px,${(to[1]-a[1])*.8}px) scale(1.15)`,offset:.45},{transform:'translate(0,0)'}],{duration:ms||380,easing:'ease-in-out'})}
function shake(el){el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake')}
/* 生物出手 */
async function doAttack(c,fi){if(cbusy)return;const f=S.foes[fi],u=S.cells[c].c,fe=foeEl(f.u),ce=crEl(u.u),fr=rectOf(fe),n0=S.drops.length;cbusy=true;lunge(ce,fr);await cwait(170);
 const r=cgAttack(S,c,fi);if(!r){cbusy=false;return}fe.classList.add('hit');pop(fr,'−'+r.dmg,'dmg');tone(r.dmg>=5?150:220,.12,'square',.06);burst(fr,r.dmg>=5?10:5,'g');
 if(r.dmg>=5)shake($('cScene'));
 if(r.dead){await cwait(120);fe.classList.add('dying');burst(fr,14,'g');SFX.die();for(const d of S.drops.slice(n0)){await cwait(90);flyTo(fr,d.drop==='energy'?$('cOrbs'):$('cDeck'),d.drop==='energy'?'en':'cd');tone(d.drop==='energy'?880:660,.12,'sine',.08)}S.drops.length=0;await cwait(330)}else await cwait(200);
 cact=null;cbusy=false;crender();if(S.over)cfinish()}
async function doClean(c,c2){if(cbusy)return;const a=crEl(S.cells[c].c.u),b=crEl(S.cells[c2].c.u);cbusy=true;lunge(a,rectOf(b));await cwait(200);if(cgClean(S,c,c2)){pop(rectOf(b),'+2♥','heal');burst(rectOf(b),8,'w');tone(990,.15,'triangle',.08)}await cwait(260);cact=null;cbusy=false;crender()}
/* 敌人的回合：一个个演 */
async function cend(){if(cbusy||S.over)return;csel=null;cact=null;cinfo=null;$('cEnd').disabled=true;let au,g=0;while((au=cgAutoNext(S))&&g++<40){if(au.atk)await doAttack(...au.atk);else await doClean(...au.clean)}$('cEnd').disabled=false;if(S.over)return;cbusy=true;crender();const pre=S.foes.map(f=>f.u),preCells=S.cells.map(x=>x.c&&x.c.u),ev=cgEnd(S),heartEl=$('cHeart');let heart=+heartEl.querySelector('b').textContent;
 for(const e of ev){const fe=e.u&&foeEl(e.u);
  if(e.t==='atk'){const ce=crEl(preCells[e.cell]);lunge(fe,rectOf(ce));await cwait(190);ce.classList.add('hurt');pop(rectOf(ce),'−'+e.dmg,'bad');SFX.eaten();shake($('cScene'));if(e.thorn){await cwait(120);pop(rectOf(fe),'−'+e.thorn,'dmg');fe.classList.add('hit');if(e.fdead){fe.classList.add('dying');burst(rectOf(fe),10,'g')}}if(e.dead){await cwait(150);ce.classList.add('die')}
   if(e.over){await cwait(150);heart-=e.over;heartEl.querySelector('b').textContent=Math.max(0,heart);shake(heartEl);pop(rectOf(heartEl),'−'+e.over,'bad')}await cwait(380)}
  else if(e.t==='heart'){lunge(fe,rectOf(heartEl));await cwait(200);heart-=e.dmg;heartEl.querySelector('b').textContent=Math.max(0,heart);shake(heartEl);shake($('cScene'));pop(rectOf(heartEl),'−'+e.dmg,'bad');SFX.eaten();await cwait(380)}
  else if(e.t==='net'){const ce=crEl(preCells[e.cell]);lunge(fe,rectOf(ce));await cwait(220);ce.classList.add('netted');ce.insertAdjacentHTML('beforeend',`<span class="nt">${II.net}</span>`);tone(300,.25,'sawtooth',.05,120);await cwait(360)}
  else if(e.t==='eat'){const sl=document.querySelector(`#cScene .slot[data-cell="${e.cell}"] .cor`);lunge(fe,rectOf(sl||heartEl));await cwait(220);if(sl){burst(rectOf(sl),10,'c');sl.classList.add('eaten')}tone(140,.3,'sawtooth',.07,60);await cwait(380)}
  else if(e.t==='heal'||e.t==='dry'){const ce=crEl(preCells[e.cell]);if(ce){pop(rectOf(ce),e.t==='heal'?'+♥':'−1',e.t==='heal'?'heal':'bad');if(e.dead)ce.classList.add('die')}}
  else if(e.t==='spawn'){await cwait(250);crender();e.us.forEach(u=>{const el=foeEl(u);if(el)el.classList.add('enter')});tone(196,.3,'sawtooth',.06);await cwait(350)}
  if(S.over==='lose'&&heart<=0)break}
 await cwait(250);cbusy=false;crender();if(S.over)cfinish()}
function cfinish(){const st=LV[S.lv];if(S.over==='lose'){SFX.lose();ov(`<h1>礁心被污染吞没了</h1><p>看敌人头上的图标：它下回合要打前排、撒网，还是吃珊瑚。先打掉最危险的那个。</p><button class="go" data-cact="again">再试一次</button>`);return}
 SFX.win();const last=S.lv>=LV.length-1,offer=cshuf(POOL.slice()).filter((v,i,a)=>a.indexOf(v)===i).slice(0,3);cfinish.offer=offer;cfinish.pick=null;
 ov(`<h1>${last?'这片礁净化完成':'净化完成'}</h1><p style="text-align:center">选 1 张记忆卡加入你的牌组。</p><div class="offer">${offer.map((k,i)=>handCard(k,`data-pick="${i}"`)).join('')}</div><p id="cPickInfo" style="font-size:13px;color:var(--dim);min-height:60px">点一张看说明，再点一次确认。</p>`)}
function intro(){const st=LV[S.lv],fr=st.fresh.filter(id=>!cSeen[id]),ff=st.foes.filter(id=>!cSeen['f_'+id]);if(!fr.length&&!ff.length)return;fr.forEach(id=>cSeen[id]=1);ff.forEach(id=>cSeen['f_'+id]=1);csave();
 ov(`${ff.length?`<h1 style="font-size:19px">新的敌人</h1><div class="newc">${ff.map(id=>`<div><span class="foepic">${svg(FART[id]())}</span><p><b>${FOE[id].n}</b>　${FOE[id].lg}</p></div>`).join('')}</div>`:''}${fr.length?`<h1 style="font-size:19px;margin-top:12px">新的记忆卡</h1><div class="newc">${fr.map(id=>`<div>${handCard(id)}<p>${CD[id].lg}</p></div>`).join('')}</div>`:''}<button class="go" data-cact="close">开始</button>`)}
function showCard(id){const d=CD[id];ov(`<div class="newc one"><div>${handCard(id)}<p>${d.lg}</p><p class="fa">${d.fact}</p></div></div>${d.a!=null?`<p class="leg"><i class="sa">${d.clean?'+':d.a}</i> ${d.clean?'清洁同伴':'净化（打敌人的伤害）'}　<i class="sh">${d.h}</i> 血量</p>`:''}<button class="go" data-cact="close">知道了</button>`)}
function cplay(i,t){const u=S.hand[i]&&S.hand[i].u,id=S.hand[i]&&S.hand[i].id,fr=t&&t.foe!=null&&foeEl(S.foes[t.foe].u)?rectOf(foeEl(S.foes[t.foe].u)):null,n0=S.drops.length;if(cgPlay(S,i,t)){csel=null;cinfo=null;SFX.place();if(fr){pop(fr,'−3','dmg');burst(fr,8,'g');S.drops.slice(n0).forEach(d=>flyTo(fr,d.drop==='energy'?$('cOrbs'):$('cDeck'),d.drop==='energy'?'en':'cd'))}S.drops.length=0;crender();const el=t&&t.cell!=null?(crEl(u)||document.querySelector(`#cScene .slot[data-cell="${t.cell}"]`)):$('cOrbs');if(el)el.classList.add(el.id==='cOrbs'?'bump':'drop');if(S.over)cfinish();return true}return false}
function cwhy(k,t){const d=CD[k.id];if(S.energy<d.e)return '能量不够：它要 '+d.e+' 点';if(d.fx==='cleanup')return '净滩要拖到一个敌人身上';if(!t||t.cell==null)return d.terr?'珊瑚只能长在礁石上':'拖到礁石上的空位';const x=S.cells[t.cell];if(d.terr)return '这丛珊瑚两边已经长满了';if(d.fx==='zoox')return '虫黄藻要用在一格珊瑚上';return x.c?'这格已经有生物了':'放不了'}
const targetAt=(x,y)=>{for(const n of document.elementsFromPoint(x,y)){if(!n.closest||!n.closest('#cScene'))continue;const f=n.closest('.foe');if(f)return {foe:+f.dataset.foe};const s=n.closest('.slot');if(s)return {cell:+s.dataset.cell};}const r=$('cScene').getBoundingClientRect();return x>r.left&&x<r.right&&y>r.top&&y<r.bottom?{any:1}:null};
document.addEventListener('pointerdown',e=>{if(mode!=='cg'||cbusy||!S||S.over)return;const c=e.target.closest('#cHand .cc');if(!c)return;cdrag={i:+c.dataset.h,x0:e.clientX,y0:e.clientY,moved:false,ghost:null,pid:e.pointerId};try{c.setPointerCapture(e.pointerId)}catch(_){}
 clearTimeout(lpT);const i=cdrag.i;lpT=setTimeout(()=>{if(cdrag&&!cdrag.moved&&cdrag.i===i){const id=S.hand[i].id;cdrag=null;showCard(id)}},480)});
document.addEventListener('pointermove',e=>{if(!cdrag||e.pointerId!==cdrag.pid)return;if(!cdrag.moved){if(Math.hypot(e.clientX-cdrag.x0,e.clientY-cdrag.y0)<9)return;cdrag.moved=true;clearTimeout(lpT);csel=null;cact=null;cinfo=null;const src=document.querySelector(`#cHand .cc[data-h="${cdrag.i}"]`),g=src.cloneNode(true);g.classList.add('ghost');g.classList.remove('sel','dead');g.removeAttribute('data-h');g.style.cssText='';document.body.appendChild(g);cdrag.ghost=g;crender();const s2=document.querySelector(`#cHand .cc[data-h="${cdrag.i}"]`);if(s2)s2.classList.add('lift')}
 cdrag.ghost.style.transform=`translate(${e.clientX-37}px,${e.clientY-100}px) rotate(${Math.max(-8,Math.min(8,(e.clientX-cdrag.x0)*.05))}deg) scale(.85)`;e.preventDefault()},{passive:false});
function cdrop(e){clearTimeout(lpT);if(!cdrag||e.pointerId!==cdrag.pid)return;const d=cdrag;cdrag=null;if(d.ghost)d.ghost.remove();
 if(!d.moved){csel=csel===d.i?null:d.i;cact=null;cinfo=null;crender();return}
 const k=S.hand[d.i],t=targetAt(e.clientX,e.clientY-56);if(!t){crender();return}
 if(CD[k.id].fx==='plankton'){if(!cplay(d.i,{any:1})){csay('能量不够',1);crender()}return}
 if(cplay(d.i,t))return;csay(cwhy(k,t),1);tone(140,.12,'square',.04);csel=d.i;crender()}
document.addEventListener('pointerup',cdrop);document.addEventListener('pointercancel',e=>{clearTimeout(lpT);if(cdrag&&e.pointerId===cdrag.pid){if(cdrag.ghost)cdrag.ghost.remove();cdrag=null;crender()}});
document.addEventListener('contextmenu',e=>{if(e.target.closest&&e.target.closest('#cHand'))e.preventDefault()});
function cstart(lv){cwarnT=-1;cLv=lv;if(lv===0)cExtra=[];csave();S=cgInit(lv,cExtra);csel=cact=cinfo=null;$('ov').hidden=true;crender();intro()}
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const d=t.dataset;
 if(t.id==='mA'||t.id==='mB'){mode=t.id==='mA'?'cg':'td';$('mA').className=mode==='cg'?'on':'';$('mB').className=mode==='td'?'on':'';$('mCG').hidden=mode!=='cg';$('mTD').hidden=mode!=='td';$('ov').hidden=true;try{localStorage.setItem('reefMode',mode)}catch(e){}
  if(mode==='td'){$('mInfo').textContent='';if(!tdStarted){tdStarted=true;start()}}else crender();return}
 if(mode!=='cg')return;
 if(d.cact==='close'){$('ov').hidden=true;return}
 if(d.cact==='again'){cstart(S.lv);return}
 if(d.golv!=null){cstart(+d.golv);return}
 if(d.pick!=null&&t.closest('#ov')){const i=+d.pick,offer=cfinish.offer;if(cfinish.pick===i){cExtra.push(offer[i]);cstart(S.lv>=LV.length-1?0:S.lv+1)}else{cfinish.pick=i;const dd=CD[offer[i]];document.querySelectorAll('.offer .cc').forEach((c,j)=>c.classList.toggle('sel',j===i));$('cPickInfo').innerHTML=`<b style="color:var(--ink)">${dd.n}</b>　${dd.lg}<br>再点一次确认。`}return}
 if(t.id==='cLvB'){ov(`<h1 style="font-size:20px">选关</h1><div class="lvs">${LV.map((l,i)=>`<button class="go ${i===S.lv?'':'alt'}" data-golv="${i}">${i+1}　${l.n}</button>`).join('')}</div><button class="go alt" data-cact="close">返回</button>`);return}
 if(cbusy||S.over)return;
 if(t.id==='cDis'){const n0=S.hand.length;if(cgDrawAct(S)){csel=null;SFX.sun();crender();document.querySelectorAll('#cHand .cc').forEach((c,i)=>{if(i>=n0)c.classList.add('drop')})}return}
 if(t.id==='cEnd'){cend();return}
 if(d.any&&csel!=null){if(!cplay(csel,{any:1}))csay('能量不够',1);return}
 if(d.foe!=null){const fi=+d.foe;if(csel!=null){if(!cplay(csel,{foe:fi})){csay(cwhy(S.hand[csel],{foe:fi}),1)}return}
  if(cact!=null&&cgCanAct(S,cact)&&!CD[S.cells[cact].c.id].clean){doAttack(cact,fi);return}cact=null;const key='f'+S.foes[fi].u;cinfo=cinfo===key?null:key;crender();return}
 if(d.cell!=null){const c=+d.cell,x=S.cells[c];if(csel!=null){if(cplay(csel,{cell:c}))return;csay(cwhy(S.hand[csel],{cell:c}),1);tone(140,.12,'square',.04);return}
  if(cact!=null&&cact!==c&&cgCanAct(S,cact)&&CD[S.cells[cact].c.id].clean&&x.c){doClean(cact,c);return}
  if(x.c){if(cgCanAct(S,c)){cact=cact===c?null:c;cinfo=null}else{cact=null;cinfo=cinfo===c?null:c;if(x.c.net)csay('它被渔网缠住了，这回合动不了',1)}crender()}return}});
cstart(cLv);
try{if(localStorage.getItem('reefMode')==='td')$('mB').click()}catch(e){}
