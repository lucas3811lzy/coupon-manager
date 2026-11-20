# 消費券管家（Vue3 + Vite 工程版）

澳門 2026 社區消費連環賞 · 7 家贊助單位消費券管理（MOP$10/20/50/100/200）。
單頁 SPA，數據只存於本機瀏覽器（localStorage），不聯網、不上傳。

## 功能
- 7 家銀行：中國銀行、工銀澳門、澳門通、澳門國際銀行、大豐銀行、廣發銀行、支付寶（澳門）——純 logo 切換
- 收券 / 用券（紅綠配色）、「⚡用完」一鍵、數量快捷鍵 2/5/10
- 用券需消費滿面值 3 倍；消費滿 MOP$50 可抽獎
- 活動週期：週五至日＝抽獎＋消費日；週一至四＝消費日；週四提醒；週五凌晨自動清理舊券、開始新一週
- NTP 聯網校時（worldtimeapi → suning 雙備援），與裝置時間比對顯示
- 全部銀行統計頁（總額 / 已收 / 已用 / 剩餘 / 矩陣表）
- 金額等寬對齊、按位數自適應縮字號，不超出綠色卡片
- 教程動畫（首次開啟）

## 工程結構
```
├─ index.html         入口（極簡，僅掛載 #app）
├─ package.json       Vue3 + Vite
├─ vite.config.js     base:'./'（相對路徑，任何平台部署不裂圖）
├─ src/
│  ├─ main.js         掛載入口
│  ├─ store.js        常量 / 數據模型 / 響應式 store / 計算屬性（KEY='cvm-v2'）
│  └─ components/     各 .vue 組件（樣式在各組件 <style> 內）
│     ├─ ClockBar.vue / ActivityBanner.vue / BankBar.vue / TotalCard.vue
│     ├─ FaceList.vue / StatsView.vue / SheetModal.vue / Tutorial.vue
│     └─ ActModal.vue / HelpModal.vue / Toast.vue
├─ src/assets/        7 張銀行 logo（CSS background 引用，發布端可爬取）
└─ dist/              npm run build 產物（發布/部署用這個目錄）
```

## 本地開發
```bash
npm install
npm run dev        # http://localhost:5173
```

## 構建
```bash
npm run build      # 產出 dist/（index.html + assets/）
```

## 發布到 doubao-html（現有鏈接）
```bash
cd dist
lark-cli apps +deploy --file-path ./index.html --app-id app_17h6xwh4fha
lark-cli apps +release-get --app-id app_17h6xwh4fha --release-id <上一步的 release_id>   # 輪詢到 status=finished
```
線上地址：`https://4mdk7hsp7gza6.doubao.link/app/app_17h6xwh4fha`

## 部署到 Cloudflare Pages（海外，免備案）
1. 把 `dist/` 整個目錄上傳（`npx wrangler pages deploy dist`）
2. 或把 dist/ 內容推送到 Cloudflare Pages 綁定的 Git 倉庫

## 部署到火山引擎 IGA Pages
1. 控制台 → 智能體應用 / Pages 服務 → 新建靜態站點
2. 上傳 `dist/` 整個目錄，選擇 HTML 靜態託管

## 數據與遷移
- 本地數據 KEY = `cvm-v2`（教程 KEY = `cvm-tut-v2`），發版不得改 KEY
- `load()` 逐項補默認：老數據缺少新銀行/新字段時自動補空，絕不整體覆蓋
- 更換裝置 = 新空數據；清除瀏覽器數據會清空記錄

## 注意
- 銀行 logo 以 CSS `url()` 引用（非 JS 動態 src），發布/部署平台可靜態爬取，不會裂圖
- 圖片請勿放入 JS 數組或 `:src` 動態綁定，否則發布後會裂圖
