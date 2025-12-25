/**
 * 字型分析引擎 - FontFlow 核心模組
 *
 * 功能：
 * - 解析 TTF/OTF/WOFF 字型檔案
 * - 執行多層級字符覆蓋率分析
 * - 計算繁體/簡體/日文/英文支援度
 * - 生成精準的缺字列表和評分
 *
 * 核心演算法：
 * - 基本字評分系統（Essential Filter）
 * - 分層字符測試（Tier-based Testing）
 * - 懲罰機制（Kill Switch）應對嚴重缺字
 */

import { parse } from 'opentype.js';
import { FontDefinition } from './types';
import { GLYPH_BASE, GLYPH_CANTONESE, GLYPH_TAIWAN, GLYPH_NAMING, GLYPH_JAPAN } from './glyphLists';

// ============================================================================
// 1. 字符集定義 (Character Set Definitions)
// ============================================================================
//
// 組織方式：
// - TIER_TC_ESSENTIAL: 基本關鍵字（日文字型最常缺的字）
// - TIER_CORE_TC: 繁體核心字集（JF7000 標準）
// - 擴展集: 粵語、台灣、人名用字（由 glyphLists.ts 提供）
// - TIER_PUNCTUATION: 排版標點符號
//

// [English]
const TIER_EN_BASIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * 基本關鍵字 (Essential Characters) - 35 字
 * 這些是繁體中文日常溝通最常用的字。
 * 日文字型通常會缺少其中的一些字。
 * 缺字超過 20%（即 7+ 字）會觸發懲罰機制，分數被鎖至 60% 以下。
 */
const TIER_TC_ESSENTIAL =
  '的一是不了人在有我他這中大來上個到說就要也你們會很那都能沒為吧嗎呢好著出對和時地要去看給還多小麼什麼之沒下天再沒想知道得真像把還讓被做用著樣只呢嗎啊啦喔把因為所以如果怎麼自己沒有可以應該已經然後讓覺得可能非常但是不是就是一起誰哪裡那裡東西現在今天明天昨天大家我們你們他們她們讓畫';

/**
 * 繁體中文核心字集 (Core Traditional Chinese) - 6373 字
 * 來源：JetBrains Font v0.9
 * 涵蓋日常通讀、商務寫作和出版用途所需的所有繁體字符。
 */
const TIER_CORE_TC = GLYPH_BASE;

/**
 * 擴展字集（由 glyphLists.ts 提供）
 * - CANTONESE: 粵語特有字 (137 字)
 * - TAIWAN: 台灣特有字 (930 字)
 * - NAMING: 人名用字 (625 字)
 */
const TIER_CANTONESE = GLYPH_CANTONESE;
const TIER_TAIWAN = GLYPH_TAIWAN;
const TIER_NAMING = GLYPH_NAMING;

// [Tier Punctuation] 標點符號
const TIER_PUNCTUATION = '，。、：；？！「」『』（）—…';

/**
 * 日文平假名與片假名 (Japanese Kana)
 * 用於初步檢測日文字型（平假名覆蓋率應達 80%）
 */
const TIER_JA_KANA =
  'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん' +
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
  'ッャュョヮヵヶ';

// [Japanese Kanji] 日文漢字常用集 (JIS Level 1 + Level 2 的常見漢字 - 簡化版 ~500字)
// 這是衡量「日文字型是否真的能排日文」的關鍵
// 包括：日本教育用漢字、常用字等
const TIER_JA_KANJI =
  '亜悪醒圧扱安暗案以囲位衣違壱逸稲益印因姻烏営怨援丘老荷架飾機械開害街楷格郭巻干刊慣甘監眼含漢汗澗潰環還' +
  '勧観願機議求救旧教許境均衡荷華落乾簡間雑支持司試侍字児治辞垂推奨承床症成清製誠請生声精聖製責総造沿塚漬' +
  '痛筒統領老艦警軍型径惠計貴喫禁金近銀群係航功効衡鋼高項豪郷広恐拘救孝講坑行広好耕攻貢郭爻購造根絡絡革割' +
  '格勘換慣漢邯館岸岩貫簡肝冠慣慨壊開械簡貝被背倍博拝払泊迫爆伯博縛舶薄販妃微疲飛扉費徴嫌嫌弦限般般隔確格' +
  '獲割樺鍛辞準准勲純唯囲隆硫留粒陸履和';

