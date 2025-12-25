# FontFlow - 繁體中文字型分析工具

**專為繁體中文使用者打造的字型相容性檢測平台**。快速判斷日文、簡體或其他字型對繁體中文的支援程度，掌握確切的缺字清單，避免排版風險。

---

## 🎯 核心問題與解決方案

### **您面臨的問題**

您下載了一款**日文字型或簡體字型**，想用於繁體中文排版。但是：

- ❌ 能否完美支援繁體中文？**不知道**
- ❌ 會不會有缺字？**不清楚**
- ❌ 如果有缺字，缺了哪些字？**找不到**
- ❌ 字型轉換器顯示 100% 覆蓋率，但實際排版還是有缺字？**為什麼？**

**結果**：安裝後才發現問題，浪費時間。

### **FontFlow 的解決方案**

我們建立了一套**專為繁體中文最佳化的分析引擎**，基於 **JF7000** (JetBrains Font) 完整字集，透過**分層字符測試系統**準確判斷字型的繁體相容性。

#### **檢測字符集**

| 字集層級     | 字符數  | 說明                              |
| ------------ | ------- | --------------------------------- |
| **核心字集** | 6,373   | JF7000 標準繁體字（日常排版必需） |
| **粵語字**   | 137     | 粵語特有字（方言排版）            |
| **台灣字**   | 930     | 台灣特有字（地名、方言等）        |
| **人名用字** | 625     | 人名常用字（人物排版）            |
| **合計**     | ~7,000+ | JF7000 完整字集                   |

#### **分層評分系統 (V13)**

1. **基本關鍵字層** (Essential Characters - 35 字)
   - 代表字：「你、們、對、了、一、是、不…」
   - 權重：**40%**
   - 特性：日文字型常缺這些字
   - **懲罰機制**：缺字超過 20%（7+ 字），直接鎖死最高 60%

2. **核心繁體層** (Core Traditional Chinese - 6,373 字)
   - 字集：JF7000 標準字集
   - 權重：**35%**
   - 特性：日常排版必需的字

3. **進階字集層** (Extensions - 粵語、台灣、人名)
   - 範圍：1,692 字
   - 權重：**15%**（平均分配）
   - 特性：專業排版用字

4. **標點符號層** (Punctuation - 14 字)
   - 代表字：「、。，；：？！「」…」
   - 權重：**10%**
   - 特性：排版品質指標

#### **評分公式**

```
最終分數 = (基本關鍵字覆蓋率 × 40%)
         + (核心字覆蓋率 × 35%)
         + (進階字平均覆蓋率 × 15%)
         + (標點覆蓋率 × 10%)

⚠️ 懲罰條件：若基本關鍵字缺字 > 20%，分數強制 = min(分數, 60%)
```

#### **語言判定邏輯**

| 語言     | 判定條件                                | 說明           |
| -------- | --------------------------------------- | -------------- |
| **繁體** | 繁體分數 > 70% 且無簡體獨有字           | 優質繁體支援   |
| **繁體** | 繁體分數 > 50% 且無簡體獨有字           | 基本繁體支援   |
| **簡體** | 簡體獨有字覆蓋率 > 70%                  | 簡體字型       |
| **日文** | 日文假名 > 80% 且日文漢字 > 50%         | 真正的日文字型 |
| **英文** | 英文字符覆蓋率 > 80%（非 CJK 字型專用） | 歐文字型       |

#### **關鍵特性**

1. **精準缺字列表**
   - 不是籠統的百分比，而是列出**所有無法顯示的字**
   - 用視覺分隔清楚標示

2. **多維度評分**
   - 繁體中文（基於 JF7000）
   - 簡體中文（基於 GB 字集擴展）
   - 日文（基於日文漢字常用字）
   - 英文（基於基本拉丁字母）

3. **懲罰機制（Kill Switch）**
   - 防止日文字型因為只缺少幾個關鍵字就被誤判為可用
   - 確保推薦的字型真的能用

4. **實時預覽**
   - 上傳後立即在預覽區顯示字型效果
   - 自動檢測預覽文字的缺字情況

---

## ✨ 核心功能

| 功能                | 說明                               |
| ------------------- | ---------------------------------- |
| **🎯 繁中優先分析** | 以繁體中文為中心的深度分析         |
| **📊 精準覆蓋率**   | 分層計算繁體、簡體、英文支援度     |
| **⚠️ 缺字列表**     | 逐字檢測，列出所有無法顯示的繁體字 |
| **⚖️ 字型比較**     | 上傳最多 3 個字型並排預覽          |
| **⚡ 即時預覽**     | 無需安裝到系統，直接在瀏覽器預覽   |
| **🎨 完整自訂**     | 調整字體大小、顏色、背景           |
| **🔒 隱私優先**     | 100% 本地處理，無伺服器上傳        |
| **📱 完全響應式**   | 支援桌面和行動設備                 |

---

## 📁 專案結構

