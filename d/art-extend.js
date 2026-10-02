/* ============ extensions to earlier articles + study plan ============ */

A.A3.body+=`<h3>完整的分类路径</h3>
<p>七级之间还可以插入许多中间等级。常用的有：</p>
<div class="tbl"><table><tr><th>主等级</th><th>常见的中间等级</th></tr>
<tr><td>界</td><td>亚界</td></tr><tr><td>门</td><td>亚门、下门</td></tr><tr><td>纲</td><td>总纲、亚纲、下纲</td></tr><tr><td>目</td><td>总目、亚目、下目</td></tr><tr><td>科</td><td>总科、亚科、族</td></tr><tr><td>属</td><td>亚属</td></tr><tr><td>种</td><td>亚种</td></tr></table></div>
<p>绿海龟在 WoRMS 里的路径大致是：动物界 › 脊索动物门 › 脊椎动物亚门 › 四足总纲 › 爬行纲 › 龟鳖目 › 曲颈龟亚目 › 海龟总科 › 海龟科 › 海龟属 › 绿海龟。</p>
<p>不必全部记住。知道“中间还有很多层”，看到资料里出现“总科”“亚目”时就不会困惑。</p>`;

A.A6.body+=`<h3>更深一层：动物身体的几个大问题</h3>
<p>动物学家区分门的时候，除了对称，还会看这些构造：</p>
<ul><li><b>胚层</b>　海绵几乎没有真正的组织；刺胞动物和栉水母有两个胚层（内外两层细胞）；其他大部分动物有三个胚层，中间那层发育成肌肉和大部分器官。</li>
<li><b>体腔</b>　身体里有没有一个充满液体、包着内脏的腔。扁虫没有体腔，环节动物、软体动物、脊索动物都有。</li>
<li><b>分节</b>　身体是不是由重复的节段组成。环节动物和节肢动物最明显，脊椎动物的脊椎和肌肉也是分节的。</li>
<li><b>胚胎发育</b>　胚胎最早形成的开口变成嘴还是肛门，把两侧对称动物分成原口动物和后口动物两大支。</li></ul>
<p>这些特征组合起来，就是每个门独特的“身体蓝图”。进阶课程会逐个拆开看。</p>`;

A.A10.body+=`<h3>接下来</h3>
<p>想知道“鱼”到底有哪几大类、为什么说人类也在鱼的树枝上，去读礁鱼专长里的“开阔水层的鱼，以及‘鱼’到底是什么”。海里的哺乳动物，在“鲸豚与海牛”专长里。</p>`;

