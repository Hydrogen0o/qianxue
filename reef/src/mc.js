const C=require('./cg.js');const clone=o=>JSON.parse(JSON.stringify(o));
const cfg=JSON.parse(process.argv[2]);C.setCFG(cfg);
const acts=S=>{const A=[];S.hand.forEach((k,i)=>{const d=C.CD[k.id];if(S.energy<d.e)return;if(d.fx)A.push([i,-1,-1]);else C.cgTargets(S,k.id).forEach(t=>A.push([i,t.l,t.c]))});return A};
const blind=S=>{for(;;){const a=acts(S)[0];if(!a)break;C.cgPlay(S,...a)}};
const finish=S=>{while(!S.over){blind(S);C.cgEnd(S)}return S.over==='win'?1:0};
function mcTurn(S){for(;;){const A=[null,...acts(S)];let best=null,bv=-1;for(const a of A){let v=0;for(let r=0;r<6;r++){const T=clone(S);if(a)C.cgPlay(T,...a);else{C.cgEnd(T)}v+=finish(T)}if(v>bv){bv=v;best=a}}if(!best)break;C.cgPlay(S,...best)}}
let wb=0,wm=0;const N=+process.argv[3]||60;for(let n=0;n<N;n++){let S=C.cgInit();wb+=finish(S);S=C.cgInit();while(!S.over){mcTurn(S);C.cgEnd(S)}wm+=S.over==='win'?1:0}
console.log('第一片水域  哪亮点哪',Math.round(wb/N*100)+'%','  往后推演',Math.round(wm/N*100)+'%');
