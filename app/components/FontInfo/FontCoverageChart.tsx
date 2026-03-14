/**
 * FontCoverageChart 元件 - 覆蓋率進度條視覺化
 *
 * 職責：展示多維度字型覆蓋率（繁體、簡體、英文、標點）
 * 特色：顏色編碼表示覆蓋程度（綠 > 黃 > 紅）
 */

import React from 'react';
import { FontDefinition } from '@/lib/types';
import { getCoverageColor } from '@/lib/coverageHelpers';

interface FontCoverageChartProps {
  font: FontDefinition;
}

/**
 * 單行覆蓋率進度條組件
 */
const CoverageBar: React.FC<{
  label: string;
  percentage: number;
}> = ({ label, percentage }) => (
  <div>
    <div className="mb-1 flex items-center justify-between">
      <span className="text-xs text-stone-600">{label}</span>
      <span className={`text-xs font-medium ${getCoverageColor(percentage).text}`}>
        {percentage}%
      </span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-stone-200">
      <div
        className={`h-full ${getCoverageColor(percentage).bar}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

export const FontCoverageChart: React.FC<FontCoverageChartProps> = ({ font }) => {
  if (!font.coverage) return null;

  return (
    <div className="border-t border-stone-200 pt-3">
      {/* 繁體中文覆蓋率 - 主要指標 */}
      <div className="mb-4 rounded-lg border border-blue-200 bg-linear-to-r from-blue-50 to-cyan-50 p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-blue-900">繁體中文覆蓋率</h3>
          <span className="text-lg font-bold text-blue-700">{font.coverage.tc}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-blue-200">
          <div
            className={`h-full ${getCoverageColor(font.coverage.tc).bar}`}
            style={{ width: `${font.coverage.tc}%` }}
          />
        </div>
        {font.totalCoreCharsChecked && (
          <p className="mt-2 text-xs font-medium text-blue-700">
            詳細統計：
            {(font.totalCoreCharsChecked || 0) - (font.missingCoreOnlyChars?.length || 0)}/
            {font.totalCoreCharsChecked || 0} 字
          </p>
        )}
      </div>

      {/* 其他語言支援 */}
      <p className="mb-1 text-xs font-semibold text-stone-600">其他語言支援</p>
      <div className="grid grid-cols-2 gap-2">
        <CoverageBar label="簡體中文" percentage={font.coverage.sc} />
        <CoverageBar label="英文" percentage={font.coverage.en} />

        {font.coverage.punctuationFull !== undefined && (
          <CoverageBar label="全形標點" percentage={font.coverage.punctuationFull} />
        )}

        {font.coverage.punctuationHalf !== undefined && (
          <CoverageBar label="半形標點" percentage={font.coverage.punctuationHalf} />
        )}
      </div>
    </div>
  );
};
