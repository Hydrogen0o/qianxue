/* 记忆礁 v1（摆鱼）/ v2（组牌）规则，无界面，浏览器与 node 共用 */
const adj4=(r,c,R,C)=>[[r-1,c],[r+1,c],[r,c-1],[r,c+1]].filter(([a,b])=>a>=0&&a<R&&b>=0&&b<C);
const shuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
/* ================= v1 摆鱼 ================= */
const HOME1={A:{n:'海葵',art:'anemone'},C:{n:'珊瑚',art:'coral'},S:{n:'沙地'},B:{n:'蓝水'},X:{n:'藻类'}};
const SP1={
 clown:{n:'小丑鱼',home:'A',pts:2,art:'clown'},
 eel:{n:'花园鳗',home:'S',pts:1,art:'gardeneel',sk:'每挨着一条花园鳗，+2 分'},
 chromis:{n:'光鳃鱼',home:'C',pts:1,art:'chromis'},
 butterfly:{n:'蝴蝶鱼',home:'C',pts:3,art:'butterfly'},
 cleaner:{n:'裂唇鱼',home:'C',pts:1,art:'cleaner',sk:'挨着它的鱼，得分 ×2'},
 parrot:{n:'鹦嘴鱼',home:'C',pts:2,art:'parrot',sk:'吃掉挨着它的藻类，变成沙地'},
 jack:{n:'鲹鱼',home:'B',pts:3,art:'jack'},
 ray:{n:'蓝斑魟',home:'S',pts:4,art:'ray'}};
const L1=[
 {t:'放回家',tip:'点一条小丑鱼，再点一个海葵。',grid:['AAA'],hand:['clown','clown','clown'],fact:['clown','小丑鱼一辈子住在海葵里。它帮海葵赶走天敌，海葵的毒触手保护它。']},
 {t:'各回各家',tip:'每种鱼只住自己的家。牌底的颜色就是它的家。',grid:['ASC','CAS'],hand:['clown','eel','chromis','clown','eel','chromis'],fact:['chromis','光鳃鱼成群悬在鹿角珊瑚上方，一有危险就整群缩回枝杈里。']},
 {t:'挨在一起',tip:'花园鳗喜欢扎堆：每挨着一条同伴，+2 分。',grid:['SSC','SCS','CSS'],hand:['eel','eel','eel','chromis','chromis','chromis'],fact:['eel','花园鳗成片住在沙洞里，只探出半截身子，迎着水流吃浮游生物。']},
 {t:'种类越多越好',tip:'新规则：总分 × 场上鱼的种类数。牌比格子多，挑着放。',mult:1,grid:['CAS','BCS'],hand:['chromis','chromis','chromis','clown','eel','eel','jack','butterfly'],fact:['butterfly','健康的礁上鱼的种类很多。蝴蝶鱼多不多，常被用来判断一片礁健不健康。']},
 {t:'清洁站',tip:'裂唇鱼是清洁工：挨着它的鱼，得分 ×2。',mult:1,grid:['CCC','SCB','ACS'],hand:['cleaner','butterfly','ray','jack','clown','chromis','eel','eel'],fact:['cleaner','裂唇鱼在固定的“清洁站”替别的鱼吃掉寄生虫，大鱼会排队等它。']},
 {t:'藻类',tip:'绿色是藻类，鱼住不了。鹦嘴鱼会吃掉挨着它的藻类。',mult:1,grid:['CXS','XCX','AXB'],hand:['parrot','eel','eel','eel','ray','clown','jack','chromis'],fact:['parrot','鹦嘴鱼刮食礁石上的藻类，磨碎的石灰质排出来就是白沙。']},
 {t:'一回合一回合来',tip:'每回合放 2 张。点“结束回合”时，全场的鱼一起得分。共 4 回合。',mult:1,turns:4,plays:2,grid:['CCS','ACB','SCB'],deck:['chromis','chromis','clown','eel','eel','jack','jack','butterfly','butterfly','cleaner','ray','chromis'],fact:['jack','早点放下的鱼，每回合都得分。鲹鱼白天聚成大鱼群，晚上才散开捕食。']},
 {t:'净化浅滩',tip:'每回合结束，藻类会盖住一个空着的家。鹦嘴鱼身边不长藻。共 5 回合。',mult:1,turns:5,plays:2,algae:1,grid:['CXSB','ACCX','SXCB'],deck:['chromis','chromis','clown','eel','eel','eel','jack','jack','butterfly','butterfly','cleaner','ray','parrot','parrot'],fact:['parrot','没有吃藻的鱼，藻类很快会盖住珊瑚。保护鹦嘴鱼，就是保护整片礁。']}];