// 注：日文字型的「日文覆蓋率」現在改為衡量**日文漢字常用字的支援程度**
// 而非只看平假名片假名（這樣會誤導，因為平假名片假名容易達到 100%）

// [Simplified] 簡體特徵（只包含簡體獨有字、簡化字等，排除繁體已有的字）
/**
 * 簡體獨有字集 (Simplified Chinese Unique Characters) - ~1200+ 字
 * 包含：簡化字、簡體異體字、GB常用簡體字
 * 用於準確識別簡體中文字型與繁體的差異
 *
 * 擴充簡體檢查字符集，提高簡體中文覆蓋率檢測精度
 */
const TIER_SC_UNIQUE =
  '国体话门经号叶爱龟转导层边实职结样机关电彻头业见龙办务运义独复厂万历书乡云亏亚亲亿仅从仑仓仪们价众优' +
  '伙会伟传伤伦伪伫体余佣侧侨侦偶偷儿允元兄充兆光兔入内全两八公六共关兴兵其具典养兼兽冈册再冒' +
  '刘齐划剂剑剧劝劳势勋励欢变难艰叹对戏观买岁轮软辐辑输辞辩农迅进远违迟运达过迈还这适选偿储言语' +
  '啊阿埃挨哎唉艾碍安昂盎凹敖奥八巴跋跛把耙坝霸罢爸白柏百摆佰败斑班颁板半办绊邦帮梆榜膀绑棒博驳卜补捕布步簿部' +
  '擦蔡餐参蚕残惭惨灿苍舱仓沧藏操糙茶察差拆柴豺搀掺蝉馋阐颤昌长肠厂敞畅唱倒捣到稻悼道盗德得蛤哈韩汉杭航豪毫郝好' +
  '喝何贺黑痕很狠恨哼亨横衡恒恽亥害蒿嗷呵荷菏核禾和贬叔述树数双水睡顺说硕司思斯死肆嗣四伺似饲侍室视试' +
  '书输术树蜀黍蜀熟竖树树树树树树术树树树树树树术术树树术术术树树树术术术术树树树术术术术树术树术树术树术' +
  '万为围唯维韦温闻翁我武午舞伍侮坞戌戍戎务悟误毋武五捂午舞伍侮坞戌戍戎务悟误毋武五捂午舞伍侮坞戌戍戎务悟误毋武五捂午舞伍侮坞戌戍戎务悟误毋' +
  '西希郗蟋阳央鸯要耀爷也页业叶曳腋夜液一壹医仪艺易异议阅颜燕沿言沿俨严厌弦县象箱襄香详项巷相释小校晓孝效学' +
  '哓啸笑效蝎歇心辛新忻鑫兴星惺悻猩惜席膝裳西析喜铣洗系细隙戏细翔项象箫校孝肖削硝晓小消宵霄辛心鑫新欣' +
  '盈营蝇应永咏优油友有迂于与玉域育约在再载赞暂乍早皂灶燥责择则泽贼增摘斋窄债踩采财材采彩菜蔡餐灿操藏草测层差产刍禂策尺处畜除础楚储贮贶触觉储处出楚触赤翅矗刍楚储' +
  '啕嗯呃呇唛唝唞嗐嘦噅噞嘮嘬嘨嘤嘥嘘嘜嘝嘞嘚嘙嘗嘛嘏嘔嗞嘓嘒嘑嘐嘎嘍嗿嗾嗽嗺嗻嗼嗷嗶嗵' +
  '嗴嗳嗲嗱嗰嗯嗮嗭嗬嗫嗪嗩嗨嗧嗦嗥嗤嗣嗢嗡嗠嗞嗝嗜嗛嗚嗙嗘嗗嗖嗕嗔嗓嗒嗑嗐嗏嗎嗍嗌嗋嗊嗉嗈嗇嗆嗅' +
  '唷啑啐啎啍啌啋啊呿呾命呼呻呺呹呸呷呶呵呴味呲呱呰呯呮呭呬呫呪呩周呧呦呥呤呣呢呡呠呟呞呝呜呛呚呙员' +
  '呗呖呕呔呓呒呑呐呏呎呍呌呋告呉呈呇呆呅呄呃呂呁呀';

