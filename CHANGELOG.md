# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **元件架構重構 (Component Architecture Refactoring)**
  - 將 FontInfo 元件拆分為 3 個子元件（FontInfo: 58 行、FontCoverageChart: 81 行、FontMissingChars: 72 行）
  - 創建通用 CharacterWarning 元件（94 行），支援三層警告級別（error/warning/note）
  - 將 PreviewCard 分層為 PreviewCardHeader（56 行）和 PreviewCardContent（55 行）
  - 將 PreviewSetting 拆分為 FontSizeSlider（46 行）和 PreviewColorPicker（64 行）
  - 重組 components 資料夾結構，按功能域分類：Preview/、FontInfo/、Shared/、Layout/

### Changed

- **元件資料夾優化**
  - 建立 Preview/ 資料夾（8 個檔案，包含預覽相關元件）
  - 建立 FontInfo/ 資料夾（3 個檔案，包含字型資訊相關元件）
  - 建立 Shared/ 資料夾（5 個檔案，包含通用元件如 CharacterWarning、UploadZone 等）
  - 建立 Layout/ 資料夾（4 個檔案，包含佈局元件如 PageHeader、Footer、ErrorBoundary）
  - 更新所有導入路徑以反映新的資料夾結構

- **CSS 相容性修復 (Tailwind v4 Compatibility)**
  - 移除 @theme 自訂顏色定義（不支援 Tailwind v4）
  - 將自訂顏色參考（primaryText、secondaryText、infoText）轉換為直接十六進制值
  - 轉換 @apply hover: 語法為 CSS :hover 虛擬選擇器

- **UI 微調**
  - 將 ChevronDown 箭頭移至警告色塊內部，改善視覺層次
  - 將外層邊框樣式（border-t、pt-3、mt-3）整合至 CharacterWarning 元件
  - 簡化 FontMissingChars 元件結構，移除重複的包裝層

### Added

- **缺字檢測系統改進 (Missing Character Detection Enhancement)**
  - 擴展基本關鍵字從 100 字至 150 字（新增內、靜、深、間、開、特、作、近等常用字）
  - 實現支援字符收集機制（`supportedChars`）用於實時預覽缺字檢測
  - 改進缺字顯示系統，區分基本關鍵字缺字和核心層級缺字
  - 為「缺失常用字」部分添加折叠功能（預設收起，點擊展開）
  - 傳遞 `hasGlyphFunc` 至預覽面板用於動態缺字檢測
  - 更新懲罰機制閾值從 20% 調整至 30%（150 字基準）

### Changed

- 更新分析引擎 `fontHelper.ts`
  - 擴展 `TIER_TC_ESSENTIAL` 從 100 字到 150 字
  - 改進 `FontDefinition` 類型，添加 `supportedChars` 字段
  - 優化缺字收集邏輯，同時收集支援字符清單

- 改進 UI 元件顯示
  - `FontInfo.tsx` 添加折叠狀態管理和互動按鈕
  - `AnalysisClient.tsx` 傳遞 `hasGlyphFunc` 至 `PreviewTextPanel`

- **SEO 優化套件 (Comprehensive SEO Enhancement)**
  - 新增 `public/sitemap.xml` — 搜尋引擎索引地圖
  - 新增 `public/robots.txt` — 爬蟲訪問策略配置
  - 新增 `app/components/StructuredData.tsx` — JSON-LD 結構化資料
  - 擴展 Root Metadata（增加 60+ 長尾關鍵字）
  - 增強 Open Graph 設置（加入預覽圖、canonical URL）
  - 加強 robots 配置（Google Bot 最佳化）
  - 分析頁面 Metadata 擴展（長尾關鍵字優化）
  - 比較頁面 Metadata 擴展（長尾關鍵字優化）

### Changed

- 更新 `app/layout.tsx`
  - 引入 `StructuredData` 元件
  - 加入 sitemap.xml 連結宣告
  - 擴展頁面標題與描述
  - 新增 60+ SEO 關鍵字
  - 補充 Open Graph 圖片與 canonical URL
  - 增強 robots 配置以提升 Google 索引品質

- 更新分析頁面 Metadata (`app/(pages)/analysis/layout.tsx`)
  - 擴展標題與描述（加入功能詞）
  - 增加 11 個長尾關鍵字

- 更新比較頁面 Metadata (`app/(pages)/comparison/layout.tsx`)
  - 擴展標題與描述（加入功能詞）
  - 增加 9 個長尾關鍵字

### Documentation

- 更新 README.md
  - 新增「Sitemap 與 Robots 配置」章節
  - 新增「結構化資料」章節
  - 新增「Open Graph 社交分享」章節
  - 新增「關鍵字優化」章節
  - 新增「SEO 檢查清單」章節

## [1.0.0] - 2026-03-10

### Added

- FontFlow Preview project initialization
- Font analysis and comparison features
- Font script signature sets expansion
- Preview text language setting functionality
- Dashboard with font information display
- Metadata support for font files
- SEO optimization with proper metadata
- Accessibility (A11y) improvements
- Vercel Analytics integration
- Responsive Web Design (RWD) support
- Drag-and-drop file upload functionality
- Font analysis performance optimizations
- Global CSS primary and accent colors theming

### Changed

- Refactored to Next.js with App Router architecture
- Unified navbar using PageHeader component
- Unified PreviewSetting component across all pages
- Applied global CSS color scheme throughout project
- Updated analysis page layout and CSS styling
- Improved code efficiency and performance
- Enhanced UX with better layout and responsiveness
- Changed analysis color scheme to blue
- Updated project structure for better organization

### Fixed

- Removed all emojis, using lucide-react icons consistently
- Fixed responsive web design (RWD) issues
- Fixed some analysis page layout issues
- Fixed A11y (accessibility) issues
- Fixed CSS and layout issues throughout project
- Fixed layout inconsistencies
- Removed unused color props from FeatureCard components
- Removed Japanese language processing

### Removed

- Removed all emoji usage (replaced with lucide-react icons)
- Removed Japanese language processing

### Chore

- Added .next to .gitignore
- Ignored .next build cache directory
- Updated copilot instructions
- Project initialization and configuration