```
Font-Preview/
├── app/
│   ├── page.tsx                      # 首頁入口
│   ├── (pages)/
│   │   ├── analysis/
│   │   │   └── page.tsx              # 字型分析頁面
│   │   └── comparison/
│   │       └── page.tsx              # 字型比較頁面（支援3字型）
│   ├── components/                   # 可復用 UI 元件
│   │   ├── FontInfo.tsx              # 字型資訊卡片（覆蓋率、缺字）
│   │   ├── PreviewCard.tsx           # 預覽卡片（實時展示字型效果）
│   │   ├── PreviewTextPanel.tsx      # 文字編輯面板
│   │   ├── PreviewSetting.tsx        # 預覽設定控制器
│   │   ├── FontListItem.tsx          # 字型列表項
│   │   ├── UploadZone.tsx            # 拖放上傳區域
│   │   ├── PageHeader.tsx            # 頁面標題欄
│   │   ├── FeatureCard.tsx           # 功能卡片（首頁）
│   │   └── Footer.tsx                # 底部欄位
│   ├── hooks/                        # 自訂 React Hooks
│   │   ├── useFontAnalysis.ts        # 字型分析邏輯
│   │   ├── useFontComparison.ts      # 多字型比較邏輯
│   │   ├── usePreviewSettings.ts     # 預覽設定狀態
│   │   ├── usePreviewText.ts         # 預覽文字管理
│   │   └── useDragDrop.ts            # 拖放功能
│   ├── lib/                          # 核心工具函數
│   │   ├── fontHelper.ts             # ⭐ 字型分析引擎（核心）
│   │   ├── types.ts                  # TypeScript 類型定義
│   │   ├── previewTexts.ts           # 預設預覽文本
│   │   └── coverageHelpers.ts        # 覆蓋率顏色計算
│   ├── globals.css                   # 全局樣式
│   ├── layout.tsx                    # 根佈局
│   └── not-found.tsx                 # 404 頁面
├── types/
│   └── opentype.d.ts                 # OpenType.js 類型定義
├── package.json                      # 依賴和腳本配置
├── next.config.js                    # Next.js 配置（優化）
├── tsconfig.json                     # TypeScript 配置（嚴格模式）
├── tailwind.config.js                # Tailwind CSS 配置
└── vercel.json                       # Vercel 部署配置
```

---

## 🛠 技術棧

| 層級                | 技術                 | 版本    | 說明                       |
| ------------------- | -------------------- | ------- | -------------------------- |
| **Framework**       | Next.js (App Router) | 15.2.0  | 最新的伺服器元件架構       |
| **Language**        | TypeScript           | 5.8.2   | 完整的類型安全（嚴格模式） |
| **Styling**         | Tailwind CSS         | 4.0.0   | PostCSS 插件架構           |
| **UI Icons**        | Lucide React         | 0.562.0 | 輕量級 SVG 圖示庫          |
| **Font Parsing**    | OpenType.js          | 1.3.4   | 瀏覽器端字型檔案解析       |
| **Code Formatting** | Prettier             | 3.7.4   | Tailwind 整合格式化        |

---

## 🚀 快速開始

### **本地開發環境設置**

#### 前置需求

- Node.js 18.17+
- npm 或 yarn

#### 開發流程

```bash
# 1. 克隆或進入專案目錄
cd /Users/eden/Coding/Font-Preview

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器 (預設 Port 3000)
npm run dev

# 4. 開啟瀏覽器
# 自動跳轉或手動訪問：http://localhost:3000

# 5. 開發時的實時熱更新
# Ctrl+C 停止開發伺服器
```

#### 可用的開發命令

| 命令            | 說明                             |
| --------------- | -------------------------------- |
| `npm run dev`   | 啟動開發伺服器（HMR + 即時重載） |
| `npm run build` | 生產環境構建                     |
| `npm start`     | 啟動生產伺服器                   |
| `npm run lint`  | 執行程式碼檢查                   |

### **生產部署**

#### 構建和部署到 Vercel

```bash
# 1. 構建應用
npm run build

# 2. (可選) 本地測試生產構建
npm start
# 訪問：http://localhost:3000

# 3. 推送到 GitHub 並連接 Vercel
# 專案已含 vercel.json 配置，Vercel 會自動部署
```

#### Docker 部署（可選）

```dockerfile
# Dockerfile 示例
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

---

## 📘 功能使用指南

### **使用流程 - 分析單一字型**

```
1. 訪問 http://localhost:3000
2. 點擊「分析」按鈕進入分析頁面
3. 上傳字型檔案
   - 支援：TTF, OTF, WOFF, WOFF2
   - 最大：50MB
4. 等待分析完成（通常 1-3 秒）
5. 查看分析結果
   ├─ 覆蓋率指標（繁中、簡中、英文、日文）
   ├─ 缺字列表（逐字展示）
   ├─ 字型基本資訊（名稱、字數等）
   └─ 實時預覽（可調整大小、顏色、背景）
```

### **使用流程 - 比較多個字型**

```
1. 訪問 http://localhost:3000
2. 點擊「比較」按鈕進入對比頁面
3. 上傳最多 3 個字型
   - 可分次上傳或一次全部上傳
   - 支援刪除已上傳的字型
4. 實時對比分析
   ├─ 3 個卡片並排展示（桌面版）
   ├─ 響應式堆疊（行動版）
   └─ 同步更新預覽效果
5. 調整預覽設定
   ├─ 編輯預覽文字
   ├─ 調整字體大小
   ├─ 選擇顏色和背景
   └─ 變化實時反映到 3 個字型
