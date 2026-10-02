/* ============ core articles (basic / intermediate / advanced) ============ */
const A={};

A.A1={title:'为什么给生物分类',lede:'同一只海龟在不同语言里有不同名字。分类和学名，让全世界说的是同一个东西。',
key:'俗名因地而异，学名是全世界通用的对接标识。分类是一套关于“谁和谁更亲”的科学假说。',
pts:['同一物种可以有很多俗名，长得像的也可能是远亲','学名让图鉴、论文和数据库对接同一个物种','动物命名从 1758 年林奈的著作算起'],
scene:[['turtle',120,30,1.4,-10]],sceneOpt:{surface:true},gal:['Chelonia mydas','Zanclus cornutus','Heniochus'],
body:`<p>在 Alona 的潜店，导潜说 “pawikan”，中文图鉴写“绿海龟”，台湾的书写“綠蠵龜”，英文叫 green sea turtle。</p>
<p>后三个名字说的是<b>同一个物种</b>；“pawikan”在菲律宾其实泛指所有海龟，要准确指绿海龟，最好同时写学名 <span class="sci">Chelonia mydas</span>。</p>
${I('names')}
<h3>长得像，不一定是亲戚</h3>
<p>礁上常见的<b>镰鱼</b>和<b>马夫鱼</b>都拖着长长的白色背鳍丝，经常被叫混。</p>
<p>其实镰鱼自成一科（镰鱼科），马夫鱼却是蝴蝶鱼科的成员。只看俗名，你根本不知道它们隔得有多远。</p>
<h3>分类做两件事</h3>
<ul><li><b>给每个物种一个通用的${g('学名')}</b>，全世界的研究者、图鉴和数据库都用它对接。</li>
<li><b>按亲缘关系把物种分组</b>，组里套组，形成一棵树。知道一种动物在树上的位置，就能推测它的大量特征。</li></ul>
<div class="callout"><b>起点是 1758 年</b>林奈《自然系统》第 10 版被定为动物命名的正式起点，今天所有动物学名都从这一版往后算。</div>
<p>分类不是把生物塞进抽屉，而是一套可以被新证据修改的假说。后面的进阶部分会讲到具体的修改。</p>`,
links:[['WoRMS 首页','https://www.marinespecies.org'],['镰鱼 照片',iNat('Zanclus cornutus')],['马夫鱼 照片',iNat('Heniochus')]],
quiz:[{q:'为什么潜水图鉴要标学名？',o:['因为学名全世界通用','因为俗名更难念','因为学名更短'],a:0,why:'俗名各地不同还会重名，学名是全世界通用的对接标识，旧名和异名也能查到它。'}]};

A.A2={title:'学名怎么读、怎么写',lede:'一个完整的学名里藏着属、种、命名人和年份，甚至能看出它后来有没有被改过属。',
key:'学名 = 属名 + 种加词，都用斜体。看词尾就能认出等级。',
pts:['属名首字母大写，种加词全小写','作者和年份加括号，说明后来换过属','-idae 是科，-inae 是亚科；sp. 和 cf. 表示还没完全确定'],
scene:[['turtle',200,40,1.2,20],['clown',40,70,.9,0]],gal:['Chelonia mydas','Amphiprion ocellaris'],
body:`<p>林奈推广的${g('双名法')}规定：每个物种的学名由两个词组成。</p>
<p>点开下面学名的每个部分看看：</p>
${I('anatomy')}
<h3>书写规则</h3>
<ul><li>属名首字母大写，种加词全小写。</li><li>属名和种加词用<b>斜体</b>；科和科以上的名字用正体。</li><li>同一篇文字里第二次出现，属名可以缩写成首字母：<span class="sci">C. mydas</span>。</li></ul>
<h3>看词尾就知道等级</h3>
<p>动物的一些等级有固定词尾：</p>
<div class="tbl"><table><tr><th>词尾</th><th>等级</th><th>例子</th></tr>
<tr><td class="mono">-oidea</td><td>总科</td><td>Chelonioidea 海龟总科</td></tr>
<tr><td class="mono">-idae</td><td>科</td><td>Cheloniidae 海龟科</td></tr>
<tr><td class="mono">-inae</td><td>亚科</td><td>Amphiprioninae 双锯鱼亚科</td></tr>
<tr><td class="mono">-ini</td><td>族</td><td>较少用到</td></tr></table></div>
<h3>图鉴里常见的缩写</h3>
<ul><li><b>sp.</b>　属已确定、种还不确定，例如 <span class="sci">Chromodoris</span> sp.。</li><li><b>spp.</b>　同一属的多个种。</li><li><b>cf.</b>　“对照”，看起来像这个种但还没完全确认，例如 <span class="sci">Acanthaster</span> cf. <span class="sci">solaris</span>。</li></ul>`,
links:[['ICZN 国际动物命名法规','https://www.iczn.org'],['绿海龟 WoRMS',worms('Chelonia mydas')]],
quiz:[{q:'“Cheloniidae” 是哪一级？',o:['属','科','目'],a:1,why:'动物科名一律以 -idae 结尾。'},{q:'作者和年份加了括号，说明什么？',o:['命名有争议','后来被移到了别的属','命名人是两个人'],a:1,why:'括号表示这个种最初被放在另一个属里。'}]};

