import { parse } from 'opentype.js';
import { FontDefinition } from './types';

// ============================================================================
// 1. 測試字符集 - 用於判斷「適用性」而非「語系分類」
// ============================================================================

// 繁體中文常用字測試集 (50字)
// 包含：高頻常用字 + 繁體特有寫法字
// 目標：測試這個字體能否滿足「繁體中文文案」的需求
const TC_TEST_CHARS = [
  // 繁體特有字（與簡體寫法不同）
  '國',
  '體',
  '話',
  '寶',
  '門',
  '經',
  '號',
  '葉',
  '說',
  '邊',
  '實',
  '這',
  '會',
  '後',
  '學',
  '機',
  '關',
  '開',
  '電',
  '車',
  // 高頻常用字（繁簡同形但必須存在）
  '的',
  '是',
  '在',
  '有',
  '我',
  '你',
  '他',
  '她',
  '們',
  '個',
  '來',
  '去',
  '好',
  '看',
  '想',
  '要',
  '能',
  '不',
  '了',
  '也',
  // 繁體文案常見字
  '臺',
  '灣',
  '網',
  '路',
  '資',
  '訊',
  '設',
  '計',
  '產',
  '品',
];

// 簡體中文特有字測試集 (20字)
// 目標：快速判斷是否為簡體字型
const SC_TEST_CHARS = [
  '国',
  '体',
  '话',
  '宝',
  '门',
  '经',
  '号',
  '叶',
  '说',
  '边',
  '实',
  '这',
  '会',
  '后',
  '学',
  '机',
  '关',
  '开',
  '电',
  '车',
];

// 日文假名測試集 (20字)
// 平假名 + 片假名混合
const JA_TEST_CHARS = [
  'あ',
  'い',
  'う',
  'え',
  'お',
  'か',
  'き',
  'く',
  'け',
  'こ',
  'ア',
  'イ',
  'ウ',
  'エ',
  'オ',
  'カ',
  'キ',
  'ク',
  'ケ',
  'コ',
];

// ============================================================================
// 2. HELPER FUNCTIONS
// ============================================================================

const hasGlyph = (font: any, char: string): boolean => {
  try {
    const glyphIndex = font.charToGlyphIndex(char);
    return glyphIndex > 0;
  } catch (e) {
    return false;
  }
};

/**
 * 計算字符集的覆蓋數量和百分比
 */
const getCoverage = (
  font: any,
  chars: string[]
): { count: number; total: number; percent: number } => {
  if (chars.length === 0) return { count: 0, total: 0, percent: 0 };
  const count = chars.reduce((acc, char) => acc + (hasGlyph(font, char) ? 1 : 0), 0);
  return {
    count,
    total: chars.length,
    percent: Math.round((count / chars.length) * 100),
  };
};

/**
 * 計算字體中的字符總數
 */
const countGlyphs = (font: any): number => {
  try {
    return Math.max(0, (font.glyphs?.length || 0) - 1);
  } catch (e) {
    return 0;
  }
};

// ============================================================================
// 3. 適用性分析邏輯
// ============================================================================

interface AnalysisResult {
  tags: string[];
  description: string;
  coverage: {
    tc: number;
    sc: number;
    ja: number;
  };
}

const analyzeCompatibility = (font: any, fileName: string): AnalysisResult => {
  // 計算各語言的覆蓋率
  const tcCoverage = getCoverage(font, TC_TEST_CHARS);
  const scCoverage = getCoverage(font, SC_TEST_CHARS);
  const jaCoverage = getCoverage(font, JA_TEST_CHARS);

  const tags = new Set<string>();
  const descriptions: string[] = [];

  // === 繁體中文適用性判斷 ===
  // 90%+ : 完全適用
  // 70-89%: 大致適用（可能缺少少數字）
  // 50-69%: 部分適用（建議謹慎使用）
  // <50%: 不建議用於繁體
  if (tcCoverage.percent >= 70) {
    tags.add('tc');
  }

  // === 簡體中文適用性判斷 ===
  if (scCoverage.percent >= 70) {
    tags.add('sc');
  }

  // === 日文適用性判斷 ===
  // 假名是日文獨有，只要有就代表支援日文
  if (jaCoverage.percent >= 50) {
    tags.add('ja');
  }

  // === 生成描述 ===
  // 以繁體中文為主要關注點
  if (tcCoverage.percent >= 90) {
    descriptions.push('完全適用繁體中文');
  } else if (tcCoverage.percent >= 70) {
    descriptions.push('大致適用繁體（可能缺少少數字）');
  } else if (tcCoverage.percent >= 50) {
    descriptions.push('部分支援繁體（建議謹慎使用）');
  } else if (tcCoverage.percent > 0) {
    descriptions.push('繁體支援不足');
  }

  if (jaCoverage.percent >= 50) {
    descriptions.push('包含日文假名');
  }

  if (scCoverage.percent >= 70 && tcCoverage.percent < 50) {
    descriptions.push('簡體中文字型');
  }

  // 兜底
  if (tags.size === 0) {
    if (hasGlyph(font, 'A') && hasGlyph(font, 'z')) {
      tags.add('en');
      descriptions.push('英文/拉丁字型');
    } else {
      descriptions.push('符號或特殊字型');
    }
  }

  return {
    tags: Array.from(tags),
    description: descriptions.join(' | '),
    coverage: {
      tc: tcCoverage.percent,
      sc: scCoverage.percent,
      ja: jaCoverage.percent,
    },
  };
};

// ============================================================================
// 4. EXPORT
// ============================================================================

export const analyzeFontFile = async (file: File): Promise<FontDefinition> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      if (!buffer) return reject(new Error('Failed to read file'));

      try {
        // @ts-ignore
        const font = parse ? parse(buffer) : window.opentype.parse(buffer);

        let fontName = file.name.split('.')[0];
        if (font.names.fontFamily?.en) fontName = font.names.fontFamily.en;

        // 分析適用性
        const { tags, description, coverage } = analyzeCompatibility(font, file.name);

        // 計算字符數
        const glyphCount = countGlyphs(font);

        const fontDef: FontDefinition = {
          name: fontName,
          family: fontName,
          category: 'display',
          tags: tags as ('tc' | 'sc' | 'en' | 'ja' | 'ko')[],
          description: description,
          glyphCount: glyphCount,
          coverage: coverage,
          isCustom: true,
        };
        resolve(fontDef);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const loadFontFace = async (fontName: string, data: ArrayBuffer): Promise<void> => {
  const fontFace = new FontFace(fontName, data);
  await fontFace.load();
  document.fonts.add(fontFace);
};
