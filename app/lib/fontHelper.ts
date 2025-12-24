import { parse } from 'opentype.js';
import { FontDefinition } from './types';

// ============================================================================
// 1. DATASETS
// ============================================================================

// [English]
const TIER_EN_BASIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// [Tier Survival] 繁體中文「生存關鍵字」 (30字)
// 這些字是日文字型的死穴。日文通常用假名或異體字(対、画)取代。
// 如果這些字缺了，就算其他漢字有 3000 個，這個字型也無法用於中文排版。
const TIER_TC_ESSENTIAL =
  '的你我他這那們是於對和麼為著' + // 虛詞與代詞 (日文全死)
  '說畫裡后發麼樣體國機關'; // 繁體特徵明顯且日文寫法不同

// [Tier 0] 繁體核心 (300字 - 統計母體)
// 用於計算廣泛的通用性
const TIER_CORE_TC =
  '的一是不了人我在有他這中大來上國個到說們為子和你地出道也時年得就那要下以生會自著去之過家學對可她里后' +
  '小么心多天而能好都然沒日于起還發成事只作當想看文無開手十用主行方又如前所本見經頭面公同三已老從動兩長' +
  '知民樣現分將外但身些與高意進把法此實回二理今明問力最賢氣口使情各正向化定師由果利機代全平真社內表常條' +
  '重名別幾政新收員角統指決活題接部度建性點應加信數少機反管期保權界系支展像象認條治導完書强記每車規據' +
  '做區感南度門者認結影告戰帶樣候遠程畫義選聲報條樂難顯傳觀究院識越球式照深消極晚苦熱視整響聽格盡未約質' +
  '養滿推支古驗算示流速增值容確備優除連始愛足供食早引商視話資達亞美花馬金六北海空廣語何話算臺灣男林布';

// [Tier 1] 繁體進階 (150字)
const TIER_COMMON_TC =
  '論型該樂復病醫費排非客驗友錢科字請且需術際望專覺班笑魚喜離險落夫快夠花完史縣司府許萬讓案羅各片母希' +
  '害官護級習造藝念速懷園衆半須眼聽輕師舉土星須獨眼響幫校停假久印句布室村德底週律風微寫云講農夜拿孩座' +
  '底故精率似突曾輕冷首旅連令講推單細演刻找算觀絕單衆香酒';

// [Tier Punctuation] 標點符號
const TIER_PUNCTUATION = '，。、：；？！「」『』（）—…';

// [Japanese] 日文
const TIER_JA_ALL =
  'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん' +
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
  'ッャュョヮヵヶ';

// [Simplified] 簡體特徵
const TIER_SC_UNIQUE =
  '国体话门经号叶爱龟转导层边实职结样机关电彻头业见龙办务运义独复厂万历书乡云亏亚亲亿仅从仑仓仪们价众优' +
  '伙会伟传伤伦伟伪伫体余佣侧侨侦偶偷伪儿允元兄充兆光兔入内全两八公六共关兴兵其具典养兼兽冁内冈册再冒' +
  '刘齐划剂剑剧劝劳势勋励欢变难艰叹对戏观欢买岁轮软辐辑输辞辩农迅进远违迟运达过迈还这适选亿优偿储言语';

// ============================================================================
// 2. HELPER FUNCTIONS
// ============================================================================

const hasGlyph = (font: any, char: string): boolean => {
  try {
    return font.charToGlyphIndex(char) > 0;
  } catch {
    return false;
  }
};

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
    rate: count / total,
  };
};