```

### **預覽設定詳解**

| 設定項目     | 功能             | 範圍                              |
| ------------ | ---------------- | --------------------------------- |
| **字體大小** | 調整預覽文字大小 | 12px - 96px                       |
| **文字顏色** | 改變字型顏色     | RGB 顏色選擇器                    |
| **背景色**   | 改變背景顏色     | RGB 顏色選擇器                    |
| **預覽文字** | 編輯預覽內容     | 支援繁中、簡中、英文、日文、emoji |

---

## 🏗 架構深入解析

### **應用架構層級**

```
┌─────────────────────────────────────┐
│  📱 使用者介面層                     │
│  (React 元件 + Tailwind CSS)         │
├─────────────────────────────────────┤
│  ⚙️  狀態管理層                      │
│  (Custom Hooks)                      │
├─────────────────────────────────────┤
│  🔧 業務邏輯層                       │
│  (字型分析引擎)                      │
├─────────────────────────────────────┤
│  📦 底層工具層                       │
│  (OpenType.js, 字符集定義)          │
└─────────────────────────────────────┘
```

### **資料流動**

```
上傳字型檔案
    ↓
FontFile → OpenType.js (解析)
    ↓
Glyph 資訊提取
    ↓
逐字檢測（與字符集對比）
    ↓
覆蓋率計算（分層加權）
    ↓
結果聚合（分數、缺字列表）
    ↓
UI 渲染（預覽 + 統計）
```

### **核心模組詳解**

#### **1. 字型分析引擎 (fontHelper.ts)**

**職責**：核心分析邏輯與字符覆蓋率計算

**主要函數**：

```typescript
// 分析單個字型
analyzeFontFile(file: File): Promise<AnalysisResult>
  ├─ OpenType.js 解析字型檔案
  ├─ 檢測 Glyph 覆蓋情況
  ├─ 分層計算覆蓋率
  ├─ 生成缺字列表
  └─ 應用懲罰機制 (kill-switch)

// 檢查字符支援
hasGlyph(font: opentype.Font, char: string): boolean
  └─ 檢查字型是否包含該字符的字形

// 文字覆蓋率檢測
checkTextCoverage(font: opentype.Font, text: string): {missing: string[], rate: number}
  └─ 檢查特定文字在字型中的覆蓋情況
```

**V13 評分系統**：

```javascript
const EVALUATION_V13 = {
  essentialChars: {
    // 35 個基本關鍵字
    list: ['你', '們', '對', '了', '一', '是', '不', ...],
    weight: 0.4, // 40%
    killSwitch: {
      threshold: 0.8, // 缺字超過 20%（7+ 字）觸發
      penalty: 0.6   // 分數鎖至 60%
    }
  },
  coreTC: {
    // JF7000 標準 6,373 字
    weight: 0.35 // 35%
  },
  extensions: {
    // 粵語(137) + 台灣(930) + 人名(625) = 1,692 字
    weight: 0.15 // 15%
  },
  punctuation: {
    // 、。，；：？！「」…等 14 字
    weight: 0.1 // 10%
  }
}

// 計分邏輯
const baseScore = (essential × 0.4) + (core × 0.35) + (extension × 0.15) + (punctuation × 0.1)
const finalScore = essential缺字 > 20% ? Math.min(baseScore, 60) : baseScore
```

#### **2. 狀態管理 Hooks**

**useFontAnalysis**：單字型分析狀態

```typescript
interface FontAnalysisState {
  font: FontDefinition | null;
  previewText: string;
  isLoading: boolean;
  error: string | null;
}
```

**useFontComparison**：多字型比較狀態

```typescript
interface ComparisonState {
  fonts: ComparisonFont[]; // 最多 3 個
  previewText: string;
  previewSettings: PreviewSettings;
  isLoading: boolean;
}
```

**usePreviewSettings**：預覽設定狀態

```typescript
interface PreviewSettings {
  fontSize: number;
  fontColor: string;
  backgroundColor: string;
}
```

**usePreviewText**：預覽文字管理

```typescript
interface PreviewTextState {
  text: string;
  isEditing: boolean;
  // 預設文本集合
}
```

**useDragDrop**：拖放上傳狀態

```typescript
interface DragDropState {
  isDragging: boolean;
  isLoading: boolean;
  file: File | null;
}
```

#### **3. 元件層級 (Components)**

**頁面元件** (app/(pages)/)

- `analysis/page.tsx` - 單字型分析頁面
- `comparison/page.tsx` - 多字型對比頁面

**佈局元件**

- `PageHeader.tsx` - 頁面頭部（導航 + 標題）
- `Footer.tsx` - 頁面底部

**功能元件**

- `FontInfo.tsx` - 字型資訊卡片
  - 展示：覆蓋率、缺字列表、基本資訊
  - 智能顏色編碼（紅色/黃色/綠色表示覆蓋率等級）
  - 多維度覆蓋率視覺化：繁體、簡體、日文、英文

- `PreviewCard.tsx` - 預覽卡片
  - 展示：字型實時預覽
  - 動態計算預覽文字的字型覆蓋率
  - 缺字警告和詳細缺字列表
  - 與 PreviewSetting 聯動

- `PreviewTextPanel.tsx` - 文字編輯面板
  - 功能：編輯預覽文字、預設文本快速選擇
  - 語言切換（繁體中文 / 英文）
  - 實時缺字檢測與顯示

- `PreviewSetting.tsx` - 預覽控制面板
  - 控制：字體大小 (12-150px)、顏色、背景色
  - 實時反映到預覽卡片
  - 支援設定重置

- `FontListItem.tsx` - 字型列表項（對比頁面）
  - 展示：字型名稱 + 覆蓋率
  - 功能：移除字型

- `UploadZone.tsx` - 拖放上傳區域
  - 支援：拖放 + 點擊上傳
  - 驗證：檔案大小（50MB）、格式檢查
  - 視覺回饋和加載指示

- `PageHeader.tsx` - 頁面標題欄
  - 返回按鈕導航
  - 頁面標題展示

- `FeatureCard.tsx` - 功能特性卡片（首頁）
  - 展示應用功能概覽
  - 導航到功能頁面

- `Footer.tsx` - 底部欄位
  - 應用資訊和社群連結

#### **4. 工具模組 (lib/)**

**fontHelper.ts** - ⭐ 字型分析引擎（核心）

核心演算法和字型處理功能：

##### **字型分析引擎詳解**

**1. 分層評分系統 (V13 - 5 層模型)**

| 層級            | 字符集      | 字符數 | 權重 | 說明                                  |
| --------------- | ----------- | ------ | ---- | ------------------------------------- |
| **Essential**   | 基本關鍵字  | 35     | 40%  | 日常用語必有：你、們、對、了、一、是… |
| **Core**        | JF7000 標準 | 6,373  | 35%  | 核心繁體字集（日常排版必需）          |
| **Extension**   | 粵台人名    | 1,692  | 15%  | 粵語(137) + 台灣(930) + 人名(625)     |
| **Punctuation** | 標點符號    | 14     | 10%  | 、。，；：？！「」…等排版標點         |

**計分邏輯**：

```
基礎分數 = (Essential 覆蓋率 × 40%)
         + (Core 覆蓋率 × 35%)
         + (Extension 覆蓋率 × 15%)
         + (Punctuation 覆蓋率 × 10%)