A.A14={title:'资源清单：去哪里查、去哪里学',lede:'把分类学学下去，需要可靠的数据库、系统的课程和好用的工具书。这是一份按用途整理的清单。',
key:'查名字用 WoRMS，看照片用 iNaturalist，系统学用免费网课，实地练用 Fish ID 和 Reef Check 课程。',
pts:['所有资源都优先选免费或门槛低的','数据库是工具，课程是框架，潜水是练习','学完一门课，就去对应的专长路线深入'],
scene:[['diver',100,40,1.3,0]],sceneOpt:{surface:true},gal:[],
body:`<h3>查名字、查分类</h3>
<ul><li><b>WoRMS</b>　海洋物种的权威名录，查最新学名、分类路径和同物异名。</li>
<li><b>FishBase / SeaLifeBase</b>　鱼类和其他海洋生物的形态、分布、生态资料。</li>
<li><b>Corals of the World</b>　珊瑚物种的在线图鉴和分布图。</li>
<li><b>Nudibranch Domain</b>　按科整理的海蛞蝓图鉴。</li></ul>
<div class="links">${LK('WoRMS','https://www.marinespecies.org')}${LK('FishBase','https://www.fishbase.se')}${LK('SeaLifeBase','https://www.sealifebase.se')}${LK('Corals of the World','https://www.coralsoftheworld.org')}${LK('Nudibranch Domain','https://nudibranchdomain.org')}</div>
<h3>看照片、请人鉴定</h3>
<ul><li><b>iNaturalist</b>　上传照片请社区鉴定，也能按地点浏览别人在 Panglao 拍到的物种。</li>
<li><b>Reef Life Survey</b>　按物种整理的高质量水下照片。</li></ul>
<div class="links">${LK('iNaturalist','https://www.inaturalist.org')}${LK('Reef Life Survey','https://reeflifesurvey.com')}</div>
<h3>系统课程（多可免费旁听）</h3>
<ul><li><b>Coursera《Marine Biology》</b>　美国自然历史博物馆开设，零基础，约 7 小时；能否免费旁听、拿证书以课程页为准。</li>
<li><b>edX《Coral Reefs: Introduction to Challenges and Solutions》</b>　澳大利亚昆士兰大学开设，珊瑚礁生态与保护入门。</li>
<li><b>Living Oceans Foundation 珊瑚礁生态课程</b>　免费的在线单元，包括分类、珊瑚解剖、摄食、繁殖、生活史和分布。</li>
<li><b>Reef Resilience Network</b>　免费自学课程，偏重珊瑚礁管理、修复和保护区，适合想深入保育的人。</li>
<li><b>Class Central</b>　汇总各平台海洋生物学、珊瑚礁相关网课的目录，方便找新课。</li></ul>
<div class="links">${LK('Coursera Marine Biology','https://www.coursera.org/learn/marine-biology')}${LK('edX Coral Reefs','https://www.edx.org/learn/ecosystems/the-university-of-queensland-coral-reefs-introduction-to-challenges-and-solutions')}${LK('Living Oceans 课程','https://learn.livingoceansfoundation.org')}${LK('Reef Resilience','https://reefresilience.org/online-training/')}${LK('Class Central 珊瑚礁课程','https://www.classcentral.com/subject/coral-reefs')}</div>
<h3>潜水相关的实践课程</h3>
<ul><li><b>SSI / PADI Fish ID 专长</b>　潜店就能报，理论加两次实践潜水。</li>
<li><b>Reef Check EcoDiver</b>　学会按标准方法做珊瑚礁监测，认识印太指示物种。</li>
<li><b>REEF Fishinars</b>　免费的鱼类鉴定网课（会员），教材覆盖中印太区。</li>
<li><b>Green Fins</b>　了解潜水环保规范，选择加入 Green Fins 的潜店。</li></ul>
<div class="links">${LK('Reef Check 课程','https://www.reefcheck.org/tropical-program/courses-products/')}${LK('REEF','https://www.reef.org')}${LK('Green Fins','https://greenfins.net')}${LK('CoralWatch','https://coralwatch.org')}</div>
<h3>工具书</h3>
<ul><li><i>Reef Fish Identification: Tropical Pacific</i>（Allen、Steene、Humann、DeLoach）</li>
<li><i>Reef Creature Identification: Tropical Pacific</i>（Humann、DeLoach）　无脊椎动物图鉴</li>
<li><i>Nudibranch &amp; Sea Slug Identification: Indo-Pacific</i>（Gosliner、Valdés、Behrens）</li>
<li><i>Coral Reef Animals of the Indo-Pacific</i>（Gosliner、Behrens、Williams）</li>
<li><i>Corals of the World</i>（Veron）　珊瑚分类的经典参考书</li></ul>
<h3>当地机构</h3>
<ul><li><b>菲律宾海洋哺乳动物搁浅网络（PMMSN）</b>　发现搁浅的鲸豚或海龟时联系。</li>
<li><b>菲律宾渔业与水产资源局（BFAR）</b>　渔业和海洋物种保护法规。</li></ul>
<div class="links">${LK('PMMSN','https://pmmsn.org')}${LK('BFAR','https://www.bfar.da.gov.ph')}</div>`,
links:[['Anki 卡片工具','https://apps.ankiweb.net']],quiz:[]};

A.S1={title:'学习方法与 12 周计划',lede:'资料再多，没有方法也学不进去。这一篇讲怎么学，并给出一个可以照着走的 12 周计划。',
key:'先框架、后细节；主动回忆加间隔复习；每次潜水都把见到的物种放回树上。',
pts:['合上书自己说一遍，通常比反复重读更有效','隔一天、隔一周再回来看，记得最牢','一周一个主题，边读边潜边记录'],
scene:[['diver',40,50,1.2,0],['nudi',210,100,.7,0],['turtle',220,10,.8,0]],sceneOpt:{surface:true},gal:[],
body:`<h3>四个经过验证的学习方法</h3>
<ul><li><b>先框架，后细节</b>　先把“门”和主要的“纲”记牢，再往上挂科和种。新知识有地方放，才不容易忘。</li>
<li><b>主动回忆</b>　读完一篇，合上屏幕，自己说出三个要点。每篇末尾的小测就是这个用途。认知科学研究一再证明，“回想”比“重读”有效得多。</li>
<li><b>间隔复习</b>　学过的内容，隔一天、隔三天、隔一周再回来看一次。用 Anki 之类的卡片工具，它会自动安排复习时间。</li>
<li><b>联系实地</b>　每次潜水后，把见到的物种在“生物树”上找到位置。把书本知识和真实见过的生物连起来，更容易记住。</li></ul>
<h3>做自己的卡片</h3>
<p>一张好的物种卡片，正面是一张照片，背面写四样东西：</p>
<ol><li>中文名和学名</li><li>科名（以及门、纲）</li><li>一个最关键的识别特征</li><li>在哪里、什么时候见到的</li></ol>
<p>用自己拍的照片做卡片，效果最好。</p>
<h3>12 周计划</h3>
<p>每周一个主题，大约三到四篇文章，加上一到两次潜水练习。点一下可以打勾（只记在你自己的设备上）：</p>
${I('plan')}
<div class="callout"><b>别追求一次记住</b>第一次读完只记得一半很正常。第二遍、第三遍时，你会发现同一篇文章读起来完全不同。</div>`,
links:[['Anki 卡片工具','https://apps.ankiweb.net'],['iNaturalist','https://www.inaturalist.org']],quiz:[]};
