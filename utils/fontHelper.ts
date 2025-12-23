import { parse } from 'opentype.js';
import { FontDefinition } from '../types';

// ============================================================================
// DIAGNOSTIC CHARACTER SETS (The "CMAP" Check)
// ============================================================================

// Traditional Chinese Distinctive Characters
// Characters that look different or don't exist in Simplified
const TC_SIGNATURE = [
  '國', '門', '臺', '灣', '飛', '書', '邊', '無', '愛', '葉', 
  '陽', '專', '開', '園', '導', '鳥', '島', '畫', '農', '豐',
  '隸', '頭', '長', '樂', '氣', '電', '買', '賣', '鹽', '塵'
];

// Simplified Chinese Distinctive Characters
const SC_SIGNATURE = [
  '国', '门', '台', '湾', '飞', '书', '边', '无', '爱', '叶', 
  '阳', '专', '开', '园', '导', '鸟', '岛', '画', '农', '丰',
  '隶', '头', '长', '乐', '气', '电', '买', '卖', '盐', '尘'
];

// Japanese Signature (Hiragana)
// We check a broader range to ensure it's not just a symbol subset.
// Japanese fonts must have full Hiragana support.
const JA_SIGNATURE = [
  'あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ',
  'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と',
  'な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ',
  'ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り',
  'る', 'れ', 'ろ', 'わ', 'を', 'ん', 'が', 'ぎ', 'ぐ', 'げ',
  'ご', 'ざ', 'じ', 'ず', 'ぜ', 'ぞ', 'だ', 'ぢ', 'づ', 'で',
  'ど', 'ば', 'び', 'ぶ', 'べ', 'ぼ', 'ぱ', 'ぴ', 'ぷ', 'ぺ',
  'ぽ', 'っ', 'ゃ', 'ゅ', 'ょ'
];

// Korean Signature (Common Hangul Syllables)
const KO_SIGNATURE = [
  '가', '나', '다', '라', '마', '바', '사', '아', '자', '차',
  '카', '타', '파', '하', '한', '글', '안', '녕', '무', '궁',
  '서', '울', '대', '韓', '國', '사', '람', '오', '늘', '날'
];

// English/Latin Signature
const EN_SIGNATURE = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'
];

// ============================================================================
// METADATA PATTERNS (The "Name Table" Check)
// ============================================================================
const METADATA_RULES = [
    { tag: 'tc', pattern: /(TC|TW|HK|Traditional|Hant|Ming|Kai|Bopomofo)/i },
    { tag: 'sc', pattern: /(SC|CN|GB|Simplified|Hans|Song|Hei)/i },
    { tag: 'ja', pattern: /(JP|JA|Jp|Ja|Mincho|Gothic|Kaku|Maru|Hiragana)/i },
    { tag: 'ko', pattern: /(KR|KO|Kr|Ko|Hangul|Batang|Dotum|Gulim|Malgun)/i }
];

/**
 * Checks if a specific character exists in the font's cmap table.
 */
const hasGlyph = (font: any, char: string): boolean => {
    // charToGlyphIndex returns 0 (notdef) if the character is missing
    return font.charToGlyphIndex(char) > 0;
};

/**
 * Calculates the coverage percentage of a signature set in the font.
 */
const calculateCoverage = (font: any, signatureSet: string[]): number => {
    let hits = 0;
    signatureSet.forEach(char => {
        if (hasGlyph(font, char)) hits++;
    });
    return hits / signatureSet.length;
};

