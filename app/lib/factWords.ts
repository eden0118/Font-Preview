// 預設預覽文字列表
export const PREVIEW_TEXTS = [
  '風在林間輕輕吹過，光影在字裡行間流動。Typography reveals the spirit of design.',
  "每一個字體都有自己的故事。Great typography is invisible, it doesn't get in the way.",
  "設計在細節中綻放光彩。The best typeface is the one you don't notice.",
  '文字是視覺藝術的靈魂。Good design is obvious, great design is transparent.',
  '字型選擇影響整個設計的氣質。A well-chosen typeface can elevate any design.',
  '排版的美感源於對細節的執著。Typography is the art of arranging type beautifully.',
  '讓文字在視覺中舞動。Perfect typography makes reading effortless and enjoyable.',
  '好的字體讓內容更有生命力。The right font transforms words into visual poetry.',
];

/**
 * 隨機取得一個預設預覽文字
 */
export const getRandomPreviewText = (): string => {
  const randomIndex = Math.floor(Math.random() * PREVIEW_TEXTS.length);
  return PREVIEW_TEXTS[randomIndex];
};