function v1new(li){const L=L1[li],st={li,grid:L.grid.map(s=>s.split('')),put:{},hand:[],deck:[],turn:1,plays:L.plays||99,total:0,over:null};
 if(L.turns){st.deck=shuf(L.deck.slice());v1draw(st)}else st.hand=L.hand.slice();return st}
const v1draw=st=>{while(st.hand.length<4&&st.deck.length)st.hand.push(st.deck.pop())};
const v1dim=st=>[st.grid.length,st.grid[0].length];
function v1type(st,r,c){const t=st.grid[r][c];if(t!=='X')return t;const[R,C]=v1dim(st);return adj4(r,c,R,C).some(([a,b])=>st.put[a+','+b]==='parrot'&&st.grid[a][b]!=='X')?'S':'X'}
const v1can=(st,sp,r,c)=>!st.put[r+','+c]&&v1type(st,r,c)===SP1[sp].home;
function v1score(st){const L=L1[st.li],[R,C]=v1dim(st),F=[];for(const k in st.put){const[r,c]=k.split(',').map(Number);F.push({r,c,sp:st.put[k],pts:SP1[st.put[k]].pts})}
 const at=(r,c)=>st.put[r+','+c];
 F.forEach(f=>{const N=adj4(f.r,f.c,R,C).map(([a,b])=>at(a,b)).filter(Boolean);if(f.sp==='eel')f.pts+=2*N.filter(s=>s==='eel').length;if(f.sp!=='cleaner'&&N.includes('cleaner')){f.pts*=2;f.x2=1}});
 const sum=F.reduce((a,f)=>a+f.pts,0),kinds=new Set(F.map(f=>f.sp)).size;return {F,sum,kinds,total:L.mult?sum*kinds:sum}}
function v1place(st,i,r,c){const sp=st.hand[i];if(st.over||!sp||st.plays<=0||!v1can(st,sp,r,c))return false;st.put[r+','+c]=sp;st.hand.splice(i,1);st.plays--;return true}
function v1take(st,r,c){const L=L1[st.li],k=r+','+c;if(L.turns||!st.put[k])return false;st.hand.push(st.put[k]);delete st.put[k];
 for(let ch=1;ch;){ch=0;for(const q in st.put){const[a,b]=q.split(',').map(Number);if(v1type(st,a,b)!==SP1[st.put[q]].home){st.hand.push(st.put[q]);delete st.put[q];ch=1}}}return true}
function v1end(st){const L=L1[st.li];if(!L.turns||st.over)return null;const sc=v1score(st),ev={gain:sc.total,algae:null};st.total+=sc.total;
 if(st.total>=L.target){st.over='win';return ev}if(st.turn>=L.turns){st.over='lose';return ev}
 if(L.algae){const[R,C]=v1dim(st),P=[];for(let r=0;r<R;r++)for(let c=0;c<C;c++)if(st.grid[r][c]!=='X'&&!st.put[r+','+c]&&!adj4(r,c,R,C).some(([a,b])=>st.put[a+','+b]==='parrot'))P.push([r,c]);
  if(P.length){const p=P[Math.floor(Math.random()*P.length)];st.grid[p[0]][p[1]]='X';ev.algae=p}}
 st.turn++;st.plays=L.plays;v1draw(st);return ev}
