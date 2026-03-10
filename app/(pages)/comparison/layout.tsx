import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '字型比較 - 多字型對比工具 | FontFlow',
  description:
    '並排對比多個字型的繁體中文支援程度。同時上傳最多 3 個字型，快速比較字符覆蓋率、視覺效果和評分，找到最適合的字體。',
  keywords: [
    '字型比較',
    '字體對比',
    '繁體中文',
    '多字型對比',
    '字符覆蓋率比較',
    '字型效果對比',
    'TTF 對比',
    'OTF 對比',
    '字型選擇工具',
  ],
};

export default function ComparisonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