A.A3={title:'界门纲目科属种',lede:'七个等级一层套一层。越往下，组里的成员越少、彼此越亲近。',
key:'七级是一层套一层的组。两种生物共享的等级越低，关系越近。',
pts:['界 › 门 › 纲 › 目 › 科 › 属 › 种','中间还能插入亚门、总科等等级','绿海龟和玳瑁同科，和海蛇只同纲'],
scene:[['turtle',60,40,1.1,-15],['hawksbill',200,20,1.2,15]],gal:['Chelonia mydas','Eretmochelys imbricata','Laticauda colubrina'],
body:`<p>把分类等级想成套娃：动物界里装着几十个门，每个门里装着若干纲，一直套到种。</p>
<p>点下面的等级按钮，看绿海龟在每一层属于哪个组、同组里还有谁。</p>
${I('nest')}
<p>七级只是主干。实际分类里还会插入“亚门”“总科”“亚科”等中间等级。</p>
<h3>两个物种有多亲？</h3>
<p>判断亲缘关系，就看两者<b>最低的共同等级</b>在哪。同一套嵌套分类中，更低层级的共同类群通常提示较近亲缘；具体关系看共同祖先。不同支系的“科”“属”不是统一年龄或距离单位。</p>
<p>选两个 Alona 常见物种试试：</p>
${I('compare')}
<div class="callout"><b>一个直觉陷阱</b>海龟和海蛇都是“海里的爬行动物”，但要一直往上到“爬行纲”才汇合。绿海龟和陆地上的乌龟同属龟鳖目，比它和海蛇亲得多。</div>`,
links:[['绿海龟 完整分类',worms('Chelonia mydas')],['玳瑁 照片',iNat('Eretmochelys imbricata')]],
quiz:[{q:'绿海龟和玳瑁在哪一级分开？',o:['科','属','目'],a:1,why:'两者同属海龟科，在属这一级分开。'}]};

