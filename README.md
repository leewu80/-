# 果择 · 按预算挑二手 Mac

## 怎么用

1. 填预算，用途可以不选。
2. 点「推荐」。
3. 点「去看看」或「直达」，到京东、闲鱼、转转、爱回收或抖音里搜这台机器。

打开页面后会先按 8000 元给出示例。也可以直接点 6000、12000 这些预算。

高级筛选收在页面最下面，不选也能用。

## 直接打开

当前可打开的地址：

https://long-adoption-suppose-text.trycloudflare.com/

不要打开自己电脑上的 `localhost:5173`，那边没有这个服务，浏览器会显示「无法访问此网站」。

## 在自己电脑上启动

需要 Node.js 20 或以上。在你自己的电脑里执行下面的命令后，浏览器打开 http://localhost:5173 。

```bash
npm install
npm run dev
```

其他命令：

```bash
npm test        # 打分、清单和预算推荐
npm run build   # 类型检查并打包到 dist
npm run preview # 预览打包结果
```

## 页面上有什么

- 预算以内的 1～3 条方案：机型全称、芯片、内存、存储、显卡、成新度、价格、渠道，以及一句为什么值。
- 一档建议配置，例如该买 M 几、多少 GB 内存、多少 GB 存储，并列出符合这档、且不超过预算的挂牌。
- 样本覆盖 MacBook Air 13/15（M1 到 M4；15 英寸从 M2 起）和 MacBook Pro 14/16（M1 Pro/Max 到 M4 Pro/Max）的常见内存和存储。五个渠道都有代表价。

价格和卖家是讲解用的代表价。链接是各平台带机型关键词的搜索页，点开就能搜到这一档，不是某一件永远有效的单品页。

## 五个渠道

| 标识 | 渠道 |
| --- | --- |
| `jd` | 京东二手（拍拍） |
| `web` | 全网二手（转转、爱回收） |
| `live` | 科技数码苹果电脑主播挂价 |
| `xianyu` | 闲鱼同款 |
| `hqb` | 华强北市场报价 |

## 打分

逻辑在 `src/scoring/score.ts`。推荐时先丢掉价格高于预算的挂牌，再打分。

- 成新分：官翻 100、99 新 96、95 新 90、9 成新 78、8 成新 62、7 成新 48。
- 金额分只和同配置比。同配置指系列、机型、年份、芯片、内存、存储、显卡都相同。等于这组均价记 50 分；比均价便宜或贵大约 25%，分别到 100 或 0。
- 综合分 = 成新分 × 成新占比 + 金额分 × 金额占比。默认各 50%。高级筛选里可以改权重。

## 主要路径

```text
src/data/catalog.ts      机型表，生成五个渠道的代表价和搜索链接
src/data/listings.ts     演示挂牌
src/data/links.ts        京东、闲鱼、转转、爱回收、抖音的搜索地址
src/recommend.ts         预算过滤、建议配置、1～3 条推荐
src/scoring/score.ts     成新分、金额分、综合分
src/App.tsx              首页：预算、推荐、建议配置
```

## 接真实数据

1. 让接口 `GET {VITE_LISTING_API}/listings` 返回 `Listing` 数组，字段见 `src/types.ts`。
2. 复制 `.env.example` 为 `.env.local`，写上 `VITE_LISTING_API`。
3. `src/data/source.ts` 的 `loadListings` 会改走这个地址。校验失败时退回内置样本。
4. 渠道用 `jd` / `web` / `live` / `xianyu` / `hqb`。
5. `linkUrl` 填能打开的搜索页或商品页。
6. 打分继续放在 `src/scoring/score.ts`。
