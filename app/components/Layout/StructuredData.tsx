'use client';

export function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'FontFlow',
    description:
      '專為繁體中文使用者打造的字型相容性檢測平台。快速判斷日文、簡體或其他字型對繁體中文的支援程度，掌握缺字情況。',
    url: 'https://fontflow.vercel.app',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    image: 'https://fontflow.vercel.app/og-image.jpg',
    author: {
      '@type': 'Organization',
      name: 'FontFlow Team',
      url: 'https://github.com/eden0118/Font-Preview.git',
    },
    featureList: [
      '深度字符檢測 - 基於 JF7000 標準分析 7000+ 繁體中文字符',
      '精準缺字列表 - 列出所有無法顯示的字符',
      '多字型對比 - 並排對比多個字型的支援程度',
      '實時預覽 - 上傳後立即在瀏覽器中預覽字型效果',
      '語言覆蓋率評分 - 評估繁體、簡體、日文、英文支援程度',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
