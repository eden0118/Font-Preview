/**
 * PreviewCardHeader 元件 - 預覽卡片標頭
 *
 * 職責：展示字型名稱與預覽覆蓋率警告
 * 機制：展示缺字統計與示例
 */

import React from 'react';

interface TextCoverageInfo {
  coverage: number;
  total: number;
  missing: string[];
}

interface PreviewCardHeaderProps {
  /** 字型名稱 */
  fontName: string | null;
  /** 預覽字體名稱（備用） */
  displayName?: string;
  /** 文字覆蓋率信息 */
  coverageInfo: TextCoverageInfo | null;
}

export const PreviewCardHeader: React.FC<PreviewCardHeaderProps> = ({
  fontName,
  displayName,
  coverageInfo,
}) => {
  return (
    <div className="bg-primary/5 flex flex-col gap-1 border-b border-stone-100 px-4 py-2 sm:flex-row sm:items-center sm:gap-2 sm:px-6 sm:py-3">
      <div className="flex flex-1 items-center gap-2">
        <div className="bg-primary h-3 w-3 shrink-0 rounded-full" />
        <p className="truncate text-sm font-semibold text-stone-800">
          {fontName || displayName || '預設字型'}
        </p>
      </div>

      {coverageInfo && coverageInfo.coverage < 100 && (
        <div className="mt-2 space-y-1 text-xs sm:mt-0">
          {coverageInfo.coverage < 80 && (
            <p className="text-xs text-amber-700">
              ⚠️ 預覽文字覆蓋率 {coverageInfo.coverage}%，有缺字
            </p>
          )}
          {coverageInfo.missing && coverageInfo.missing.length > 0 && (
            <p className="text-xs text-stone-600">
              缺字: {coverageInfo.missing.slice(0, 10).join('')}
              {coverageInfo.missing.length > 10 ? '...' : ''}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