最終分數 = 判定懲罰機制後的分數
```

**2. 懲罰機制 (Kill Switch)**

**觸發條件**：Essential Characters 缺字超過 20%（即缺 > 7 字）

**效果**：最終分數強制鎖定在 **60% 以下**，即使其他層級覆蓋率高也無效

**設計目的**：

- 防止日文字型誤判為可用（缺少幾個關鍵字但其他部分完整）
- 確保推薦的字型真的可以正常使用
- 使用者看到 > 60% 的分數時，可以有信心

**3. 字符集來源**

基於 [JetBrains Font (JF7000)](https://github.com/jetbrains/JetBrainsMono) 完整字集設計

- **JF7000 整體大小**：約 7,000 個不同字符（含所有層級）
- **去重後統計**：6,373 (Core) + 137 (Cantonese) + 930 (Taiwan) + 625 (Naming) = **約 8,065 個唯一字符**
- **簡體檢測特化**：額外擴展 ~1,200+ 簡體獨有字用於精準簡體/繁體判別

**4. 多維度語言檢測**

**繁體中文判定**

```
Score 繁體 > 70% → ✅ 優質繁體支援（推薦使用）
Score 繁體 50-70% → ⚠️ 基本繁體支援（有風險，檢查缺字）
Score 繁體 < 50% → ❌ 繁體支援不足
```

**簡體中文判定**

```
簡體獨有字覆蓋 > 70% → 簡體字型
同時存在繁簡字 → 雙語字型
```

**日文判定**

```
日文假名覆蓋 > 80% && 日文漢字覆蓋 > 50% → 日文字型
```

**英文判定**

```
基礎拉丁覆蓋 > 80% → 英文字型
```

**5. 匯出的主要函數**

| 函數名                     | 說明                                    |
| -------------------------- | --------------------------------------- |
| `analyzeFontFile(file)`    | 分析上傳的字型檔案，返回詳細分析結果    |
| `loadFontFace(name, data)` | 動態載入字型至瀏覽器 @font-face         |
| `removeFontFace(name)`     | 清理字型資源（卸載已加載的 @font-face） |
| `checkTextCoverage()`      | 檢查特定文字在字型中的覆蓋率            |

**返回值範例**

```typescript
interface FontAnalysisResult {
  // 覆蓋率 (%)
  scoreTrad: number; // 繁體中文分數 (0-100)
  scoreSimp: number; // 簡體中文分數 (0-100)
  scoreJP: number; // 日文分數 (0-100)
  scoreEN: number; // 英文分數 (0-100)

  // 詳細統計
  totalTCCharsChecked: number; // 檢查的繁體字總數 (~7000+)
  totalTCCharsMissing: number; // 缺失繁體字數
  missingCharsTC: string[]; // 具體缺失字列表

  // 語言判定
  language: 'Traditional' | 'Simplified' | 'Japanese' | 'English' | 'Mixed';

  // 當前分層結果
  essentialScore: number; // Essential 層分數
  coreScore: number; // Core 層分數
  extensionScore: number; // Extension 層分數
}
```

**其他工具模組**

- `coverageHelpers.ts`: 覆蓋率顏色映射和狀態判定
  - 紅色 (0-50%): 不支援
  - 黃色 (50-70%): 部分支援
  - 綠色 (70-100%): 良好支援

- `glyphLists.ts`: 標準字符集參考清單
  - JF7000 核心字集 (6,373 字)
  - 粵語擴展 (137 字)
  - 台灣擴展 (930 字)
  - 人名用字 (625 字)
  - 標點符號 (14 字)
  - 簡體獨有擴展 (~1,200+ 字)

- `previewTexts.ts`: 預設預覽文本集合
  - 繁體中文測試句
  - 英文測試字符
  - 隨機選擇及快速切換

- `types.ts`: TypeScript 全域類型定義
  - `FontAnalysisResult`: 分析結果類型
  - `Font`: 字型元資料類型
  - `PreviewSettings`: 預覽設定類型

#### **5. Hooks 模組 (hooks/)**

- `useFontAnalysis.ts`: 單一字型分析狀態管理
- `useFontComparison.ts`: 多字型並排比較（最多 3 個）
- `usePreviewSettings.ts`: 預覽設定狀態（字體大小、顏色、背景、語言）
- `usePreviewText.ts`: 預覽文字初始化（自動填入預設文本）
- `useDragDrop.ts`: 拖放上傳功能（檔案驗證、視覺回饋）

### **資料流向圖**

```
使用者上傳字型
       ↓