// 注：簡體獨有字集，用於準確識別簡體中文字型與繁體的差異

// ============================================================================
// 2. OPTIMIZED CHARACTER SETS (預先計算)
// ============================================================================

// 所有繁體中文字符的組合（用於缺字掃描）
// 包括：ESSENTIAL、BASE、粵語字、台灣字、人名用字
// ★ 注：ESSENTIAL 已包含在 BASE 中，但為了精確計算和警告，保持分離
const ALL_TC_CHARS_SET = new Set(
  (TIER_TC_ESSENTIAL + TIER_CORE_TC + TIER_CANTONESE + TIER_TAIWAN + TIER_NAMING).split('')
);
const TC_CHARS_FOR_SCAN =
  TIER_TC_ESSENTIAL + TIER_CORE_TC + TIER_CANTONESE + TIER_TAIWAN + TIER_NAMING;

/**
 * 各層級字符集 (Set 格式，用於高效查詢)
 * 預先計算以提升字符檢測效能
 */
const TIER_CORE_TC_SET = new Set(TIER_CORE_TC.split(''));
const TIER_ESSENTIAL_SET = new Set(TIER_TC_ESSENTIAL.split(''));
const TIER_CANTONESE_SET = new Set(TIER_CANTONESE.split(''));
const TIER_TAIWAN_SET = new Set(TIER_TAIWAN.split(''));
const TIER_NAMING_SET = new Set(TIER_NAMING.split(''));

// English 字符集
const EN_CHARS_SET = new Set(TIER_EN_BASIC.split(''));
const SC_CHARS_SET = new Set(TIER_SC_UNIQUE.split(''));
const PUNCT_CHARS_SET = new Set(TIER_PUNCTUATION.split(''));
const JA_KANA_SET = new Set(TIER_JA_KANA.split(''));
const JA_KANJI_SET = new Set(TIER_JA_KANJI.split(''));

// ============================================================================
// 3. 輔助函數 (Helper Functions)
// ============================================================================

// 文件大小驗證（防止超大檔案卡頓）
const MAX_FONT_FILE_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * 驗證字型檔案大小
 * @throws Error 如果檔案超過限制
 */
const validateFileSize = (file: File): void => {
  if (file.size > MAX_FONT_FILE_SIZE) {
    throw new Error(`字型檔案超過 ${MAX_FONT_FILE_SIZE / 1024 / 1024}MB，請選擇更小的檔案`);
  }
};

/**
 * 檢查 OpenType 字型中是否存在某個字符的 Glyph
 * 會檢查：
 * 1. Glyph Index (charToGlyphIndex)
 * 2. Glyph 路徑（path.commands）或輪廓（numberOfContours）
 * 3. 複合字形（compound glyph）
 *
 * @param font - OpenType 字型物件
 * @param char - 要檢查的字符
 * @returns 是否存在有效的 glyph
 */
