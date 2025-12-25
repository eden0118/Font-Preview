# 代碼風格最佳實踐指南

## 📝 命名規範

### TypeScript 變數和函數

```typescript
// ✅ 推薦
const isLoading = true; // 布林值：is/has 前綴
const handleFontUpload = () => {}; // 事件處理：handle 前綴
const calculateCoverage = (font) => {}; // 函數：動詞開頭
const MAX_FILE_SIZE = 50; // 常數：UPPER_SNAKE_CASE

// ❌ 避免
const loading = true; // 不清楚
const onUpload = () => {}; // 太籠統
const coverage = (font) => {}; // 不知道做什麼
```

### React 元件

```typescript
// ✅ 推薦
const FontCard = () => {}; // PascalCase
const useFontAnalysis = () => {}; // Hook：useXxx

// ❌ 避免
const fontCard = () => {}; // 應該大寫
const FontAnalysisHook = () => {}; // Hook 應該小寫
```

## 🎨 Tailwind CSS 類別順序

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
  transition-all duration-300
">
</div>

// ❌ 避免：混亂的順序
<div className="text-sm shadow-md p-4 flex bg-white gap-4 border">
</div>
```

## 🏗 React 元件結構

```typescript
/**
 * 元件 JSDoc 說明
 */
import React from 'react';
import { Dependency } from '@/lib/...';

// 1️⃣ 型別定義
interface ComponentProps {
  title: string;
  onAction?: () => void;
}

// 2️⃣ 元件實現
export const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
  // 3️⃣ Hooks（順序：state → effect → handlers）
  const [state, setState] = React.useState(false);

  React.useEffect(() => {
    // 初始化邏輯
  }, []);

  const handleAction = useCallback(() => {
    onAction?.();
  }, [onAction]);

  // 4️⃣ 渲染
  return (
    <div className="...">
      <h2>{title}</h2>
      <button onClick={handleAction}>Click</button>
    </div>
  );
};

// 5️⃣ 匯出（帶 display name 用於開發工具）
Component.displayName = 'Component';
export default Component;
```

## 💬 註解標準

```typescript
// ✅ 有用的註解
// 檢查基本關鍵字的缺字數量，如果超過 20% 則降分到 60%
if (criticalCharsGap > 0.2) {
  score = 0.6;
}

// ✅ JSDoc 文件字符串
/**
 * 分析字型覆蓋率
 * @param font - 字型定義
 * @param text - 檢查的文字
 * @returns 覆蓋率百分比 (0-100)
 */
function analyzeFontCoverage(font: FontDefinition, text: string): number {
  // ...
}

// ❌ 無用的註解
const x = font.name; // 獲取字型名稱
for (const char of chars) {
  // 迴圈遍歷
}
```

## 🎯 性能最佳實踐

### 記憶化優化

```typescript
// ❌ 避免：每次都重新計算
function Component({ text, font }) {
  const coverage = calculateCoverage(text, font);
  return <div>{coverage}</div>;
}

// ✅ 推薦：使用 useMemo
function Component({ text, font }) {
  const coverage = useMemo(
    () => calculateCoverage(text, font),
    [text, font]
  );
  return <div>{coverage}</div>;
}
```

### 回調優化

```typescript
// ❌ 避免：每次都新建函數
const handleClick = () => {
  // ...
};

// ✅ 推薦：使用 useCallback
const handleClick = useCallback(() => {
  // ...
}, [依賴]);
```

## 🚫 常見錯誤和檢查清單

### 提交前檢查

- [ ] 無 TypeScript 錯誤 (`npm run lint` 通過)
- [ ] Prettier 已格式化 (`npm run format`)
- [ ] 應用成功構建 (`npm run build`)
- [ ] 響應式設計正確（sm: 和 lg: 斷點）
- [ ] 沒有 console.log（除了開發用途）
- [ ] 沒有 any 類型（改用具體類型）
- [ ] 有必要的錯誤處理
- [ ] 新增功能有相應文檔

### 常見錯誤

```typescript
// ❌ 避免：寬泛的 any 類型
function process(data: any) {
  return data.map((item: any) => item.name);
}

// ✅ 推薦：具體的類型
interface Item {
  name: string;
  id: number;
}

function process(data: Item[]): string[] {
  return data.map((item) => item.name);
}
```

## 📦 檔案組織

```
app/
├── components/          # 可復用 UI 元件
│   ├── ErrorBoundary.tsx
│   ├── FontInfo.tsx
│   └── ...
├── hooks/              # 自訂 React Hooks
│   ├── useFontAnalysis.ts
│   ├── useFontCache.ts
│   └── ...
├── lib/                # 核心工具和業務邏輯
│   ├── analytics.ts
│   ├── fontHelper.ts
│   ├── types.ts
│   └── ...
├── config/             # 配置文件
│   └── constants.ts
└── (pages)/            # 頁面路由
    ├── analysis/
    └── comparison/
```

## 🔍 代碼審查檢查清單

- [ ] 代碼遵循項目風格指南
- [ ] 功能經過充分測試
- [ ] 沒有邏輯重複（DRY 原則）
- [ ] 必要時添加了新的類型定義
- [ ] 註解清晰且有用
- [ ] 沒有使用已棄用的 API
- [ ] 考慮了邊界情況和錯誤處理
- [ ] 性能合理（無不必要的重新渲染等）