A.A5={title:'三域与界：生命之树的全貌',lede:'海里不只有动物。从制造氧气的蓝细菌，到住在珊瑚里的藻，先看一眼整棵树。',
key:'生命分三域。海里除了动物，还有植物界和色素界的藻，以及数不清的微生物。',
pts:['细菌、古菌、真核生物三域','WoRMS 用七个界组织全部海洋生物','“海藻”分属植物界和色素界，海草是开花植物'],
scene:[['seagrass',20,90,1,0],['coral',240,80,1.1,0],['sargassum',140,70,1.2,0]],gal:['Enhalus acoroides','Halimeda','Sargassum','Noctiluca scintillans'],
body:`<p>传统上把所有生命分成三个${g('域')}：细菌、古菌和${g('真核生物')}。</p>
<p>细菌和古菌都是没有细胞核的单细胞生物，但它们之间的差别，和人与细菌的差别一样大。</p>
${I('domains')}
<p>越来越多的证据显示，真核生物是从古菌的一支里演化出来的。</p>
<h3>WoRMS 用的是“界”</h3>
<p>海洋物种名录 WoRMS 在域之下用七个界组织全部海洋生物：</p>
<div class="tbl"><table><tr><th>界</th><th>海里的代表</th></tr>
<tr><td>动物界</td><td>从海绵到鲸，本 App 的主角</td></tr>
<tr><td>植物界</td><td>海草、红藻、绿藻</td></tr>
<tr><td>色素界</td><td>褐藻、硅藻、甲藻、有孔虫</td></tr>
<tr><td>原生动物界</td><td>多种单细胞生物</td></tr>
<tr><td>真菌界</td><td>海洋真菌</td></tr>
<tr><td>细菌界</td><td>蓝细菌、发光细菌</td></tr>
<tr><td>古菌界</td><td>热泉、普通海水和沉积物里的古菌</td></tr></table></div>
<div class="callout"><b>“海藻”不是一个类群</b>红藻、绿藻在植物界，褐藻却在色素界，和硅藻更亲。海草更特别：它是会开花结籽的开花植物。</div>
<p>珊瑚身体里的${g('虫黄藻')}是一种甲藻，在 WoRMS 里归色素界。一块珊瑚礁，就是动物界和色素界的合作。</p>`,
links:[['WoRMS 生物总表','https://www.marinespecies.org/aphia.php?p=taxdetails&id=1'],['海草 照片',iNat('Enhalus acoroides')],['蓝细菌（维基）',wiki('蓝菌门')]],
quiz:[{q:'褐藻在 WoRMS 里属于哪个界？',o:['植物界','色素界','原生动物界'],a:1,why:'褐藻和硅藻同属色素界，和红藻、绿藻不是一家。'}]};

A.A6={title:'看身体设计认“门”',lede:'门是动物最根本的身体蓝图。看对称方式、有没有组织、有没有外骨骼，就能把大部分海洋动物归到门。',
key:'门就是身体蓝图。第一眼先看对称方式。',
pts:['海绵没有对称，刺胞动物辐射对称','棘皮动物成体五辐射，大多数动物两侧对称','外形像“虫”不代表同一门'],
scene:[['sponge',30,70,1,0],['jelly',140,10,1,0],['linckia',240,90,1,20]],gal:['Xestospongia testudinaria','Linckia laevigata','Pseudobiceros','Spirobranchus'],
body:`<p>身体设计可帮助初步认识动物的门，但门是分类层级，不是统一年龄或固定不变的蓝图；同一门内部可能高度改造或丢失特征。</p>
<p>第一个要看的线索是<b>对称方式</b>。切换下面的动物，看它有几条对称轴：</p>
${I('symmetry')}
<h3>再问三个问题</h3>
<ul><li>有没有真正的组织和器官？</li><li>身体是否分节？有没有外骨骼？</li><li>有没有贝壳或刺状的皮？</li></ul>
<p>下面是潜水最常遇到的 9 个门，点开看识别要点：</p>
${I('phyla')}
<div class="callout"><b>“虫”不是分类</b>扁虫、圣诞树蠕虫、海参外形都像“虫”，却分属扁形动物门、环节动物门和棘皮动物门。</div>`,
links:[['动物门列表（维基）',wiki('动物门')],['寒武纪大爆发（维基）',wiki('寒武纪大爆发')]],
quiz:[{q:'海星成体是几辐射对称？',o:['两侧对称','四辐射','五辐射'],a:2,why:'棘皮动物成体通常五辐射对称，幼体却是两侧对称。'}]};

