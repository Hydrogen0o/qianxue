/* 用简单打法攻击 v7：不看局面的打法应该明显更差 */
const C=require('./cg.js');const {NC,NL,ci,laneOf,colOf}=C;
const plays=S=>{const A=[];S.hand.forEach((k,i)=>{if(S.energy>=C.CD[k.id].e)C.cgTargets(S,k.id).forEach(t=>{if(t.cell!=null&&S.cells[t.cell].c&&!C.CD[k.id].terr&&!C.CD[k.id].fx)return;A.push([i,t])})});return A};
// 新手：能放就随手放，偶尔抽牌
function playNovice(S){for(let g=0;g<40;g++){const A=plays(S);if(A.length){C.cgPlay(S,...A[Math.floor(Math.random()*A.length)]);continue}if(Math.random()<.6&&C.cgDrawAct(S))continue;break}}
// 哪亮点哪：永远第一张能打的牌、第一个亮的位置，没牌就抽
function playBlind(S){for(let g=0;g<40;g++){const A=plays(S);if(A.length){C.cgPlay(S,...A[0]);continue}if(!C.cgDrawAct(S))break}}
// 看局面：哪条道有威胁就往哪投，肉盾顶到污染源面前，珊瑚鱼进珊瑚
function threat(S,l){const f=C.foeIn(S,l);if(f)return 3+(NC-f.p)*.8+f.hp*.05;const n=C.nextIn(S,l);return n?(n.n<=2?2:.8):0}
function laneDmg(S,l){let d=0;for(let col=0;col<NC;col++)d+=C.atkOf(S,ci(l,col));return d}
function playSmart(S){for(let g=0;g<40;g++){let best=null,bv=-1;for(const [i,t] of plays(S)){const d=C.CD[S.hand[i].id];let v=0;
   if(d.fx==='plankton')v=9;else if(d.fx==='cleanup'){const f=S.foes[t.foe];v=f.hp<=4?7:2+(NC-f.p)*.5}
   else{const l=laneOf(t.cell),col=colOf(t.cell),th=threat(S,l),f=C.foeIn(S,l),x=S.cells[t.cell],fc=C.frontCell(S,l),p=f?f.p:NC;
    if(d.terr){const need=S.hand.some(k=>C.CD[k.id].home)||S.cells.some((y,c)=>y.c&&C.CD[y.c.id].home&&!y.coral);const free=S.cells.some((y,c)=>laneOf(c)===1&&y.coral&&!y.c&&!C.polluted(S,c));
      v=!x.coral?(x.c&&C.CD[x.c.id].home?7:(need&&!free?4-Math.abs(col-Math.max(0,(C.foeIn(S,1)?C.foeIn(S,1).p:NC)-3))*.6:.4)):(need&&!free?2:.3)}
    else if(d.fx==='zoox')v=x.c?3:.4;
    else if(d.h>=6){v=th*(fc<0||colOf(fc)<p-1&&col===p-1?1.6:.5)+(col===Math.min(p-1,NC-2)?1.5:0)-(col<colOf(fc)?1:0)}
    else{const reach=Math.max(col,fc<0?-9:colOf(fc))>=p-C.RNG;v=th*(d.home?(x.coral?1.3:.15):1)*(reach?1.3:.7)+(d.a||0)*.2-col*.25;if(d.school)v+=.6*[...Array(NC)].filter((_,q)=>{const o=S.cells[ci(l,q)].c;return o&&o.id===S.hand[i].id}).length;if(f&&col===p-1&&fc<0)v-=1}}
   if(v>bv){bv=v;best=[i,t]}}
  if(best&&bv>=1.2&&C.cgPlay(S,...best))continue;if(S.hand.length<4&&C.cgDrawAct(S))continue;if(best&&bv>=.6&&C.cgPlay(S,...best))continue;if(!C.cgDrawAct(S))break}}
const N=+process.argv[2]||300,LV=C.getLV();
if(require.main===module)for(const [name,pol] of [['新手乱放',playNovice],['哪亮点哪',playBlind],['看局面',playSmart]]){const out=[];for(let lv=0;lv<LV.length;lv++){let w=0,t=0,h=0;for(let n=0;n<N;n++){const S=C.cgInit(lv);let g=0;while(!S.over&&g++<80){pol(S);C.cgAutoAll(S);if(!S.over)C.cgEnd(S)}if(S.over==='win'){w++;h+=S.heart}t+=S.turn}out.push(`关${lv+1} ${Math.round(w/N*100)}%（${(t/N).toFixed(1)} 回合，剩 ${(h/(w||1)).toFixed(1)} 心）`)}console.log(name.padEnd(5),out.join('  '))}
module.exports={playNovice,playBlind,playSmart};
