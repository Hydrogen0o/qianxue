/* 用简单打法攻击 v8：不看局面的打法应该明显更差 */
const C=require('./cg.js');const {NC,NL,ci,laneOf,colOf}=C;
const plays=S=>{const A=[];S.hand.forEach((k,i)=>{if(S.energy>=C.CD[k.id].e)C.cgTargets(S,k.id).forEach(t=>{if(!t.swap)A.push([i,t])})});return A};
function playNovice(S){for(let g=0;g<40;g++){const A=plays(S);if(A.length){C.cgPlay(S,...A[Math.floor(Math.random()*A.length)]);continue}if(Math.random()<.6&&C.cgDrawAct(S))continue;break}}
function playBlind(S){for(let g=0;g<40;g++){const A=plays(S);if(A.length){C.cgPlay(S,...A[0]);continue}if(!C.cgDrawAct(S))break}}
function threat(S,l){const f=C.foeIn(S,l);if(f)return 3+(NC-f.p)*.8+f.hp*.05;const n=C.nextIn(S,l);return n?(n.n<=2?2:.8):0}
function playSmart(S){for(let g=0;g<40;g++){let best=null,bv=-1;const need={},free={};for(const kind of ['anem','coral']){need[kind]=S.hand.filter(k=>C.CD[k.id].home===kind).length;free[kind]=0;for(let col=0;col<NC;col++){const c=ci(1,col);if(C.inHome(S,c,kind)&&!C.polluted(S,c))free[kind]+=C.capOf(S,c)-S.cells[c].cs.length}}
  for(const [i,t] of plays(S)){const d=C.CD[S.hand[i].id];let v=0;
   if(d.fx==='plankton')v=9;else if(d.fx==='upwelling')v=S.hand.length<5?6:1.5;else if(d.fx==='cleanup'){const f=S.foes[t.foe];v=f.hp<=4?7:2+(NC-f.p)*.5}
   else{const l=laneOf(t.cell),col=colOf(t.cell),th=threat(S,l),f=C.foeIn(S,l),x=S.cells[t.cell],fc=C.frontCell(S,l),p=f?f.p:NC;
    if(d.terr&&d.terr!=='anem'&&d.terr!=='coral'){const hf=S.hand.filter(k=>{const q=C.CD[k.id];return !q.terr&&!q.fx&&q.z.includes(l)}).length;let fr=0;for(let q=0;q<NC;q++){const c=ci(l,q);if(!C.polluted(S,c))fr+=C.capOf(S,c)-S.cells[c].cs.length}v=hf>fr?3+(x.cs.length?.5:0)-(col>=p-1?1:0):.3}
    else if(d.terr){const K=d.terr,dry=x.cs.some(k=>C.CD[k.id].home===K)&&!C.inHome(S,t.cell,K),want=need[K]>free[K];v=dry?7:x.coral===0?(want&&!x.cs.some(k=>C.CD[k.id].home&&C.CD[k.id].home!==K)?4-Math.abs(col-Math.max(0,p-3))*.6:.4):(want?3.2+(x.cs.length>=C.capOf(S,t.cell)?.5:0)-(col>=p-1?1:0):.3)}
    else if(d.fx==='zoox')v=x.cs.length*1.5;
    else if(d.h>=6){v=th*((fc<0||colOf(fc)<p-1)&&col===p-1?1.6:.5)+(col===Math.min(p-1,NC-2)?1.5:0)-(fc>=0&&col<colOf(fc)?1:0)}
    else{const reach=Math.max(col,fc<0?-9:colOf(fc))>=p-C.RNG;v=th*(d.home?(C.inHome(S,t.cell,d.home)?1.3:.15):1)*(reach?1.3:.7)+(d.a||0)*.2-col*.25;if(d.gen==='e')v+=S.turn<=6?2.2:.6;if(d.school)v+=.6*[...Array(NC)].reduce((n,_,q)=>n+S.cells[ci(l,q)].cs.filter(o=>o.id===S.hand[i].id).length,0);if(f&&col===p-1&&fc<0)v-=1}}
   if(v>bv){bv=v;best=[i,t]}}
  if(best&&bv>=1.2&&C.cgPlay(S,...best))continue;if(S.hand.length<4&&C.cgDrawAct(S))continue;if(best&&bv>=.6&&C.cgPlay(S,...best))continue;if(!C.cgDrawAct(S))break}}
function game(lv,pol,extra){const S=C.cgInit(lv,extra);let g=0;while(!S.over&&g++<80){pol(S);C.cgSettle(S);if(!S.over)C.cgEnd(S)}return S}
const N=+process.argv[2]||300,LV=C.getLV();
if(require.main===module)for(const [name,pol] of [['新手乱放',playNovice],['哪亮点哪',playBlind],['看局面',playSmart]]){const out=[];for(let lv=0;lv<LV.length;lv++){let w=0,t=0,h=0;for(let n=0;n<N;n++){const S=game(lv,pol);if(S.over==='win'){w++;h+=S.heart}t+=S.turn}out.push(`关${lv+1} ${Math.round(w/N*100)}%（${(t/N).toFixed(1)} 回合，剩 ${(h/(w||1)).toFixed(1)} 心）`)}console.log(name.padEnd(5),out.join('  '))}
module.exports={playNovice,playBlind,playSmart,game};