export const analyzeFontFile = async (file: File): Promise<FontDefinition> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const buffer = e.target?.result as ArrayBuffer;
            if (!buffer) {
                reject(new Error("Failed to read file"));
                return;
            }

            try {
                // @ts-ignore
                const font = parse ? parse(buffer) : window.opentype.parse(buffer);
                
                // 1. Get Font Names
                let fontName = file.name.split('.')[0];
                const names = font.names;
                
                const familyName = names.fontFamily?.en || names.fontFamily?.['zh-TW'] || names.fontFamily?.['zh-CN'] || '';
                const fullName = names.fullName?.en || '';
                const postScriptName = names.postScriptName?.en || '';
                
                if (familyName) fontName = familyName;
                else if (fullName) fontName = fullName;

                const allNameString = `${familyName} ${fullName} ${postScriptName} ${file.name}`.toLowerCase();

                // 2. Identify "Intended" Language from Metadata
                // This is our Strong Signal.
                let intendedLang: 'tc' | 'sc' | 'ja' | 'ko' | null = null;

                if (METADATA_RULES[0].pattern.test(allNameString)) intendedLang = 'tc';
                else if (METADATA_RULES[1].pattern.test(allNameString)) intendedLang = 'sc';
                else if (METADATA_RULES[2].pattern.test(allNameString)) intendedLang = 'ja';
                else if (METADATA_RULES[3].pattern.test(allNameString)) intendedLang = 'ko';

                // 3. Calculate Scores
                const tcScore = calculateCoverage(font, TC_SIGNATURE);
                const scScore = calculateCoverage(font, SC_SIGNATURE);
                const jaScore = calculateCoverage(font, JA_SIGNATURE);
                const koScore = calculateCoverage(font, KO_SIGNATURE);
                const enScore = calculateCoverage(font, EN_SIGNATURE);

                const finalTags = new Set<'tc' | 'sc' | 'en' | 'ja' | 'ko'>();
                const detectedDescriptions: string[] = [];

                // 4. Logic: Metadata Dominance with Strict Fallbacks
                
                // Thresholds
                const STRICT_THRESHOLD = 0.90; // Needs 90% coverage to be added if not primary
                const BASE_THRESHOLD = 0.60;   // Needs 60% coverage to be considered generally

                if (intendedLang === 'tc') {
                    finalTags.add('tc');
                    // Only add others if they are nearly perfect (Pan-CJK font)
                    if (scScore > STRICT_THRESHOLD) finalTags.add('sc');
                    if (jaScore > STRICT_THRESHOLD) finalTags.add('ja');
                    if (koScore > STRICT_THRESHOLD) finalTags.add('ko');
                } else if (intendedLang === 'sc') {
                    finalTags.add('sc');
                    if (tcScore > STRICT_THRESHOLD) finalTags.add('tc');
                    if (jaScore > STRICT_THRESHOLD) finalTags.add('ja');
                    if (koScore > STRICT_THRESHOLD) finalTags.add('ko');
                } else if (intendedLang === 'ja') {
                    finalTags.add('ja');
                    // Japanese fonts often have Kanji, so we check which Chinese set matches best
                    if (tcScore > STRICT_THRESHOLD) finalTags.add('tc');
                    if (scScore > STRICT_THRESHOLD) finalTags.add('sc');
                } else if (intendedLang === 'ko') {
                    finalTags.add('ko');
                    if (tcScore > STRICT_THRESHOLD) finalTags.add('tc');
                } else {
                    // No metadata signal. Rely on scores.
                    // This handles cases where filename is generic like "MyFont.ttf"
                    
                    // Korean Unique Check
                    if (koScore > BASE_THRESHOLD) finalTags.add('ko');
                    
                    // Japanese Unique Check (Hiragana is very specific)
                    if (jaScore > BASE_THRESHOLD) finalTags.add('ja');

                    // Chinese Disambiguation
                    // If neither is present, checking CJK
                    if (tcScore > BASE_THRESHOLD || scScore > BASE_THRESHOLD) {
                        if (tcScore > scScore) finalTags.add('tc');
                        else if (scScore > tcScore) finalTags.add('sc');
                        else {
                            // Equal score? Likely Pan-CJK or symbol font.
                            finalTags.add('tc');
                            finalTags.add('sc');
                        }
                    }
                }

                // Always check English
                if (enScore > 0.9) {
                     // Only add 'en' tag if it's the ONLY thing detected, or if we want to explicitly say it supports English.
                     // Usually for CJK fonts, English is implied. We might want to omit the tag to reduce clutter 
                     // UNLESS it's an English-only font.
                     if (finalTags.size === 0) finalTags.add('en');
                }

                // Description Builder
                if (finalTags.has('tc')) detectedDescriptions.push('Traditional Chinese');
                if (finalTags.has('sc')) detectedDescriptions.push('Simplified Chinese');
                if (finalTags.has('ja')) detectedDescriptions.push('Japanese');
                if (finalTags.has('ko')) detectedDescriptions.push('Korean');
                if (finalTags.has('en') && finalTags.size === 1) detectedDescriptions.push('English');

                let description = detectedDescriptions.length > 0 
                    ? `Detected: ${detectedDescriptions.join(', ')}`
                    : "Symbol or Limited Font";

                const fontDef: FontDefinition = {
                    name: fontName,
                    family: fontName, 
                    category: 'display',
                    tags: Array.from(finalTags),
                    description: description,
                    isCustom: true
                };

                resolve(fontDef);
            } catch (err) {
                console.error("Font analysis error:", err);
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