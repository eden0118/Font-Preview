/**
 * 全域 TypeScript 類型定義
 *
 * 包含：
 * - FontDefinition: 字型分析結果
 * - ComparisonFont: 比較頁面的字型插槽
 * - UI 狀態類型
 */

import { PreviewLanguage } from './previewTexts';

// ============================================================================
// 字型相關類型
// ============================================================================

/**
 * 語言標籤
 */
export type LanguageTag = 'tc' | 'sc' | 'en' | 'ja' | 'ko';

/**
 * 覆蓋率信息
 */
export interface CoverageInfo {
  tc: number; // 繁體中文適用性（基於 GLYPH_BASE）
  sc: number; // 簡體中文適用性
  en: number; // 英文適用性
  ja: number; // 日文適用性
}

/**
 * 字型分析結果主體
 */
export interface FontDefinition {
  // 基本信息
  name: string;
  family: string;
  description?: string;
  isCustom?: boolean;
  glyphCount?: number;

  // 標籤
  tags: LanguageTag[];

  // 覆蓋率評分 (0-100)
  coverage?: CoverageInfo;

  // 支援的字符範圍（用於快速檢查）
  supportedChars?: string;

  // 缺失字符集
  missingTCChars?: string;
  missingEssentialChars?: string;
  missingCoreOnlyChars?: string;
  missingCoreTCChars?: string;

  // 統計信息
  totalTCCharsChecked?: number;
  totalCoreCharsChecked?: number;
}

// ============================================================================
// 預覽相關類型
// ============================================================================

/**
 * 顏色設定
 */
export interface ColorSettings {
  fontColor: string;
  bgColor: string;
  fontSize: number;
}

/**
 * 預覽設定
 */
export interface PreviewSettings extends ColorSettings {
  language: PreviewLanguage;
}

// ============================================================================
// 比較功能相關類型
// ============================================================================

/**
 * 比較頁面的字型插槽
 */
export interface ComparisonFont {
  font: FontDefinition | null;
  id: string;
}

/**
 * 比較狀態
 */
export interface ComparisonState {
  fonts: ComparisonFont[];
  previewText: string;
  settings: PreviewSettings;
  isAnalyzing: boolean;
  error: string | null;
}

// ============================================================================
// 分析相關類型
// ============================================================================

/**
 * 文字覆蓋率信息
 */
export interface TextCoverageInfo {
  coverage: number; // 百分比
  total: number; // 非空格字符總數
  missing: string[]; // 缺字列表
}

/**
 * 分析結果狀態
 */
export interface AnalysisState {
  font: FontDefinition | null;
  isAnalyzing: boolean;
  error: string | null;
  previewText: string;
}

// ============================================================================
// 快取相關類型
// ============================================================================

/**
 * 快取條目
 */
export interface CachedFontEntry {
  fontDef: FontDefinition;
  timestamp: number;
}

/**
 * 快取統計信息
 */
export interface CacheStats {
  size: number;
  maxSize: number;
  entries: string[];
}
