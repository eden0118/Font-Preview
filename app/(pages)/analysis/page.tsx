import React from 'react';
import { Metadata } from 'next';
import AnalysisClient from './AnalysisClient';

export const metadata: Metadata = {
  title: '字型分析 - FontFlow',
  description:
    '深入分析字型的繁體中文支援程度。上傳 TTF/OTF 字型，獲得詳細的字符覆蓋率報告和缺字清單。',
  keywords: ['字型分析', '繁體中文支援', '字符覆蓋率', '缺字檢查', '字型評估'],
};

export default function AnalysisPage() {
  return <AnalysisClient />;
}
