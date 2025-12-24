// 中文預覽文字列表
export const PREVIEW_TEXTS_CN = [
  '風在林間輕輕吹過，光影在字裡行間流動。',
  '每一個字體都有自己的故事。',
  '設計在細節中綻放光彩。',
  '文字是視覺藝術的靈魂。',
  '字型選擇影響整個設計的氣質。',
  '排版的美感源於對細節的執著。',
  '讓文字在視覺中舞動。',
  '好的字體讓內容更有生命力。',
];

// 英文預覽文字列表
export const PREVIEW_TEXTS_EN = [
  'Typography reveals the spirit of design.',
  "Great typography is invisible, it doesn't get in the way.",
  "The best typeface is the one you don't notice.",
  'Good design is obvious, great design is transparent.',
  'A well-chosen typeface can elevate any design.',
  'Typography is the art of arranging type beautifully.',
  'Perfect typography makes reading effortless and enjoyable.',
  'The right font transforms words into visual poetry.',
];

// 語言類型
export type PreviewLanguage = 'cn' | 'en';

/**
 * 根據語言隨機取得一個預設預覽文字
 * @param language - 'cn' 為中文，'en' 為英文
 */
export const getRandomPreviewText = (language: PreviewLanguage = 'cn'): string => {
  const texts = language === 'en' ? PREVIEW_TEXTS_EN : PREVIEW_TEXTS_CN;
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
};

/**
 * 取得指定語言的所有預覽文字
 */
export const getPreviewTexts = (language: PreviewLanguage = 'cn'): string[] => {
  return language === 'en' ? PREVIEW_TEXTS_EN : PREVIEW_TEXTS_CN;
};
