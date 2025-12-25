/**
 * config/constants.ts - 全局常數定義
 *
 * 集中管理所有魔法數字和配置值
 * 便於統一調整和維護
 */

/**
 * 字型相關配置
 */
export const FONT_CONFIG = {
  // 檔案大小限制
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB

  // 超時時間
  ANALYSIS_TIMEOUT: 5000, // 5秒

  // 比較功能
  MAX_COMPARISON_SLOTS: 3,

  // 預覽設定
  MIN_FONT_SIZE: 12, // px
  MAX_FONT_SIZE: 150, // px
  DEFAULT_FONT_SIZE: 28, // px

  // 快取配置
  CACHE_MAX_SIZE: 20, // 最多快取 20 個字型
  CACHE_TTL: Infinity, // 無過期時間

  // 覆蓋率評分閾值
  SCORE_THRESHOLDS: {
    POOR: 50, // 0-50%：不支援
    FAIR: 70, // 50-70%：部分支援
    GOOD: 85, // 70-85%：良好支援
    EXCELLENT: 100, // 85-100%：優質支援
  },
} as const;

/**
 * UI 相關配置
 */
export const UI_CONFIG = {
  // 響應式斷點
  BREAKPOINTS: {
    sm: 640,
    lg: 1024,
    xl: 1280,
  },

  // 動畫時間（毫秒）
  ANIMATION_DURATION: {
    SHORT: 200,
    DEFAULT: 300,
    LONG: 500,
  },

  // Z-index 層級
  Z_INDEX: {
    DROPDOWN: 10,
    MODAL: 20,
    TOOLTIP: 30,
  },

  // 預設顏色
  DEFAULT_COLORS: {
    FONT_COLOR: '#292524',
    BG_COLOR: '#FFFFFF',
  },
} as const;

/**
 * API 和伺服器相關配置
 */
export const SERVER_CONFIG = {
  // 環境變數（從 .env.local 讀取）
  API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT
    ? parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT, 10)
    : 5000,

  CACHE_ENABLED: process.env.NEXT_PUBLIC_CACHE_ENABLED !== 'false',

  // 本地存儲鍵名
  STORAGE_KEYS: {
    ANALYTICS: 'analytics_events',
    FONT_CACHE: 'font_cache',
    USER_PREFERENCES: 'user_preferences',
  },
} as const;

/**
 * 文本常數
 */
export const TEXT_CONFIG = {
  ERROR_MESSAGES: {
    INVALID_FILE_TYPE: '不支援的檔案類型。請上傳 TTF、OTF、WOFF 或 WOFF2 檔案。',
    FILE_TOO_LARGE: '檔案過大。最大支援 50MB。',
    ANALYSIS_FAILED: '字型分析失敗。請嘗試其他檔案。',
    NETWORK_ERROR: '網路連線錯誤。請檢查您的連線。',
  },

  SUCCESS_MESSAGES: {
    FONT_LOADED: '字型已成功載入！',
    CACHE_HIT: '從快取快速載入字型。',
  },
} as const;

/**
 * 驗證規則
 */
export const VALIDATION = {
  // 支援的字型格式
  SUPPORTED_FONT_TYPES: [
    'font/ttf',
    'font/otf',
    'font/woff',
    'font/woff2',
    'application/font-ttf',
    'application/font-otf',
    'application/font-woff',
  ],

  // 支援的副檔名
  SUPPORTED_EXTENSIONS: ['.ttf', '.otf', '.woff', '.woff2'],
} as const;
