/* ---------- 牌局界面 v6：你指挥生物打敌人 ---------- */
mode='cg';let S,csel=null,cact=null,cinfo=null,cbusy=false,ctT=0,tdStarted=false,cdrag=null,cLv=0,cExtra=[],cSeen={},lpT=0;
try{const s=JSON.parse(localStorage.getItem('reefCG9')||'{}');if(s.lv)cLv=Math.min(LV.length-1,s.lv);if(s.seen)cSeen=s.seen;if(s.extra)cExtra=s.extra}catch(e){}
const csave=()=>{try{localStorage.setItem('reefCG9',JSON.stringify({lv:cLv,seen:cSeen,extra:cExtra}))}catch(e){}};
const cart=id=>CD[id].art?svg(P[CD[id].art]()):'';
const FXART={plankton:'<g fill="#e9fbff"><circle cx="28" cy="34" r="7"/><circle cx="62" cy="26" r="5"/><circle cx="74" cy="58" r="8"/><circle cx="40" cy="66" r="6"/><circle cx="52" cy="46" r="4"/><circle cx="22" cy="62" r="4"/></g>',
 zoox:'<circle cx="50" cy="50" r="30" fill="#f2c14e"/><g stroke="#f2c14e" stroke-width="6" stroke-linecap="round"><path d="M50 6 V16 M50 84 V94 M6 50 H16 M84 50 H94 M19 19 l7 7 M74 74 l7 7 M81 19 l-7 7 M26 74 l-7 7"/></g><circle cx="42" cy="44" r="7" fill="#a9d94a"/><circle cx="58" cy="56" r="8" fill="#8fc43a"/>',
 cleanup:'<path d="M30 34 H70 L64 88 H36Z" fill="#fff"/><path d="M24 30 H76" stroke="#fff" stroke-width="8" stroke-linecap="round"/><path d="M42 22 H58" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M43 46 V76 M57 46 V76" stroke="#7b6ad0" stroke-width="5" stroke-linecap="round"/>'};
const FART={algae:()=>ALG(false),cots:()=>P.cots(),net:()=>'<g fill="none" stroke="#c9d3d6" stroke-width="3.5"><path d="M14 20 Q50 6 86 20 Q94 50 86 80 Q50 94 14 80 Q6 50 14 20Z"/><path d="M14 20 L86 80 M86 20 L14 80 M50 8 V92 M8 50 H92 M30 13 L70 87 M70 13 L30 87"/></g><circle cx="50" cy="50" r="46" fill="rgba(180,200,205,.12)"/><circle cx="38" cy="44" r="7" fill="#fff"/><circle cx="36" cy="45" r="3.2" fill="#111"/><circle cx="62" cy="44" r="7" fill="#fff"/><circle cx="60" cy="45" r="3.2" fill="#111"/><path d="M30 34 L44 39 M70 34 L56 39" stroke="#2a3338" stroke-width="4" stroke-linecap="round"/>'};
const II={atk:'<svg viewBox="0 0 24 24"><path d="M4 20 L14 10 M12 6 L18 12 M16 4 L20 8 L18 10 L14 6Z M4 20 L7 20 L7 17" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 net:'<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12 H21 M12 3 V21 M6 6 L18 18 M18 6 L6 18"/></g></svg>',
 eat:'<svg viewBox="0 0 24 24"><path d="M12 21 V12 M12 12 L7 6 M12 12 L17 6 M12 15 L8 12 M12 15 L16 12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M3 4 L21 20" stroke="#ff7a59" stroke-width="3" stroke-linecap="round"/></svg>',
 move:'<svg viewBox="0 0 24 24"><path d="M20 12 H5 M11 5 L4 12 L11 19" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 shield:'<svg viewBox="0 0 24 24"><path d="M12 2 L21 5 V12 C21 17 17 21 12 22 C7 21 3 17 3 12 V5Z" fill="currentColor"/></svg>',
 heart:'<svg viewBox="0 0 24 24"><path d="M12 21 C4 15 2 11 2 7.5 A5 5 0 0 1 12 6 A5 5 0 0 1 22 7.5 C22 11 20 15 12 21Z" fill="currentColor"/></svg>'};
