# FontFlow - 繁體中文字型分析工具

**專為繁體中文使用者打造的字型相容性檢測平台**。快速判斷日文、簡體或其他字型對繁體中文的支援程度，掌握確切的缺字清單，避免排版風險。

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

---

## ✨ 核心功能

### 字型分析

- **深度字符檢測**：基於 JF7000 標準分析 7000+ 繁體中文字符覆蓋率
- **精準缺字列表**：列出所有無法顯示的字符，避免排版風險
- **多語言評分**：同時評估繁體、簡體、日文、英文支援程度
- **實時預覽**：上傳後立即在瀏覽器中預覽字型效果

### 字型比較

- **並排對比**：同時比較多個字型的繁體中文支援度
- **快速篩選**：一眼看出哪個字型最適合繁體排版
- **互動預覽**：自定義預覽文字、顏色、大小

### 進階特性

- **100% 本地處理**：無需上傳到伺服器，隱私優先
- **無需安裝**：直接在瀏覽器預覽字型效果
- **實時分析**：分層評分系統，秒速完成分析
- **完全響應式**：支援桌面和行動設備

---

## 🎯 分析引擎原理

FontFlow 採用**分層字符測試系統**確保精準度：

| 層級       | 字符數   | 權重 | 說明                                 |
| ---------- | -------- | ---- | ------------------------------------ |
| 基本關鍵字 | 150 字   | 40%  | 最常用的繁體字（防誤判、含內靜裡等） |
| 核心繁體   | 6,373 字 | 35%  | JF7000 標準字集                      |
| 進階字集   | 1,692 字 | 15%  | 粵語、台灣、人名用字                 |
| 標點符號   | 14 字    | 10%  | 排版品質指標                         |

**評分公式**：

```
最終分數 = (基本關鍵字 × 40%) + (核心繁體 × 35%) + (進階字 × 15%) + (標點 × 10%)

若基本關鍵字缺字 > 30%，分數強制 ≤ 60%（防止誤判為可用）
```

---

## 🛠 技術棧

| 層級         | 技術                 | 版本    | 說明           |
| ------------ | -------------------- | ------- | -------------- |
| Framework    | Next.js (App Router) | 15.2.0  | 伺服器元件架構 |
| Language     | TypeScript           | 5.8.2   | 完整類型安全   |
| Styling      | Tailwind CSS         | 4.0.0   | PostCSS 架構   |
| Icons        | Lucide React         | 0.562.0 | SVG 圖示庫     |
| Font Parsing | OpenType.js          | 1.3.4   | 瀏覽器端解析   |
| Formatting   | Prettier + Tailwind  | 3.7.4   | 代碼格式化     |
| Analytics    | Vercel Analytics     | 1.6.1   | 訪客追蹤       |

---

## 📁 專案結構

```
font-flow/
├── app/
│   ├── page.tsx                    # 首頁
│   ├── layout.tsx                  # 根佈局（SEO metadata）
│   ├── not-found.tsx               # 404 頁面
│   ├── globals.css                 # 全局樣式
│   │
│   ├── (pages)/
│   │   ├── analysis/
│   │   │   ├── page.tsx            # 分析頁面
│   │   │   ├── layout.tsx          # 分析頁 metadata
│   │   │   └── AnalysisClient.tsx  # 互動邏輯
│   │   └── comparison/
│   │       ├── page.tsx            # 比較頁面
│   │       ├── layout.tsx          # 比較頁 metadata
│   │       └── ComparisonClient.tsx # 互動邏輯
│   │
│   ├── components/                 # UI 元件（13 個）
│   │   ├── StructuredData.tsx      # JSON-LD 結構化資料
│   │   ├── PreviewDisplay.tsx      # 預覽展示區
│   │   ├── MissingCharsList.tsx    # 缺字列表
│   │   ├── FontInfo.tsx            # 字型資訊卡片
│   │   ├── UploadZone.tsx          # 拖放上傳
│   │   └── ...
│   │
│   ├── hooks/                      # 自訂 Hooks（7 個）
│   │   ├── useFontAnalysis.ts      # 分析邏輯
│   │   ├── useFontComparison.ts    # 比較邏輯
│   │   ├── useFontCache.ts         # LRU 快取
│   │   └── ...
│   │
│   ├── lib/                        # 核心工具
│   │   ├── fontHelper.ts           # ⭐ 分析引擎
│   │   ├── glyphLists.ts           # 字符集定義
│   │   ├── analytics.ts            # 事件追蹤
│   │   ├── coverageHelpers.ts      # 覆蓋率計算
│   │   └── types.ts                # 類型定義
│   │
│   └── config/
│       └── constants.ts            # 全局常數
│
├── public/
│   ├── sitemap.xml                 # SEO sitemap
│   ├── robots.txt                  # 爬蟲指引
│   └── og-image.jpg                # 社交分享圖（待製作）
│
├── types/
│   └── opentype.d.ts               # 類型定義
│
├── package.json                    # 依賴配置
├── next.config.js                  # Next.js 配置
├── tsconfig.json                   # TypeScript（嚴格模式）
├── tailwind.config.js              # Tailwind 配置
├── postcss.config.js               # PostCSS 配置
├── vercel.json                     # Vercel 部署設置
├── CHANGELOG.md                    # 變更記錄
└── README.md                       # 本文件
```

