import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
  ),
  title: 'FontFlow - 繁體中文字型分析工具',
  description:
    '專業的繁體中文字型相容性檢測工具。快速判斷日文、簡體字型對繁體中文的支援程度，掌握確切的缺字清單。',
  keywords: ['字型分析', '字體檢測', '繁體中文', '字型相容性', '缺字檢查', '排版工具'],
  authors: [{ name: 'FontFlow Team', url: 'https://github.com/fontflow' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'FontFlow - 繁體中文字型分析工具',
    description: '專為繁體中文使用者打造的字型相容性檢測平台',
    siteName: 'FontFlow',
    url: '/',
    type: 'website',
    locale: 'zh_TW',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className="bg-stone-50">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
