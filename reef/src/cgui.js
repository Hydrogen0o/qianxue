/* ---------- 牌局界面：三条水道的海景 ---------- */
let mode='cg',S,csel=null,cinfo=null,cbusy=false,ctT=0,tdStarted=false,cdrag=null,cpick=null,cundo=[];
const cart=id=>CD[id].art?svg(P[CD[id].art]()):'';
const IC={alg:'<svg viewBox="0 0 24 24"><circle cx="9" cy="10" r="6" fill="#7a9a2e"/><circle cx="15" cy="14" r="6" fill="#62822a"/><circle cx="13" cy="7" r="4" fill="#8fb03a"/></svg>',
 undo:'<svg viewBox="0 0 24 24"><path d="M9 4 L4 9 L9 14 M4 9 H14 a6 6 0 0 1 0 12 H11" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 swap:'<svg viewBox="0 0 24 24"><path d="M4 9 a8 8 0 0 1 14 -3 M20 3 v4 h-4 M20 15 a8 8 0 0 1 -14 3 M4 21 v-4 h4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 up:'<svg viewBox="0 0 24 24"><path d="M12 20 V6 M6 11 L12 5 L18 11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 star:'<svg viewBox="0 0 24 24"><path d="M12 2 l3 7 h7 l-5.5 4.5 2 7.5 -6.5 -4.5 -6.5 4.5 2 -7.5 L2 9 h7Z" fill="currentColor"/></svg>'};
const mi=id=>`<span class="mi">${cart(id)}</span>`,slot2='<span class="s2"><i></i><i></i></span>',ai=`<span class="ic">${IC.alg}</span>`;
const FXI={anem:()=>mi('clown')+mi('clown'),clown:()=>mi('clown')+mi('clown')+'<b>×2</b>',chromis:()=>mi('chromis')+'<b>+1</b>',butterfly:()=>mi('butterfly')+mi('butterfly')+'<b>×2</b>',
 cleaner:()=>'<span class="ic st">'+IC.star+'</span><b>×2</b>',parrot:()=>ai+'<b>−3</b>',urchin:()=>ai+'<b>−2</b>',grouper:()=>'<span class="ic up">'+IC.up+'</span><b>+2</b>',
 eel:()=>mi('eel')+'<b>+2</b>',jack:()=>mi('sardine')+'<b>+2</b>',shark:()=>mi('sardine')+mi('jack')+'<b>+2</b>',moray:()=>mi('grouper')+'<b>×2</b>',spawn:()=>'<b class="big">×2</b>'};
