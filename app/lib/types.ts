export interface FontDefinition {
  name: string;
  family: string;

  tags: ('tc' | 'sc' | 'en' | 'ja' | 'ko')[];

  isCustom?: boolean;
  glyphCount?: number;
  // 適用性分數 (0-100)
  coverage?: {
    tc: number; // 繁體中文適用性（基於 GLYPH_BASE）
    sc: number; // 簡體中文適用性
    en: number; // 英文適用性
    ja: number; // 日文適用性
  };
  // 支援的字符範圍（用於快速檢查）
  supportedChars?: string;
  description?: string;
  // 缺失的繁體中文字
  missingTCChars?: string;
  // 缺失的 ESSENTIAL 字（生存關鍵字 - 只顯示具體字符）
  missingEssentialChars?: string;
  // 缺失的核心繁體字（只包含 ESSENTIAL + CORE）- 用於顯示
  missingCoreOnlyChars?: string;
  // 缺失的核心繁體字（影響日常使用）- 用於判定是否顯示警告
  missingCoreTCChars?: string;
  // 檢查的繁體中文字總數（包含 ESSENTIAL、CORE、CANTONESE、TAIWAN、NAMING）
  totalTCCharsChecked?: number;
  // ★ 新增：GLYPH_BASE (CORE) 字符數，用於計算覆蓋率
  totalCoreCharsChecked?: number;
}

export type TabMode = 'analysis' | 'comparison';

export interface ComparisonFont {
  font: FontDefinition | null;
  id: string;
}