A.A7={title:'刺胞动物：珊瑚、海葵与水母',lede:'珊瑚礁的建造者和最会蜇人的动物同属一个门。它们共享一样武器和两种身体形态。',
key:'刺胞动物靠刺丝囊捕食，有水螅体和水母体两种形态。造礁珊瑚靠虫黄藻供能。',
pts:['水母体就是倒过来的水螅体','火珊瑚属于水螅纲，不是真珊瑚','白化是珊瑚失去共生藻或藻色素'],
scene:[['coral',30,80,1.2,0],['anemone',210,90,1.1,0],['jelly',140,0,.9,0]],gal:['Acropora','Heteractis magnifica','Millepora','Cubozoa'],
body:`<p>刺胞动物门的名字来自刺细胞。每个刺细胞里有一个${g('刺丝囊')}，受到触碰就射出带毒的细丝。</p>
<p>潜水时被“蜇”，几乎都跟它有关。</p>
<h3>两种身体：水螅体和水母体</h3>
<p>${g('水螅体')}固着、口朝上；${g('水母体')}漂浮、口朝下。点按钮把水螅体翻过来，你会发现它们其实是同一个设计。</p>
${I('polyp')}
<h3>四个常见的类群</h3>
<div class="tbl"><table><tr><th>纲</th><th>是什么</th><th>潜水提示</th></tr>
<tr><td>珊瑚虫类（旧称珊瑚纲）<br><span class="lat">Anthozoa</span></td><td>硬珊瑚、软珊瑚、海葵。终生水螅体。</td><td>硬珊瑚触手是 6 的倍数，软珊瑚 8 条羽状触手</td></tr>
<tr><td>钵水母纲<br><span class="lat">Scyphozoa</span></td><td>常见的大型水母</td><td>多数只是刺痒</td></tr>
<tr><td>立方水母纲<br><span class="lat">Cubozoa</span></td><td>伞部方盒形的箱水母</td><td>部分种具有危及生命的毒性</td></tr>
<tr><td>水螅纲<br><span class="lat">Hydrozoa</span></td><td>火珊瑚、羽螅、僧帽水母</td><td>火珊瑚长得像珊瑚，碰到会灼痛</td></tr></table></div>
<h3>珊瑚为什么有颜色</h3>
<p>造礁的硬珊瑚长得快，靠的是组织里的${g('虫黄藻')}。藻类进行光合作用，把大部分养分交给珊瑚。珊瑚的颜色来自这些共生藻，也来自珊瑚自身的色素。</p>
<div class="callout"><b>白化是怎么回事</b>海水持续过热时（强光、低温、盐度异常也可能触发），珊瑚会失去大量虫黄藻或藻色素，透出白色骨骼。温度很快回落，虫黄藻还能回来；拖久了珊瑚就会饿死。</div>`,
links:[['火珊瑚 照片',iNat('Millepora')],['箱水母 照片',iNat('Cubozoa')],['NOAA：珊瑚白化','https://oceanservice.noaa.gov/facts/coral_bleach.html']],
quiz:[{q:'火珊瑚属于哪个纲？',o:['珊瑚虫类','水螅纲','钵水母纲'],a:1,why:'火珊瑚是水螅纲，只是长得像珊瑚。'}]};

A.A8={title:'软体动物：从砗磲到章鱼',lede:'一只慢吞吞的海蛞蝓和一只会开罐头的章鱼，用的是同一份身体蓝图。',
key:'软体动物共用一份蓝图：外套膜、足、内脏团。每个纲改造了不同的部位。',
pts:['腹足纲：壳螺旋或消失，足用来爬','双壳纲：两片壳，丢了头和齿舌','头足纲：足变成腕，壳缩进体内'],
scene:[['octopus',30,20,1.3,-8],['nudi',200,110,.9,0],['clam',230,40,.9,0]],gal:['Chromodoris annae','Tridacna','Octopus cyanea','Sepia latimanus'],
body:`<p>软体动物门有三件标配：分泌贝壳的${g('外套膜')}、肌肉发达的足、装着内脏的内脏团。大多数还有刮食用的${g('齿舌')}。</p>
<p>不同的纲，就是对这份蓝图做了不同改造。切换下面的纲看看改了哪里：</p>
${I('mollusc')}
<h3>潜水时会见到的</h3>
<ul><li><b>海蛞蝓</b>（腹足纲）　成体的壳大多退化或消失；鲜艳的颜色常是警戒色，但不能单凭颜色判断有没有毒。</li>
<li><b>砗磲</b>（双壳纲）　世界上最大的双壳类，外套膜里也养着虫黄藻，所以张开时色彩斑斓。</li>
<li><b>章鱼和乌贼</b>（头足纲）　足演变成了腕，有三颗心脏，血液是蓝色的。</li></ul>
<div class="callout"><b>聪明的无脊椎动物</b>章鱼大约三分之二的神经元分布在腕上，每条腕都能在一定程度上“自己做决定”。</div>
<p>想深入学，可以去看“海蛞蝓与头足类”专长课程。</p>`,
links:[['海蛞蝓 照片',iNat('Nudibranchia')],['砗磲 照片',iNat('Tridacna')],['大蓝章鱼 照片',iNat('Octopus cyanea')]],
quiz:[{q:'哪个纲没有齿舌？',o:['腹足纲','双壳纲','头足纲'],a:1,why:'双壳类靠滤食，齿舌在演化中丢掉了。'}]};