const LCOL={blue:'#6ab8ff',reef:'#ff8a6b',sand:'#e3cf9a'};
const handCard=(k,attr,extra)=>{const id=k.id||k,d=CD[id],band=d.fx?'':d.ln.length>1?`background:linear-gradient(90deg,${d.ln.map((t,i)=>`${LCOL[t]} ${i*100/d.ln.length}% ${(i+1)*100/d.ln.length}%`).join(',')})`:`background:${LCOL[d.ln[0]]}`;return `<button class="cc h-${d.fx?'fx':d.ln[0]} ${extra||''}" ${attr||''}><span class="orb">${d.e}</span>${d.fx?'':`<span class="pv">${d.p}</span>`}<span class="art">${cart(id)}</span><b>${d.n}</b><small class="fxi">${FXI[id]?FXI[id]():''}</small><em style="${band}">${d.home?mi(d.home):''}</em></button>`};
function csay(t,bad){document.querySelectorAll('.ctoast').forEach(e=>e.remove());const d=document.createElement('div');d.className='ctoast'+(bad?' bad':'');d.textContent=t;document.body.appendChild(d);clearTimeout(ctT);ctT=setTimeout(()=>d.remove(),2000)}
const LH=104,cx=c=>(c+.5)/NC*100;
/* 生物在自己那一格里的位置（像素偏移） */
function spot(a,type){if(a.k==='hab')return {x:0,y:LH-26,s:46};const j=a.j||0;if(type==='reef')return {x:j?13:-13,y:j?44:28,s:34};if(type==='blue')return {x:j?10:-10,y:j?66:32,s:38};return {x:j?14:-14,y:LH-24,s:36}}
function crender(){const st=CFG[S.stage],sc=cgScore(S),k=csel!=null?S.hand[csel]:(cdrag&&cdrag.moved?S.hand[cdrag.i]:null);
 const ok=new Set(k&&!CD[k.id].fx&&S.energy>=CD[k.id].e?cgTargets(S,k.id).map(t=>t.l+','+t.c):[]);
 $('mInfo').innerHTML=`${st.n} <span class="pips">${Array.from({length:st.turns},(_,i)=>`<i class="${i<S.turn-1?'d':i===S.turn-1?'c':''}"></i>`).join('')}</span>`;
 let h='';S.lanes.forEach((L,l)=>{const r=sc[l];h+=`<div class="lane ln-${L.type}" data-l="${l}">`;
  for(let c=0;c<NC;c++)h+=`<button class="cell ${c>=L.front?'pol':''} ${ok.has(l+','+c)?'tgt':''} ${c===L.front-1&&L.front<NC?'fr':''}" data-l="${l}" data-c="${c}" style="left:${c/NC*100}%" aria-label="第${l+1}道第${c+1}格"></button>`;
  r.A.forEach(a=>{const p=spot(a,L.type),on=cinfo===a.c.u;h+=`<button class="sp k-${a.k} ${a.off?'off':''} ${on?'on':''}" data-u="${a.c.u}" style="left:calc(${cx(a.col)}% + ${p.x-p.s/2}px);top:${p.y-p.s/2}px;width:${p.s}px;height:${p.s}px"><span class="sw" style="--dx:${a.k==='hab'||L.type==='sand'?2:7+a.c.u%5}px;--dy:${a.k==='hab'?0:L.type==='sand'?1:4+a.c.u%4}px;animation-duration:${2.6+(a.c.u%7)*.45}s;animation-delay:-${(a.c.u%9)*.5}s">${cart(a.c.id)}</span>${a.off?'':`<i class="val ${a.cl||a.fr||(a.fx&&a.fx.length)?'x2':''}">${a.p}</i>`}</button>`});
  if(L.front<NC)h+=`<div class="mass" style="left:${L.front/NC*100}%"></div><div class="duel ${r.win?'w':'l'}" style="left:${L.front/NC*100}%"><b class="pw">${r.power}</b><i>${r.win?'▶':'◀'}</i><b class="pp">${r.need}</b></div>`;
  else h+='<div class="clear">✓</div>';
  h+='</div>'});
 $('cScene').innerHTML=h;
 let tx='';const showId=csel!=null?S.hand[csel].id:cinfo?(()=>{for(const r of sc)for(const a of r.A)if(a.c.u===cinfo)return a.c.id})():null;
 if(showId){const d=CD[showId];let why='';if(csel!=null&&S.energy<d.e)why=`能量不够：要 ${d.e} 点，还剩 ${S.energy} 点。`;else if(csel!=null&&!d.fx&&!cgTargets(S,showId).length)why=d.hab?'礁石这条道没有空格了。':d.home?`没有能住的${CD[d.home].n}：还没放，或者住满了。`:'这条道没有空位了。';
  tx=`<b>${d.n}</b><i>${d.lg}</i>${csel!=null&&d.fx?' <button id="cUse" class="mini">使用</button>':''}${why?`<br><u>${why}</u>`:''}<br><span>${d.fact}</span>`}
 $('cText').innerHTML=tx;
 $('cOrbs').innerHTML=Array.from({length:cgEnergy(S.turn)},(_,i)=>`<i class="${i<S.energy?'on':''}"></i>`).join('');
 $('cDeck').textContent=S.deck.length;$('cDisP').textContent=S.dis.length;
 const n=S.hand.length;$('cHand').innerHTML=S.hand.map((c,i)=>{const d=CD[c.id],dead=S.energy<d.e||(!d.fx&&!cgTargets(S,c.id).length),rot=(i-(n-1)/2)*2.4;return handCard(c,`data-h="${i}" style="--r:${rot}deg;--y:${Math.abs(i-(n-1)/2)*5}px"`,(csel===i?'sel ':'')+(dead?'dead':''))}).join('');
 if(!$('cUndo').firstChild){$('cUndo').innerHTML=IC.undo;$('cDis').innerHTML=IC.swap}
 $('cDis').disabled=csel==null||S.energy<1;$('cUndo').disabled=!cundo.length;$('cEnd').classList.toggle('ready',!S.hand.some(c=>CD[c.id].e<=S.energy&&(CD[c.id].fx||cgTargets(S,c.id).length)))}