const handCard=(k,attr,extra)=>{const id=k.id||k,d=CD[id];return `<button class="cc ${d.fx?'h-fx':d.terr?'h-terr':d.home?'h-reef':'h-free'} ${extra||''}" ${attr||''}><span class="orb">${d.e}</span>${d.z?`<span class="zp">${[0,1,2].map(z=>`<i class="z${z} ${d.z.includes(z)?'on':''}"></i>`).join('')}</span>`:''}<span class="art">${svg(d.fx?FXART[d.fx]:P[d.art]())}</span>${cSeen[id]?'':'<span class="nw"></span>'}${d.play?'<span class="pl">⚡</span>':''}${d.pair||d.algae?'<span class="tag">×2</span>':d.clean?'<span class="tag">↺</span>':d.gen==='e'?'<span class="tag ge">+●</span>':d.school?'<span class="tag">+1</span>':''}<b>${d.n}</b>${d.a!=null?`<span class="st"><i class="sa">${d.clean?'↺':d.a}</i><i class="sh">${d.h}</i></span>`:'<span class="st"></span>'}</button>`};
function csay(t,bad){document.querySelectorAll('.ctoast').forEach(e=>e.remove());const d=document.createElement('div');d.className='ctoast'+(bad?' bad':'');d.textContent=t;($('stage')||document.body).appendChild(d);clearTimeout(ctT);ctT=setTimeout(()=>d.remove(),2000)}
let LAND=false,ROT=false;const RS=()=>ROT?' rotate(90deg)':'',upPt=(x,y,d)=>ROT?[x+d,y]:[x,y-d];
function applyLand(){const on=mode==='cg',vw=innerWidth,vh=innerHeight,H=document.documentElement;LAND=on;ROT=on&&vh>vw;H.classList.toggle('land',on);H.classList.toggle('rot',ROT);if(on){const W=Math.min(ROT?vh:vw,940),Hh=Math.min(ROT?vw:vh,480);H.style.setProperty('--W',W+'px');H.style.setProperty('--H',Hh+'px');H.style.setProperty('--L',ROT?'0px':(vw-W)/2+'px');H.style.setProperty('--T',ROT?'0px':(vh-Hh)/2+'px')}}
addEventListener('resize',()=>{applyLand();if(mode==='cg'&&S&&!cbusy)crender()});
const LT=[16.5,50,85],ZC=['z-top','z-reef','z-sand'],fx=p=>9.5+p*14.6;
/* 一格里几条鱼时各自的位置：[左%, 上%] 与大小 */
const CPOS={1:[[50,34]],2:[[27,36],[73,36]],3:[[27,24],[73,24],[50,66]]},CSZ={1:46,2:40,3:36};
function crender(){const st=LV[S.lv],k=csel!=null?S.hand[csel]:(cdrag&&cdrag.moved?S.hand[cdrag.i]:null),T=k&&S.energy>=CD[k.id].e?cgTargets(S,k.id):[],okc=new Set(T.filter(t=>t.cell!=null).map(t=>t.cell)),okf=new Set(T.filter(t=>t.foe!=null).map(t=>t.foe)),any=T.some(t=>t.any),hn=chint(),thr=new Set();
 if(hn&&hn.lock&&k){okc.clear();if(S.hand.indexOf(k)===hn.card)okc.add(hn.cell)}
 S.foes.forEach(f=>{const it=intent(S,f);if(it[0]==='atk'){const o=S.cells[it[2]].cs.slice().sort((a,b)=>b.hp-a.hp)[0];if(o)thr.add(o.u)}else if(it[0]==='net')thr.add(it[2])});
 const act=S.foes.reduce((n,f)=>n+f.n,0);
 $('mInfo').innerHTML=`<button id="cLvB" class="lvb">${S.lv+1}/${LV.length} ${st.n}</button><span class="prog2" role="img" aria-label="这一关的污染源：已净化 ${S.done} 个，共 ${S.total} 个">${Array.from({length:S.total},(_,i)=>`<i class="${i<S.done?'d':i<S.done+act?'a':''}"></i>`).join('')}</span>`;
 let h=`<div class="heartb" id="cHeart"><span>${II.heart}</span><b>${S.heart}</b></div>`;
 for(let l=0;l<NL;l++){const f=foeIn(S,l),fc=frontCell(S,l),nx=nextIn(S,l),reach=inReach(S,l),tot=fc>=0?calcLane(S,l).tot:0;h+=`<div class="zone ${ZC[l]}">`;
  for(let col=0;col<NC;col++){const c=ci(l,col),x=S.cells[c],n=x.cs.length,cap=capOf(S,c),side=x.coral?null:sideKind(S,c);
   h+=`<button class="slot ${okc.has(c)?'tgt':''} ${hn&&hn.cell===c&&!k?'hintt':''}" data-cell="${c}" style="left:${fx(col)}%" aria-label="${ZN[l]}第${col+1}格">${x.coral||side?`<span class="cor k-${x.coral?x.kind:side} l${x.coral} ${x.coral?'':'side'} ${x.lush?'lush':''}">${cart(x.coral?x.kind:side)}</span>`:''}`;
   x.cs.forEach((u,i)=>{const d=CD[u.id],a=valOf(S,c,u),ps=CPOS[Math.min(3,n)][i]||[50,50],sz=CSZ[Math.min(3,n)];h+=`<span class="cr ${n>1?'sm':''} ${reach&&!u.net?'rdy':''} ${u.net?'netted':''} ${d.home&&!inHome(S,c,d.home)?'dry':''} ${thr.has(u.u)?'threat':''} ${cinfo==='u'+u.u?'on':''}" data-u="${u.u}" style="width:${sz}px;height:${sz}px;left:${ps[0]}%;top:${ps[1]}%;margin:${-sz/2}px 0 0 ${-sz/2}px"><span class="sw" style="animation-duration:${2.6+(u.u%7)*.45}s;animation-delay:-${(u.u%9)*.5}s">${cart(u.id)}</span>${u.net?`<span class="nt">${II.net}</span>`:''}<i class="sa ${a>d.a?'up':''}">${d.clean?'↺':a}</i><i class="sh ${u.hp<d.h?'hurt':''}">${u.hp}</i></span>`});
   if(cap>1)h+=`<span class="cap">${Array.from({length:cap},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('')}</span>`;
   if(c===fc&&f)h+='<i class="fr"></i>';
   h+='</button>'}
  if(fc>=0)h+=`<div class="lt ${reach?(f.arm&&tot<=f.arm?'weak':''):'off'}" data-lt="${l}">${II.atk}<b>${tot}</b></div>`;
  if(f)h+=`<div class="sludge" data-su="${f.u}" style="left:${fx(f.p)}%"></div>`;
  if(nx)h+=`<div class="inc"><span>${svg(FART[nx.id]())}</span><b>${nx.n}</b></div>`;
  h+='</div>'}
 S.foes.forEach((f,i)=>{const it=intent(S,f),big=it[0]==='heart';h+=`<button class="foe ${okf.has(i)?'tgt':''} ${cinfo==='f'+f.u?'on':''} ${inReach(S,f.lane)?'inr':''}" data-foe="${i}" data-fu="${f.u}" style="top:${LT[f.lane]}%;left:calc(${fx(f.p)+7}% - 29px)"><span class="it i-${it[0]}">${II[it[0]]}${it[0]==='atk'||big?`<b>${it[1]}</b>`:''}</span><span class="fa">${svg(FART[f.id]())}</span>${f.arm?`<span class="arm">${II.shield}<b>${f.arm}</b></span>`:''}<span class="hpb"><i style="width:${f.hp/f.max*100}%"></i><b>${f.hp}</b></span></button>`});
 if(any)h+='<button class="anyt" data-any="1" aria-label="使用"></button>';
 $('cScene').innerHTML=h;
 let tx='';if(csel!=null){const d=CD[S.hand[csel].id];tx=`<b>${d.n}</b><i>${d.lg}</i>${S.energy<d.e?`<br><u>能量不够：要 ${d.e} 点。</u>`:!T.length?'<br><u>现在没有能用它的地方。</u>':''}`}
 else if(cinfo&&String(cinfo)[0]==='f'){const f=S.foes.find(x=>'f'+x.u===cinfo);if(f)tx=`<b>${FOE[f.id].n}</b><i>${FOE[f.id].lg}</i>`}
 else if(cinfo&&String(cinfo)[0]==='u'){let u=null;S.cells.forEach(x=>x.cs.forEach(o=>{if('u'+o.u===cinfo)u=o}));if(u){const d=CD[u.id];tx=`<b>${d.n}</b><i>${d.lg}</i>${u.net?'<br><u>被渔网缠住了，这回合不结算。</u>':''}`}}
 $('cText').innerHTML=tx;
 $('cOrbs').innerHTML=Array.from({length:Math.max(3,S.energy)},(_,i)=>`<i class="${i<S.energy?'on':''}"></i>`).join('');
 $('cDeck').textContent=S.deck.length;$('cDisP').textContent=S.dis.length;
 const n=S.hand.length;$('cHand').style.setProperty('--ov',n>5?((n*19-96)/(n-1)).toFixed(2)+'%':'0%');$('cHand').innerHTML=S.hand.map((c,i)=>{const d=CD[c.id],dead=S.energy<d.e||!cgTargets(S,c.id).length,rot=(i-(n-1)/2)*2.4;return handCard(c,`data-h="${i}" style="--r:${rot}deg;--y:${Math.abs(i-(n-1)/2)*5}px"`,(csel===i?'sel ':'')+(dead?'dead':'')+(hn&&hn.card===i&&csel!==i?' hintc':''))}).join('');
 if(!$('cDis').firstChild)$('cDis').innerHTML='<span class="dk"><i></i><i></i></span><b>+2</b>';
 $('cUndo').hidden=true;$('cDis').disabled=!cgCanDraw();
 const idle=!cbusy&&!S.over&&!S.hand.some(c=>CD[c.id].e<=S.energy&&cgTargets(S,c.id).length),drawHint=idle&&cgCanDraw()&&S.hand.length<5&&!(S.lv===0&&S.turn===1&&!cSeen.tutDone);$('cDis').classList.toggle('hintb',drawHint);$('cEnd').classList.toggle('ready',idle&&!drawHint);cdemo(hn)}