A.A9={title:'棘皮动物：五辐射的怪咖',lede:'海星、海胆、海参看起来和我们毫无关系，但在动物树上，它们比章鱼离人类更近。',
key:'棘皮动物成体多为五辐射、幼体两侧对称，用液压的水管系统驱动管足。',
pts:['五个纲：海星、蛇尾、海胆、海参、海百合','水管系统是它们独有的装备','和脊索动物同属后口动物'],
scene:[['linckia',40,60,1.1,10],['urchin',200,90,.9,0],['crinoid',230,10,1,0]],gal:['Linckia laevigata','Acanthaster','Diadema setosum','Comatulida'],
body:`<p>棘皮动物的成体大多是五辐射对称（也有多腕或次生两侧对称的），幼体却是两侧对称，很多在水里漂游，也有直接发育或亲体育幼的。</p>
<p>这说明它们的祖先本来是两侧对称的，后来才“绕成了五瓣”。</p>
<h3>独有的水管系统</h3>
<p>它们最独特的装备是${g('水管系统')}：体内一套充满液体的液压管道（液体成分受身体调节，并不是单纯的海水），连着成百上千只管足。点按钮打开“透视”：</p>
${I('seastar')}
<h3>五个纲</h3>
<div class="tbl"><table><tr><th>纲</th><th>代表</th></tr>
<tr><td>海星纲 <span class="lat">Asteroidea</span></td><td>海星、棘冠海星</td></tr>
<tr><td>蛇尾纲 <span class="lat">Ophiuroidea</span></td><td>蛇尾（腕细长，摆动很快）</td></tr>
<tr><td>海胆纲 <span class="lat">Echinoidea</span></td><td>海胆、沙钱</td></tr>
<tr><td>海参纲 <span class="lat">Holothuroidea</span></td><td>海参</td></tr>
<tr><td>海百合纲 <span class="lat">Crinoidea</span></td><td>海羽星（礁上彩色的“羽毛”）</td></tr></table></div>
<p>为什么说它们和人更近？因为棘皮动物和脊索动物都是${g('后口动物')}。下一篇会用一棵小树说明。</p>`,
links:[['海羽星 照片',iNat('Comatulida')],['棘冠海星 照片',iNat('Acanthaster')],['海参 照片',iNat('Holothuroidea')]],
quiz:[{q:'棘皮动物的幼体是什么对称？',o:['两侧对称','五辐射','没有对称'],a:0,why:'幼体两侧对称，说明祖先原本是两侧对称的。'}]};