const cwait=ms=>new Promise(r=>setTimeout(r,window.__fast?0:ms));
const rectOf=el=>{const r=el.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]};
const spEl=u=>document.querySelector(`.sp[data-u="${u}"]`);
function pop(at,txt,cls){const f=document.createElement('span');f.className='pop '+(cls||'');f.textContent=txt;f.style.left=at[0]+'px';f.style.top=at[1]+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),window.__fast?0:800)}
function shoot(from,to,cls){const f=document.createElement('i');f.className='shot '+(cls||'');f.style.transform=`translate(${from[0]}px,${from[1]}px)`;document.body.appendChild(f);requestAnimationFrame(()=>requestAnimationFrame(()=>{f.style.transform=`translate(${to[0]}px,${to[1]}px)`}));setTimeout(()=>f.remove(),window.__fast?0:330)}
function dash(el,to,ms){if(!el||!el.animate||window.__fast)return;const a=rectOf(el);el.animate([{transform:'translate(0,0)'},{transform:`translate(${to[0]-a[0]}px,${to[1]-a[1]}px) scale(1.15)`,offset:.5},{transform:'translate(0,0)'}],{duration:ms||520,easing:'ease-in-out'})}
function chint(){document.querySelectorAll('.hand-hint').forEach(e=>e.remove());if(S.stage!==0||S.turn>2||cundo.length||cdrag||csel!=null||cbusy)return;
 const i=S.hand.findIndex(c=>!CD[c.id].fx&&CD[c.id].e<=S.energy&&cgTargets(S,c.id).length),f=document.createElement('span');f.className='hand-hint';f.textContent='👆';
 if(i<0){const b=rectOf($('cEnd'));f.classList.add('tap');f.style.left=b[0]+'px';f.style.top=b[1]+'px';document.body.appendChild(f);return}
 const t=cgTargets(S,S.hand[i].id).pop(),c=document.querySelector(`#cHand .cc[data-h="${i}"]`),g=document.querySelector(`.cell[data-l="${t.l}"][data-c="${t.c}"]`);if(!c||!g||!c.animate)return;const a=rectOf(c),b=rectOf(g);f.style.left=a[0]+'px';f.style.top=a[1]+'px';document.body.appendChild(f);
 f.animate([{transform:'translate(0,0)',opacity:0},{transform:'translate(0,0)',opacity:1,offset:.15},{transform:`translate(${b[0]-a[0]}px,${b[1]-a[1]}px)`,opacity:1,offset:.8},{transform:`translate(${b[0]-a[0]}px,${b[1]-a[1]}px)`,opacity:0}],{duration:1900,iterations:Infinity,easing:'ease-in-out'})}
