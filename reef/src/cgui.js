/* ---------- 牌局界面：牌桌版 ---------- */
let mode='cg',S,csel=null,cinfo=null,cbusy=false,ctT=0,tdStarted=false,cdrag=null,cpick=null,cundo=[];
const cart=id=>CD[id].art?svg(P[CD[id].art]()):'';
const ROWS=[['blue','蓝水'],['bare','礁石'],['sand','沙地']];
const hcls=d=>d.fx?'fx':d.hab?'hab':d.home;
const handCard=(k,attr,extra)=>{const d=CD[k.id||k];return `<button class="cc h-${hcls(d)} ${extra||''}" ${attr||''}><span class="orb">${d.e}</span>${d.fx?'':`<span class="pv">${d.p}</span>`}<span class="art">${cart(k.id||k)}</span><b>${d.n}</b><small>${d.tx}</small><em>${d.fx?'效果牌':d.hab?'种在荒礁':HOMEN[d.home]}</em></button>`};
function csay(t,bad){document.querySelectorAll('.ctoast').forEach(e=>e.remove());const d=document.createElement('div');d.className='ctoast'+(bad?' bad':'');d.textContent=t;document.body.appendChild(d);clearTimeout(ctT);ctT=setTimeout(()=>d.remove(),2000)}
const CTIPS=['把牌拖到桌上。牌左上角是费用，你每回合有 3 点能量。先种珊瑚或海葵，鱼才有家。','桌上的牌每回合结束都净化一次，还会长大 +1。先放下的牌赚得多。','打不出去的牌：选中它，花 1 点能量换一张。'],CALG='污染在反扑。红框是回合结束时藻类要盖住的家：净化最多、又没有守卫的那个。被盖住的家不净化。鹦嘴鱼、海胆住进去能清藻并守家。';
const RUB=`<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="74" rx="40" ry="14" fill="#5d6a70"/><circle cx="34" cy="62" r="15" fill="#7c878d"/><circle cx="58" cy="56" r="19" fill="#8b969b"/><circle cx="72" cy="68" r="11" fill="#6d787e"/><path d="M50 44 L46 30 M50 44 L58 28 M44 50 L34 40" stroke="#a9b2b6" stroke-width="4" stroke-linecap="round"/></svg>`;
const need=sp=>Math.ceil(TIERS[sp.t]*S.target);
function crender(){const st=CST[S.stage],sc=cgScore(S),k=csel!=null?S.hand[csel]:(cdrag&&cdrag.moved?S.hand[cdrag.i]:null),prog=Math.min(1,S.total/S.target);
 const ok=k&&!CD[k.id].fx&&S.energy>=CD[k.id].e?new Set(cgTargets(S,k.id).map(s=>s.i)):new Set(),th=new Set(cgThreat(S).map(s=>s.i));
 $('mInfo').textContent=`${st.n} · 第 ${S.turn} / ${st.turns} 回合`;$('cTot').textContent=S.total;$('cTgt').textContent='/ '+S.target;$('cBar').style.width=prog*100+'%';
 $('cTicks').innerHTML=TIERS.slice(1).map((f,i)=>`<s class="${S.tier>i?'on':''}" style="left:${f*100}%"></s>`).join('');
 $('cGain').innerHTML=sc.total?`回合结束 <b>+${sc.total}</b>${S.x2?' ×2':''}`:'';
 $('cTip').innerHTML=S.tier>=1&&(S.stage>0||!S.seenAlg||S.turn<=S.seenAlg+1)?`<b>藻类 ×${S.tier}</b>${CALG}`:S.stage===0&&S.turn<=3?`<b>第 ${S.turn} 步</b>${CTIPS[S.turn-1]}`:S.stage>0&&S.turn===1?`<b>${st.n}</b>${st.rule}`:'';if(S.tier>=1&&!S.seenAlg)S.seenAlg=S.turn;
 const val=c=>{const a=sc.A.find(o=>o.c===c);return a?a:{p:0}};
 const mini=(c,sp,kk,j)=>{const a=val(c),on=cinfo&&cinfo.si===sp.i&&cinfo.k===kk&&cinfo.j===j;return `<button class="mc ${on?'on':''} ${a.x2?'x2':''}" data-si="${sp.i}" data-k="${kk}" data-j="${j==null?'':j}" data-u="${c.u}">${cart(c.id)}<i class="val">${a.p}</i>${c.b?`<i class="gr">+${c.b}</i>`:''}</button>`};
 const lock=sp=>`<div class="lock"><b>污染</b><small>净化到 ${need(sp)}</small></div>`;
 let h='';for(const [type,label] of ROWS){h+=`<div class="row r-${type}"><span class="rl">${label}</span>`;
  S.spots.filter(sp=>sp.type===type).forEach(sp=>{const t=ok.has(sp.i)?'tgt':'';
   if(sp.t>S.tier){h+=`<div class="${type==='blue'?'bs':'home'} locked">${lock(sp)}</div>`;return}
   if(type==='blue'){h+=sp.c?`<div class="bs full" data-si="${sp.i}">${mini(sp.c,sp,'solo',null)}<small>${CD[sp.c.id].n}</small></div>`:`<button class="bs ${t}" data-si="${sp.i}"><small>空</small></button>`;return}
   if(type==='bare'&&!sp.hab){h+=`<button class="home bare ${t}" data-si="${sp.i}">${RUB}<small>荒礁</small></button>`;return}
   const kind=type==='sand'?'sand':sp.hab.id,hv=sp.hab?val(sp.hab):null;
   h+=`<div class="home k-${kind} ${t} ${sp.alg?'alg':''} ${th.has(sp.i)?'warn':''}" data-si="${sp.i}">`+(sp.hab?`<button class="hh" data-si="${sp.i}" data-k="hab" data-j="" data-u="${sp.hab.u}">${cart(sp.hab.id)}<b>${CD[sp.hab.id].n.replace('鹿角','')}</b><i class="val">${hv.p}</i></button>`:`<span class="hh"><b>沙地</b></span>`)
    +`<div class="rr">${[0,1].map(j=>sp.res[j]?mini(sp.res[j],sp,'res',j):`<span class="rs"></span>`).join('')}</div>${sp.alg?'<span class="algb">被藻盖住</span>':th.has(sp.i)?'<span class="wb">藻要来</span>':guarded(sp)?'<span class="gb">有守卫</span>':''}</div>`});
  h+='</div>'}
 $('cTable').innerHTML=h;
 let tx='';const show=csel!=null?S.hand[csel].id:(cinfo?(()=>{const sp=S.spots[cinfo.si],c=cinfo.k==='hab'?sp.hab:cinfo.k==='res'?sp.res[cinfo.j]:sp.c;return c&&c.id})():null);
 if(show){const d=CD[show];let why='';if(csel!=null&&S.energy<d.e)why=`能量不够：它要 ${d.e} 点，你还剩 ${S.energy} 点。`;else if(csel!=null&&!d.fx&&!cgTargets(S,show).length)why=d.hab?'没有空着的荒礁。':d.home==='blue'?'蓝水没有空位了。':`没有能住的${HOMEN[d.home]}：还没种、住满了，或者被藻盖着。`;
  tx=`<b>${d.n}</b><i>${d.lg||d.tx+'。'}</i>${csel!=null&&d.fx?' <button id="cUse" class="mini">使用</button>':''}${cinfo&&csel==null?' <button id="cRem" class="mini alt">移走</button>':''}${why?`<br><u>${why}</u>`:''}<br><span>${d.fact}</span>`}
 else if(S.energy>0&&!S.hand.some(c=>CD[c.id].e<=S.energy&&(CD[c.id].fx||cgTargets(S,c.id).length)))tx='<u>手里的牌现在都打不出去。</u>选中一张点“换牌”，或者直接结束回合。';
 $('cText').innerHTML=tx;
 $('cOrbs').innerHTML=Array.from({length:3+S.tier},(_,i)=>`<i class="${i<S.energy?'on':''}"></i>`).join('')+`<b>${S.energy}</b>`;
 $('cDeck').textContent=S.deck.length;$('cDisP').textContent=S.dis.length;
 const n=S.hand.length;$('cHand').innerHTML=S.hand.map((c,i)=>{const d=CD[c.id],dead=S.energy<d.e||(!d.fx&&!cgTargets(S,c.id).length),rot=(i-(n-1)/2)*2.4;return handCard(c,`data-h="${i}" style="--r:${rot}deg;--y:${Math.abs(i-(n-1)/2)*5}px"`,(csel===i?'sel ':'')+(dead?'dead':''))}).join('');
 $('cDis').disabled=csel==null||S.energy<1;$('cUndo').disabled=!cundo.length;$('cEnd').classList.toggle('ready',!S.hand.some(c=>CD[c.id].e<=S.energy&&(CD[c.id].fx||cgTargets(S,c.id).length)))}
