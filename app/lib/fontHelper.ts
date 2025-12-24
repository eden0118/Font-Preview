import { parse } from 'opentype.js';
import { FontDefinition } from './types';

// ============================================================================
// 1. DATASETS (字頻數據集)
// ============================================================================

// [English] 基礎歐語/數字 (62字)
// 這是所有現代字型的基石
const TIER_EN_BASIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// [Tier 0] 繁體核心 (50字)
const TIER_CORE_TC =
  '的一是不了人我在有他這中大來上國個到說們為子和你地出道也時年得就那要下以生會自著去之過家學對可她里后小么心多天而能好都然沒日于起還發成事只作當想看文無開手十用主行方又如前所本見經頭面公同三已老從動兩長';

// [Tier 1] 繁體常用 (150字)
const TIER_COMMON_TC =
  '知民樣現分將外但身些與高意進把法此實回二理今明問力最賢氣口使情各正向化定師由果利機代全平真社內表常條重名別幾政新收員角統指決活題接員教至放決解山任總受目反確提果海位夫件最理幾公特做系計管期情入保建步給色書通界林華今日比員神幾感認數情區即求變權光情結科影告戰界張展馬制像將性導務制條幹變許選史強';

// [Japanese] 假名核心
const TIER_KANA =
  'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';

// [Simplified] 簡體特徵
const TIER_SC_UNIQUE =
  '国体话门经号叶爱龟转导层边实职结样机关电彻头业见龙办务运义独复厂万历书乡云亏亚亲亿仅从仑仓仪们价众优伙会伟传伤伦伟伪伫体余佣侧侨侦偶偷伪儿允元兄充兆光兔入内全两八公六共关兴兵其具典养兼兽冁内冈册再冒冕冠冬冰冶凉凌准减凑凝几凡凤凫凭凯凶凸凹出击凿';

// ============================================================================
// 2. HELPER FUNCTIONS
// ============================================================================

const hasGlyph = (font: any, char: string): boolean => {
  try {
    // charToGlyphIndex 回傳 0 代表 .notdef (缺失)
    return font.charToGlyphIndex(char) > 0;
  } catch {
    return false;
  }
};

/**
 * 通用區塊檢測函數
 */
const checkBlock = (font: any, charString: string) => {
  const chars = charString.split('');
  const total = chars.length;
  let count = 0;

  for (let i = 0; i < total; i++) {
    if (hasGlyph(font, chars[i])) count++;
  }

  return {
    count,
    total,
    rate: count / total, // 0.0 ~ 1.0
  };
};

// ============================================================================
// 3. MAIN LOGIC
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

        // --- 1. 執行所有統計 (並行計算) ---
        // 這裡一定要全部執行，不可以像之前那樣有條件執行
        const statsEN = checkBlock(font, TIER_EN_BASIC);
        const statsCoreTC = checkBlock(font, TIER_CORE_TC);
        const statsCommonTC = checkBlock(font, TIER_COMMON_TC);
        const statsKana = checkBlock(font, TIER_KANA);
        const statsUniqueSC = checkBlock(font, TIER_SC_UNIQUE);

        const tags = new Set<string>();
        const descriptions: string[] = [];

        // --- 2. 判斷邏輯 (Tagging Logic) ---

        // 分數計算
        const tcScore = statsCoreTC.rate * 0.6 + statsCommonTC.rate * 0.4;

        let isCJK = false;

        // A. 日文判定
        if (statsKana.rate > 0.8) {
          tags.add('ja');
          descriptions.push('日文');
          isCJK = true;

          // 日文字型若是漢字多，也算繁體通用
          if (statsCoreTC.rate > 0.9) tags.add('tc');
        }

        // B. 繁體中文判定
        if (statsCoreTC.rate > 0.9 && statsUniqueSC.rate < 0.2) {
          tags.add('tc');
          isCJK = true;

          if (statsCommonTC.rate > 0.9) descriptions.push('繁體中文');
          else descriptions.push('繁體中文 (通用)');
        }

        // C. 簡體中文判定
        if (statsUniqueSC.rate > 0.8) {
          tags.add('sc');
          descriptions.push('簡體中文');
          isCJK = true;
        }

        // D. 英文判定 logic
        // 如果完全沒有 CJK 特徵，且英文完整 -> 標記為英文
        if (!isCJK && statsEN.rate > 0.8) {
          tags.add('en');
          descriptions.push('英文/歐語');
        }

        // 額外邏輯：雖然是 CJK，但如果使用者上傳了一個完全壞掉的字型（英文全是方塊），我們還是要標記出來
        if (statsEN.rate < 0.5) {
          descriptions.push('⚠️ 英文缺字');
        }

        // --- 3. 輸出結果 ---

        const fontDef: FontDefinition = {
          name: fontName,
          family: fontName,
          category: 'display',
          tags: Array.from(tags) as any,
          description: descriptions.join(' | ') || '未知格式',
          // 這裡確保回傳所有數值，無論 Tag 是什麼
          coverage: {
            en: Math.round(statsEN.rate * 100), // 這裡現在會有數值了！
            tc: Math.round(tcScore * 100),
            sc: Math.round(statsUniqueSC.rate * 100),
            ja: Math.round(statsKana.rate * 100),
          },
          glyphCount: font.glyphs.length,
          isCustom: true,
        };

        resolve(fontDef);
      } catch (err) {
        console.error(err);
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
