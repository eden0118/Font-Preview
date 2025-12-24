# FontFlow - Font Preview & Analysis Tool

一個現代、快速的字體預覽和分析工具，支援上傳 TTF、OTF、WOFF、WOFF2 字體檔案，並智能檢測繁簡中文、日文等多語言支援情況。

## ✨ 核心功能

- **🔍 字型分析** - 上傳單個字型，深入分析其覆蓋範圍、特性和適用語言
- **⚖️ 字型比較** - 並排預覽多個字型檔案，快速對比視覺效果
- **⚡ 即時預覽** - 無需安裝字體到系統，在瀏覽器中即時預覽效果
- **🎨 完整自訂** - 調整字體大小、文字顏色、背景顏色
- **📊 智能分析** - 自動檢測字體對繁體中文、簡體中文、日文的覆蓋率
- **🔒 隱私優先** - 所有檔案處理均在瀏覽器本地完成，無伺服器上傳
- **📱 響應式設計** - 完美支援桌面和行動設備

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
│   ├── page.tsx                      # 入口首頁
│   ├── analysis/
│   │   └── page.tsx                  # 字型分析頁面
│   ├── comparison/
│   │   └── page.tsx                  # 字型比較頁面
│   ├── components/                   # 可復用元件
│   │   ├── FeatureCard.tsx           # 功能卡片
│   │   ├── PreviewSetting.tsx        # 預覽設定面板
│   │   ├── PageHeader.tsx            # 頁面標題欄
│   │   └── Footer.tsx                # 底部欄位
│   ├── hooks/                        # 自訂 React Hooks
│   │   ├── useFontAnalysis.ts        # 字型分析邏輯
│   │   ├── useFontComparison.ts      # 字型比較邏輯
│   │   ├── usePreviewSettings.ts     # 預覽設定狀態
│   │   ├── usePreviewText.ts         # 預覽文字初始化
│   │   └── useDragDrop.ts            # 拖曳上傳功能
│   ├── lib/
│   │   ├── fontHelper.ts             # 字體分析引擎
│   │   ├── types.ts                  # TypeScript 型別定義
│   │   └── constants.ts              # 應用常數
│   ├── layout.tsx                    # 全局 Layout
│   └── globals.css                   # 全局樣式
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── .prettierrc.json
└── README.md                         # 本文件
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
# 開發伺服器 (熱模組重載)
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

### 字型分析頁面

1. **上傳字型**
   - 點擊上傳區域或拖曳 TTF/OTF/WOFF/WOFF2 檔案
   - 系統自動分析檔案並提取字體信息

2. **檢視分析結果**
   - 字體名稱、分類
   - 字符數量統計
   - 多語言覆蓋率進度條

3. **自訂預覽**
   - 輸入或編輯預覽文字
   - 調整字體大小（12px - 150px）
   - 修改文字和背景顏色

### 字型比較頁面

1. **上傳多個字型**
   - 最多可上傳 3 個字型
   - 支援拖曳或點擊上傳

2. **並排預覽**
   - 相同文字在各字型中的效果展示
   - 即時調整預覽設定，所有字型同步更新

## 🔧 開發相關

### TypeScript 配置

- **嚴格模式** (`strict: true`) - 完整的型別檢查
- **路徑別名** - `@/*` 指向 `./app/*`
- **模組解析** - `bundler` 模式，最佳化打包

### Tailwind CSS v4

- 使用新的 `@tailwindcss/postcss` 插件
- 自訂顏色變數透過 `@theme` 定義
- PostCSS 自動化處理

### 程式碼風格

- **格式化工具** - Prettier with Tailwind CSS plugin
- **列寬** - 100 字符
- **引號** - 單引號
- **尾逗號** - ES5 模式

## 🐛 已知問題和解決方案

### Tailwind CSS 熱更新

如果編輯樣式後沒有立即生效：

```bash
# 清除 Next.js 緩存
rm -rf .next
npm run dev
```

## 📄 許可證

MIT

## 👨‍💻 開發者

