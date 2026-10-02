# 记忆礁（原型 v0.1）

潜水扫描 + 卡牌净化游戏的“净化牌局”部分原型。暂时放在潜学仓库里，之后可以搬到独立仓库。

- 试玩：`reef/index.html`
- `src/engine.js`：规则和全部卡牌数据（无界面，浏览器和 node 共用）
- `src/index.src.html`：界面
- `src/art.js`：插画（取自潜学的插画库）
- `src/sim.js`：用贪心脚本模拟对局、调目标分：`node sim.js 500`
- `src/build.py`：合成单个 HTML