/* 回合结算：一条道一条道演给玩家看 */
async function cend(){if(cbusy||S.over)return;cbusy=true;csel=null;cinfo=null;cundo=[];crender();document.querySelectorAll('.hand-hint').forEach(e=>e.remove());const sc=cgScore(S);
 for(let l=0;l<3;l++){const r=sc[l],L=S.lanes[l];if(r.done)continue;const lane=document.querySelector(`.lane[data-l="${l}"]`),duel=lane.querySelector('.duel'),pw=duel.querySelector('.pw'),pp=duel.querySelector('.pp'),front=rectOf(duel),on=r.A.filter(a=>!a.off);
  lane.classList.add('act');pw.textContent='0';let need=L.P;pp.textContent=need;await cwait(180);
  /* 吃藻的先上：游到前线啃一口，污染值往下掉 */
  for(const a of on){const e=CD[a.c.id].eat;if(!e)continue;const el=spEl(a.c.u);dash(el,front,520);await cwait(260);need=Math.max(0,need-e);pp.textContent=need;pp.classList.remove('hit');void pp.offsetWidth;pp.classList.add('hit');pop(front,'−'+e,'eat');tone(180,.16,'square',.05);await cwait(300)}
  /* 搭配效果：成对靠在一起，掠食者冲向猎物，裂唇鱼去给最强的鱼清洁 */
  const cleaners=on.filter(a=>a.c.id==='cleaner'),cleaned=on.filter(a=>a.cl);cleaners.forEach((cl,i)=>{if(cleaned[i]){dash(spEl(cl.c.u),rectOf(spEl(cleaned[i].c.u)),560);setTimeout(()=>{const e=spEl(cleaned[i].c.u);if(e){e.classList.add('spark');pop(rectOf(e),'×2','x2')}},window.__fast?0:280)}});
  on.forEach(a=>{const el=spEl(a.c.u);if(!el||!a.fx)return;if(a.fx.includes('hunt')){const prey=on.find(o=>o!==a&&(o.c.id==='sardine'||a.c.id==='shark'));if(prey)dash(el,rectOf(spEl(prey.c.u)),480)}if(a.fx.includes('pair')){el.classList.add('spark');pop(rectOf(el),'×2','x2')}if(a.fx.includes('school'))el.classList.add('spark')});
  if(on.some(a=>a.cl||(a.fx&&a.fx.length))){tone(880,.12,'triangle',.07);await cwait(520)}
  /* 每个生物吐一个泡泡打向污染，净化力一点点涨上去 */
  let run=0;for(const a of on){if(!a.p)continue;const el=spEl(a.c.u);if(el){el.classList.remove('pulse');void el.offsetWidth;el.classList.add('pulse');shoot(rectOf(el),front,a.fr?'big':'')}await cwait(90);run+=a.p*(S.x2?2:1);pw.textContent=run;tone(392+Math.min(run,40)*14,.07,'triangle',.06)}
  await cwait(260);const mass=lane.querySelector('.mass'),cw=lane.getBoundingClientRect().width/NC;duel.classList.add(r.win?'won':'lost');
  if(r.win){mass.style.transform=`translateX(${cw}px)`;duel.style.transform=`translateX(${cw}px)`;tone(330,.35,'sine',.1,880)}else{mass.style.transform=`translateX(${-cw}px)`;duel.style.transform=`translateX(${-cw}px)`;lane.classList.add('shake');SFX.eaten()}
  await cwait(520);lane.classList.remove('act')}
 cgEnd(S);if(S.over){await cwait(300);cbusy=false;cfinish();return}crender();cbusy=false;chint()}
function cfinish(){const st=CFG[S.stage];if(S.over==='lose'){SFX.lose();const full=S.lanes.find(L=>L.front<=0);ov(`<h1>${full?'一条水道被污染占满了':'时间到了，污染还在'}</h1><p>每条道都要有东西顶着。紧挨污染的那一格净化力翻倍，但污染一进就先盖住它。</p><button class="go" data-cact="again">再试这片水域</button>`);return}
 SFX.win();if(S.offer){cpick=null;ov(`<h1>${st.n}净化完成</h1><p style="text-align:center">选 1 张新的记忆卡加入牌组。</p><div class="offer">${S.offer.map((k,i)=>handCard(k,`data-pick="${i}"`)).join('')}</div><p id="cPickInfo" style="font-size:13px;color:var(--dim)">点一张看说明，再点一次确认。</p>`)}
 else ov(`<h1>整片礁净化完成</h1><p>三片水域都恢复了。你的牌组里现在有 ${S.cards.length} 张记忆卡。</p><button class="go" data-cact="new">再来一局</button>`)}
