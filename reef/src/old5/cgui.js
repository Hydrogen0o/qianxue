/* ---------- 牌局界面（场景版） ---------- */
let mode='cg',S,csel=null,cinfo=null,cbusy=false,ctT=0,tdStarted=false,cdrag=null,cpick=null;
const cart=id=>CD[id].art?svg(P[CD[id].art]()):'';
const ccard=(k,attr,extra)=>{const d=CD[k.id||k];return `<button class="cc ${d.fx?'fx':''} ${d.hab?'hb':''} ${extra||''}" ${attr||''}><span class="no">${d.e}</span>${d.fx?'':`<span class="pv">${d.p}分</span>`}${cart(k.id||k)}<b>${d.n}</b><small>${d.tx}</small></button>`};
function csay(t){document.querySelectorAll('.ctoast').forEach(e=>e.remove());const d=document.createElement('div');d.className='ctoast';d.textContent=t;document.body.appendChild(d);clearTimeout(ctT);ctT=setTimeout(()=>d.remove(),2000)}
const CTIPS=['每回合有 3 点能量，牌左上角是它的费用。先种珊瑚或海葵，再让鱼住进去。','留在礁上的生物每回合都净化，还会长大 +1。能量每回合补满，花不完不会留到下回合。','手里的牌打不出去？选中它，花 1 点能量换一张。','把分堆在一个家里涨得快，也最招藻。分散开、留个守卫，还是赌一把？'],CALG='污染在反扑。红圈是回合结束时藻类要盖住的家：净化最多、又没有守卫的。被盖住就不净化。鹦嘴鱼（珊瑚）和海胆（沙地）住进去能清藻并守家。';
const ALGS=`<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 14 C68 8 82 22 82 34 C96 40 96 60 84 68 C88 84 70 94 58 86 C46 98 26 92 26 78 C10 76 6 56 18 46 C10 30 26 16 38 22 C40 16 46 13 50 14Z" fill="#55701f" opacity=".88"/><circle cx="38" cy="46" r="9" fill="#7a9a2e"/><circle cx="62" cy="58" r="12" fill="#6a8a26"/><circle cx="52" cy="34" r="7" fill="#86a83a"/></svg>`;
const RUB=`<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="74" rx="40" ry="14" fill="#6f7a80"/><circle cx="34" cy="62" r="15" fill="#8a949a"/><circle cx="58" cy="56" r="19" fill="#9aa4a9"/><circle cx="72" cy="68" r="11" fill="#7c868c"/><path d="M50 44 L46 30 M50 44 L58 28 M44 50 L34 40" stroke="#b9c0c3" stroke-width="4" stroke-linecap="round"/></svg>`;
function cbg(){let rock='';let s=7;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;for(let i=0;i<46;i++){const x=rnd()*76,y=76+rnd()*26;rock+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.5+rnd()*3).toFixed(1)}" fill="${rnd()<.5?'#4b677d':'#2e4354'}"/>`}
 let grass='';for(let i=0;i<9;i++)grass+=`<path d="M${2+i*2.6} 30 Q${1+i*2.6} ${18-rnd()*6} ${4+i*2.8} ${9+rnd()*5}" stroke="${i%2?'#3f9b58':'#59b86c'}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
 return `<svg class="bg" viewBox="0 0 100 102" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="cgw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#39b3d2"/><stop offset=".5" stop-color="#1368a8"/><stop offset="1" stop-color="#072a5c"/></linearGradient><linearGradient id="cgs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3e3b8"/><stop offset="1" stop-color="#d7bd86"/></linearGradient></defs>
 <rect width="100" height="102" fill="url(#cgw)"/><path d="M14 0 L30 0 L16 70 L-6 70Z M44 0 L56 0 L52 60 L34 60Z M72 0 L80 0 L84 50 L70 50Z" fill="#fff" opacity=".07"/>
 <path d="M0 0 H100 V2.5 Q92 5 84 2.5 T68 2.5 T52 2.5 T36 2.5 T20 2.5 T4 2.5 L0 3Z" fill="#d6f3fa" opacity=".55"/>
 <path d="M74 102 C76 88 88 84 100 86 V102Z" fill="#06224e" opacity=".75"/>
 <path d="M0 78 L52 73 C61 71 67 65 70 55 C76 64 76 84 72 102 L0 102Z" fill="#3b5266"/>${rock}
 <path d="M24 87 C40 82 60 84 73 91 L76 102 L22 102Z" fill="#8cc0cb" opacity=".5"/>
 <ellipse cx="17" cy="91" rx="13" ry="8" fill="#08131c"/><path d="M4 92 C5 80 29 80 30 92" stroke="#587489" stroke-width="2.4" fill="none"/>
 <path d="M0 13 C12 12 24 19 31 27 L0 33Z" fill="#cdb97f"/>${grass}
 <path d="M0 29 C20 24 50 30 68 38 C74 42 73 50 70 56 C67 66 60 71 52 73 L0 79Z" fill="url(#cgs)"/>
 <path d="M6 44 Q16 41 26 44 M30 54 Q42 51 54 55 M8 68 Q20 65 32 68 M40 40 Q50 38 58 41" stroke="#c7ad76" stroke-width=".7" fill="none" opacity=".7"/></svg>`}
function cinit(){$('cScene').innerHTML=cbg()+'<div class="haze" id="cHaze"></div><div id="cSpots"></div><div id="cMurk"></div><div id="cFx"></div>';
 $('cMurk').innerHTML=S.spots.filter(sp=>sp.t>S.tier).map(sp=>`<i class="murk" data-m="${sp.i}" data-t="${sp.t}" style="left:${sp.x}%;top:${sp.y/1.02}%"></i>`).join('')}
const spos=sp=>`left:${sp.x}%;top:${sp.y/1.02}%`;
const gs=c=>1+Math.min(.55,c.b*.05);
function crender(){const st=CST[S.stage],sc=cgScore(S),left=S.energy,k=csel!=null?S.hand[csel]:(cdrag&&cdrag.moved?S.hand[cdrag.i]:null),prog=Math.min(1,S.total/S.target);
 $('mInfo').textContent=`${st.n} · 第 ${S.turn} / ${st.turns} 回合`;$('cTot').textContent=S.total;$('cTgt').textContent='/ '+S.target;$('cBar').style.width=prog*100+'%';
 $('cGain').textContent=sc.total?`这回合 +${sc.total}${S.x2?'（×2）':''}`:'';
 $('cTip').innerHTML=S.tier>=1&&(S.stage>0||!S.seenAlg||S.turn<=S.seenAlg+1)?`<b>藻类 ×${S.tier}</b>${CALG}`:S.stage===0?`<b>${S.turn<=3?'第 '+S.turn+' 步':'提示'}</b>${CTIPS[Math.min(3,S.turn-1)]}`:`<b>${st.n}</b>${st.rule}`;if(S.tier>=1&&!S.seenAlg)S.seenAlg=S.turn;
 $('cScene').style.filter=`saturate(${(.5+.5*prog).toFixed(2)}) brightness(${(.88+.12*prog).toFixed(2)})`;$('cHaze').style.opacity=(.32*(1-prog)).toFixed(2);
 const ok=k&&!CD[k.id].fx&&left>=CD[k.id].e?new Set(cgTargets(S,k.id).map(s=>s.i)):new Set();let h='';const th=new Set(cgThreat(S).map(s=>s.i));const val=a=>{const f=sc.A.find(o=>o.c===a);return f?f.p:0};
 const cr=(c,sp,kk,j,dx,dy,size)=>{const s=gs(c),on=cinfo&&cinfo.si===sp.i&&cinfo.k===kk&&cinfo.j===j;return `<button class="cr ${kk} ${on?'on':''} ${sp.alg?'off':''} ${CD[c.id].home==='blue'?'swim':''}" data-si="${sp.i}" data-k="${kk}" data-j="${j==null?'':j}" style="${spos(sp)};width:${size}px;height:${size}px;margin:${dy-size/2}px 0 0 ${dx-size/2}px;animation-delay:-${(c.u%7)*.4}s"><span class="cs" style="transform:scale(${s})">${cart(c.id)}</span><span class="v ${sc.A.find(o=>o.c===c&&o.x2)?'x2':''}">${val(c)}</span></button>`};
 S.spots.forEach(sp=>{if(sp.t>S.tier)return;
  if(sp.type==='bare'&&!sp.hab)h+=`<span class="rub" style="${spos(sp)}">${RUB}</span>`;
  if(sp.hab){h+=cr(sp.hab,sp,'hab',null,0,4,60);sp.res.forEach((c,j)=>h+=cr(c,sp,'res',j,j?20:-20,j?-22:-26,38))}
  else if(sp.type==='sand')sp.res.forEach((c,j)=>h+=cr(c,sp,'res',j,sp.res.length>1?(j?19:-19):0,j?5:-3,44));
  if(sp.alg)h+=`<span class="alg" style="${spos(sp)}">${ALGS}</span>`;
  if(th.has(sp.i))h+=`<span class="warn" style="${spos(sp)}"><i>藻</i></span>`;
  if(sp.c)h+=cr(sp.c,sp,'solo',null,0,0,sp.type==='blue'?50:46);
  if(ok.has(sp.i))h+=`<button class="ring" data-ring="${sp.i}" style="${spos(sp)}" aria-label="放到这里"></button>`});
 $('cSpots').innerHTML=h;
 let tx='';const show=csel!=null?S.hand[csel].id:(cinfo?(()=>{const sp=S.spots[cinfo.si],c=cinfo.k==='hab'?sp.hab:cinfo.k==='res'?sp.res[cinfo.j]:sp.c;return c&&c.id})():null);
 if(show){const d=CD[show];let why='';if(csel!=null&&S.energy<d.e)why=`<br><i style="color:var(--bad)">能量不够：它要 ⚡${d.e}，你还剩 ⚡${S.energy}。</i>`;else if(csel!=null&&!d.fx&&!cgTargets(S,show).length)why=`<br><i style="color:var(--bad)">现在没地方放：${d.hab?'没有空着的荒礁':d.home==='coral'||d.home==='anem'?'没有能住的'+HOMEN[d.home]+'（还没种、住满了，或者被藻盖着）':d.home==='sand'?'沙地住满了，或者被藻盖着':HOMEN[d.home]+'还被污染盖着，或者满了'}。</i>`;
  const hsp=cinfo&&csel==null?S.spots[cinfo.si]:null,note=hsp&&hsp.alg?'<br><i style="color:var(--bad)">这个家被藻盖住了：不净化、不长大。让吃藻的住进来才能清掉。</i>':hsp&&th.has(hsp.i)?'<br><i style="color:var(--bad)">回合结束时藻类会盖住这个家：它净化最多，又没有守卫。</i>':'';
  tx=`<b>${d.n}</b><span class="cost">⚡${d.e}</span><i>${d.lg||d.tx+'。'}</i>${csel!=null&&d.fx?' <button id="cUse" class="mini">使用</button>':''}${cinfo&&csel==null?' <button id="cRem" class="mini alt">移走</button>':''}${why}${note}<br>${d.fact}`}
 else if(left>0&&!S.hand.some(c=>CD[c.id].e<=left&&(CD[c.id].fx||cgTargets(S,c.id).length)))tx=`还有 ⚡${left}，但手里的牌现在都打不出去。选中一张，点“换牌”（⚡1）；或者直接结束回合。`;
 else tx=left>0?`还有 ⚡${left}。把手牌拖进海里，或者点一张牌再点发光的位置。`+(th.size?'<br><i style="color:var(--bad)">红圈：回合结束时藻类会盖住那里。</i>':''):'能量用完了。点“结束回合”，看它们净化。';
 $('cText').innerHTML=tx;
 $('cHand').innerHTML=S.hand.map((c,i)=>ccard(c,`data-h="${i}"`,(csel===i?'sel ':'')+(S.energy<CD[c.id].e||(!CD[c.id].fx&&!cgTargets(S,c.id).length)?'dead':''))).join('');
 $('cDis').disabled=csel==null||S.energy<1;$('cDis').innerHTML=`换牌 <small>⚡1</small>`;$('cEnd').innerHTML=`结束回合 <small>剩 ⚡${left}</small>`;$('cEn').textContent=S.energy}
function cfx(sp,dx,dy,txt,cls){const f=document.createElement('span');f.className='fl '+(cls||'');f.textContent=txt;f.style.cssText=spos(sp)+`;margin:${dy}px 0 0 ${dx}px`;$('cFx').appendChild(f);setTimeout(()=>f.remove(),900);const r=document.createElement('i');r.className='wave';r.style.cssText=spos(sp)+`;margin:${dy}px 0 0 ${dx}px`;$('cFx').appendChild(r);setTimeout(()=>r.remove(),700)}
const cwait=ms=>new Promise(r=>setTimeout(r,window.__fast?0:ms));
async function cend(){if(cbusy||S.over)return;cbusy=true;csel=null;cinfo=null;crender();const sc=cgScore(S),t0=S.total,mult=S.x2?2:1;let run=0;const step=sc.A.length>10?90:150;
 for(const a of sc.A){if(!a.p)continue;run+=a.p;const el=document.querySelector(`.cr[data-si="${a.sp.i}"][data-k="${a.k}"][data-j="${a.j==null?'':a.j}"]`);if(el){el.classList.remove('pulse');void el.offsetWidth;el.classList.add('pulse')}
  cfx(a.sp,a.k==='res'?(a.j?20:-20):0,a.k==='res'?-30:-8,'+'+a.p,a.x2?'x2':'');$('cGain').textContent='+'+run;$('cTot').textContent=t0+run;$('cBar').style.width=Math.min(100,(t0+run)/S.target*100)+'%';tone(392+Math.min(run,300)*2.4,.09,'triangle',.07);await cwait(step)}
 if(mult>1){$('cGain').textContent='+'+run+' ×2 = +'+run*2;tone(1047,.3,'triangle',.1);await cwait(550)}
 const ev=cgEnd(S);$('cTot').textContent=S.total;const prog=Math.min(1,S.total/S.target);$('cBar').style.width=prog*100+'%';$('cScene').style.filter=`saturate(${(.5+.5*prog).toFixed(2)}) brightness(${(.88+.12*prog).toFixed(2)})`;$('cHaze').style.opacity=(.32*(1-prog)).toFixed(2);await cwait(350);
 const gone=[...document.querySelectorAll('.murk')].filter(m=>+m.dataset.t<=S.tier);if(gone.length){gone.forEach(m=>{m.classList.add('gone');setTimeout(()=>m.remove(),1300)});tone(330,.5,'sine',.1,990);if(!S.over)csay(S.tier===1?'污染退了一圈，但它开始反扑了':'污染又退了一圈，藻类也更凶了');await cwait(900)}
 if(S.over){await cwait(500);cbusy=false;cfinish();return}cbusy=false;crender();if(ev.alg.length){SFX.eaten();csay('藻类盖住了净化最多的家');ev.alg.forEach(i=>cfx(S.spots[i],0,0,'藻','bad'))}}
function cfinish(){const st=CST[S.stage];if(S.over==='lose'){SFX.lose();ov(`<h1>污染没有退完</h1><p style="text-align:center;font:700 26px var(--num);color:var(--sun)">${S.total} / ${S.target}</p><p>藻类总盖住净化最多、又没守卫的家。给最值钱的家配一个吃藻的，或者把分散开。</p><button class="go" data-cact="again">再试这片水域</button>`);return}
 SFX.win();if(S.offer){cpick=null;ov(`<h1>${st.n}净化完成</h1><p style="text-align:center">博士刻好了新的记忆卡，选 1 张加入牌组。</p><div class="offer">${S.offer.map((k,i)=>ccard(k,`data-pick="${i}"`)).join('')}<p id="cPickInfo" style="font-size:13px;color:var(--dim)">点一张看说明，再点一次确认。</p></div>`)}
 else ov(`<h1>整片礁净化完成</h1><p style="text-align:center;font:700 26px var(--num);color:var(--sun)">${S.total} / ${S.target}</p><p>三片水域都恢复了。你的牌组里现在有 ${S.cards.length} 张记忆卡。</p><button class="go" data-cact="new">再来一局</button>`)}
function cplay(i,si){if(cgPlay(S,i,si)){csel=null;cinfo=null;SFX.place();crender();if(si>=0){const sp=S.spots[si];cfx(sp,0,0,'','')}return true}return false}
/* 拖动：按住手牌拖进场景；没拖动就当作点选 */
document.addEventListener('pointerdown',e=>{if(mode!=='cg'||cbusy||!S||S.over)return;const c=e.target.closest('#cHand .cc');if(!c)return;cdrag={i:+c.dataset.h,x0:e.clientX,y0:e.clientY,moved:false,ghost:null,pid:e.pointerId};try{c.setPointerCapture(e.pointerId)}catch(_){}});
document.addEventListener('pointermove',e=>{if(!cdrag||e.pointerId!==cdrag.pid)return;if(!cdrag.moved){if(Math.hypot(e.clientX-cdrag.x0,e.clientY-cdrag.y0)<10)return;cdrag.moved=true;csel=null;cinfo=null;const src=document.querySelector(`#cHand .cc[data-h="${cdrag.i}"]`);const g=src.cloneNode(true);g.className='cc ghost'+(g.classList.contains('fx')?' fx':'');g.removeAttribute('data-h');document.body.appendChild(g);cdrag.ghost=g;src.classList.add('lift');crender();const s2=document.querySelector(`#cHand .cc[data-h="${cdrag.i}"]`);if(s2)s2.classList.add('lift')}
 cdrag.ghost.style.transform=`translate(${e.clientX-36}px,${e.clientY-88}px) scale(.82)`;e.preventDefault()},{passive:false});
