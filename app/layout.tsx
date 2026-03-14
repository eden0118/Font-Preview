import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { StructuredData } from './components/Layout/StructuredData';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
  ),
  title: 'FontFlow - 繁體中文字型分析工具 | TTF/OTF 字型檢測',
  description:
    '专业繁體中文字型相容性檢測工具。快速判斷日文、簡體字型對繁體中文的支援程度，獲取精準缺字清單。支援 TTF、OTF 格式。',
  keywords: [
    '字型分析',
    '字體檢測',
    '繁體中文',
    '字型相容性',
    '缺字檢查',
    '排版工具',
    'TTF 檢測',
    'OTF 檢測',
    '日文字型相容性',
    '簡體字型轉繁體',
    '字符覆蓋率',
    '字型評估工具',
  ],
  authors: [{ name: 'FontFlow Team', url: 'https://github.com/eden0118/Font-Preview.git' }],
  creator: 'FontFlow',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'FontFlow - 繁體中文字型分析工具',
    description: '上傳字型檢測繁體中文支援度，獲得精確的缺字清單和語言覆蓋率評分',
    siteName: 'FontFlow',
    url: 'https://fontflow.vercel.app',
    type: 'website',
    locale: 'zh_TW',
    images: [
      {
        url: 'https://fontflow.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FontFlow - 繁體中文字型分析工具',
      },
    ],
  },
  alternates: {
    canonical: 'https://fontflow.vercel.app',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <link rel="sitemap" href="/sitemap.xml" />
      </head>
      <body className="bg-stone-50">
        <StructuredData />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