function cplay(i,l,c){const snap=JSON.stringify(S),u=S.hand[i]&&S.hand[i].u;if(cgPlay(S,i,l,c)){cundo.push(snap);csel=null;cinfo=null;SFX.place();crender();chint();const el=spEl(u);if(el){el.classList.add('drop');const r=rectOf(el);for(let n=0;n<5;n++){const b=document.createElement('i');b.className='bub2';b.style.left=r[0]+(Math.random()*30-15)+'px';b.style.top=r[1]+'px';b.style.animationDelay=n*.05+'s';document.body.appendChild(b);setTimeout(()=>b.remove(),900)}}return true}return false}
function cwhy(k,l,c){const d=CD[k.id];if(S.energy<d.e)return '能量不够：它要 '+d.e+' 点';if(l==null)return '拖到发亮的格子里';const L=S.lanes[l];if(!d.ln.includes(L.type))return d.n+'不去这条道。看牌底的颜色：'+d.ln.map(t=>t==='blue'?'蓝水':t==='reef'?'礁石':'沙地').join('、');if(c>=L.front)return '这格被污染占着';const x=L.cells[c];if(d.hab)return '这格已经有东西了';if(d.home&&(!x.hab||x.hab.id!==d.home))return d.n+'要住'+CD[d.home].n+'，先放一个';return '这格住满了（最多 2 个）'}
document.addEventListener('pointerdown',e=>{if(mode!=='cg'||cbusy||!S||S.over)return;const c=e.target.closest('#cHand .cc');if(!c)return;document.querySelectorAll('.hand-hint').forEach(x=>x.remove());cdrag={i:+c.dataset.h,x0:e.clientX,y0:e.clientY,moved:false,ghost:null,pid:e.pointerId};try{c.setPointerCapture(e.pointerId)}catch(_){}});
const cellAt=(x,y)=>{const u=document.elementsFromPoint(x,y).find(n=>n.classList&&n.classList.contains('cell'));return u?{l:+u.dataset.l,c:+u.dataset.c,el:u}:null};
document.addEventListener('pointermove',e=>{if(!cdrag||e.pointerId!==cdrag.pid)return;if(!cdrag.moved){if(Math.hypot(e.clientX-cdrag.x0,e.clientY-cdrag.y0)<9)return;cdrag.moved=true;csel=null;cinfo=null;const src=document.querySelector(`#cHand .cc[data-h="${cdrag.i}"]`),g=src.cloneNode(true);g.classList.add('ghost');g.classList.remove('sel','dead');g.removeAttribute('data-h');g.style.cssText='';document.body.appendChild(g);cdrag.ghost=g;crender();const s2=document.querySelector(`#cHand .cc[data-h="${cdrag.i}"]`);if(s2)s2.classList.add('lift')}
 cdrag.ghost.style.transform=`translate(${e.clientX-37}px,${e.clientY-100}px) rotate(${Math.max(-8,Math.min(8,(e.clientX-cdrag.x0)*.05))}deg) scale(.85)`;
 document.querySelectorAll('.cell.over').forEach(x=>x.classList.remove('over'));const t=cellAt(e.clientX,e.clientY-56);if(t&&t.el.classList.contains('tgt'))t.el.classList.add('over');e.preventDefault()},{passive:false});
