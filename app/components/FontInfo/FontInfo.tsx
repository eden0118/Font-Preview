/**
 * FontInfo 元件 - 字型資訊卡片（主容器）
 *
 * 職責：組織字型顯示信息
 * - 基本資訊（名稱、字符數）
 * - 語言支援標籤
 * - 委派給子元件：FontCoverageChart、FontMissingChars
 */

import React from 'react';
import { FontDefinition } from '@/lib/types';
import { FontCoverageChart } from './FontCoverageChart';
import { FontMissingChars } from './FontMissingChars';

interface FontInfoProps {
  font: FontDefinition;
}

/**
 * 字型資訊卡片元件
 */
export const FontInfo: React.FC<FontInfoProps> = ({ font }) => {
  return (
    <div className="card p-4 sm:p-6">
      <h3 className="mb-3 font-bold text-stone-800">{font.name}</h3>
      <div className="space-y-3">
        {/* 基本資訊 */}
        {font.glyphCount && (
          <div>
            <span className="mr-2 text-xs text-stone-500">字符數</span>
            <span className="font-medium text-stone-700">{font.glyphCount.toLocaleString()}</span>
          </div>
        )}

        {/* 支援語系標籤 */}
        {font.coverage && (
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
            <p className="text-xs whitespace-nowrap text-stone-500">支援語系</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {font.coverage.tc >= 80 && <span className="lang-label">繁體中文</span>}
              {font.coverage.sc >= 80 && <span className="lang-label">簡體中文</span>}
              {font.coverage.en >= 80 && <span className="lang-label">英文</span>}
              {font.coverage.tc < 80 && font.coverage.sc < 80 && font.coverage.en < 80 && (
                <span className="text-xs text-stone-400">無主要語言支援</span>
              )}
            </div>
          </div>
        )}

        {/* 子元件：覆蓋率圖表 */}
        <FontCoverageChart font={font} />

        {/* 子元件：缺字警告 */}
        <FontMissingChars font={font} />
      </div>
    </div>
  );
};