A.A10={title:'脊索动物：从海鞘到海龟',lede:'礁上一团不起眼的海鞘，是离脊椎动物最近的无脊椎亲戚。',
key:'脊索动物一生中都有四大特征。海鞘是脊椎动物最近的无脊椎亲戚。',
pts:['脊索、背神经管、咽鳃裂、肛后尾','海星和人同属后口动物，章鱼不是','海里的脊椎动物：软骨鱼、辐鳍鱼、爬行动物、哺乳动物'],
scene:[['squirt',30,80,1,0],['turtle',220,20,1.1,20],['clown',130,90,.8,0]],gal:['Polycarpa aurata','Laticauda colubrina','Chelonia mydas','Dugong dugon'],
body:`<p>脊索动物门的成员，一生中某个阶段都具备四个特征。点按钮逐个高亮：</p>
${I('chordate')}
<p>海鞘成体固着在礁上滤食，看起来像海绵。但它的幼体像一只小蝌蚪，四个特征一应俱全。</p>
<p>分子研究显示，海鞘所在的被囊动物是脊椎动物最近的亲戚。</p>
<h3>海星比章鱼更亲近我们</h3>
${I('deut')}
<p>两侧对称的动物可以按胚胎发育分成原口动物和${g('后口动物')}两大支（海绵、刺胞动物、栉水母不在这个二分法里）。章鱼在原口动物那边，海星和我们在后口动物这边。</p>
<h3>海里的脊椎动物</h3>
<ul><li><b>软骨鱼纲</b>　鲨、鳐、蝠鲼，骨骼是软骨。</li><li><b>辐鳍鱼纲</b>　绝大多数礁鱼，约占所有脊椎动物物种的一半。</li><li><b>爬行纲</b>　全世界 7 种海龟，以及海蛇。</li><li><b>哺乳纲</b>　鲸、海豚、儒艮。</li></ul>`,
links:[['海鞘 照片',iNat('Ascidiacea')],['黄唇青斑海蛇 照片',iNat('Laticauda colubrina')],['儒艮 照片',iNat('Dugong dugon')]],
quiz:[{q:'离脊椎动物最近的无脊椎亲戚是？',o:['文昌鱼','海鞘等被囊动物','章鱼'],a:1,why:'分子证据支持被囊动物是脊椎动物的姊妹群。'}]};

A.A11={title:'礁鱼按“科”来认',lede:'礁鱼种类多到记不住，但它们来自有限的几十个科。先认轮廓归到科，再看颜色细分到种。',
key:'先认轮廓归到科，再看颜色定到种。',
pts:['认得 20 个科，就能归类大部分礁鱼','每次潜水只盯两三个科','把易混的两个科放一起比较'],
scene:[['butterfly',30,40,1,0],['clown',150,90,.9,0],['wrasse',220,20,1,0],['trigger',230,110,.8,0]],gal:['Chaetodon','Amphiprion ocellaris','Pterois volitans','Labroides dimidiatus'],
body:`<p>专业的鱼类调查员在水下辨认的顺序是：</p>
<div class="steps"><span>看体型轮廓</span><span>归到科</span><span>看颜色斑纹</span><span>确定种</span></div>
<p>认得礁上最常见的 20 个科，大部分鱼你都能叫出“是哪一家”。点下面的轮廓，看每个科的识别要点：</p>
${I('fish')}
<div class="callout"><b>分类还在变</b>鹦嘴鱼长期自成一科，分子研究却发现它们嵌在隆头鱼科里面，有的分类系统已把它们并入隆头鱼科。</div>
<h3>练习方法</h3>
<ul><li>每次潜水只盯两三个科，看清轮廓和游泳方式。</li><li>上岸后在 iNaturalist 上传照片，看社区给的鉴定。</li><li>把易混的两个科放在一起比较，只记区别。</li></ul>`,
links:[['FishBase','https://www.fishbase.se'],['REEF 鱼类鉴定','https://www.reef.org'],['Reef Life Survey','https://reeflifesurvey.com']],
quiz:[{q:'尾柄两侧有刀状骨棘的是？',o:['刺尾鱼科','鳞鲀科','雀鲷科'],a:0,why:'刺尾鱼英文叫 surgeonfish，就是因为这把“手术刀”。'}]};

