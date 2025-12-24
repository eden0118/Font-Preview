# FontFlow - Font Preview & Analysis Tool

一個現代、快速的字體預覽和分析工具，支援上傳 TTF、OTF、WOFF、WOFF2 字體檔案，並智能檢測繁簡中文、日文等多語言支援情況。

## 功能特性

- **雙功能設計** - 字型分析 + 字型比較，各司其職
- **快速上傳預覽** - 無需安裝字體到系統，即時在瀏覽器中預覽效果
- **完整自訂選項** - 調整字體大小、文字顏色、背景顏色
- **文字輸入管理** - 支援自訂文字輸入
- **智能字體分析** - 自動檢測字體對繁體中文、簡體中文、日文的適用性覆蓋率
- **視覺化呈現** - 進度條展示覆蓋率，顏色編碼快速判斷適用性
- **隱私保護** - 所有檔案處理均在瀏覽器本地完成，不上傳任何資料到伺服器
- **響應式設計** - 支援桌面和行動設備

## 技術棧

### 核心依賴

- **Framework**: Next.js 15.2 (App Router)
- **Language**: TypeScript 5.8 (strict mode)
- **Styling**: Tailwind CSS v4 (@tailwindcss/postcss)
- **Icons**: Lucide React 0.562.0
- **Font Parsing**: OpenType.js 1.3.4

### 開發工具

- **Package Manager**: npm
- **Code Formatter**: Prettier 3.7.4
- **Bundler**: Next.js (built-in)

## 項目結構

```
Font-Preview/
├── app/                              # Next.js App Router
│   ├── page.tsx                      # 入口首頁 (功能選擇)
│   ├── analysis/
│   │   └── page.tsx                  # 字型分析頁面
│   ├── comparison/
│   │   └── page.tsx                  # 字型比較頁面
│   ├── hooks/                        # 自訂 React Hooks
│   │   ├── useFontAnalysis.ts        # 單個字型分析邏輯
│   │   ├── useFontComparison.ts      # 多字型比較邏輯
│   │   ├── usePreviewSettings.ts     # 預覽設定狀態管理
│   │   └── useDragDrop.ts            # 拖曳上傳功能
│   ├── components/                   # 可復用組件
│   │   ├── FontUploadZone.tsx        # 檔案上傳區域
│   │   ├── PreviewSetting.tsx        # 預覽設定面板
│   │   ├── PageHeader.tsx            # 頁面標題欄
│   │   └── FontInfo.tsx              # 字型資訊卡片
│   ├── layout.tsx                    # 全局 Layout
│   └── globals.css                   # 全局樣式
├── lib/                              # Next.js 工具庫
│   ├── fontHelper.ts                 # 字體分析引擎
│   ├── types.ts                      # TypeScript 型別
│   └── constants.ts                  # 常數定義
├── package.json                      # 依賴配置
├── tsconfig.json                     # TypeScript 配置
├── next.config.js                    # Next.js 配置
├── tailwind.config.js                # Tailwind CSS 配置
├── postcss.config.js                 # PostCSS 配置
├── .prettierrc.json                  # Prettier 配置
└── README.md                         # 本文件
```

## 🚀 快速開始

### 前提條件

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

開發伺服器將在 `http://localhost:3000` 啟動

### 可用命令

```bash
# 開發伺服器 (熱模組重載)
npm run dev

# 生產構建
npm run build

# 預覽生產版本
npm start

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
│  └─ 功能選擇介面
├─ /analysis 路由
│  ├─ useFontAnalysis Hook
│  └─ 分析專用邏輯
└─ /comparison 路由
   ├─ useFontComparison Hook
   └─ 比較專用邏輯
```

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
```

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