/* 第一关的画面引导：该拿哪张牌、放到哪。lock=第一回合只认这一步，放错不花任何东西 */
function chint(){if(!S||S.lv!==0||S.over||cbusy||cSeen.tutDone)return null;const f=foeIn(S,1),p=f?f.p:NC,hi=id=>S.hand.findIndex(k=>k.id===id&&CD[id].e<=S.energy),reef=Array.from({length:NC},(_,col)=>ci(1,col)).filter(c=>!polluted(S,c)),an=reef.filter(c=>S.cells[c].coral>0&&S.cells[c].kind==='anem'),lock=false,demo=S.turn===1;let i;
 if(!an.length&&(i=hi('anem'))>=0)return {card:i,cell:ci(1,Math.max(0,Math.min(NC-1,p-2))),lock,demo};
 if((i=hi('clown'))>=0){const c=an.filter(c=>S.cells[c].cs.length<capOf(S,c)).sort((a,b)=>b-a)[0];if(c!=null)return {card:i,cell:c,lock,demo};const j=hi('anem'),u=an.filter(c=>S.cells[c].coral<3).sort((a,b)=>b-a)[0];if(j>=0&&u!=null)return {card:j,cell:u}}
 if((i=hi('urchin'))>=0&&f&&p-1>=0){const c=ci(1,p-1);if(S.cells[c].cs.length<capOf(S,c)&&!S.cells[c].cs.some(o=>o.id==='urchin'))return {card:i,cell:c}}
 return null}