const v1total=st=>L1[st.li].turns?st.total:v1score(st).total;
/* ================= v2 组牌 ================= */
const HOME2={reef:{n:'珊瑚礁'},sand:{n:'沙地'},blue:{n:'蓝水'},grass:{n:'海草床'}};
const SP2={
 seagrass:{n:'海草',home:'grass',lv:1,art:'seagrass'},coral:{n:'鹿角珊瑚',home:'reef',lv:1,art:'coral'},plankton:{n:'浮游动物',home:'blue',lv:1,art:'copepod'},
 chromis:{n:'光鳃鱼',home:'reef',lv:2,art:'chromis'},parrot:{n:'鹦嘴鱼',home:'reef',lv:2,art:'parrot'},turtle:{n:'绿海龟',home:'grass',lv:2,art:'turtle'},eel:{n:'花园鳗',home:'sand',lv:2,art:'gardeneel'},urchin:{n:'海胆',home:'sand',lv:2,art:'urchin'},sardine:{n:'沙丁鱼',home:'blue',lv:2,art:'sardine'},pistol:{n:'枪虾',home:'sand',lv:2,art:'pistol'},
 butterfly:{n:'蝴蝶鱼',home:'reef',lv:3,art:'butterfly'},cleaner:{n:'裂唇鱼',home:'reef',lv:3,art:'cleaner'},clown:{n:'小丑鱼',home:'reef',lv:3,art:'clown'},anem:{n:'海葵',home:'reef',lv:3,art:'anemone'},goby:{n:'虾虎鱼',home:'sand',lv:3,art:'goby'},ray:{n:'蓝斑魟',home:'sand',lv:3,art:'ray'},seahorse:{n:'海马',home:'grass',lv:3,art:'seahorse'},
 jack:{n:'鲹鱼',home:'blue',lv:4,art:'jack'},grouper:{n:'石斑鱼',home:'reef',lv:4,art:'grouper'},moray:{n:'海鳝',home:'reef',lv:4,art:'moray'},lizard:{n:'狗母鱼',home:'sand',lv:4,art:'lizardfish'},
 shark:{n:'礁鲨',home:'blue',lv:5,art:'shark'}};
const PAIRS=[['clown','anem','小丑鱼住在海葵里，互相保护'],['goby','pistol','枪虾挖洞，虾虎鱼放哨'],['moray','grouper','石斑鱼会邀请海鳝一起捕猎']];
const partner=id=>{for(const p of PAIRS){if(p[0]===id)return p[1];if(p[1]===id)return p[0]}return null};
const rep=(o)=>Object.entries(o).flatMap(([k,n])=>Array(n).fill(k));
const FULL2=rep({coral:2,chromis:3,parrot:2,butterfly:2,cleaner:1,clown:2,anem:1,grouper:1,moray:1,eel:3,urchin:1,pistol:1,goby:1,ray:1,lizard:1,plankton:2,sardine:3,jack:2,shark:1,seagrass:2,turtle:2,seahorse:2});
const COMBO={home:{n:'同一个家',d:'选的牌都住同一个家（同颜色）',m:{2:2,3:3,4:3,5:4}},school:{n:'鱼群',d:'选的牌都是同一种',m:{2:3,3:5,4:8,5:12}},chain:{n:'食物链',d:'数字一个接一个连起来，比如 1-2-3',m:{3:4,4:6,5:8}},pair:{n:'搭档',d:'两张互为搭档的牌',m:{2:5}}};
const L2=[
 {t:'放流',tip:'选 3 张牌，点“放流”。牌上的数字加起来，就是净化值。',max:3,plays:3,swaps:0,on:[],deck:rep({chromis:3,eel:3,sardine:3,butterfly:2,ray:1,jack:2,coral:2,plankton:2}),fact:['jack','牌上的数字是它在食物链里的位置：1 是被吃的，5 是顶级掠食者。']},
 {t:'同一个家',tip:'新牌型：同一个家（同颜色）的牌一起放，得分 × 张数。最多选 5 张。',max:5,plays:3,swaps:0,on:['home'],deck:rep({coral:2,chromis:3,parrot:2,butterfly:2,clown:2,eel:3,urchin:1,ray:1,goby:1,sardine:3,jack:2}),fact:['chromis','住在同一个地方的生物互相依靠。珊瑚礁只占海底不到 1%，却养活了约四分之一的海洋鱼类。']},
 {t:'鱼群',tip:'新牌型：同一种鱼一起放，就是鱼群，倍数更高。',max:5,plays:3,swaps:0,on:['home','school'],deck:rep({chromis:4,eel:4,sardine:4,butterfly:2,jack:2,ray:1,parrot:2,coral:1}),fact:['sardine','沙丁鱼成千上万挤成“饵球”。鱼越多，掠食者越难盯住其中一条。']},
 {t:'换牌',tip:'手牌不好？选中不要的牌，点“换牌”。可以换 3 次。',max:5,plays:3,swaps:3,on:['home','school'],deck:FULL2,fact:['turtle','海草床里住着绿海龟和海马。绿海龟成年后主要吃海草。']},
 {t:'食物链',tip:'新牌型：数字连起来（比如 1-2-3）是一条食物链，×4 起。',max:5,plays:3,swaps:3,on:['home','school','chain'],deck:FULL2,fact:['shark','浮游动物被沙丁鱼吃，沙丁鱼被鲹鱼吃，鲹鱼被鲨鱼吃。少了哪一环，整条链都会出问题。']},
 {t:'搭档',tip:'新牌型：有些动物是搭档。选中一张，它的搭档会亮起来。两张一起放 ×5。',max:5,plays:3,swaps:3,on:['home','school','chain','pair'],deck:FULL2.concat(['anem','pistol','goby','moray','grouper']),fact:['goby','枪虾视力差，负责挖洞；虾虎鱼在洞口放哨，一摆尾巴两个一起躲进去。']},
 {t:'净化浅滩',tip:'所有牌型都能用了。4 次放流，把污染压下去。',max:5,plays:4,swaps:3,on:['home','school','chain','pair'],deck:FULL2.concat(['anem','pistol']),fact:['parrot','一片礁要恢复，需要住得下、吃得上、种类全。你刚才用的每个牌型，都是真实的生态关系。']},
 {t:'珊瑚白化',tip:'污染反扑：珊瑚白化了，住珊瑚礁的牌只算 1 分。换别的家来打。',max:5,plays:4,swaps:4,on:['home','school','chain','pair'],boss:'reef',deck:FULL2.concat(['anem','pistol']),fact:['coral','水温过高时，珊瑚会赶走体内的共生藻而变白。时间一长，珊瑚就会饿死。']}];