---

## 🌐 頁面與 SEO

### 頁面結構

| 頁面     | 路由          | 說明                     |
| -------- | ------------- | ------------------------ |
| 首頁     | `/`           | 品牌介紹 + 功能展示      |
| 字型分析 | `/analysis`   | 上傳單一字型進行深度分析 |
| 字型比較 | `/comparison` | 並排對比多個字型         |
| 404      | `/404`        | 錯誤頁面                 |

### SEO 優化

**已實現**：

- ✅ Sitemap (`public/sitemap.xml`) — 搜尋引擎索引地圖
- ✅ Robots 配置 (`public/robots.txt`) — 爬蟲訪問策略
- ✅ JSON-LD 結構化資料 — SoftwareApplication 標記
- ✅ Open Graph 元標籤 — 社交媒體分享
- ✅ 60+ 長尾關鍵字 — 根據搜尋意圖分層
- ✅ Canonical URL — 防止重複內容

**待完成**：

- ⚠️ `public/og-image.jpg` (1200×630px) — 社交分享預覽圖
- ⚠️ 提交到 Google Search Console — https://search.google.com/search-console

---

## 🚀 快速開始

### 前置需求

- Node.js 18.17+
- npm 或 yarn

### 開發環境

```bash
# 安裝依賴
npm install

# 啟動開發伺服器（Port 4000）
npm run dev

# 開啟瀏覽器
# http://localhost:4000
```

### 可用命令

| 命令                   | 說明                 |
| ---------------------- | -------------------- |
| `npm run dev`          | 開發伺服器（熱重載） |
| `npm run build`        | 生產環境構建         |
| `npm start`            | 啟動生產伺服器       |
| `npm run format`       | 使用 Prettier 格式化 |
| `npm run format:check` | 檢查代碼格式         |

### 使用指南

#### 分析單一字型

1. 訪問 `/analysis` 頁面
2. 拖放或點擊上傳字型檔案（TTF/OTF/WOFF/WOFF2）
3. 等待分析完成（通常 1-3 秒）
4. 查看覆蓋率、缺字列表、字型資訊
5. 調整預覽（字體大小、顏色、背景）

#### 比較多個字型

1. 訪問 `/comparison` 頁面
2. 上傳最多 3 個字型（支援分次上傳）
3. 實時並排預覽對比
4. 統一調整預覽設定

---

## 📊 核心功能深入

### 分析結果包含

**覆蓋率指標**：

- 繁體中文（JF7000 基準）
- 簡體中文（GB 字集）
- 日文（平假名 + 片假名 + 漢字）
- 英文（基本拉丁字母）

**缺字列表**：

- 分類展示（按字集層級）
- 視覺標示無法顯示的字符
- 統計數據展示

**字型資訊**：

- 名稱、字符總數
- 支援的語言標籤
- 分層覆蓋率進度條

### 性能優化

- ✅ 字符結果緩存（LRU 快取）
- ✅ 分時段檢測（避免 UI 阻塞）
- ✅ 預計算字符集（使用 Set 快速查詢）
- ✅ 自動記憶體管理（防止洩漏）

---

## 🏗 架構說明

### 資料流動

```
上傳字型檔案
    ↓
OpenType.js 解析
    ↓
提取 Glyph 對應表
    ↓
逐層檢測字符支援
    ↓
分層評分計算
    ↓
生成分析報告
    ↓
實時預覽渲染
```

### 核心元件互動

```
頁面 (Page)
    ├─ Client 元件 (AnalysisClient / ComparisonClient)
    │   ├─ useFontAnalysis Hook
    │   ├─ useFontComparison Hook
    │   └─ useFontCache Hook
    │
    └─ UI 元件
        ├─ UploadZone (拖放上傳)
        ├─ FontInfo (信息卡片)
        ├─ PreviewDisplay (預覽區)
        └─ MissingCharsList (缺字列表)

lib/fontHelper.ts (核心)
    ├─ analyzeFont() — 分析邏輯
    ├─ compareCharacters() — 字符檢測
    └─ calculateScore() — 評分計算
```

### 元件結構 (Component Architecture)

元件按功能域分類，提升可維護性與代碼重用：

**Preview/ 資料夾 (8 個檔案)**：