const cwait=ms=>new Promise(r=>setTimeout(r,window.__fast?0:ms));
const rectOf=el=>{const r=el.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]};
function fly(from,txt,cls){const to=rectOf($('cTot')),f=document.createElement('span');f.className='fly '+(cls||'');f.textContent=txt;f.style.transform=`translate(${from[0]}px,${from[1]}px)`;document.body.appendChild(f);requestAnimationFrame(()=>requestAnimationFrame(()=>{f.style.transform=`translate(${to[0]}px,${to[1]}px) scale(.6)`;f.style.opacity='.2'}));setTimeout(()=>f.remove(),window.__fast?0:520)}
function shake(){const t=$('cTable');t.classList.remove('shake');void t.offsetWidth;t.classList.add('shake')}
async function cend(){if(cbusy||S.over)return;cbusy=true;csel=null;cinfo=null;cundo=[];crender();const sc=cgScore(S),t0=S.total;let run=0;const step=sc.A.length>9?95:150;
 for(const a of sc.A){if(!a.p)continue;run+=a.p;const el=document.querySelector(`[data-u="${a.c.u}"]`);if(el){el.classList.remove('pulse');void el.offsetWidth;el.classList.add('pulse');fly(rectOf(el),'+'+a.p,a.x2?'x2':'')}
  tone(392+Math.min(run,260)*2.6,.09,'triangle',.07);await cwait(step);$('cTot').textContent=t0+run;$('cBar').style.width=Math.min(100,(t0+run)/S.target*100)+'%';$('cTotBox').classList.remove('bump');void $('cTotBox').offsetWidth;$('cTotBox').classList.add('bump')}
 if(S.x2&&run){await cwait(200);$('cGain').innerHTML=`产卵季 <b>+${run}</b>`;fly(rectOf($('cTable')),'×2  +'+run,'x2');tone(1047,.3,'triangle',.1);await cwait(550)}
 const tier0=S.tier,ev=cgEnd(S);$('cTot').textContent=S.total;$('cBar').style.width=Math.min(100,S.total/S.target*100)+'%';await cwait(300);
 if(S.over){await cwait(400);cbusy=false;cfinish();return}
 crender();
 if(S.tier>tier0){document.querySelectorAll('#cTable .bs,#cTable .home').forEach(e=>{const sp=S.spots[+e.dataset.si];if(sp&&sp.t>tier0&&sp.t<=S.tier)e.classList.add('unlock')});tone(330,.5,'sine',.1,990);csay(S.tier===1?'污染退了一圈：多 1 点能量，露出新位置。但它开始反扑了':'污染又退一圈：多 1 点能量，藻类也多盖一个家');await cwait(700)}
 if(ev.alg.length){ev.alg.forEach(i=>{const e=document.querySelector(`.home[data-si="${i}"]`);if(e)e.classList.add('slam')});shake();SFX.eaten();if(S.tier===tier0)csay('藻类盖住了净化最多的家',1)}
 cbusy=false}
