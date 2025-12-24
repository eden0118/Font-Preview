export interface FontDefinition {
  name: string;
  family: string;
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting';
  tags: ('tc' | 'sc' | 'en' | 'ja' | 'ko')[];
  description?: string;
  isCustom?: boolean;
  glyphCount?: number;
  // 適用性分數 (0-100)
  coverage?: {
    tc: number; // 繁體中文適用性
    sc: number; // 簡體中文適用性
    ja: number; // 日文適用性
  };
}

export type TabMode = 'analysis' | 'comparison';

export interface ComparisonFont {
  font: FontDefinition | null;
  id: string;
}