Eden Chang - [@eden0118](https://github.com/eden0118)

---

**上次更新**: 2025 年 12 月 24 日

# 程式碼格式化 (Prettier)

npm run format

# 檢查程式碼格式

npm run format:check

```

## 📖 使用指南

### 字型分析頁面

1. 點擊「字型分析」進入專頁
2. 上傳或拖拽字型檔案
3. 查看詳細的語言覆蓋率分析
4. 調整預覽設定（大小、顏色）
5. 輸入自訂文字進行預覽

### 字型比較頁面

1. 點擊「字型比較」進入專頁
2. 上傳多個字型檔案
3. 並排預覽效果
4. 快速比較視覺差異
5. 調整設定同步應用於所有字型

## 🔍 字體分析邏輯

### 核心設計理念

FontFlow 採用**適用性評估**而非傳統的語系分類：

- ❌ **不再問**：「這是什麼語系的字體？」
- ✅ **改為問**：「這個字體能滿足繁體中文排版需求嗎？」

### 測試字符集

#### 繁體中文 (50 字)

- **繁體特有字** (10字)：國、體、話、寶、門、經、號、葉、說、邊
- **高頻常用字** (10字)：的、是、在、有、我、你、他、她、們、個
- **繁體文案常見字** (10字)：臺、灣、網、路、資、訊、設、計、產、品

#### 簡體中文 (20 字)

国、体、话、宝、门、经、号、叶、说、边、实、这、会、后、学、机、关、开、电、车

#### 日文 (20 字)

- 平假名：あ、い、う、え、お、か、き、く、け、こ
- 片假名：ア、イ、ウ、エ、オ、カ、キ、ク、ケ、コ

### 適用性等級

| 等級     | 繁體覆蓋率 | 評估           | 顏色 |
| -------- | ---------- | -------------- | ---- |
| 完全適用 | 90%+       | 建議使用       | 綠色 |
| 大致適用 | 70-89%     | 可能缺少少數字 | 黃色 |
| 部分適用 | 50-69%     | 建議謹慎使用   | 橙色 |
| 不建議   | <50%       | 不適合繁體文案 | 紅色 |

### 實戰案例

| 字型               | 繁體 | 簡體 | 日文 | 結論                 |
| ------------------ | ---- | ---- | ---- | -------------------- |
| 思源黑體 TW        | 100% | 20%  | 0%   | 完全適用繁體         |
| 思源黑體 SC        | 20%  | 100% | 0%   | 簡體中文字型         |
| 思源宋體 (Pan-CJK) | 95%  | 98%  | 90%  | 完全適用，多語言支援 |

## 架構設計

### 頁面分離的優勢

```

之前 (單頁面)
├─ 分析功能 + 比較功能混合
├─ 狀態管理複雜
└─ 代碼可維護性低

之後 (多頁面)
├─ App Router (首頁)
│ └─ 功能選擇介面
├─ /analysis 路由
│ ├─ useFontAnalysis Hook
│ └─ 分析專用邏輯
└─ /comparison 路由
├─ useFontComparison Hook
└─ 比較專用邏輯

````

### 共用 Hooks

| Hook                 | 用途                        |
| -------------------- | --------------------------- |
| `useFontAnalysis`    | 管理單個字體分析狀態        |
| `useFontComparison`  | 管理多個字體比較邏輯        |
| `usePreviewSettings` | 預覽設定狀態 (字大小、顏色) |
| `useDragDrop`        | 拖曳上傳核心邏輯            |

### 共用組件

| 組件             | 描述                        |
| ---------------- | --------------------------- |
| `FontUploadZone` | 檔案上傳區域 (可配置樣式)   |
| `PreviewSetting` | 預覽設定面板                |
| `PageHeader`     | 頁面標題欄 (帶返回按鈕)     |
| `FontInfo`       | 字型資訊卡片 (含覆蓋率圖表) |

## 隱私與安全

- **完全本地處理** - 所有字體分析在瀏覽器本地完成
- **零數據上傳** - 不上傳任何字體檔案或個人資料
- **無追蹤** - 不使用分析工具或第三方服務
- **無 Cookie** - 不存儲任何追蹤信息

## 性能優化

1. **按需加載** - Next.js 自動分割代碼
2. **本地執行** - 所有計算在瀏覽器進行，無網絡延遲
3. **優化字符集** - 只測試 89 個特徵字，避免全掃描
4. **高效狀態管理** - 自訂 Hooks，無多餘重渲染

## 常見問題

**Q: 為什麼字體上傳後沒有立即顯示？**
A: 瀏覽器正在解析和加載字體檔案，通常需要 1-3 秒。

**Q: 能否離線使用？**
A: 可以。`npm run build` 後得到的產物可完全離線運行。

**Q: 支援哪些字體格式？**
A: TTF、OTF、WOFF、WOFF2。

**Q: 能否添加其他語言檢測？**
A: 可以。編輯 `lib/fontHelper.ts` 中的字符測試集。

## 部署

### 部署到 Vercel (推薦)

```bash
npm i -g vercel
vercel
````

### 部署到其他平台

1. 執行 `npm run build`
2. 上傳 `.next` 和 `node_modules` 到伺服器
3. 執行 `npm run start`

## 開發指南

### 添加新的語言測試

編輯 `lib/fontHelper.ts`:

```typescript
const NEW_LANG_CHARS = '你的字符集';

export function analyzeCompatibility(font: opentype.Font) {
  // 添加新的語言覆蓋率計算
}
```

### 自訂主題顏色

編輯 `tailwind.config.js`:

```javascript
theme: {
  colors: {
    primary: '#your-color',
  }
}
```

### 修改適用性閾值

編輯 `lib/fontHelper.ts` 中的 `generateDescription()` 函式。

## 項目統計

- **總代碼行數**: ~1200 行
- **TypeScript 檔案**: 15+ 個
- **可復用組件**: 4 個
- **自訂 Hooks**: 4 個
- **依賴包數**: 5 個 (生產)
- **構建輸出**: ~500KB (未壓縮)

## 貢獻

歡迎提交 Issue 和 Pull Request！

## 許可證

MIT

## 相關資源

- [Next.js 文檔](https://nextjs.org/docs)
- [OpenType.js 文檔](https://opentype.js.org/)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)

---

**最後更新**: 2025 年 12 月 24 日