function combo(ids,on){const n=ids.length;if(!n)return null;let best={key:null,n:'',mult:1};const tryc=(key,ok,extra)=>{if(on.includes(key)&&ok&&COMBO[key].m[n]&&COMBO[key].m[n]>best.mult)best={key,n:COMBO[key].n+(extra||''),mult:COMBO[key].m[n]}};
 const sp=ids.map(i=>SP2[i]);tryc('home',n>=2&&sp.every(s=>s.home===sp[0].home),' · '+HOME2[sp[0].home].n);tryc('school',n>=2&&ids.every(i=>i===ids[0]));
 const lv=sp.map(s=>s.lv).sort((a,b)=>a-b);tryc('chain',n>=3&&lv.every((v,i)=>!i||v===lv[i-1]+1));tryc('pair',n===2&&partner(ids[0])===ids[1]);return best}
const chips=(ids,L)=>ids.reduce((a,i)=>a+(L.boss&&SP2[i].home===L.boss?1:SP2[i].lv),0);
function v2new(li){const L=L2[li],st={li,deck:shuf(L.deck.slice()),hand:[],sel:[],plays:L.plays,swaps:L.swaps,total:0,over:null};v2draw(st);return st}
const v2draw=st=>{while(st.hand.length<8&&st.deck.length)st.hand.push(st.deck.pop())};
const v2eval=(st,idx)=>{const L=L2[st.li],ids=idx.map(i=>st.hand[i]),c=combo(ids,L.on),ch=chips(ids,L);return {ids,combo:c,chips:ch,gain:c?ch*c.mult:0}};
function v2play(st){const L=L2[st.li];if(st.over||!st.sel.length||st.plays<=0)return null;const e=v2eval(st,st.sel);st.total+=e.gain;st.hand=st.hand.filter((_,i)=>!st.sel.includes(i));st.sel=[];st.plays--;v2draw(st);
 if(st.total>=L.target)st.over='win';else if(st.plays<=0||!st.hand.length)st.over='lose';return e}
function v2swap(st){if(st.over||!st.sel.length||st.swaps<=0)return false;st.hand=st.hand.filter((_,i)=>!st.sel.includes(i));st.sel=[];st.swaps--;v2draw(st);return true}
const RC={adj4,SP1,HOME1,L1,v1new,v1type,v1can,v1score,v1place,v1take,v1end,v1total,v1dim,SP2,HOME2,L2,PAIRS,COMBO,partner,combo,chips,v2new,v2eval,v2play,v2swap};
[[6,6],[8,8],[14,14],[60,75],[140,182],[100,138],[240,0],[280,0]].forEach((v,i)=>{L1[i].target=v[0];L1[i].best=v[1]});[20,70,80,95,130,150,200,160].forEach((v,i)=>{L2[i].target=v});
if(typeof module!=='undefined')module.exports=RC;
