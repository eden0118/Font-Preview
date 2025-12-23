# FontFlow - Font Preview Tool

一個快速、直觀的字體預覽工具，支援上傳 TTF、OTF、WOFF、WOFF2 字體檔案，並智能自動檢測繁簡中文、日文、韓文等多語言支援情況。

## 功能特性

✨ **快速上傳預覽** - 無需安裝字體到系統，即時在瀏覽器中預覽效果

🌍 **多語言支援** - 自動檢測字體對繁體中文、簡體中文、日文、韓文、英文的支援

🎨 **完整自訂選項** - 調整字體大小、文字顏色、背景顏色

📋 **文字輸入管理** - 支援自訂文字輸入和清空預覽

🔍 **字體分析** - 智能分析字體檔案名稱和字形特徵

## 技術棧

- **前端框架**: React 19 + TypeScript
- **樣式管理**: Tailwind CSS v4 (使用 @theme)
- **構建工具**: Vite 6
- **字體解析**: OpenType.js
- **圖示庫**: Lucide React
- **程式碼格式**: Prettier + Tailwind CSS Formatter

## 快速開始

### 前提條件

- Node.js 16+
- npm 或 yarn

### 安裝步驟

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

開發伺服器將在 `http://localhost:3000` 啟動

### 建立生產版本

```bash
npm run build
```

生產檔案將在 `dist/` 目錄中生成

### 預覽生產版本

```bash
npm run preview
```

## 可用命令

```bash
# 開發伺服器
npm run dev

# 生產構建
npm run build

# 預覽生產版本
npm run preview

# 程式碼格式化（Prettier）
npm run format

# 檢查程式碼格式
npm run format:check
```

## 專案結構

```
src/
├── components/        # React 元件
│   └── FontCard.tsx  # 字體卡片展示
├── utils/            # 工具函數
│   ├── fontHelper.ts # 字體分析和加載
│   └── langUtils.ts  # 語言檢測
├── App.tsx           # 主應用元件
├── main.tsx          # 入口文件
├── index.css         # 全局樣式（Tailwind v4 @theme）
├── constants.ts      # 常數和示例文本
└── types.ts          # TypeScript 類型定義
```

## 配置文件

- `vite.config.ts` - Vite 構建配置
- `tailwind.config.js` - Tailwind CSS 配置
- `postcss.config.js` - PostCSS 配置
- `.prettierrc.json` - Prettier 代碼格式化配置
- `tsconfig.json` - TypeScript 配置

## 環境變數

目前該應用不需要任何環境變數配置。（Gemini API 功能已移除）

## 瀏覽器支援

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 其他現代瀏覽器

## 貢獻

歡迎提交 Issue 和 Pull Request！

## 授權

MIT