// ============================================================================
// 3. MAIN LOGIC (V11 - The Essential Filter)
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

        // --- 1. 數據統計 ---
        const statsEN = checkBlock(font, TIER_EN_BASIC);
        const statsEssential = checkBlock(font, TIER_TC_ESSENTIAL); // ★ 新增：生存檢測
        const statsCoreTC = checkBlock(font, TIER_CORE_TC);
        const statsCommonTC = checkBlock(font, TIER_COMMON_TC);
        const statsPunct = checkBlock(font, TIER_PUNCTUATION);
        const statsKana = checkBlock(font, TIER_JA_ALL);
        const statsUniqueSC = checkBlock(font, TIER_SC_UNIQUE);

        const tags = new Set<string>();
        const descriptions: string[] = [];
        let isCJK = false;

        // --- 2. 繁體中文評分系統 (V11) ---

        // 基礎分：依舊依賴廣泛的 300 字與 150 字
        let rawTcScore = statsCoreTC.rate * 0.7 + statsCommonTC.rate * 0.2 + statsPunct.rate * 0.1;

        // ★ 懲罰機制 (The Kill Switch)
        // 如果「生存關鍵字」缺字太嚴重（例如日文字型常缺「你、們、於」），直接鎖死最高分
        // 閾值設定：如果關鍵字少於 80% (30字缺6字以上)，這字型就不能算合格的繁體字型
        if (statsEssential.rate < 0.8) {
          // 強制將分數壓在 60% 以下，反映出「雖然有很多漢字，但不能打中文」的事實
          rawTcScore = Math.min(rawTcScore, 0.59);
        }

        const tcScore = rawTcScore; // 最終定案分數

        // --- 3. 決策與標籤 ---

        // A. 日文判定
        if (statsKana.rate > 0.5) {
          tags.add('ja');
          isCJK = true;

          // 日文漢字的繁體相容性描述
          if (statsEssential.rate > 0.95) {
            tags.add('tc');
            descriptions.push('日文 (繁體全相容)');
          } else if (statsEssential.rate > 0.7) {
            // 雖然是日文，但關鍵字有 70% 以上，勉強可用
            descriptions.push('日文 (部分漢字通用)');
          } else {
            // 關鍵字大量缺失
            descriptions.push('日文 (繁體缺字嚴重)');
          }
        }

        // B. 繁體中文判定
        if (!tags.has('tc')) {
          // 進入條件：分數要高，且不能是簡體
          if (tcScore > 0.6 && statsUniqueSC.rate < 0.15) {
            // 只有分數真的很高才給 TC 標籤
            if (tcScore > 0.9) {
              tags.add('tc');
              if (statsPunct.rate < 0.8) descriptions.push('繁體中文 (缺標點)');
              else descriptions.push('繁體中文');
            } else {
              // 分數 0.6~0.9 之間，屬於「通用但缺字」
              // 不給 TC 標籤，但給描述，或者給 TC 標籤但標註缺字
              tags.add('tc');
              descriptions.push('繁體中文 (部分缺字)');
            }
          }
        }

        // C. 簡體中文
        if (statsUniqueSC.rate > 0.7) {
          tags.add('sc');
          descriptions.push('簡體中文');
          isCJK = true;
        }

        // D. 英文
        if (!isCJK && statsEN.rate > 0.8) {
          tags.add('en');
          descriptions.push('英文/歐語');
        } else if (isCJK && statsEN.rate < 0.5) {
          descriptions.push('⚠️ 英文缺字');
        }

        // --- 4. 輸出 ---
        const fontDef: FontDefinition = {
          name: fontName,
          family: fontName,
          tags: Array.from(tags) as any,
          coverage: {
            en: Math.round(statsEN.rate * 100),
            tc: Math.round(tcScore * 100), // 這裡輸出的分數現在會反映懲罰結果
            sc: Math.round(statsUniqueSC.rate * 100),
            ja: Math.round(statsKana.rate * 100),
          },
          glyphCount: font.glyphs.length,
          isCustom: true,
          description: descriptions.join(' | '),
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

export const removeFontFace = (fontName: string): void => {
  try {
    const fontsToDelete: FontFace[] = [];
    document.fonts.forEach((font) => {
      if (font.family === fontName) fontsToDelete.push(font);
    });
    fontsToDelete.forEach((font) => document.fonts.delete(font));
  } catch (e) {
    console.warn('Failed to remove font:', fontName, e);
  }
};

// ============================================================================
// 4. TEXT COVERAGE CHECK (用於預覽驗證)
// ============================================================================

export const checkTextCoverage = (font: any, text: string): { rate: number; missing: string[] } => {
  const chars = Array.from(text);
  const missing: string[] = [];
  let covered = 0;

  for (const char of chars) {
    // 跳過空格和換行符
    if (/\s/.test(char)) {
      continue;
    }

    if (hasGlyph(font, char)) {
      covered++;
    } else {
      missing.push(char);
    }
  }

  const total = chars.filter((c) => !/\s/.test(c)).length;
  return {
    rate: total > 0 ? covered / total : 1,
    missing: Array.from(new Set(missing)), // 去重
  };
};