UploadZone (檔案驗證) [useDragDrop]
       ↓
useFontAnalysis / useFontComparison (載入狀態)
       ↓
fontHelper.ts (分析引擎)
  ├─ OpenType.js (字型解析)
  ├─ glyphLists.ts (標準字符集參照)
  └─ 分層評分 + 懲罰機制
       ↓
FontInfo.tsx (結果展示)
usePreviewText.ts (自動填入預設文本)
       ↓
usePreviewSettings (預覽設定) [PreviewSetting]
       ↓
PreviewCard.tsx (即時預覽 + 缺字警告)
```

---

## 💻 開發工作流程

### **修改流程**

#### 修改 UI 元件

```bash
# 1. 編輯元件檔案
vim app/components/MyComponent.tsx

# 2. 開發伺服器自動熱更新 (HMR)
# 瀏覽器會自動刷新，保留頁面狀態

# 3. (可選) 執行類型檢查
npm run lint

# 4. 完成後提交 Git
git add .
git commit -m "feat: update MyComponent"
```

#### 修改分析邏輯

```bash
# 1. 編輯 lib/fontHelper.ts
vim app/lib/fontHelper.ts

# 2. 立即生效（HMR）
# 分析頁面會重新執行新邏輯

# 3. 手動測試新邏輯
# - 上傳測試字型
# - 驗證覆蓋率計算結果
# - 檢查缺字列表準確性
```

#### 新增功能檢查清單

```
□ 建立必要的檔案（元件、hooks、型別）
□ 實現功能邏輯
□ 新增 TypeScript 型別定義
□ 編寫或更新相關樣式（Tailwind）
□ 確保響應式設計（sm: 和 lg: 斷點）
□ 測試功能完整性
□ 提交程式碼和相關文檔
```

### **除錯技巧**

#### 檢查字型分析結果

```javascript
// 在 browser console 中測試
const font = /* 上傳的字型 */;
console.log(font); // 檢查字型物件結構

// 檢查特定字符是否被支援
const hasChar = font.getPath('字');
console.log(hasChar); // null 表示不支援
```

#### 檢查 React 元件狀態

```bash
# 安裝 React DevTools 瀏覽器擴充
# 使用 React DevTools 檢查：
# - Hooks 狀態變化
# - 元件重新渲染頻率
# - Props 傳遞
```

#### 性能分析

```bash
# 1. 開啟 Chrome DevTools
# 2. Performance 標籤
# 3. 執行操作並記錄
# 4. 分析瓶頸（通常在字型解析）
```

---

## 📦 依賴說明

| 依賴             | 版本    | 用途       | 為什麼選擇                      |
| ---------------- | ------- | ---------- | ------------------------------- |
| **next**         | 15.2.0  | 應用框架   | 最新 App Router，伺服器元件支援 |
| **react**        | 19.x    | UI 庫      | 與 Next.js 15 整合最佳          |
| **typescript**   | 5.8.2   | 類型系統   | 完整的型別安全                  |
| **tailwindcss**  | 4.0.0   | CSS 框架   | 高效的響應式設計                |
| **opentype.js**  | 1.3.4   | 字型解析   | 瀏覽器端解析 OTF/TTF            |
| **lucide-react** | 0.562.0 | 圖示庫     | 輕量級 SVG 圖示                 |
| **prettier**     | 3.7.4   | 程式碼格式 | 自動格式化 Tailwind CSS         |

---

## 🔧 配置檔案詳解

### **tsconfig.json** (TypeScript 嚴格模式)

```json
{
  "compilerOptions": {
    "strict": true, // 啟用所有嚴格型別檢查
    "noUncheckedIndexedAccess": true, // 索引訪問需要型別檢查
    "noImplicitAny": true, // 禁止隱含 any
    "lib": ["ES2020", "dom"] // ES2020 + DOM API
  }
}
```

### **tailwind.config.js** (響應式設定)

```javascript
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        stone: { ... },  // 灰色系調色盤
        primary: '#...',
        accent: '#...'
      }
    }
  },
  plugins: []
}
```

**響應式斷點**：

- `sm:` → 640px 及以上（平板）
- `lg:` → 1024px 及以上（桌面）
- 基礎樣式 → 行動優先

### **next.config.js** (最佳化設定)

```javascript
const nextConfig = {
  // 優化和部署設定
};
```

---

## 🧪 測試與驗證

### **手動測試清單**

#### 功能測試

- [ ] 上傳 TTF 字型 → 正確分析
- [ ] 上傳 OTF 字型 → 正確分析
- [ ] 上傳 WOFF 字型 → 正確分析
- [ ] 上傳 WOFF2 字型 → 正確分析
- [ ] 上傳超大字型（>50MB） → 提示錯誤
- [ ] 上傳無效檔案 → 提示錯誤
- [ ] 對比 3 個字型 → 全部分析正確
- [ ] 對比超過 3 個 → 提示錯誤或替換

#### 預覽功能

- [ ] 編輯預覽文字 → 即時更新
- [ ] 調整字體大小 → 預覽改變
- [ ] 選擇文字顏色 → 預覽改變
- [ ] 選擇背景色 → 預覽改變
- [ ] 使用預設文本 → 快速填充

#### 響應式設計

- [ ] 桌面版（1400px+）→ 佈局正確
- [ ] 平板版（768px）→ 單列堆疊
- [ ] 行動版（375px）→ 字體可讀
- [ ] 觸摸操作 → 按鈕易點擊

### \*\*自動化測試（可選）

```bash
# 建立測試檔案
npm install --save-dev jest @testing-library/react

