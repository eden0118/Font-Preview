# FontFlow - Font Preview & Analysis Tool

**專為繁體中文使用者打造的字型分析工具**。快速檢測日文、簡體或其他字型對繁體中文的支援程度，掌握缺字情況，避免排版風險。

> 核心痛點：您下載了一款日文字型，想用於繁體中文排版。但它能完美支援繁體中文嗎？會有缺字嗎？FontFlow 幫您快速找到答案。

## ✨ 核心功能

- **🎯 繁中優先分析** - 以繁體中文為中心進行深度分析，檢測確切的缺字字符
- **📊 精準覆蓋率** - 分析繁體中文、簡體中文、英文的支援度
- **⚠️ 缺字列表** - 列出所有無法顯示的繁體字（用頓號分隔，易於識別）
- **⚖️ 字型比較** - 上傳最多 3 個字型，並排預覽和比較
- **⚡ 即時預覽** - 無需安裝字體到系統，在瀏覽器中即時預覽
- **🎨 完整自訂** - 調整字體大小（12px-150px）、文字顏色、背景顏色
- **🔒 隱私優先** - 所有分析在瀏覽器本地完成，無伺服器上傳
- **📱 完全響應式** - 桌面和行動設備完美支援

## 🛠 技術棧

| 類別                | 技術                 | 版本    |
| ------------------- | -------------------- | ------- |
| **Framework**       | Next.js (App Router) | 15.2.0  |
| **Language**        | TypeScript           | 5.8.2   |
| **Styling**         | Tailwind CSS         | 4.0.0   |
| **UI Icons**        | Lucide React         | 0.562.0 |
| **Font Parsing**    | OpenType.js          | 1.3.4   |
| **Code Formatting** | Prettier             | 3.7.4   |

## 📁 專案結構

```
Font-Preview/
├── app/
│   ├── page.tsx                      # 首頁入口
│   ├── (pages)/
│   │   ├── analysis/
│   │   │   └── page.tsx              # 字型分析頁面
│   │   └── comparison/
│   │       └── page.tsx              # 字型比較頁面
│   ├── components/                   # 可復用 UI 元件
│   │   ├── FontInfo.tsx              # 字型資訊卡片（缺字列表、覆蓋率）
│   │   ├── PreviewCard.tsx           # 預覽卡片（顯示字型效果）
│   │   ├── PreviewTextPanel.tsx      # 文字編輯面板
│   │   ├── PreviewSetting.tsx        # 預覽設定控制器
│   │   ├── FontListItem.tsx          # 字型列表項
│   │   ├── UploadZone.tsx            # 上傳區域
│   │   ├── PageHeader.tsx            # 頁面標題欄
│   │   ├── FeatureCard.tsx           # 功能卡片（首頁）
│   │   └── Footer.tsx                # 底部欄位
│   ├── hooks/                        # 自訂 React Hooks
│   │   ├── useFontAnalysis.ts        # 字型分析狀態管理
│   │   ├── useFontComparison.ts      # 字型比較狀態管理
│   │   ├── usePreviewSettings.ts     # 預覽設定狀態（字大小、顏色等）
│   │   ├── usePreviewText.ts         # 預覽文字初始化
│   │   └── useDragDrop.ts            # 拖曳上傳功能
│   ├── lib/
│   │   ├── fontHelper.ts             # ★ 字體分析引擎（核心邏輯）
│   │   ├── types.ts                  # TypeScript 型別定義
│   │   ├── previewTexts.ts           # 預設預覽文字
│   │   ├── coverageHelpers.ts        # 覆蓋率顏色配置
│   │   └── constants.ts              # 常數
│   ├── layout.tsx                    # 全局 Layout
│   └── globals.css                   # 全局樣式
├── types/
│   └── opentype.d.ts                 # OpenType.js 型別定義
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json                       # Vercel 部署配置
├── .prettierrc.json                  # Prettier 格式化配置
└── README.md
```

## 🚀 快速開始

### 系統要求

- Node.js 18+
- npm 9+

### 安裝步驟

```bash
# 進入專案目錄
cd Font-Preview

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

開發伺服器將在 `http://localhost:4000` 啟動

### 可用命令

```bash
# 開發伺服器（熱模組重載）
npm run dev

# 生產構建
npm run build

# 預覽生產版本
npm start

# 程式碼格式化
npm run format

# 檢查程式碼格式
npm run format:check
```

## 📖 使用指南

### 🔍 字型分析頁面

**目的**：深度分析單個字型的繁體中文適用性

