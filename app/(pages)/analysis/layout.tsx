import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '字型分析 - 繁體中文支援度檢測 | FontFlow',
  description:
    '深入分析字型的繁體中文支援程度。上傳 TTF/OTF 字型，獲得詳細的字符覆蓋率報告、缺字清單和評分。支援 7000+ 繁體字符檢測。',
  keywords: [
    '字型分析',
    '繁體中文支援',
    '字符覆蓋率',
    '缺字檢查',
    '字型評估',
    'TTF 分析',
    'OTF 分析',
    '字型工具',
    '繁體字檢測',
    '日文字型檢測',
    '簡體字型檢查',
  ],
};

export default function AnalysisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
