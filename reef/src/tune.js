const R=require('./core.js');const clone=o=>JSON.parse(JSON.stringify(o));
// v1 谜题：穷举最优
function best1(li){let st=R.v1new(li),best=0;const cells=[];const[Rr,C]=R.v1dim(st);for(let r=0;r<Rr;r++)for(let c=0;c<C;c++)cells.push([r,c]);
 // 鹦嘴鱼先放才能清藻：多轮 DFS，按“先珊瑚格后其他”排序即可
 cells.sort((a,b)=>(st.grid[a[0]][a[1]]==='X')-(st.grid[b[0]][b[1]]==='X'));
 const go=(i)=>{if(i===cells.length){best=Math.max(best,R.v1score(st).total);return}const[r,c]=cells[i];go(i+1);const seen={};for(let h=0;h<st.hand.length;h++){const sp=st.hand[h];if(seen[sp])continue;seen[sp]=1;if(R.v1can(st,sp,r,c)){st.put[r+','+c]=sp;st.hand.splice(h,1);go(i+1);st.hand.splice(h,0,sp);delete st.put[r+','+c]}}};go(0);return best}
R.L1.forEach((L,i)=>{if(!L.turns)console.log('v1 L'+(i+1),L.t,'best',best1(i))});
// v1 回合：贪心
function bot1(li){const st=R.v1new(li);const L=R.L1[li];L.target=1e9;while(!st.over){for(;;){let b=null,bv=-1;const[Rr,C]=R.v1dim(st);st.hand.forEach((sp,h)=>{for(let r=0;r<Rr;r++)for(let c=0;c<C;c++)if(st.plays>0&&R.v1can(st,sp,r,c)){const t=clone(st);R.v1place(t,h,r,c);const v=R.v1score(t).total+Math.random();if(v>bv){bv=v;b=[h,r,c]}}});if(!b)break;R.v1place(st,...b)}R.v1end(st)}return st.total}
const q=(a,p)=>a.slice().sort((x,y)=>x-y)[Math.floor(a.length*p)];
R.L1.forEach((L,i)=>{if(L.turns){const a=[];for(let n=0;n<400;n++)a.push(bot1(i));console.log('v1 L'+(i+1),L.t,'q10/30/50/90',q(a,.1),q(a,.3),q(a,.5),q(a,.9))}});
// v2：每次放流取最优子集；换牌：留下最优子集，换掉其余
function subsets(n,max){const o=[];const go=(s,a)=>{if(a.length)o.push(a.slice());if(a.length===max)return;for(let i=s;i<n;i++){a.push(i);go(i+1,a);a.pop()}};go(0,[]);return o}
function bot2(li){const st=R.v2new(li),L=R.L2[li];const save=L.target;L.target=1e9;while(!st.over){const pick=()=>{let b=null,bv=-1;for(const s of subsets(st.hand.length,L.max)){const v=R.v2eval(st,s).gain;if(v>bv){bv=v;b=s}}return [b,bv]};
  let[b,bv]=pick();while(st.swaps>0&&st.deck.length){const need=18+li*4;if(bv>=need)break;const keep=new Set(b.length>=2&&R.v2eval(st,b).combo.mult>1?b:[]);st.sel=st.hand.map((_,i)=>i).filter(i=>!keep.has(i)).sort((x,y)=>R.SP2[st.hand[x]].lv-R.SP2[st.hand[y]].lv).slice(0,5);if(!st.sel.length)break;R.v2swap(st);[b,bv]=pick()}
  st.sel=b;R.v2play(st)}L.target=save;return st.total}
R.L2.forEach((L,i)=>{const a=[];for(let n=0;n<400;n++)a.push(bot2(i));console.log('v2 L'+(i+1),L.t,'q10/30/50/90',q(a,.1),q(a,.3),q(a,.5),q(a,.9))});