1. **上傳字型**
   - 點擊上傳區域或拖曳字型檔案（支援 TTF、OTF、WOFF、WOFF2）
   - 系統自動解析字型並開始分析

2. **檢視分析結果**
   - **字符數** - 字型包含的總字符數
   - **支援語系標籤** - 自動識別適用語言（繁中、簡中、英文）
   - **語言覆蓋率進度條**
     - 繁體中文覆蓋率（最重要）
     - 簡體中文覆蓋率
     - 英文覆蓋率
   - **缺失繁體字列表** ⚠️
     - 逐個列出所有無法顯示的繁體漢字（用頓號分隔）
     - 超過 5 個缺字時會顯示警告

3. **實時預覽**
   - 輸入預覽文字，實時查看在該字型中的顯示效果
   - 缺字字符會用系統預設字型回退顯示
   - 預覽卡片會實時計算預覽文字的覆蓋率
   - 支援調整：
     - 字體大小（12px - 150px）
     - 文字顏色和背景顏色

### ⚖️ 字型比較頁面

**目的**：同時測試多個字型，快速找到最適合繁體中文的方案

1. **上傳多個字型**
   - 支援同時上傳 **3 個字型**
   - 每個字型都會完整分析和展示

2. **並排預覽對比**
   - 相同文字在各字型中的視覺效果
   - 各字型的繁體中文覆蓋率對比
   - 缺字字符對比

3. **統一編輯**
   - 修改預覽文字時，所有字型同步更新
   - 調整字體大小、顏色時，所有預覽卡片同步應用

## 🔍 字體分析引擎（fontHelper.ts）

### 核心邏輯

FontFlow 不再問「這是什麼語系字體？」，而是問「**這個字體能滿足繁體中文排版需求嗎？**」

### 測試字符集

| 分類       | 字符數 | 舉例                       | 用途                           |
| ---------- | ------ | -------------------------- | ------------------------------ |
| 繁體關鍵字 | 35字   | 的、你、我、他、這、對、於 | 日文字型的死穴，檢測基本相容性 |
| 繁體核心字 | 500字  | 國、中、大、生、時、人...  | 計算廣泛覆蓋率，涵蓋日常使用   |
| 繁體進階字 | 100字  | 互、充、免、判...          | 區分「能用」vs「優質使用體驗」 |
| 標點符號   | 14個   | ，。、：？！...            | 檢測排版完整性                 |
| 簡體特徵字 | 100字  | 国、体、话...              | 區分是否為簡體字型             |
| 英文字母   | 62字   | A-Z、a-z、0-9              | 檢測英文支援度                 |

**總計：645 個測試字符**

### 評分系統

```
繁體中文最終分數 =
  核心字覆蓋率 × 70% + 進階字覆蓋率 × 20% + 標點覆蓋率 × 10%

如果（關鍵字覆蓋率 < 80%）
  → 強制將分數壓低至 59% 以下（懲罰機制）
  → 反映「雖有大量漢字，但無法正常打中文」
```

### 判定規則

| 繁體分數 | 判定            | 建議               |
| -------- | --------------- | ------------------ |
| 90%+     | ✅ 繁體中文     | 完全適用，推薦使用 |
| 60-89%   | ⚠️ 部分繁體相容 | 可用但會有缺字     |
| <60%     | ❌ 不適合繁體   | 建議尋找替代方案   |

### 缺字列表

- 自動掃描所有 645 個測試字符
- 計算哪些字在字型中無法顯示
- 逐個列出，用頓號分隔，便於識別

**範例**：

```
缺失繁體字 (11)
撤、么、内、値、獄...
```

## 🏗️ 技術架構

### 狀態管理

使用自訂 Hooks 管理各功能的狀態：

```
分析頁面                          比較頁面
├─ useFontAnalysis Hook          ├─ useFontComparison Hook
│  ├─ currentFont                │  ├─ comparisonSlots (3個)
│  ├─ isAnalyzing               │  ├─ analysingId
│  └─ uploadError               │  └─ uploadError
│                               │
├─ usePreviewSettings Hook       ├─ usePreviewSettings Hook
│  ├─ settings                  │  ├─ settings
│  └─ DEFAULT_SAMPLE_TEXT       │  └─ DEFAULT_SAMPLE_TEXT
│                               │
└─ usePreviewText Hook           └─ usePreviewText Hook
   └─ 初始化預覽文字             └─ 初始化預覽文字
```

### 核心函數