/* 拖动示意：一张半透明的牌从手里滑到落点，最多演 3 遍，放对了立刻停 */
let cdemoKey='',cdemoEl=null;function cdemo(hn){const key=hn&&hn.demo&&!cdrag&&csel==null?hn.card+':'+hn.cell+':'+S.hand.length:'';if(key===cdemoKey)return;cdemoKey=key;if(cdemoEl){cdemoEl.remove();cdemoEl=null}if(!key||window.__fast)return;
 requestAnimationFrame(()=>{if(cdemoKey!==key)return;const a=document.querySelector(`#cHand .cc[data-h="${hn.card}"]`),b=document.querySelector(`#cScene .slot[data-cell="${hn.cell}"]`);if(!a||!b||!a.animate)return;const A=rectOf(a),B=rectOf(b),g=document.createElement('div');g.className='dghost';g.innerHTML=a.querySelector('.art').innerHTML;document.body.appendChild(g);cdemoEl=g;
  const an=g.animate([{left:A[0]+'px',top:A[1]+'px',opacity:0},{left:A[0]+'px',top:A[1]+'px',opacity:.85,offset:.12},{left:B[0]+'px',top:B[1]+'px',opacity:.85,offset:.7},{left:B[0]+'px',top:B[1]+'px',opacity:0}],{duration:1700,delay:500,iterations:3,easing:'ease-in-out',fill:'both'});an.onfinish=()=>{if(cdemoEl===g){g.remove();cdemoEl=null}}})}