function cdrop(e){if(!cdrag||e.pointerId!==cdrag.pid)return;const d=cdrag;cdrag=null;if(d.ghost)d.ghost.remove();
 if(!d.moved){csel=csel===d.i?null:d.i;cinfo=null;crender();return}
 const k=S.hand[d.i],r=$('cScene').getBoundingClientRect(),x=e.clientX,y=e.clientY-40,inside=x>r.left&&x<r.right&&e.clientY>r.top&&e.clientY<r.bottom+30;
 if(!inside){crender();return}
 if(S.energy<CD[k.id].e){csay('能量不够：它要 ⚡'+CD[k.id].e);csel=d.i;crender();return}
 if(CD[k.id].fx){cplay(d.i,-1);return}
 let best=null,bd=1e9;cgTargets(S,k.id).forEach(sp=>{const px=r.left+sp.x/100*r.width,py=r.top+sp.y/102*r.height,dd=Math.hypot(px-x,py-y);if(dd<bd){bd=dd;best=sp}});
 if(best&&bd<r.width*.3){cplay(d.i,best.i)}else{const dd=CD[k.id];csay(best?'拖到发光的圈里':dd.hab?'没有空着的荒礁了':dd.home==='coral'||dd.home==='anem'?'没有能住的'+HOMEN[dd.home]+'：还没种、住满了，或者被藻盖着':HOMEN[dd.home]+'满了，或者还被盖着');csel=d.i;crender()}}