function cfinish(){const st=CST[S.stage];if(S.over==='lose'){SFX.lose();ov(`<h1>污染没有退完</h1><p style="text-align:center;font:700 26px var(--num);color:var(--sun)">${S.total} / ${S.target}</p><p>藻类总盖住净化最多、又没守卫的家。给最值钱的家配一个吃藻的，或者把分散开。</p><button class="go" data-cact="again">再试这片水域</button>`);return}
 SFX.win();if(S.offer){cpick=null;ov(`<h1>${st.n}净化完成</h1><p style="text-align:center">博士刻好了新的记忆卡，选 1 张加入牌组。</p><div class="offer">${S.offer.map((k,i)=>handCard(k,`data-pick="${i}"`)).join('')}</div><p id="cPickInfo" style="font-size:13px;color:var(--dim)">点一张看说明，再点一次确认。</p>`)}
 else ov(`<h1>整片礁净化完成</h1><p style="text-align:center;font:700 26px var(--num);color:var(--sun)">${S.total} / ${S.target}</p><p>三片水域都恢复了。你的牌组里现在有 ${S.cards.length} 张记忆卡。</p><button class="go" data-cact="new">再来一局</button>`)}
function cplay(i,si){const snap=JSON.stringify(S),u=S.hand[i]&&S.hand[i].u;if(cgPlay(S,i,si)){cundo.push(snap);csel=null;cinfo=null;SFX.place();crender();const el=document.querySelector(`[data-u="${u}"]`);if(el)el.classList.add('drop');else{const o=$('cOrbs');o.classList.add('bump')}return true}return false}
function cwhy(k,sp){const d=CD[k.id];if(S.energy<d.e)return '能量不够：它要 '+d.e+' 点';if(d.hab)return '栖息地要种在空着的荒礁上';if(!sp)return '拖到发亮的位置';if(sp.t>S.tier)return '这里还被污染盖着';if(d.home==='blue')return sp.type==='blue'?'这个位置有鱼了':d.n+'游蓝水，放最上面一排';
 if(sp.type==='blue')return d.n+'不住蓝水，它住'+HOMEN[d.home];if(sp.alg&&!d.guard)return '这个家被藻盖着，只有吃藻的能住进来';const kind=sp.type==='sand'?'sand':sp.hab?sp.hab.id:'bare';if(kind!==d.home)return d.n+'住'+HOMEN[d.home]+(kind==='bare'?'，先种一个':'，不住'+HOMEN[kind]);return '这个家住满了（最多 2 个）'}