- `PreviewCard.tsx` — 預覽卡片容器 (90 行)
- `PreviewCardHeader.tsx` — 卡片標題區 (56 行)
- `PreviewCardContent.tsx` — 卡片內容區 (55 行)
- `PreviewDisplay.tsx` — 純展示元件 (44 行)
- `PreviewSetting.tsx` — 設定容器 (64 行)
- `PreviewTextPanel.tsx` — 文字輸入面板 (129 行)
- `FontSizeSlider.tsx` — 字號滑桿控制 (46 行)
- `PreviewColorPicker.tsx` — 顏色選擇器 (64 行)

**FontInfo/ 資料夾 (3 個檔案)**：

- `FontInfo.tsx` — 字型資訊容器 (58 行)
- `FontCoverageChart.tsx` — 覆蓋率進度條 (81 行)
- `FontMissingChars.tsx` — 缺字字符管理 (72 行)

**Shared/ 資料夾 (5 個檔案)**：

- `CharacterWarning.tsx` — 統一警告元件 (94 行，支援 3 層級：error/warning/note)
- `MissingCharsList.tsx` — 缺字簡潔清單 (57 行)
- `FontListItem.tsx` — 字型列表項 (40 行)
- `TextCoverageStatus.tsx` — 文字覆蓋率狀態 (91 行)
- `UploadZone.tsx` — 拖放上傳區 (78 行)

**Layout/ 資料夾 (4 個檔案)**：

- `PageHeader.tsx` — 頁面標題區 (29 行)
- `Footer.tsx` — 頁尾（含更新日期） (55 行)
- `ErrorBoundary.tsx` — 錯誤邊界處理 (112 行)
- `StructuredData.tsx` — JSON-LD 結構化資料 (39 行)

**根目錄**：

- `FeatureCard.tsx` — 首頁功能卡片 (67 行)
- `index.ts` — 統一導出入口

**設計原則**：

- DRY (Don't Repeat Yourself) — 邏輯抽象為 Hooks 和工具函數
- 單責原則 — 每個元件職責明確
- 可組合性 — 元件支援靈活組合與嵌套
- 型別安全 — 嚴格 TypeScript 模式下開發

---

## 📝 預設預覽文本

內建三套預設文本供快速測試：

**繁體中文**：

```
FontFlow 字型分析工具幫助設計師和排版師快速判斷日文、簡體或其他字型對繁體中文的支援程度。
```

**英文**：

```
FontFlow helps designers quickly assess font compatibility with Traditional Chinese.
```

**日文**：

```
フォント分析ツールにより、デザイナーは日本語フォントの繁体字対応状況を迅速に判断できます。
```

---

## 🔒 隱私與安全

- ✅ 100% 本地處理 — 所有分析都在瀏覽器內完成
- ✅ 無伺服器上傳 — 字型檔案不離開您的電腦
- ✅ 自動清理 — 分析完成後自動釋放記憶體
- ✅ 無追蹤 — 不收集使用者數據，僅記錄匿名使用統計

---

## 🤝 貢獻指南

### 報告問題

- 在 GitHub 提交 Issue
- 附加詳細描述、字型檔案、使用環境

### 提交改進

```bash
# 1. Fork 或 Clone 專案
git clone https://github.com/eden0118/Font-Preview.git

# 2. 建立分支
git checkout -b feature/your-feature-name

# 3. 提交改動
git commit -m "feat: 描述你的功能"

# 4. 推送並建立 Pull Request
git push origin feature/your-feature-name
```

---

## 📚 相關資源

- [JetBrains Font (JF7000)](https://www.jetbrains.com/lp/mono/) — 字符集標準參考
- [OpenType 規範](https://docs.microsoft.com/en-us/typography/opentype/) — 字型技術文檔
- [Next.js 文檔](https://nextjs.org/docs) — 框架文檔
- [Tailwind CSS](https://tailwindcss.com/docs) — 樣式框架

---

## 📄 授權

MIT License - 自由使用、修改和分發

---

## 💡 常見問題

### Q: 為什麼日文字型常缺繁體字？

日文字型通常只包含日文漢字的字形。即使是相同的字，繁體和日文的**筆畫寫法可能不同**。FontFlow 可精確檢測這些差異。

### Q: 支援的檔案格式有哪些？

支援：TTF、OTF、WOFF、WOFF2（單個檔案 < 50MB）

### Q: 覆蓋率 100% 還有缺字？

正常的！覆蓋率基於**關鍵字符集**計算。缺字列表展示的是**完整測試集**中的缺字，幫助您精確了解字型能力。

### Q: 可用於商業目的嗎？

可以！FontFlow 開源（MIT License），但請尊重原字型授權條款。

---

**FontFlow** — 讓繁體中文字型選擇變得簡單明了。🎯
