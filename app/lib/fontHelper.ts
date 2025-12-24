import { parse } from 'opentype.js';
import { FontDefinition } from './types';

// ============================================================================
// 1. DATASETS (字頻數據集)
// ============================================================================

// [Level 1] 繁體中文 TOP 100 高頻字
// 來源：教育部常用字頻表
// 邏輯：這些字是中文的「骨架」，缺了這些字，字型基本上無法使用。
const TC_COMMON_100 = [
  '的',
  '一',
  '是',
  '不',
  '了',
  '人',
  '我',
  '在',
  '有',
  '他',
  '這',
  '中',
  '大',
  '來',
  '上',
  '國',
  '個',
  '到',
  '說',
  '們',
  '為',
  '子',
  '和',
  '你',
  '地',
  '出',
  '道',
  '也',
  '時',
  '年',
  '得',
  '就',
  '那',
  '要',
  '下',
  '以',
  '生',
  '會',
  '自',
  '著',
  '去',
  '之',
  '過',
  '家',
  '學',
  '對',
  '可',
  '她',
  '里',
  '后',
  '小',
  '么',
  '心',
  '多',
  '天',
  '而',
  '能',
  '好',
  '都',
  '然',
  '沒',
  '日',
  '于',
  '起',
  '還',
  '發',
  '成',
  '事',
  '只',
  '作',
  '當',
  '想',
  '看',
  '文',
  '無',
  '開',
  '手',
  '十',
  '用',
  '主',
  '行',
  '方',
  '又',
  '如',
  '前',
  '所',
  '本',
  '見',
  '經',
  '頭',
  '面',
  '公',
  '同',
  '三',
  '已',
  '老',
  '從',
  '動',
  '兩',
  '長',
];

// [Level 2] 繁體特有特徵字 (用於區分簡體/日文)
const TC_UNIQUE = [
  '體',
  '國',
  '話',
  '門',
  '經',
  '號',
  '葉',
  '愛',
  '龜',
  '轉',
  '導',
  '層',
  '邊',
  '實',
  '職',
  '結',
  '樣',
  '機',
  '關',
  '電',
];

// [Level 2] 簡體特有特徵字
const SC_UNIQUE = [
  '体',
  '国',
  '话',
  '门',
  '经',
  '号',
  '叶',
  '爱',
  '龟',
  '转',
  '导',
  '层',
  '边',
  '实',
  '职',
  '结',
  '样',
  '机',
  '关',
  '电',
];

// [Level 3] 全形標點符號 (重要判斷依據)
const PUNCTUATION = ['，', '。', '、', '：', '「', '」'];

// 日文假名
const JA_KANA = ['あ', 'い', 'う', 'え', 'お', 'の', 'は', 'を', 'ん', 'が'];

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

const getCoverage = (font: any, chars: string[]) => {
  const count = chars.reduce((acc, char) => acc + (hasGlyph(font, char) ? 1 : 0), 0);
  return {
    count,
    total: chars.length,
    percent: count / chars.length, // 0.0 ~ 1.0
  };
};

// ============================================================================
// 3. ANALYSIS LOGIC
// ============================================================================

const analyzeAdvanced = (font: any, fileName: string) => {
  const tags = new Set<string>();
  const descriptions: string[] = [];

  // 1. 基礎覆蓋率計算
  const commonScore = getCoverage(font, TC_COMMON_100).percent;
  const uniqueTC = getCoverage(font, TC_UNIQUE).percent;
  const uniqueSC = getCoverage(font, SC_UNIQUE).percent;
  const kanaScore = getCoverage(font, JA_KANA).percent;
  const punctScore = getCoverage(font, PUNCTUATION).percent;

  // 2. 判斷邏輯

  // [日文判定]
  if (kanaScore > 0.5) {
    tags.add('ja');
    descriptions.push('日文');
  }

  // [繁體中文判定]
  // 條件：常用字 > 80% 且 繁體特徵 > 簡體特徵
  if (commonScore > 0.8 && uniqueTC > uniqueSC) {
    // 進階檢查：標點符號
    if (punctScore > 0.8) {
      tags.add('tc');
      descriptions.push('繁體中文 (完整)');
    } else {
      // 有字但沒標點，可能是標題字或日文漢字
      if (!tags.has('ja')) {
        tags.add('tc');
        descriptions.push('繁體中文 (缺標點)');
      }
    }
  }
  // [容錯判定] 如果是日文字型，但繁體常用字支援度極高 (>90%)
  else if (tags.has('ja') && commonScore > 0.9) {
    tags.add('tc');
    descriptions.push('繁體通用');
  }

  // [簡體中文判定]
  if (uniqueSC > 0.6 && uniqueSC > uniqueTC) {
    tags.add('sc');
    descriptions.push('簡體中文');
  }

  // [兜底]
  if (tags.size === 0) {
    if (hasGlyph(font, 'A')) {
      tags.add('en');
      descriptions.push('英文/歐語');
    }
  }

  return {
    tags: Array.from(tags),
    description: descriptions.join(' | '),
    stats: { commonScore, uniqueTC, uniqueSC, kanaScore },
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

        const result = analyzeAdvanced(font, file.name);

        const fontDef: FontDefinition = {
          name: fontName,
          family: fontName,
          category: 'display',
          tags: result.tags as any,
          description: result.description,
          // 可以將詳細分數存入 meta 以供前端顯示進度條
          coverage: {
            tc: Math.round(result.stats.commonScore * 100),
            sc: Math.round(result.stats.uniqueSC * 100),
            ja: Math.round(result.stats.kanaScore * 100),
          },
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

/**
 * 從 document.fonts 中移除指定名稱的字體
 * 用於防止內存洩漏，當切換字體時清理舊字體
 */
export const removeFontFace = (fontName: string): void => {
  try {
    const fontsToDelete: FontFace[] = [];
    document.fonts.forEach((font) => {
      if (font.family === fontName) {
        fontsToDelete.push(font);
      }
    });
    fontsToDelete.forEach((font) => {
      document.fonts.delete(font);
    });
  } catch (e) {
    console.warn('Failed to remove font:', fontName, e);
  }
};
