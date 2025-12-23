import { DetectedLanguage } from '../types';

// Markers
const SC_MARKERS = /[简国会万画书体爱头实贝见车长韦风飞马鱼鸟麦齐齿龙龟]/;
const TC_MARKERS = /[簡國會萬畫書體愛頭實貝見車長韋風飛馬魚鳥麥齊齒龍龜]/;
const JA_MARKERS = /[\u3040-\u309F\u30A0-\u30FF]/; // Hiragana and Katakana
const KO_MARKERS = /[\uAC00-\uD7AF]/; // Hangul Syllables

export const detectLanguage = (text: string): DetectedLanguage => {
  if (!text || text.trim() === '') return DetectedLanguage.UNKNOWN;

  let scScore = 0;
  let tcScore = 0;
  let jaScore = 0;
  let koScore = 0;
  let enScore = 0;

  for (const char of text) {
    if (SC_MARKERS.test(char)) scScore++;
    if (TC_MARKERS.test(char)) tcScore++;
    if (JA_MARKERS.test(char)) jaScore++;
    if (KO_MARKERS.test(char)) koScore++;
    if (/[a-zA-Z]/.test(char)) enScore++;
  }

  // Priority Logic
  if (koScore > 0 && koScore > jaScore && koScore > tcScore) return DetectedLanguage.KO;
  if (jaScore > 0 && jaScore > tcScore) return DetectedLanguage.JA; // Japanese often mixes Kanji, so prioritize Kana presence

  if (tcScore > scScore) return DetectedLanguage.TC;
  if (scScore > tcScore) return DetectedLanguage.SC;

  if (enScore > tcScore + scScore + jaScore + koScore) return DetectedLanguage.EN;

  // Default fallback if ambiguous but contains Chinese characters
  if (/[\u4e00-\u9fa5]/.test(text)) {
    return DetectedLanguage.UNKNOWN;
  }

  return DetectedLanguage.UNKNOWN;
};