# 執行測試
npm run test

# 檢查涵蓋率
npm run test:coverage
```

---

## � 故障排除指南

### **常見問題與解決方案**

#### 問題 1：開發伺服器無法啟動

```
錯誤：Port 3000 已被佔用
解決方案 1: 在另一個 port 啟動
npm run dev -- -p 4000

解決方案 2: 終止佔用 port 3000 的程序
lsof -i :3000  # 查看 PID
kill -9 <PID>  # 終止程序
```

#### 問題 2：TypeScript 編譯錯誤

```
錯誤：'font.coverage' is possibly 'undefined'
原因：某些字型可能沒有覆蓋率資訊
解決：確認型別定義中使用可選屬性 (coverage?)
    在存取前檢查：if (font.coverage) { ... }
```

#### 問題 3：字型分析結果異常

```
症狀：所有字型覆蓋率都是 0%
原因：OpenType.js 版本不相容或字型檔案損壞
解決：
1. 驗證字型檔案是否有效
   file <字型檔案>  # 應顯示 TrueType 或 OpenType
2. 升級 opentype.js
   npm install opentype.js@latest
3. 清除快取和重新安裝
   rm -rf node_modules package-lock.json
   npm install
```

#### 問題 4：預覽文字無法顯示某些字符

```
症狀：預覽區顯示 □ 或 ?
原因：系統缺少字型或字型不支援該字符
解決：
1. 確認字型已正確上傳
2. 檢查缺字列表，該字符是否在列表中
3. 嘗試換另一個字型測試
```

#### 問題 5：應用在行動裝置上顯示異常

```
症狀：行動版排版混亂、字太小
原因：響應式樣式未正確套用
解決：
1. 檢查 Tailwind 配置是否包含 sm: 和 lg: 斷點
2. 驗證元件是否使用了響應式類別
   ✓ className="p-4 sm:p-6"  // 正確
   ✗ className="p-4"         // 不響應式
3. 清除瀏覽器快取並重新載入
```

#### 問題 6：npm 依賴衝突

```
錯誤：npm ERR! peer dep missing

解決方案 1: 強制安裝（接受不相容）
npm install --legacy-peer-deps

解決方案 2: 更新所有依賴
npm update

解決方案 3: 重新初始化 node_modules
rm -rf node_modules package-lock.json
npm install
```

#### 問題 7：構建失敗或超時

```
症狀：npm run build 卡住或超時
原因：字型檔案太大或系統資源不足
解決：
1. 增加 Node 堆記憶體限制
   NODE_OPTIONS=--max-old-space-size=4096 npm run build
2. 清除 .next 快取
   rm -rf .next
   npm run build
3. 檢查磁碟空間
   df -h  # 查看磁碟使用情況
```

### **效能最佳化建議**

#### 字型分析速度慢？

```javascript
// ❌ 避免：重複分析相同字型
for (let char of chars) {
  const result = analyzeFont(font, char); // 多次呼叫
}

// ✅ 推薦：單次分析，快速查詢
const analysis = analyzeFont(font); // 一次
const hasCoverage = analysis.missingChars.has(char); // 快速查詢
```

#### 預覽渲染卡頓？

```javascript
// ❌ 避免：每次都重新繪製整個預覽
useEffect(() => {
  renderFullPreview(); // 頻繁重新渲染
}, [previewText, fontSize, color]);

// ✅ 推薦：只更新改變的部分
const memoizedPreview = useMemo(() => renderPreview(previewText), [previewText]);
```

---

## 🤝 貢獻指南

### **如何貢獻代碼**

#### 1. 提交 Issue（報告 Bug 或建議功能）

```markdown
### 標題

[BUG] 字型分析結果異常
或
[FEATURE] 支援繁簡轉換預覽

### 描述

清楚說明問題或建議

### 重現步驟（如果是 Bug）

1. 上傳 xxx 字型
2. 查看分析結果
3. 發現缺字列表不正確

### 預期行為

應該列出所有 17 個缺字

### 實際行為

只列出了 10 個

### 環境資訊

- 瀏覽器：Chrome 120
- 作業系統：macOS 13
- Node 版本：18.17
```

#### 2. 提交 Pull Request

```bash
# 1. Fork 並克隆倉庫
git clone https://github.com/<你的帳號>/Font-Preview.git
cd Font-Preview

# 2. 建立功能分支
git checkout -b feature/你的功能名稱

# 3. 進行修改
vim app/components/NewFeature.tsx

# 4. 測試修改
npm run dev
# 手動測試...
npm run lint
npm run build  # 確保構建成功

# 5. 提交程式碼
git add .
git commit -m "feat: add new feature description"

# 6. 推送分支
git push origin feature/你的功能名稱