document.addEventListener('pointerup',cdrop);document.addEventListener('pointercancel',e=>{if(cdrag&&e.pointerId===cdrag.pid){if(cdrag.ghost)cdrag.ghost.remove();cdrag=null;crender()}});
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const d=t.dataset;
 if(t.id==='mA'||t.id==='mB'){mode=t.id==='mA'?'cg':'td';$('mA').className=mode==='cg'?'on':'';$('mB').className=mode==='td'?'on':'';$('mCG').hidden=mode!=='cg';$('mTD').hidden=mode!=='td';$('ov').hidden=true;try{localStorage.setItem('reefMode',mode)}catch(e){}
  if(mode==='td'){$('mInfo').textContent='';if(!tdStarted){tdStarted=true;start()}}else crender();return}
 if(mode!=='cg')return;
 if(d.cact==='new'){S=cgInit();csel=cinfo=null;$('ov').hidden=true;cinit();crender();return}
 if(d.cact==='again'){cgStage(S);csel=cinfo=null;$('ov').hidden=true;cinit();crender();return}
 if(d.pick!=null){const i=+d.pick;if(cpick===i){cpick=null;cgPick(S,i);csel=cinfo=null;$('ov').hidden=true;cinit();crender()}else{cpick=i;const dd=CD[S.offer[i]];document.querySelectorAll('.offer .cc').forEach((c,j)=>c.classList.toggle('sel',j===i));$('cPickInfo').innerHTML=`<b style="color:var(--ink)">${dd.n}</b>　<span style="color:var(--sun)">${dd.lg||dd.tx}</span><br>${dd.fact}<br>再点一次确认。`}return}
 if(cbusy||S.over)return;
 if(t.id==='cUse'){if(!cplay(csel,-1))csay('能量不够');return}
 if(t.id==='cRem'){if(cinfo&&cgRemove(S,cinfo.si,cinfo.k,cinfo.j)){cinfo=null;crender()}return}
 if(d.ring!=null){if(csel!=null&&!cplay(csel,+d.ring))csay('能量不够');return}
 if(d.si!=null){const si=+d.si;if(csel!=null){const k=S.hand[csel];if(!CD[k.id].fx&&cgCan(S,k.id,S.spots[si])){if(!cplay(csel,si))csay('能量不够');return}}csel=null;const ni={si,k:d.k,j:d.j===''?null:+d.j};cinfo=cinfo&&cinfo.si===ni.si&&cinfo.k===ni.k&&cinfo.j===ni.j?null:ni;crender();return}
 if(t.id==='cDis'){if(csel!=null&&cgSwap(S,csel)){csel=null;crender()}return}
 if(t.id==='cEnd'){cend();return}});
S=cgInit();cinit();crender();
try{if(localStorage.getItem('reefMode')==='td')$('mB').click()}catch(e){}