/* 拖动：按住手牌拖到桌上；没拖动就当作点选 */
document.addEventListener('pointerdown',e=>{if(mode!=='cg'||cbusy||!S||S.over)return;const c=e.target.closest('#cHand .cc');if(!c)return;cdrag={i:+c.dataset.h,x0:e.clientX,y0:e.clientY,moved:false,ghost:null,pid:e.pointerId};try{c.setPointerCapture(e.pointerId)}catch(_){}});
document.addEventListener('pointermove',e=>{if(!cdrag||e.pointerId!==cdrag.pid)return;if(!cdrag.moved){if(Math.hypot(e.clientX-cdrag.x0,e.clientY-cdrag.y0)<9)return;cdrag.moved=true;csel=null;cinfo=null;const src=document.querySelector(`#cHand .cc[data-h="${cdrag.i}"]`),g=src.cloneNode(true);g.classList.add('ghost');g.classList.remove('sel','dead');g.removeAttribute('data-h');g.style.cssText='';document.body.appendChild(g);cdrag.ghost=g;crender();const s2=document.querySelector(`#cHand .cc[data-h="${cdrag.i}"]`);if(s2)s2.classList.add('lift')}
 cdrag.ghost.style.transform=`translate(${e.clientX-37}px,${e.clientY-96}px) rotate(${Math.max(-8,Math.min(8,(e.clientX-cdrag.x0)*.05))}deg)`;
 const under=document.elementFromPoint(e.clientX,e.clientY-50),t=under&&under.closest('#cTable [data-si]');document.querySelectorAll('#cTable .over').forEach(x=>x.classList.remove('over'));if(t&&t.classList.contains('tgt'))t.classList.add('over');e.preventDefault()},{passive:false});