const cgCanDraw=()=>S.energy>=1&&!S.over&&(S.deck.length+S.dis.length>0||S.hand.length>5);
let cwarnT=-1;
const cwait=ms=>new Promise(r=>setTimeout(r,window.__fast?0:ms));
const rectOf=el=>{const r=el.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]};
const crEl=u=>document.querySelector(`#cScene .cr[data-u="${u}"]`),foeEl=u=>document.querySelector(`#cScene .foe[data-fu="${u}"]`);
function pop(at,txt,cls){const f=document.createElement('span');f.className='pop '+(cls||'');f.textContent=txt;f.style.left=at[0]+'px';f.style.top=at[1]+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),window.__fast?0:800)}
function burst(at,n,cls){for(let i=0;i<(n||8);i++){const b=document.createElement('i');b.className='bt '+(cls||'');b.style.left=at[0]+'px';b.style.top=at[1]+'px';const a=Math.random()*6.28,r=24+Math.random()*30;b.style.setProperty('--dx',Math.cos(a)*r+'px');b.style.setProperty('--dy',Math.sin(a)*r+'px');document.body.appendChild(b);setTimeout(()=>b.remove(),600)}}
function flyTo(from,toEl,cls){const to=rectOf(toEl),f=document.createElement('i');f.className='drop2 '+cls;f.style.transform=`translate(${from[0]}px,${from[1]}px)`;document.body.appendChild(f);requestAnimationFrame(()=>requestAnimationFrame(()=>{f.style.transform=`translate(${to[0]}px,${to[1]}px) scale(.7)`}));setTimeout(()=>{f.remove();toEl.classList.remove('bump');void toEl.offsetWidth;toEl.classList.add('bump')},window.__fast?0:520)}
function lunge(el,to,ms){if(!el||!el.animate||window.__fast)return;const a=rectOf(el);let dx=(to[0]-a[0])*.8,dy=(to[1]-a[1])*.8;if(ROT)[dx,dy]=[dy,-dx];el.animate([{transform:'translate(0,0)'},{transform:`translate(${dx}px,${dy}px) scale(1.15)`,offset:.45},{transform:'translate(0,0)'}],{duration:ms||380,easing:'ease-in-out'})}
function shake(el){el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake')}
/* 敌人的回合：一个个演 */
/* 结算：一条道一条道来，从左到右每条鱼把净化叠进计数器，最后一击 */
async function csettle(){const R=cgSettle(S),slide=(u,p)=>{const fe=foeEl(u),sl=document.querySelector(`#cScene .sludge[data-su="${u}"]`);if(fe)fe.style.left=`calc(${fx(p)+7}% - 29px)`;if(sl)sl.style.left=fx(p)+'%'};
 const gen=async st=>{const ce=crEl(st.u);if(!ce)return;const q=rectOf(ce);if(ce.animate&&!window.__fast)ce.animate([{transform:'scale(1)'},{transform:'scale(1.35)'},{transform:'scale(1)'}],{duration:200});if(st.op==='e'){pop(q,'+1','gen');flyTo(q,$('cOrbs'),'en');tone(880,.12,'sine',.08)}else{pop(q,'+牌','gen');flyTo(q,$('cDeck'),'cd');tone(660,.12,'sine',.08)}await cwait(200)};
 for(const r of R){const fe=r.u&&foeEl(r.u);if(!fe){for(const st of r.steps){if(st.op==='e'||st.op==='c')await gen(st);else if(st.op==='re'){const te=crEl(st.tu);if(te)pop(rectOf(te),'+2♥','heal');await cwait(160)}}continue}const arm=r.arm||0,ab=fe.querySelector('.arm'),hb0=fe.querySelector('.hpb'),hp0=+hb0.querySelector('b').textContent,mx=hp0/(parseFloat(hb0.querySelector('i').style.width)/100||1),tick=t=>{if(ab&&t>arm&&!ab.classList.contains('brk')){ab.classList.add('brk');tone(1200,.08,'square',.05)}const left=Math.max(0,hp0-Math.max(0,t-arm));hb0.querySelector('i').style.width=left/mx*100+'%';hb0.querySelector('b').textContent=left;hb0.classList.remove('pend');void hb0.offsetWidth;hb0.classList.add('pend')};const fr=rectOf(fe),cnt=document.createElement('div');cnt.className='run';cnt.textContent='0';document.body.appendChild(cnt);let i=0,first=true;
  const at=el=>{const q=rectOf(el);cnt.style.transform=`translate(${q[0]}px,${q[1]}px) translate(-50%,-50%)${RS()} translateY(-34px) scale(${Math.min(2,1+r.steps.length*0+Math.log2(1+(+cnt.textContent||0))*.12)})`};
  for(const st of r.steps){const ce=crEl(st.u);if(!ce)continue;if(first){cnt.style.transition='none';at(ce);void cnt.offsetWidth;cnt.style.transition='';first=false}
   if(st.op==='net'){shake(ce);await cwait(140);continue}
   if(st.op==='e'||st.op==='c'){await gen(st);continue}
   if(st.op==='re'){const te=crEl(st.tu);at(ce);if(ce.animate&&!window.__fast)ce.animate([{transform:'scale(1)'},{transform:'scale(1.4)'},{transform:'scale(1)'}],{duration:220});pop(rectOf(ce),'↺','x2');if(te){pop(rectOf(te),'+2♥','heal');te.classList.remove('netted')}tone(990,.12,'triangle',.07);await cwait(230);continue}
   at(ce);if(ce.animate&&!window.__fast)ce.animate([{transform:'scale(1)'},{transform:'scale(1.45) translateY(-4px)'},{transform:'scale(1)'}],{duration:200});
   if(st.op==='+'){pop(rectOf(ce),'+'+st.v,'add');tone(330*Math.pow(1.122,Math.min(i,14)),.1,'triangle',.08);cnt.textContent=st.tot;tick(st.tot);cnt.classList.remove('tick');void cnt.offsetWidth;cnt.classList.add('tick');await cwait(Math.max(110,230-i*18))}
   else{pop(rectOf(ce),'×'+st.v,'mul');cnt.textContent=st.tot;tick(st.tot);cnt.classList.remove('tick','mulf');void cnt.offsetWidth;cnt.classList.add('mulf');tone(523,.2,'square',.07);tone(784,.25,'square',.06);shake($('cScene'));await cwait(360)}
   at(ce);i++}
  if(!r.tot){cnt.remove();continue}
  await cwait(140);cnt.style.transition='transform .22s cubic-bezier(.5,0,.9,.4)';cnt.style.transform=`translate(${fr[0]}px,${fr[1]}px) translate(-50%,-50%)${RS()} scale(1.2)`;await cwait(230);cnt.remove();
  if(!r.dmg){pop(fr,'挡住','bad');if(ab){ab.classList.remove('bump');void ab.offsetWidth;ab.classList.add('bump')}tone(240,.12,'square',.06);tone(180,.18,'square',.05);await cwait(380);continue}
  const big=r.dmg>=10;fe.classList.add('hit');pop(fr,'−'+r.dmg,big?'dmg crit':'dmg');burst(fr,big?16:7,'g');tone(big?110:200,big?.3:.14,'square',.08);if(big){shake($('cScene'));tone(70,.35,'sawtooth',.07)}
  if(r.dead){await cwait(130);fe.classList.add('dying');burst(fr,14,'g');SFX.die();const sl=document.querySelector(`#cScene .sludge[data-su="${r.u}"]`);if(sl)sl.style.left='100%';for(const d of S.drops.filter(d=>d.u===r.u)){await cwait(90);flyTo(fr,d.drop==='energy'?$('cOrbs'):$('cDeck'),d.drop==='energy'?'en':'cd');tone(d.drop==='energy'?880:660,.12,'sine',.08)}await cwait(320)}
  else{if(r.push){await cwait(120);slide(r.u,r.p);tone(160,.15,'sine',.07)}await cwait(260)}}
 S.drops.length=0}
const cbusyOn=v=>{cbusy=v;document.documentElement.classList.toggle('busy',v)};
async function cend(){if(cbusy||S.over)return;cbusyOn(true);csel=null;cact=null;cinfo=null;crender();await csettle();crender();if(S.over){cbusyOn(false);cfinish();return}
 const ev=cgEnd(S),heartEl=$('cHeart');let heart=+heartEl.querySelector('b').textContent;
 const slide=(u,p)=>{const fe=foeEl(u),sl=document.querySelector(`#cScene .sludge[data-su="${u}"]`);if(fe)fe.style.left=`calc(${fx(p)+7}% - 29px)`;if(sl)sl.style.left=fx(p)+'%'},bleach=c=>{const sl=document.querySelector(`#cScene .slot[data-cell="${c}"] .cor`);if(sl){burst(rectOf(sl),8,'c');sl.classList.add('eaten')}};
 for(const e of ev){const fe=e.u&&foeEl(e.u),ce=e.ku&&crEl(e.ku);
  if(e.t==='move'){slide(e.u,e.p);tone(110,.18,'sawtooth',.04);await cwait(260);if(e.bleach){bleach(e.cell);tone(140,.3,'sawtooth',.07,60);await cwait(260)}}
  else if(e.t==='atk'){lunge(fe,rectOf(ce));await cwait(190);ce.classList.add('hurt');pop(rectOf(ce),'−'+e.dmg,'bad');SFX.eaten();shake($('cScene'));if(e.thorn){await cwait(120);pop(rectOf(fe),'−'+e.thorn,'dmg');fe.classList.add('hit');if(e.fdead){fe.classList.add('dying');burst(rectOf(fe),10,'g');const sl=document.querySelector(`#cScene .sludge[data-su="${e.u}"]`);if(sl)sl.style.left='100%'}}if(e.dead){await cwait(150);ce.classList.add('die')}
   if(e.adv){await cwait(200);slide(e.u,colOf(e.cell));if(e.bleach)bleach(e.cell)}await cwait(360)}
  else if(e.t==='heart'){lunge(fe,rectOf(heartEl));await cwait(200);heart-=e.dmg;heartEl.querySelector('b').textContent=Math.max(0,heart);shake(heartEl);shake($('cScene'));pop(rectOf(heartEl),'−'+e.dmg,'bad');SFX.eaten();fe.classList.add('dying');const sl=document.querySelector(`#cScene .sludge[data-su="${e.u}"]`);if(sl)sl.style.left='100%';await cwait(420)}
  else if(e.t==='net'){lunge(fe,rectOf(ce));await cwait(220);ce.classList.add('netted');ce.insertAdjacentHTML('beforeend',`<span class="nt">${II.net}</span>`);tone(300,.25,'sawtooth',.05,120);await cwait(360)}
  else if(e.t==='eat'){const sl=document.querySelector(`#cScene .slot[data-cell="${e.cell}"] .cor`);lunge(fe,rectOf(sl||heartEl));await cwait(220);if(e.left)sl&&burst(rectOf(sl),8,'c');else bleach(e.cell);if(sl&&e.left)sl.className=sl.className.replace(/l\d/,'l'+e.left);tone(140,.3,'sawtooth',.07,60);await cwait(380)}
  else if(e.t==='leave'){if(ce){pop(rectOf(ce),'住不下','bad');ce.classList.add('die')}await cwait(200)}
  else if(e.t==='heal'||e.t==='dry'){if(ce){pop(rectOf(ce),e.t==='heal'?'+♥':'−1',e.t==='heal'?'heal':'bad');if(e.dead)ce.classList.add('die')}}
  else if(e.t==='spawn'){await cwait(250);crender();e.us.forEach(o=>{const el=foeEl(o.u);if(!el)return;if(o.grow){pop(rectOf(el),'+'+o.grow,'bad');el.classList.add('hit')}else el.classList.add('enter')});tone(196,.3,'sawtooth',.06);await cwait(350)}
  if(S.over==='lose'&&heart<=0)break}
 await cwait(250);cbusyOn(false);crender();if(S.over)cfinish()}
function cfinish(){const st=LV[S.lv];if(S.over==='win'&&S.lv===0&&!cSeen.tutDone){cSeen.tutDone=1;csave()}if(S.over==='lose'){SFX.lose();ov(`<h1>礁心被污染吞没了</h1><p>污染源会一格格压过来，先打最前面那一格。把血厚的顶到前面；把海葵叠高，让更多鱼挤在一起叠净化。</p><button class="go" data-cact="again">再试一次</button>`);return}
 SFX.win();const last=S.lv>=LV.length-1,offer=cshuf(POOL.slice()).filter((v,i,a)=>a.indexOf(v)===i).slice(0,3);cfinish.offer=offer;cfinish.pick=null;
 ov(`<h1>${last?'这片礁净化完成':'净化完成'}</h1><p style="text-align:center">选 1 张记忆卡加入你的牌组。</p><div class="offer">${offer.map((k,i)=>handCard(k,`data-pick="${i}"`)).join('')}</div><p id="cPickInfo" style="font-size:13px;color:var(--dim);min-height:60px">点一张看说明，再点一次确认。</p>`)}
function intro(){const st=LV[S.lv],fr=st.fresh.filter(id=>!cSeen[id]),ff=st.foes.filter(id=>!cSeen['f_'+id]);if(!fr.length&&!ff.length)return;fr.forEach(id=>cSeen[id]=1);ff.forEach(id=>cSeen['f_'+id]=1);csave();
 ov(`${ff.length?`<h1 style="font-size:19px">新的污染源</h1><div class="newc">${ff.map(id=>`<div><span class="foepic">${svg(FART[id]())}</span><p><b>${FOE[id].n}</b>　${FOE[id].lg}</p></div>`).join('')}</div>`:''}${fr.length?`<h1 style="font-size:19px;margin-top:12px">新的记忆卡</h1><div class="newc">${fr.map(id=>`<div>${handCard(id)}<p>${CD[id].lg}</p></div>`).join('')}</div>`:''}<button class="go" data-cact="close">开始</button>`)}
function showCard(id){const d=CD[id];ov(`<div class="newc one"><div>${handCard(id)}<p>${d.lg}</p><p class="fa">${d.fact}</p></div></div>${d.a!=null?`<p class="leg"><i class="sa">${d.clean?'↺':d.a}</i> ${d.clean?'让左边的鱼再算一次':'净化（结算时加进这条道的总数）'}　<i class="sh">${d.h}</i> 血量</p>`:''}<button class="go" data-cact="close">知道了</button>`)}
function cplay(i,t){const k=S.hand[i];if(!k)return false;const u=k.u,rects={};S.foes.forEach(f=>{const el=foeEl(f.u);if(el)rects[f.u]=rectOf(el)});const n0=S.drops.length,tf=t&&t.foe!=null&&S.foes[t.foe]?S.foes[t.foe].u:null,nh=S.hand.length;
 const hn=chint();if(hn&&hn.lock&&(i!==hn.card||!t||t.cell!==hn.cell)){const c=document.querySelector(`#cHand .cc[data-h="${hn.card}"]`),sl=document.querySelector(`#cScene .slot[data-cell="${hn.cell}"]`);tone(180,.1,'sine',.04);csel=null;crender();[document.querySelector(`#cHand .cc[data-h="${hn.card}"]`),document.querySelector(`#cScene .slot[data-cell="${hn.cell}"]`)].forEach(e=>{if(e){e.classList.remove('nudge');void e.offsetWidth;e.classList.add('nudge')}});return 'lock'}
 const kid=k.id;if(!cgPlay(S,i,t))return false;if(!cSeen[kid]){cSeen[kid]=1;csave()}csel=null;cinfo=null;SFX.place();const px=S.pfx,dr=S.drops.slice(n0);S.drops.length=0;crender();
 if(tf&&rects[tf]){pop(rects[tf],'−4','dmg');burst(rects[tf],8,'g')}
 if(px){if(px.t==='hit'&&rects[px.u]){pop(rects[px.u],'−'+px.dmg,'dmg');burst(rects[px.u],6,'g');tone(220,.12,'square',.06);const fe=foeEl(px.u);if(fe)fe.classList.add('hit')}
  else if(px.t==='push'){const fe=foeEl(px.u);if(fe){pop(rectOf(fe),'撞退','add');fe.classList.add('hit')}tone(160,.15,'sine',.07)}
  else if(px.t==='heart'){pop(rectOf($('cHeart')),'+1','heal');$('cHeart').classList.add('bump');tone(880,.15,'sine',.08)}
  else if(px.t==='draw'){$('cDeck').classList.add('bump');const c=document.querySelectorAll('#cHand .cc');if(c.length)c[c.length-1].classList.add('drop')}}
 dr.forEach(d=>{if(rects[d.u])flyTo(rects[d.u],d.drop==='energy'?$('cOrbs'):$('cDeck'),d.drop==='energy'?'en':'cd')});
 if(t&&t.cell!=null){const d=CD[kid],cor=document.querySelector(`#cScene .slot[data-cell="${t.cell}"] .cor`),me=crEl(u);if(d.home&&me&&inHome(S,t.cell,d.home)){pop(rectOf(me),'+'+d.hb,'add');if(cor)cor.classList.add('hug');burst(rectOf(me),6,'w');tone(784,.14,'triangle',.07)}else if(d.terr&&cor){S.cells[t.cell].cs.forEach(o=>{if(CD[o.id].home===d.terr){const e=crEl(o.u);if(e)e.classList.add('drop')}});document.querySelectorAll('#cHand .cc').forEach((c,j)=>{if(S.hand[j]&&CD[S.hand[j].id].home===d.terr)c.classList.add('drop')})}}
 const el=t&&t.cell!=null?(crEl(u)||document.querySelector(`#cScene .slot[data-cell="${t.cell}"] .cor`)):$('cOrbs');if(el)el.classList.add(el.id==='cOrbs'?'bump':'drop');if(S.over)cfinish();return true}
function cwhy(k,t){const d=CD[k.id];if(S.energy<d.e)return '能量不够：它要 '+d.e+' 点';if(d.fx==='cleanup')return '净滩要拖到一个污染源身上';if(!t||t.cell==null)return '拖到一个格子上';const x=S.cells[t.cell],l=laneOf(t.cell);if(polluted(S,t.cell))return '这格被污染盖住了';if(d.fx==='zoox')return x.lush?'这格已经很茂盛了':'虫黄藻要用在一格珊瑚上';if(d.terr)return l!==1?d.n+'只能长在礁石上':x.coral&&x.kind!==d.terr?'这格已经长了别的':d.n+'最多 3 级';if(!d.z.includes(l))return d.n+'只生活在'+d.z.map(z=>ZN[z]).join('、');return l===1?'这格住满了：把海葵或珊瑚叠高能多住几条':'这格已经住了一只'}
const targetAt=(x,y)=>{for(const n of document.elementsFromPoint(x,y)){if(!n.closest||!n.closest('#cScene'))continue;const f=n.closest('.foe');if(f)return {foe:+f.dataset.foe};const s=n.closest('.slot');if(s)return {cell:+s.dataset.cell};}const r=$('cScene').getBoundingClientRect();return x>r.left&&x<r.right&&y>r.top&&y<r.bottom?{any:1}:null};
document.addEventListener('pointerdown',e=>{if(mode!=='cg'||cbusy||!S||S.over)return;const c=e.target.closest('#cHand .cc');if(!c)return;cdrag={i:+c.dataset.h,x0:e.clientX,y0:e.clientY,moved:false,ghost:null,pid:e.pointerId};try{c.setPointerCapture(e.pointerId)}catch(_){}
 clearTimeout(lpT);const i=cdrag.i;lpT=setTimeout(()=>{if(cdrag&&!cdrag.moved&&cdrag.i===i){const id=S.hand[i].id;cdrag=null;showCard(id)}},480)});
document.addEventListener('pointermove',e=>{if(!cdrag||e.pointerId!==cdrag.pid)return;if(!cdrag.moved){if(Math.hypot(e.clientX-cdrag.x0,e.clientY-cdrag.y0)<9)return;cdrag.moved=true;clearTimeout(lpT);csel=null;cact=null;cinfo=null;const src=document.querySelector(`#cHand .cc[data-h="${cdrag.i}"]`),g=src.cloneNode(true);g.classList.add('ghost');g.classList.remove('sel','dead');g.removeAttribute('data-h');g.style.cssText='';document.body.appendChild(g);cdrag.ghost=g;crender();const s2=document.querySelector(`#cHand .cc[data-h="${cdrag.i}"]`);if(s2)s2.classList.add('lift')}
 cdrag.ghost.style.transform=`translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)${RS()} translateY(-46px) rotate(${Math.max(-8,Math.min(8,((ROT?e.clientY-cdrag.y0:e.clientX-cdrag.x0))*.05))}deg) scale(.85)`;e.preventDefault()},{passive:false});
function cdrop(e){clearTimeout(lpT);if(!cdrag||e.pointerId!==cdrag.pid)return;const d=cdrag;cdrag=null;if(d.ghost)d.ghost.remove();
 if(!d.moved){csel=csel===d.i?null:d.i;cact=null;cinfo=null;crender();return}
 const k=S.hand[d.i],t=targetAt(...upPt(e.clientX,e.clientY,56));if(!t){crender();return}
 if(CD[k.id].fx==='plankton'){if(!cplay(d.i,{any:1})){csay('能量不够',1);crender()}return}
 const r=cplay(d.i,t);if(r)return;csay(cwhy(k,t),1);tone(140,.12,'square',.04);csel=d.i;crender()}
document.addEventListener('pointerup',cdrop);document.addEventListener('pointercancel',e=>{clearTimeout(lpT);if(cdrag&&e.pointerId===cdrag.pid){if(cdrag.ghost)cdrag.ghost.remove();cdrag=null;crender()}});
document.addEventListener('contextmenu',e=>{if(e.target.closest&&e.target.closest('#cHand'))e.preventDefault()});
function cstart(lv){cwarnT=-1;cLv=lv;if(lv===0)cExtra=[];csave();S=cgInit(lv,cExtra);csel=cact=cinfo=null;$('ov').hidden=true;LV[lv].foes.forEach(id=>cSeen['f_'+id]=1);crender()}
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const d=t.dataset;
 if(t.id==='mA'||t.id==='mB'){mode=t.id==='mA'?'cg':'td';$('mA').className=mode==='cg'?'on':'';$('mB').className=mode==='td'?'on':'';$('mCG').hidden=mode!=='cg';$('mTD').hidden=mode!=='td';$('ov').hidden=true;applyLand();try{localStorage.setItem('reefMode',mode)}catch(e){}
  if(mode==='td'){$('mInfo').textContent='';if(!tdStarted){tdStarted=true;start()}}else crender();return}
 if(mode!=='cg')return;
 if(d.cact==='close'){$('ov').hidden=true;return}
 if(d.cact==='again'){cstart(S.lv);return}
 if(d.golv!=null){cstart(+d.golv);return}
 if(d.pick!=null&&t.closest('#ov')){const i=+d.pick,offer=cfinish.offer;if(cfinish.pick===i){cExtra.push(offer[i]);cstart(S.lv>=LV.length-1?0:S.lv+1)}else{cfinish.pick=i;const dd=CD[offer[i]];document.querySelectorAll('.offer .cc').forEach((c,j)=>c.classList.toggle('sel',j===i));$('cPickInfo').innerHTML=`<b style="color:var(--ink)">${dd.n}</b>　${dd.lg}<br>再点一次确认。`}return}
 if(t.id==='cLvB'){ov(`<h1 style="font-size:20px">选关</h1><div class="lvs">${LV.map((l,i)=>`<button class="go ${i===S.lv?'':'alt'}" data-golv="${i}">${i+1}　${l.n}</button>`).join('')}</div><button class="go alt" data-cact="close">返回</button>`);return}
 if(cbusy||S.over)return;
 if(t.id==='cDis'){let n0=S.hand.length;const r=cgDrawAct(S);if(r){n0-=r.out;if(r.out)csay('手牌满了：最旧的 '+r.out+' 张回了弃牌堆');csel=null;SFX.sun();crender();document.querySelectorAll('#cHand .cc').forEach((c,i)=>{if(i>=n0)c.classList.add('drop')})}return}
 if(t.id==='cEnd'){cend();return}
 if(d.any&&csel!=null){if(!cplay(csel,{any:1}))csay('能量不够',1);return}
 if(d.foe!=null){const fi=+d.foe;if(csel!=null){if(!cplay(csel,{foe:fi})){csay(cwhy(S.hand[csel],{foe:fi}),1)}return}
  const key='f'+S.foes[fi].u;cinfo=cinfo===key?null:key;crender();return}
 if(d.cell!=null){const c=+d.cell,x=S.cells[c];if(csel!=null){if(cplay(csel,{cell:c}))return;csay(cwhy(S.hand[csel],{cell:c}),1);tone(140,.12,'square',.04);return}
  const cr=e.target.closest('.cr');if(cr){const key='u'+cr.dataset.u;cinfo=cinfo===key?null:key;crender()}else if(x.cs.length){const key='u'+x.cs[0].u;cinfo=cinfo===key?null:key;crender()}return}});
applyLand();cstart(cLv);
try{if(localStorage.getItem('reefMode')==='td')$('mB').click()}catch(e){}