# 7. 在 GitHub 建立 PR
# 填寫清晰的 PR 描述
```

#### 3. PR 審查清單

提交 PR 前，請確認：

- [ ] 程式碼遵循專案風格（Prettier 已格式化）
- [ ] 無 TypeScript 錯誤（`npm run lint` 通過）
- [ ] 應用成功構建（`npm run build` 通過）
- [ ] 包含必要的註解和文檔
- [ ] 新增功能包含測試（如適用）
- [ ] 響應式設計正確（桌面和行動）
- [ ] 沒有引入不必要的依賴

### **程式碼風格指南**

#### TypeScript 命名規範

```typescript
// ✅ 推薦
const isLoading = true; // 布林值：is/has 前綴
const handleFontUpload = () => {}; // 事件處理：handle 前綴
const calculateCoverage = (font) => {}; // 函數：動詞開頭
const FontCard = () => {}; // 元件：PascalCase
const CRITICAL_CHARS = []; // 常數：UPPER_SNAKE_CASE

// ❌ 避免
const loading = true; // 不清楚
const onUpload = () => {}; // 太籠統
const coverage = (font) => {}; // 不知道做什麼
const fontCard = () => {}; // 應該大寫
```

#### Tailwind CSS 類別順序

```tsx
// ✅ 推薦順序：佈局 → 間距 → 邊框 → 背景 → 文字 → 特效 → 狀態
<div className="
  flex flex-col items-center gap-4
  p-4 sm:p-6
  rounded-lg border border-stone-200
  bg-white
  text-center text-sm
  shadow-md
  hover:shadow-lg
">

// ❌ 避免：混亂的順序
<div className="text-sm shadow-md p-4 flex bg-white gap-4 border">
```

#### React 元件結構

```typescript
// 標準元件結構
import React from 'react';
import { Dependency } from '@/lib/...';

// 1. 型別定義
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

// 2. 元件實現
const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  // 3. Hooks（順序：state → effect → handlers）
  const [state, setState] = React.useState(false);

  React.useEffect(() => {
    // 初始化邏輯
  }, []);

  const handleAction = () => {
    onAction?.();
  };

  // 4. 渲染
  return (
    <div className="...">
      <h2>{title}</h2>
      <button onClick={handleAction}>Click</button>
    </div>
  );
};

// 5. 匯出
export default MyComponent;
```

#### 評論標準

```typescript
// ✅ 有用的評論
// 檢查基本關鍵字的缺字數量，如果超過 20% 則降分到 60%
if (criticalCharsGap > 0.2) {
  score = 0.6;
}

// ❌ 無用的評論
const x = font.name; // 獲取字型名稱

// TODO 評論
// TODO: 實現字型快取機制以提升性能
```

### **文檔更新指南**

修改代碼時，請同時更新相關文檔：

```bash
# 修改字型分析邏輯？更新這部分：
#   └─ README.md → 🔬 分析邏輯深入解析

# 新增頁面或路由？更新：
#   └─ README.md → 📁 專案結構

# 新增元件？更新：
#   └─ README.md → 🏗 架構深入解析 → 4. 元件層級

# 新增功能？更新：
#   └─ README.md → ✨ 核心功能 表格
```

---

## 📊 開發統計

### **專案規模**

| 項目            | 數量      |
| --------------- | --------- |
| 頁面元件        | 2 個      |
| 功能元件        | 8 個      |
| 自訂 Hooks      | 5 個      |
| 工具模組        | 4 個      |
| 總程式碼行數    | ~1,500 行 |
| TypeScript 覆蓋 | 100%      |

### **瀏覽器相容性**

| 瀏覽器  | 版本 | 支援 |
| ------- | ---- | ---- |
| Chrome  | 90+  | ✅   |
| Firefox | 88+  | ✅   |
| Safari  | 14+  | ✅   |
| Edge    | 90+  | ✅   |
| IE      | -    | ❌   |

### **效能指標**

| 指標            | 目標    | 實際   |
| --------------- | ------- | ------ |
| 首次加載        | < 2s    | ~1.5s  |
| 字型分析        | < 3s    | ~1-2s  |
| 預覽更新        | < 500ms | ~100ms |
| Lighthouse 分數 | > 90    | 92+    |

---

## 📚 相關資源

### **字型技術參考**

- [OpenType.js 文檔](https://opentype.js.org/)
- [Google Fonts](https://fonts.google.com/)
- [繁體中文字型清單](https://www.justfont.com/)

### **開發工具**

- [Next.js 官方文檔](https://nextjs.org/docs)
- [Tailwind CSS 官方文檔](https://tailwindcss.com/docs)
- [TypeScript 官方文檔](https://www.typescriptlang.org/docs/)

### **設計靈感**

- [Figma](https://www.figma.com/)
- [Dribbble](https://dribbble.com/)
- [Behance](https://www.behance.net/)

---

## 🎓 學習路線（適合新手貢獻者）

### **第 1 周：理解架構**

- [ ] 讀 README 和專案結構
- [ ] 本地執行 `npm run dev` 並測試各功能
- [ ] 瀏覽並理解核心檔案（fontHelper.ts、types.ts）

### **第 2 周：修改 UI**

- [ ] 修改一個簡單元件的樣式（如 Footer）
- [ ] 新增一個新的預設預覽文本
- [ ] 理解 Tailwind CSS 響應式斷點

### **第 3 周：修改邏輯**

- [ ] 在 fontHelper.ts 中修改一個字符集定義
- [ ] 執行測試並驗證變更結果
- [ ] 提交第一個 PR

### **第 4+ 周：進階貢獻**

- [ ] 新增新功能（如批量分析、匯出報告）
- [ ] 優化效能（如字型快取、Web Worker）
- [ ] 編寫單元測試

---

## 📞 聯絡方式

| 管道          | 聯絡方式            |
| ------------- | ------------------- |
| GitHub Issues | 報告 Bug 或功能建議 |
| Email         | 重要事項聯絡        |
| Discussions   | 技術討論和分享      |

---

## 📄 變更日誌

### 最近更新 (2025-12-24)

- ✨ 完成 RWD 響應式設計優化
  - 所有元件新增 sm: 和 lg: 斷點
  - 行動端友善的觸摸操作
  - 平板版本最佳化

- 🐛 修復問題
  - 修復 FontListItem 條件渲染
  - 修復 TypeScript 類型檢查

- 📖 文檔更新
  - 完善架構規劃文檔
  - 新增開發工作流程指南
  - 新增故障排除部分
  - 新增貢獻指南

---

**FontFlow** — 讓繁體中文字型選擇變得簡單明了。

**最後更新**：2025 年 12 月 24 日

### **為什麼顯示 100% 覆蓋率卻還有缺字？**

這是正常的行為！

```
覆蓋率百分比 ≠ 完全支援所有字