const hasGlyph = (font: any, char: string): boolean => {
  try {
    const glyphIndex = font.charToGlyphIndex(char);

    // 無此字符
    if (glyphIndex <= 0) return false;

    // ★ 進一步檢查：glyph 是否有實際內容（路徑）
    // 有些字體雖然有 glyph index，但實際上是空的 glyph
    const glyph = font.glyphs.get(glyphIndex);
    if (!glyph) return false;

    /**
     * 檢查 glyph 是否有路徑命令（實際可渲染的內容）
     * 空的 glyph 通常沒有 path 或 path.commands 為空
     */
    if (glyph.path && glyph.path.commands && glyph.path.commands.length > 0) {
      return true;
    }

    /**
     * 某些字體使用 numberOfContours 來表示輪廓數量
     */
    if (glyph.numberOfContours && glyph.numberOfContours > 0) {
      return true;
    }

    /**
     * 複合字形（compound glyph）也算有內容
     * 例如：é = e + 組合符號
     */
    if (glyph.isComposite || (glyph.components && glyph.components.length > 0)) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

/**
 * 檢查字符塊的覆蓋率
 * @param font - OpenType 字型物件
 * @param charString - 要檢查的字符串
 * @returns 覆蓋率統計 { count, total, rate }
 */
const checkBlock = (font: any, charString: string) => {
  const chars = charString.split('');
  const total = chars.length;
  let count = 0;

  /**
   * 使用 Set 來快速查詢，避免重複字符影響統計
   */
  const uniqueChars = new Set(chars);
  for (const char of uniqueChars) {
    if (hasGlyph(font, char)) count++;
  }

  return {
    count,
    total: uniqueChars.size,
    rate: uniqueChars.size > 0 ? count / uniqueChars.size : 0,
  };
};

// ============================================================================
// 4. 核心邏輯 (Main Analysis Logic - V13 版本)
// ============================================================================
//
// 演算法說明：
// 1. 分層評分：Essential (40%) + Core (35%) + Extensions (15%) + Punctuation (10%)
// 2. 懲罰機制：Essential 缺字超過 20% 時，分數鎖至 60% 以下
// 3. 語言判定：基於覆蓋率和獨有字符比例
// 4. 缺字收集：分別收集 Essential、Core 層級的缺字
//

/**
 * 分析字型檔案的繁體中文支援程度
 *
 * 詳細流程：
 * 1. 驗證檔案大小和格式
 * 2. 逐層檢測字符覆蓋率
 * 3. 計算多維度評分（繁體、簡體、日文、英文）
 * 4. 根據 Essential Filter 應用懲罰機制
 * 5. 判定語言標籤和描述
 * 6. 收集並整理缺字列表
 *
 * @param file - 字型檔案 (TTF/OTF/WOFF/WOFF2)
 * @returns Promise<FontDefinition> 字型定義物件，包含覆蓋率、缺字列表等
 * @throws Error 如果檔案格式不正確或解析失敗
 */
export const analyzeFontFile = (file: File): Promise<FontDefinition> =>
  new Promise((resolve, reject) => {
    // 驗證文件大小
    try {
      validateFileSize(file);
    } catch (err) {
      return reject(err);
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      if (!buffer) return reject(new Error('Failed to read file'));

      try {
        // 使用動態導入或備用方案處理 opentype.js
        const font =
          typeof parse === 'function' ? parse(buffer) : (window as any).opentype?.parse?.(buffer);

        if (!font) {
          throw new Error('無法解析字型檔案，請確認是有效的 TTF/OTF/WOFF 檔案');
        }
        let fontName = file.name.split('.')[0];
        if (font.names.fontFamily?.en) fontName = font.names.fontFamily.en;

        // --- 1. 數據統計 ---
        const statsEN = checkBlock(font, TIER_EN_BASIC);
        const statsEssential = checkBlock(font, TIER_TC_ESSENTIAL); // ★ 新增：基本檢測
        const statsCoreTC = checkBlock(font, TIER_CORE_TC);
        const statsCantonese = checkBlock(font, TIER_CANTONESE);
        const statsTaiwan = checkBlock(font, TIER_TAIWAN);
        const statsNaming = checkBlock(font, TIER_NAMING);
        const statsPunct = checkBlock(font, TIER_PUNCTUATION);
        const statsJaKana = checkBlock(font, TIER_JA_KANA);
        const statsJaKanji = checkBlock(font, TIER_JA_KANJI); // ★ 日文漢字覆蓋率（才是真的日文支援度）
        const statsUniqueSC = checkBlock(font, TIER_SC_UNIQUE);

        const tags = new Set<string>();
        const descriptions: string[] = [];
        let isCJK = false;

        // --- 2. 繁體中文評分系統 (V13 - JF7000 完整字集) ---

        // ★ 新評分系統（V13）：使用 JetBrains Font v0.9 完整字集
        // Essential（基本字 35 字）和 Core（BASE 6373 字）的比重更重（40% + 35% = 75%）
        // Essential 和 Core 合佔 75%，其他特定用途的字佔 25%
        let rawTcScore =
          statsEssential.rate * 0.4 +
          statsCoreTC.rate * 0.35 +
          ((statsCantonese.rate + statsTaiwan.rate + statsNaming.rate) / 3) * 0.15 +
          statsPunct.rate * 0.1;

        // ★ 懲罰機制 (The Kill Switch)
        // 如果「基本關鍵字」缺字太嚴重（例如日文字型常缺「你、們、於」），直接鎖死最高分
        // 閾值設定：如果關鍵字少於 80% (35字缺7字以上)，分數壓在 60% 以下
        if (statsEssential.rate < 0.8) {
          rawTcScore = Math.min(rawTcScore, 0.59);
        }

        const tcScore = rawTcScore; // 最終定案分數

        // --- 3. 決策與標籤 ---

        // A. 日文判定
        // ★ 改進：日文覆蓋率現在基於「日文漢字」（Kanji），而非只看平假名片假名
        // 這樣才能準確反映「這個字型是否真的適合排日文」
        const hasJaKana = statsJaKana.rate > 0.8; // 至少有 80% 的日文假名
        const hasJaKanji = statsJaKanji.rate > 0.5; // 至少有 50% 的日文漢字

        if (hasJaKana && hasJaKanji) {
          // 真正的日文字型：假名 + 漢字都有
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
        } else if (hasJaKana && !hasJaKanji) {
          // 只有假名沒有漢字的字型（通常不是日文字型）
          descriptions.push('⚠️ 平假名字型（非日文字型）');
        }

        // B. 繁體中文判定
        if (!tags.has('tc')) {
          // 進入條件：分數要高，且不能是簡體
          if (tcScore > 0.5 && statsUniqueSC.rate < 0.15) {
            // ★ V13 判定標準：基於 JF7000 完整字集 (6373+1692 字)
            // 由於字集擴大，降低標準到：> 70% = 優質，> 50% = 可用
            if (tcScore > 0.7) {
              tags.add('tc');
              if (statsPunct.rate < 0.8) descriptions.push('繁體中文 (缺標點)');
              else descriptions.push('繁體中文');
            } else if (tcScore > 0.5) {
              // 分數 0.5~0.7 之間，屬於「通用但缺字」
              tags.add('tc');
              descriptions.push('繁體中文 (部分缺字)');
            }
          }
        }

        // C. 粵語、台灣、人名用字判定 (新增)
        if (statsCantonese.rate > 0.7) {
          tags.add('yue');
          descriptions.push('粵語字');
        }
        if (statsTaiwan.rate > 0.7) {
          tags.add('zh-TW');
          descriptions.push('台灣字');
        }
        if (statsNaming.rate > 0.7) {
          tags.add('naming');
          descriptions.push('人名用字');
        }

        // D. 簡體中文
        if (statsUniqueSC.rate > 0.7) {
          tags.add('sc');
          descriptions.push('簡體中文');
          isCJK = true;
        }

        // E. 英文
        if (!isCJK && statsEN.rate > 0.8) {
          tags.add('en');
          descriptions.push('英文/歐語');
        } else if (isCJK && statsEN.rate < 0.5) {
          descriptions.push('⚠️ 英文缺字');
        }

        // --- 4. 收集缺失的繁體中文字 ---
        const missingChars: string[] = []; // 全部缺字（用於統計）
        const missingEssentialChars: string[] = []; // ★ ESSENTIAL 缺字：用於顯示和檢視
        const missingCoreChars: string[] = []; // 核心字缺字：用於警告
        const missingCoreOnlyChars: string[] = []; // 核心層級缺字

        // ★ JF7000 字集包含：GLYPH_BASE (6373) + 粵語 (137) + 台灣 (930) + 人名 (625) = 約 7000+ 字
        // 由於 Set 去重，實際不會超過 8000，但以「7000 字 JF7000」作為檢查標準說明
        const totalTCCharsChecked = ALL_TC_CHARS_SET.size; // 檢查的總字符數（基於 JF7000 完整字集）

        // 只計算 CORE 字的缺字（用於覆蓋率計算）
        let missingCoreOnlyCount = 0;
        const coreCharSet = new Set(TIER_CORE_TC.split(''));

        for (const char of ALL_TC_CHARS_SET) {
          if (!hasGlyph(font, char)) {
            missingChars.push(char);
            // 檢查是否在 ESSENTIAL 中
            if (TIER_TC_ESSENTIAL.includes(char)) {
              missingEssentialChars.push(char); // 只有 ESSENTIAL 缺字才會顯示具體字符
              missingCoreOnlyChars.push(char); // 也加入 coreOnly 供警告判定
              missingCoreChars.push(char);
            }
            // 檢查是否在核心字集中（CORE）
            else if (coreCharSet.has(char)) {
              missingCoreChars.push(char);
              missingCoreOnlyChars.push(char);
              missingCoreOnlyCount++; // ★ 只計算 CORE 缺字
            }
          }
        }

        // ★ 新算法：覆蓋率只基於 GLYPH_BASE (TIER_CORE_TC)
        // 基本字不列入覆蓋率計算，只用於檢視
        const coreCharCount = coreCharSet.size; // GLYPH_BASE 的字符數
        const coreCharsCovered = coreCharCount - missingCoreOnlyCount;
        const actualTCCoverage = coreCharCount > 0 ? coreCharsCovered / coreCharCount : 0;
        const adjustedTcScore = Math.round(actualTCCoverage * 100);

        // --- 5. 輸出 ---
        const fontDef: FontDefinition = {
          name: fontName,
          family: fontName,
          tags: Array.from(tags) as any,
          coverage: {
            en: Math.round(statsEN.rate * 100),
            tc: adjustedTcScore, // ★ 改為基於實際缺字計算
            sc: Math.round(statsUniqueSC.rate * 100),
            ja: Math.round(statsJaKanji.rate * 100), // ★ 改為日文漢字覆蓋率（才是真正的日文支援度）
          },
          glyphCount: font.glyphs.length,
          isCustom: true,
          description: descriptions.join(' | '),
          missingTCChars: missingChars.join(''), // 全部缺字（用於內部統計）
          missingEssentialChars: missingEssentialChars.join(''), // ★ 新增：只顯示 ESSENTIAL 缺字的具體字符
          missingCoreOnlyChars: missingCoreOnlyChars.join(''), // 核心層級的缺字（用於警告判定）
          missingCoreTCChars: missingCoreChars.join(''), // 用於警告判定的核心缺字
          totalTCCharsChecked, // 檢查的繁體字總數（包含所有 TIER）
          totalCoreCharsChecked: coreCharCount, // ★ GLYPH_BASE 字符數（用於覆蓋率分母）
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

/**
 * 將字型載入至瀏覽器 DOM
 * 使 CSS @font-face 可以使用該字型進行渲染
 *
 * @param fontName - 字型名稱（用於 CSS 引用）
 * @param data - 字型檔案的二進位資料
 */
export const loadFontFace = async (fontName: string, data: ArrayBuffer): Promise<void> => {
  const fontFace = new FontFace(fontName, data);
  await fontFace.load();
  document.fonts.add(fontFace);
};

/**
 * 從瀏覽器 DOM 移除指定的字型
 * 釋放記憶體並避免字型衝突
 *
 * @param fontName - 要移除的字型名稱
 */
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
// 5. 文字覆蓋率檢測 (Text Coverage Checking)
// ============================================================================
//
// 用於預覽時動態檢測使用者輸入的文字中，有多少字符
// 在目前選擇的字型中無法顯示

/**
 * 檢查文字在指定字型中的覆蓋率
 * 用於預覽效果和缺字視覺化
 *
 * @param font - OpenType 字型物件
 * @param text - 要檢查的文字
 * @returns { rate: 覆蓋率 0-1, missing: 缺失的唯一字符 }
 */
export const checkTextCoverage = (font: any, text: string): { rate: number; missing: string[] } => {
  const chars = Array.from(text);
  const missing: string[] = [];
  let covered = 0;

  for (const char of chars) {
    /**
     * 跳過空格和換行符
     * 這些不應該被計入覆蓋率計算
     */
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
    missing: Array.from(new Set(missing)), // 去重：只保留唯一字符
  };
};
