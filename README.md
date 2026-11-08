# 果择 · 按预算挑二手 Mac

## 怎么用

1. 填预算，用途可以不选。
2. 点「推荐」。
3. 点「直达」打开苹果官网这台翻新机的商品页。旁边的「去京东」「去爱回收」是同款搜索。

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

- 预算以内的 1～3 条方案。价格和「直达」来自苹果官网翻新正在卖的商品，包含 M5。
- 一档建议配置，并列出不超过预算的在售商品。
- 「去京东」「去爱回收」打开同款搜索。这两个平台抓不到稳定标价，页面上不写假价格。

更新在售清单：

```bash
npm run refresh-data
```

它会重新请求 `https://www.apple.com.cn/shop/refurbished/mac`，写入 `src/data/live-listings.ts`。

## 渠道

首页标价来自 `apple`（苹果官方翻新）。京东和爱回收只作为同款搜索入口。

| 标识 | 渠道 |
| --- | --- |
| `apple` | 苹果官网翻新，有真实价格和商品页 |
| `jd` | 京东二手搜索 |
| `web` | 爱回收搜索 |

## 打分

逻辑在 `src/scoring/score.ts`。推荐时先丢掉价格高于预算的挂牌，再打分。

- 成新分：官翻 100、99 新 96、95 新 90、9 成新 78、8 成新 62、7 成新 48。
- 金额分只和同配置比。同配置指系列、机型、年份、芯片、内存、存储、显卡都相同。等于这组均价记 50 分；比均价便宜或贵大约 25%，分别到 100 或 0。
- 综合分 = 成新分 × 成新占比 + 金额分 × 金额占比。默认各 50%。高级筛选里可以改权重。

## 主要路径

```text
src/data/live-listings.ts  苹果官网翻新的在售清单
scripts/fetch-apple-refurb.py  重新抓取上面这份清单
src/data/links.ts        商品页、京东搜索、爱回收搜索
src/recommend.ts         预算过滤、建议配置、1～3 条推荐
src/scoring/score.ts     成新分、金额分、综合分
src/App.tsx              首页：预算、推荐、建议配置
```

## 接真实数据

1. 让接口 `GET {VITE_LISTING_API}/listings` 返回 `Listing` 数组，字段见 `src/types.ts`。
2. 复制 `.env.example` 为 `.env.local`，写上 `VITE_LISTING_API`。
3. `src/data/source.ts` 的 `loadListings` 会改走这个地址。校验失败时退回内置样本。
4. 渠道用 `apple` / `jd` / `web` / `live` / `xianyu`。`apple` 的 `linkUrl` 必须是商品页。
5. `linkUrl` 填能打开的搜索页或商品页。
6. 打分继续放在 `src/scoring/score.ts`。