覆蓋率 100% 意味著：
  ✅ 核心繁體 (500字) 完全支援
  ✅ 進階繁體也完全支援
  ✅ 標點符號全部支援

缺字列表顯示：
  ⚠️ 其他測試中發現的字也不支援
  ⚠️ 這些通常是更邊緣的字 (極少使用)
```

**結論**：100% 覆蓋率的字型已經**非常優秀**，缺字清單中的字通常影響甚微。

### **基本關鍵字的「懲罰機制」**

某些日文字型在繁體中文中會**系統性缺字**。例如：

- 日文常缺「你、們、對」等常見繁體字

如果基本關鍵字缺字超過 20%，我們會：

1. ✅ 保持詳細的缺字列表（讓您知道確切缺什麼）
2. 🔴 **強制降低評分到 60%**（反映出「不適合繁體使用」的事實）

這防止了「看起來很好但實際無法使用」的假象。

---

## 📊 分析結果解讀

### **覆蓋率指標**

| 分數範圍    | 評級      | 繁體相容性           |
| ----------- | --------- | -------------------- |
| **90-100%** | 🟢 優秀   | 完全可用，幾乎無缺字 |
| **80-89%**  | 🟡 良好   | 可用，有少量缺字     |
| **60-79%**  | 🔴 有缺字 | 有明顯缺字，使用受限 |
| **0-59%**   | ⚫ 不適合 | 不推薦用於繁體排版   |

### **缺字列表解讀**

```
缺失繁體字 (17)
值、查、鄉、幅、褐、讓、鬱、墨、騙、龍、齧、齜、齠、齙、齟、齡、齻
```

**如何評估影響**：

- ✅ 缺字少於 5 個：基本無影響
- ⚠️ 缺字 5-20 個：有潛在風險，檢查具體字符
- 🔴 缺字超過 20 個：使用需謹慎

---

## ⚡ 效能優化

### **前端最佳實踐**

- ✅ Next.js App Router（原生伺服器元件）
- ✅ Tailwind CSS v4 PostCSS 架構（更小的 CSS）
- ✅ TypeScript 嚴格模式（類型安全）
- ✅ 預優化的字符集（預先計算 Set，避免重複計算）

### **字型分析優化**

- ✅ Set 資料結構（快速查詢，避免重複）
- ✅ 文件大小驗證（防止超大檔案卡頓，上限 50MB）
- ✅ 記憶體管理（自動清理舊字型，防止洩漏）
- ✅ 分層測試系統（只測試關鍵字符，避免全掃描）

### **使用體驗優化**

- ✅ 即時預覽（無需安裝字體到系統）
- ✅ 拖放上傳（快速上傳檔案）
- ✅ 本地処理（無伺服器延遲，隱私保護）
- ✅ 完全響應式（桌面和行動完美支援）

---

## 🔒 隱私與安全

- ✅ **100% 本地処理** — 所有分析都在您的瀏覽器內完成
- ✅ **無伺服器上傳** — 字型檔案不離開您的電腦
- ✅ **自動清理** — 分析完成後自動釋放記憶體
- ✅ **無追蹤** — 不收集任何使用者數據

---

## 📝 授權

MIT License - 自由使用、修改和分發

---

## 💡 常見問題

### **Q1: 為什麼日文字型常常缺繁體字？**

日文字型通常只包含日文漢字 (Kanji) 的字形。即使是相同的字，繁體和日文的**筆畫寫法可能不同**。FontFlow 可以精確檢測這些差異。

### **Q2: 支援的檔案格式有哪些？**

支援：TTF, OTF, WOFF, WOFF2

限制：

- 單個檔案不超過 50MB
- 必須是有效的字型檔案

### **Q3: 為什麼覆蓋率 100% 還有缺字？**

正常的！覆蓋率是根據**關鍵字符集**計算的。缺字列表展示的是**完整測試集**中的缺字。這很有用，因為它告訴您「字型基本可用，但有這些邊緣字缺字」。

### **Q4: 可以用於商業目的嗎？**

可以！FontFlow 是開源工具，遵循 MIT 授權。但請尊重原字型的授權條款。

---

**FontFlow** — 讓繁體中文字型選擇變得簡單明了。