function cdrop(e){if(!cdrag||e.pointerId!==cdrag.pid)return;const d=cdrag;cdrag=null;if(d.ghost)d.ghost.remove();
 if(!d.moved){csel=csel===d.i?null:d.i;cinfo=null;crender();return}
 const k=S.hand[d.i],r=$('cTable').getBoundingClientRect(),y=e.clientY-50;if(e.clientY>r.bottom+40){crender();return}
 if(CD[k.id].fx){if(!cplay(d.i,-1)){csay('能量不够',1);crender()}return}
 const under=document.elementFromPoint(e.clientX,y),t=under&&under.closest('#cTable [data-si]'),sp=t?S.spots[+t.dataset.si]:null;
 if(sp&&cplay(d.i,sp.i))return;
 let best=null,bd=1e9;if(S.energy>=CD[k.id].e)cgTargets(S,k.id).forEach(s=>{const el=document.querySelector(`#cTable [data-si="${s.i}"]`);if(!el)return;const c=rectOf(el),dd=Math.hypot(c[0]-e.clientX,c[1]-y);if(dd<bd){bd=dd;best=s}});
 if(!sp&&best&&bd<70&&cplay(d.i,best.i))return;csay(cwhy(k,sp),1);tone(140,.12,'square',.04);csel=d.i;crender()}
document.addEventListener('pointerup',cdrop);document.addEventListener('pointercancel',e=>{if(cdrag&&e.pointerId===cdrag.pid){if(cdrag.ghost)cdrag.ghost.remove();cdrag=null;crender()}});
document.addEventListener('click',e=>{const t=e.target.closest('button,[data-si]');if(!t)return;const d=t.dataset;
 if(t.id==='mA'||t.id==='mB'){mode=t.id==='mA'?'cg':'td';$('mA').className=mode==='cg'?'on':'';$('mB').className=mode==='td'?'on':'';$('mCG').hidden=mode!=='cg';$('mTD').hidden=mode!=='td';$('ov').hidden=true;try{localStorage.setItem('reefMode',mode)}catch(e){}
  if(mode==='td'){$('mInfo').textContent='';if(!tdStarted){tdStarted=true;start()}}else crender();return}
 if(mode!=='cg')return;
 if(d.cact==='new'){S=cgInit();csel=cinfo=null;cundo=[];$('ov').hidden=true;crender();return}
 if(d.cact==='again'){cgStage(S);csel=cinfo=null;cundo=[];$('ov').hidden=true;crender();return}
 if(d.pick!=null){const i=+d.pick;if(cpick===i){cpick=null;cgPick(S,i);csel=cinfo=null;cundo=[];$('ov').hidden=true;crender()}else{cpick=i;const dd=CD[S.offer[i]];document.querySelectorAll('.offer .cc').forEach((c,j)=>c.classList.toggle('sel',j===i));$('cPickInfo').innerHTML=`<b style="color:var(--ink)">${dd.n}</b>　<span style="color:var(--sun)">${dd.lg||dd.tx}</span><br>${dd.fact}<br>再点一次确认。`}return}
 if(cbusy||S.over)return;
 if(t.id==='cUse'){if(!cplay(csel,-1))csay('能量不够',1);return}
 if(t.id==='cRem'){if(cinfo){cundo.push(JSON.stringify(S));if(cgRemove(S,cinfo.si,cinfo.k,cinfo.j)){cinfo=null;crender()}else cundo.pop()}return}
 if(t.id==='cUndo'){if(cundo.length){S=JSON.parse(cundo.pop());csel=cinfo=null;crender()}return}
 if(t.id==='cDis'){if(csel!=null&&cgSwap(S,csel)){csel=null;cundo=[];crender()}return}
 if(t.id==='cEnd'){cend();return}
 if(d.si!=null){const si=+d.si,sp=S.spots[si];if(csel!=null){const k=S.hand[csel];if(CD[k.id].fx){csay('点“使用”来用这张牌');return}if(cplay(csel,si))return;csay(cwhy(k,sp),1);tone(140,.12,'square',.04);return}
  if(d.k){const ni={si,k:d.k,j:d.j===''?null:+d.j};cinfo=cinfo&&cinfo.si===ni.si&&cinfo.k===ni.k&&cinfo.j===ni.j?null:ni;crender()}return}});
S=cgInit();crender();
try{if(localStorage.getItem('reefMode')==='td')$('mB').click()}catch(e){}