| 函數                  | 文件          | 說明                               |
| --------------------- | ------------- | ---------------------------------- |
| `analyzeFontFile()`   | fontHelper.ts | 解析字型、計算覆蓋率、生成缺字列表 |
| `loadFontFace()`      | fontHelper.ts | 將字型加載到 `document.fonts`      |
| `removeFontFace()`    | fontHelper.ts | 移除已加載的字型，防止內存洩漏     |
| `checkTextCoverage()` | fontHelper.ts | 計算指定文字在字型中的覆蓋率       |

### Hooks 職責

| Hook                 | 職責                                            |
| -------------------- | ----------------------------------------------- |
| `useFontAnalysis`    | 管理單個字型分析：上傳、解析、清除              |
| `useFontComparison`  | 管理多個字型：支援最多 3 個 slot，獨立上傳/刪除 |
| `usePreviewSettings` | 管理預覽設定：字大小、顏色、默認文字            |
| `usePreviewText`     | 當字型改變時，自動初始化預覽文字                |
| `useDragDrop`        | 檢測拖曳狀態、驗證文件類型                      |

## 🔧 開發配置

### TypeScript 設定

- **嚴格模式** (`strict: true`) - 完整類型檢查
- **路徑別名** - `@/*` 指向 `./app/*`，簡化導入
- **模組解析** - `bundler` 模式，優化打包

### Tailwind CSS v4

- 使用 `@tailwindcss/postcss` 插件
- PostCSS 自動化樣式處理
- 自訂主題在 `tailwind.config.js` 中定義

### 程式碼風格

- **格式化工具** - Prettier with Tailwind CSS Plugin
- **單引號** - 所有字符串使用單引號
- **尾逗號** - ES5 模式（兼容性更好）
- **行寬** - 100 字符

## 🐛 已知問題和解決方案

### 字型缺字顯示問題

**Q: 上傳日文字型，顯示 98% 覆蓋率，但預覽看不到某些字？**

A: 這是正常現象。覆蓋率基於測試字符集計算，但您輸入的文字可能包含不在測試字符集內的字。預覽卡片會顯示當前文字的實時覆蓋率。

### Tailwind CSS 樣式未更新

如果編輯 CSS 後沒有立即反映：

```bash
rm -rf .next
npm run dev
```

### 瀏覽器相容性

支援所有現代瀏覽器（Chrome、Firefox、Safari、Edge）。建議使用最新版本以獲得最佳體驗。

## 🚀 部署

### 部署到 Vercel（推薦）

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel
```

專案已配置 `vercel.json`，Vercel 會自動檢測並使用正確的構建命令。

### 部署到其他平台

```bash
# 構建生產版本
npm run build

# 啟動生產伺服器
npm start
```

輸出檔案位於 `.next` 目錄。

## 🎓 使用場景

### 場景 1：尋找合適的繁體字型

> 您想找一款既支援繁體中文，又支援英文的字型用於網站設計。

**使用 FontFlow**：

1. 上傳候選字型到「字型比較」
2. 檢查繁體中文覆蓋率
3. 查看缺失字符列表
4. 直觀對比多個字型

### 場景 2：評估日文字型的繁中相容性

> 您發現一款美觀的日文字型（如 Noto Sans JP），想用於繁體中文排版。

**使用 FontFlow**：

1. 上傳到「字型分析」
2. 檢查繁體覆蓋率和缺字列表
3. 預覽包含常見繁體字的文字
4. 決定是否適合您的專案

### 場景 3：字型替換測試

> 您的設計用了付費字型，現在想用免費替代品。

**使用 FontFlow**：

1. 在「字型比較」中上傳原字型和候選替代品
2. 使用相同預覽文字對比視覺效果
3. 檢查繁體覆蓋率差異
4. 快速評估可行性

## 📊 性能

- **分析速度** - 通常 1-3 秒（取決於字型大小）
- **預覽速度** - 實時（<100ms）
- **構建輸出** - 約 500KB (未壓縮)
- **本地執行** - 無網絡延遲，完全離線支援

## 📝 更新日誌

### v1.0.0 (2025-12-24)

- ✨ 首版發布
- 🎯 繁體中文優先的分析引擎
- 📊 詳細的缺字列表
- ⚖️ 支援最多 3 個字型比較
- 🔒 完整本地隱私

## 📄 許可證

MIT

## 👨‍💻 開發者

Eden Chang - [@eden0118](https://github.com/eden0118)

## 相關資源

- [OpenType.js 文檔](https://opentype.js.org/)
- [Next.js 文檔](https://nextjs.org/docs)
- [Tailwind CSS 文檔](https://tailwindcss.com/)

---

**上次更新**: 2025 年 12 月 24 日
