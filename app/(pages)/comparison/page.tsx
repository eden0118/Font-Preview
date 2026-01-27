import React from 'react';
import { Metadata } from 'next';
import ComparisonClient from './ComparisonClient';

export const metadata: Metadata = {
  title: '字型比較 - FontFlow',
  description:
    '並排對比多個字型的繁體中文支援程度。同時上傳最多 3 個字型，快速比較字符覆蓋率和視覺呈現。',
  keywords: ['字型比較', '字體對比', '繁體中文', '多字型對比', '字符覆蓋率比較'],
};

export default function ComparisonPage() {
  return <ComparisonClient />;
}