function cdrop(e){if(!cdrag||e.pointerId!==cdrag.pid)return;const d=cdrag;cdrag=null;if(d.ghost)d.ghost.remove();
 if(!d.moved){csel=csel===d.i?null:d.i;cinfo=null;crender();return}
 const k=S.hand[d.i],r=$('cScene').getBoundingClientRect();if(e.clientY-56>r.bottom+20){crender();chint();return}
 if(CD[k.id].fx){if(!cplay(d.i,-1,-1)){csay('能量不够',1);crender()}return}
 const t=cellAt(e.clientX,e.clientY-56);if(t&&cplay(d.i,t.l,t.c))return;
 if(t&&S.energy>=CD[k.id].e){const alt=cgTargets(S,k.id).filter(q=>q.l===t.l).sort((a,b)=>Math.abs(a.c-t.c)-Math.abs(b.c-t.c))[0];if(alt&&Math.abs(alt.c-t.c)<=1&&cplay(d.i,alt.l,alt.c))return}
 csay(cwhy(k,t?t.l:null,t?t.c:null),1);tone(140,.12,'square',.04);csel=d.i;crender()}
document.addEventListener('pointerup',cdrop);document.addEventListener('pointercancel',e=>{if(cdrag&&e.pointerId===cdrag.pid){if(cdrag.ghost)cdrag.ghost.remove();cdrag=null;crender()}});
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const d=t.dataset;
 if(t.id==='mA'||t.id==='mB'){mode=t.id==='mA'?'cg':'td';$('mA').className=mode==='cg'?'on':'';$('mB').className=mode==='td'?'on':'';$('mCG').hidden=mode!=='cg';$('mTD').hidden=mode!=='td';$('ov').hidden=true;document.querySelectorAll('.hand-hint').forEach(x=>x.remove());try{localStorage.setItem('reefMode',mode)}catch(e){}
  if(mode==='td'){$('mInfo').textContent='';if(!tdStarted){tdStarted=true;start()}}else{crender();chint()}return}
 if(mode!=='cg')return;
 if(d.cact==='new'){S=cgInit();csel=cinfo=null;cundo=[];$('ov').hidden=true;crender();chint();return}
 if(d.cact==='again'){cgStage(S);csel=cinfo=null;cundo=[];$('ov').hidden=true;crender();return}
 if(d.pick!=null){const i=+d.pick;if(cpick===i){cpick=null;cgPick(S,i);csel=cinfo=null;cundo=[];$('ov').hidden=true;crender()}else{cpick=i;const dd=CD[S.offer[i]];document.querySelectorAll('.offer .cc').forEach((c,j)=>c.classList.toggle('sel',j===i));$('cPickInfo').innerHTML=`<b style="color:var(--ink)">${dd.n}</b>　<span style="color:var(--sun)">${dd.lg}</span><br>${dd.fact}<br>再点一次确认。`}return}
 if(cbusy||S.over)return;
 if(t.id==='cUse'){if(!cplay(csel,-1,-1))csay('能量不够',1);return}
 if(t.id==='cUndo'){if(cundo.length){S=JSON.parse(cundo.pop());csel=cinfo=null;crender()}return}
 if(t.id==='cDis'){if(csel!=null&&cgSwap(S,csel)){csel=null;cundo=[];crender()}return}
 if(t.id==='cEnd'){cend();return}
 if(d.u){const u=+d.u;if(csel!=null){const el=t.getBoundingClientRect(),q=cellAt(el.left+el.width/2,el.top+el.height/2);if(q){const k=S.hand[csel];if(!CD[k.id].fx&&cplay(csel,q.l,q.c))return}}csel=null;cinfo=cinfo===u?null:u;crender();return}
 if(d.c!=null&&d.l!=null){const l=+d.l,c=+d.c;if(csel!=null){const k=S.hand[csel];if(CD[k.id].fx){csay('点“使用”来用这张牌');return}if(cplay(csel,l,c))return;csay(cwhy(k,l,c),1);tone(140,.12,'square',.04)}else if(cinfo){cinfo=null;crender()}}});
S=cgInit();crender();setTimeout(chint,400);
try{if(localStorage.getItem('reefMode')==='td')$('mB').click()}catch(e){}