A.A4={title:'分类会变：从形态到 DNA',lede:'等级是人定的，亲缘关系是自然的。DNA 让我们看清了真实的树，也让一些老分类站不住了。',
key:'现代分类只认完整的演化支。DNA 正在改写许多老分类。',
pts:['演化支 = 一个祖先加它的全部后代','不含鸟的“爬行纲”是并系群','礁鱼的“目”在大洗牌，先学“科”更稳'],
scene:[['snake',40,60,1.3,-10],['turtle',230,40,1,15]],gal:['Laticauda colubrina','Chelonia mydas'],
body:`<p>早期分类主要看外形和解剖结构。20 世纪末开始，分子数据成为主力。</p>
<p>分类学家越来越倾向只承认${g('演化支')}：一个祖先加上它的全部后代。</p>
<h3>“爬行纲”的问题</h3>
<p>用这个标准一看，传统的“爬行纲”出了问题。下面是一棵简化的系统树，从左往右读，分叉点代表共同祖先：</p>
${I('clado')}
<p>鸟类从恐龙演化而来，和鳄鱼最亲。传统爬行纲把鸟排除在外，就成了${g('并系群')}。</p>
<h3>礁鱼的“目”正在大洗牌</h3>
<p>过去很多礁鱼被笼统放进“鲈形目”。分子研究发现它是个大杂烩，于是被拆成了许多新的目。</p>
<p>这也是为什么学礁鱼要直接从“科”入手：科相对稳定，目还在变。</p>
<div class="callout"><b>学习建议</b>把七级当成记忆框架，而不是永恒真理。资料写法不一样时，本 App 选 WoRMS 作为名称对接主干，同时保留核查日期、原名、异名和分类文献；有争议或数据库更新不同步时，展示分歧。</div>`,
links:[['演化支（维基）',wiki('演化支')],['辐鳍鱼纲（维基）',wiki('辐鳍鱼纲')]],
quiz:[{q:'为什么说传统爬行纲是并系群？',o:['它包含了哺乳动物','它漏掉了鸟类','它的成员都已灭绝'],a:1,why:'鸟类和鳄鱼同源，把鸟排除在外就不是完整的一支。'}]};

A.A12={title:'什么是一个“种”',lede:'七级里只有“种”被认为是自然存在的单位。但划定一个种，比想象中难得多。',
key:'物种是分类里最“自然”的单位，但 DNA 常常发现一个名字下藏着好几个种。',
pts:['WoRMS 已收录超过 25 万种海洋物种','每年新描述约 2000 种','棘冠海星其实包含几个隐存种，太平洋一支常写作 A. solaris'],
scene:[['cots',100,50,1.5,0],['coral',20,90,.9,0]],gal:['Acanthaster','Chelonia mydas','Laticauda colubrina','Octopus cyanea','Chromodoris annae','Eretmochelys imbricata'],
body:`<p>最常用的定义是<b>生物学物种概念</b>：能相互交配、产生可育后代的一群个体。</p>
<p>对海洋生物来说，这很难直接检验。实际工作中会综合外形、DNA、分布和行为来判断。</p>
${I('stats')}
<h3>一个名字，几个隐存种</h3>
<p>吃珊瑚的棘冠海星长期被当作一个种。2010 年前后的 DNA 研究发现（2017 年又做了命名整理），它其实是几个外形很像的${g('隐存种')}，分布在不同海域：</p>
${I('cots')}
<p>所以区域图鉴常把菲律宾的棘冠海星写成 <span class="sci">Acanthaster</span> cf. <span class="sci">solaris</span>。cf. 的意思是“与之相符、尚待确认”；不同数据库采用的分类观点也不一样。</p>
<h3>Alona 物种档案</h3>
<p>本 App 贯穿使用的六个本地物种：</p>
${I('species')}`,
links:[['WoRMS 最新统计','https://www.marinespecies.org'],['棘冠海星（维基）',wiki('棘冠海星')]],
quiz:[{q:'“cf.” 写在种名前表示什么？',o:['已灭绝','接近这个种但未完全确认','杂交种'],a:1,why:'cf. 是 confer，“对照、接近”的意思。'}]};

