import { parse } from 'opentype.js';
import { FontDefinition } from '../types';

// ============================================================================
// DIAGNOSTIC CHARACTER SETS (The "CMAP" Check)
// ============================================================================
// Instead of pairs, we use "Signature Vectors". If a font supports a high percentage
// of these characters, it strongly indicates support for that specific script.

// Traditional Chinese Distinctive Characters (U+570B 國, U+9580 門, etc.)
// These characters usually do not exist in strict Simplified fonts.
const TC_SIGNATURE = [
  '國', '門', '臺', '灣', '飛', '書', '邊', '無', '愛', '葉', 
  '陽', '專', '開', '園', '導', '鳥', '島', '畫', '農', '豐'
];

// Simplified Chinese Distinctive Characters (U+56FD 国, U+95E8 门, etc.)
// These characters usually do not exist in strict Traditional fonts.
const SC_SIGNATURE = [
  '国', '门', '台', '湾', '飞', '书', '边', '无', '爱', '叶', 
  '阳', '专', '开', '园', '导', '鸟', '岛', '画', '农', '丰'
];

// Japanese Signature (Hiragana)
// The presence of Hiragana is the strongest indicator for Japanese support.
// Range: \u3040 - \u309F
const JA_SIGNATURE = [
  'あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ',
  'さ', 'し', 'す', 'せ', 'そ', 'の', 'を', 'ん', 'っ', 'ゃ'
];

// Korean Signature (Hangul Syllables)
// Range: \uAC00 - \uD7AF
const KO_SIGNATURE = [
  '가', '나', '다', '라', '마', '바', '사', '아', '자', '차',
  '카', '타', '파', '하', '한', '글', '안', '녕', '무', '궁'
];

// English/Latin Signature
const EN_SIGNATURE = [
  'A', 'B', 'C', 'D', 'E', 'a', 'b', 'c', 'd', 'e'
];

// ============================================================================
// METADATA PATTERNS (The "Name Table" Check)
// ============================================================================
const METADATA_RULES = [
    { tag: 'tc', pattern: /(TC|TW|HK|Traditional|Hant|Ming|Kai)/i },
    { tag: 'sc', pattern: /(SC|CN|GB|Simplified|Hans|Song|Hei)/i },
    { tag: 'ja', pattern: /(JP|JA|Jp|Ja|Mincho|Gothic|Kaku|Maru)/i },
    { tag: 'ko', pattern: /(KR|KO|Kr|Ko|Hangul|Batang|Dotum|Gulim)/i }
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
                // @ts-ignore - opentype might be loaded as default or named export
                const font = parse ? parse(buffer) : window.opentype.parse(buffer);
                
                // --------------------------------------------------------
                // 1. EXTRACT METADATA (Font Name Table)
                // --------------------------------------------------------
                let fontName = file.name.split('.')[0];
                const names = font.names;
                
                // Try to get the English name, fallback to raw name
                const familyName = names.fontFamily?.en || names.fontFamily?.['zh-TW'] || names.fontFamily?.['zh-CN'] || '';
                const fullName = names.fullName?.en || '';
                const postScriptName = names.postScriptName?.en || '';
                
                if (familyName) fontName = familyName;
                else if (fullName) fontName = fullName;

                // Combine all name fields for analysis
                const allNameString = `${familyName} ${fullName} ${postScriptName} ${file.name}`.toLowerCase();

                // --------------------------------------------------------
                // 2. ANALYZE SUPPORT (Metadata + CMAP)
                // --------------------------------------------------------
                const tags = new Set<'tc' | 'sc' | 'en' | 'ja' | 'ko'>();
                const detectedDescriptions: string[] = [];

                // --- A. Metadata Check ---
                // If the file name explicitly says "TC" or "SC", we trust it highly.
                METADATA_RULES.forEach(rule => {
                    if (rule.pattern.test(allNameString)) {
                        // We treat 'ja' patterns carefully as "Gothic" can be generic,
                        // but usually in CJK context it implies JP or generic sans.
                        // We will verify with glyph check.
                        // However, explicit country codes like TW, CN, JP, KR are strong signals.
                        if (/(TC|TW|HK|Traditional|Hant)/i.test(allNameString)) tags.add('tc');
                        if (/(SC|CN|GB|Simplified|Hans)/i.test(allNameString)) tags.add('sc');
                        if (/(JP|JA)/i.test(allNameString)) tags.add('ja');
                        if (/(KR|KO|Hangul)/i.test(allNameString)) tags.add('ko');
                    }
                });

                // --- B. CMAP / Glyph Coverage Check ---
                // This is the "Truth" check. Even if named "MyFont", if it has Hiragana, it supports JP.

                const tcScore = calculateCoverage(font, TC_SIGNATURE);
                const scScore = calculateCoverage(font, SC_SIGNATURE);
                const jaScore = calculateCoverage(font, JA_SIGNATURE);
                const koScore = calculateCoverage(font, KO_SIGNATURE);
                const enScore = calculateCoverage(font, EN_SIGNATURE);

                // Thresholds
                const COVERAGE_THRESHOLD = 0.5; // 50% of signature chars must exist

                // Add tags based on glyph evidence
                if (tcScore > COVERAGE_THRESHOLD) tags.add('tc');
                if (scScore > COVERAGE_THRESHOLD) tags.add('sc');
                if (jaScore > COVERAGE_THRESHOLD) tags.add('ja');
                if (koScore > COVERAGE_THRESHOLD) tags.add('ko');
                if (enScore > 0.9) tags.add('en');

                // --------------------------------------------------------
                // 3. CONFLICT RESOLUTION & REFINEMENT
                // --------------------------------------------------------

                // Case: Universal CJK Fonts (like Noto Sans CJK)
                // They might support TC, SC, JA, and KO. We keep all tags.
                
                // Case: Fallback for ambiguous CJK
                // If it has "Middle" (中) but fails strict TC/SC checks (e.g., a very limited font)
                if (!tags.has('tc') && !tags.has('sc') && !tags.has('ja')) {
                    if (hasGlyph(font, '中')) {
                        // It's likely Chinese but we're not sure which.
                        // Check which score is higher, even if below threshold
                        if (tcScore > scScore) tags.add('tc');
                        else tags.add('sc');
                    }
                }

                // Generate Description
                if (tags.has('tc')) detectedDescriptions.push('Traditional Chinese');
                if (tags.has('sc')) detectedDescriptions.push('Simplified Chinese');
                if (tags.has('ja')) detectedDescriptions.push('Japanese');
                if (tags.has('ko')) detectedDescriptions.push('Korean');
                if (tags.has('en') && tags.size === 1) detectedDescriptions.push('English Only');

                let description = detectedDescriptions.length > 0 
                    ? `Detected scripts: ${detectedDescriptions.join(', ')}`
                    : "Limited character set or Symbol font";

                // 4. Resolve
                const fontDef: FontDefinition = {
                    name: fontName,
                    family: fontName, 
                    category: 'display', // Could be refined by checking PANOSE if available, but display is safe default
                    tags: Array.from(tags),
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