A.A13={title:'谁是最早的动物',lede:'动物树的根部，最先分出去的是海绵还是栉水母？这个问题争论了十几年。',
key:'最早分出的动物是栉水母还是海绵，仍有争论。2023 年的染色体证据倾向栉水母。',
pts:['栉水母有神经和肌肉，海绵没有','基因共线性是很难逆转的演化记号','新证据会不断修正生命之树'],
scene:[['ctene',60,30,1.3,0],['ctene',220,70,.8,20],['sponge',260,110,.8,0]],sceneDepth:40,gal:['Ctenophora','Porifera'],
body:`<p>直觉上海绵最简单：没有神经，没有肌肉，应该最先分出。</p>
<p>但栉水母有神经和肌肉，却在不少分子研究里跑到了树的最底部。如果栉水母最早分出，神经系统可能演化了两次，或者海绵后来把它丢掉了。</p>
<p>切换两种假说，看树根的差别：</p>
${I('ctene')}
<h3>2023 年的新证据</h3>
<p>一项发表在《自然》上的研究没有比较基因序列，而是比较${g('共线性')}：哪些基因总是排在同一条染色体上。</p>
<p>研究者发现，海绵、刺胞动物和两侧对称动物共享一些染色体融合重组的痕迹，而栉水母保留着和单细胞近亲一样的古老排列。这种融合几乎不可逆，因此支持“栉水母最早分出”。</p>
<div class="callout"><b>还没定论</b>也有研究用改进的模型得到“海绵最早”。这就是分类学的日常：一棵树，不断用新数据检验。</div>`,
links:[['Nature 2023 原文','https://www.nature.com/articles/s41586-023-05936-6'],['栉水母 照片',iNat('Ctenophora')]],
quiz:[{q:'2023 年这项研究比较的是什么？',o:['骨骼化石','基因在染色体上的排列','幼体形态'],a:1,why:'它用染色体上的基因共线性作为演化记号。'}]};

A.A14={title:'怎么学、去哪里学',lede:'一张资源清单和一套方法。读完这些课程，下一步从这里出发。',
key:'先搭框架、再挂细节；主动回忆加间隔复习；每次潜水都实地记录。',
pts:['WoRMS 查名字，iNaturalist 看照片','Coursera、REEF、Fish ID 课程系统学','每次潜完在生物树上给物种找位置'],
scene:[['turtle',140,40,1.2,0]],sceneOpt:{surface:true},gal:[],
body:`<h3>查资料</h3>
<ul><li><b>WoRMS</b>　海洋物种的权威名录，查最新学名和分类位置。</li><li><b>iNaturalist</b>　上传照片请社区鉴定，也能看别人在 Panglao 拍到了什么。</li><li><b>FishBase / SeaLifeBase</b>　鱼类和其他海洋生物的详细资料。</li></ul>
<div class="links">${LK('WoRMS','https://www.marinespecies.org')}${LK('iNaturalist','https://www.inaturalist.org')}${LK('FishBase','https://www.fishbase.se')}${LK('SeaLifeBase','https://www.sealifebase.se')}</div>
<h3>系统课程</h3>
<ul><li><b>Coursera《Marine Biology》</b>　美国自然历史博物馆开设，零基础，约 7 小时；能否免费旁听、拿证书以课程页为准。</li><li><b>REEF Fishinars</b>　免费的鱼类鉴定网课（会员），教材覆盖菲律宾所在的中印太区。</li><li><b>SSI / PADI Fish ID 专长课</b>　潜店就能报，理论加两潜实践。</li></ul>
<div class="links">${LK('Coursera Marine Biology','https://www.coursera.org/learn/marine-biology')}${LK('REEF','https://www.reef.org')}</div>
<h3>工具书</h3>
<ul><li><i>Reef Fish Identification: Tropical Pacific</i>（Allen 等）</li><li><i>Nudibranch &amp; Sea Slug Identification: Indo-Pacific</i>（Gosliner 等）</li></ul>
<h3>方法</h3>
<ul><li><b>先框架，后细节</b>　先有树，再往上挂物种。</li><li><b>主动回忆</b>　合上书自己说一遍，通常比反复重读更有效。</li><li><b>间隔复习</b>　隔一天、隔一周再回来看，用 Anki 之类的卡片工具最省事。</li><li><b>本地优先、实地记录</b>　每次潜完，把见到的物种在树上找到位置。</li></ul>`,
links:[['Anki 卡片工具','https://apps.ankiweb.net'],['Reef Life Survey','https://reeflifesurvey.com']],
quiz:[]};
