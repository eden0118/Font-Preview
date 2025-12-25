/**
 * FontInfo 元件 - 字型資訊卡片
 *
 * 功能：
 * - 顯示字型基本資訊（字符數、名稱）
 * - 多維度覆蓋率視覺化（繁體、簡體、日文、英文）
 * - 語言支援標籤
 * - 缺字警告和詳細缺字列表
 *
 * 設計特色：
 * - 響應式進度條顯示覆蓋率
 * - 顏色編碼表示覆蓋程度（綠 > 黃 > 紅）
 * - 基本字缺字會觸發警告符號
 */

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { FontDefinition } from '@/lib/types';
import { getCoverageColor } from '@/lib/coverageHelpers';

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
        {font.glyphCount && (
          <div>
            <span className="mr-2 text-xs text-stone-500">字符數</span>
            <span className="font-medium text-stone-700">{font.glyphCount.toLocaleString()}</span>
          </div>
        )}

        {/* Supported Languages */}
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

        {/* Coverage Info - 著重繁體中文 */}
        {font.coverage && (
          <div className="border-t border-stone-200 pt-3">
            {/* 繁體中文覆蓋率 - 主要指標 */}
            <div className="mb-4 rounded-lg border border-blue-200 bg-linear-to-r from-blue-50 to-cyan-50 p-3">
              <div className="mb-2 flex items-center justify-between">
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

            {/* 其他語言支援 - 簡體、英文 */}
            <p className="mb-2 text-xs font-semibold text-stone-600">其他語言支援</p>
            <div className="grid grid-cols-2 gap-2">
              {/* Simplified Chinese */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-stone-600">簡體中文</span>
                  <span
                    className={`text-xs font-medium ${getCoverageColor(font.coverage.sc).text}`}
                  >
                    {font.coverage.sc}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                  <div
                    className={`h-full ${getCoverageColor(font.coverage.sc).bar}`}
                    style={{ width: `${font.coverage.sc}%` }}
                  />
                </div>
              </div>

              {/* English */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-stone-600">英文</span>
                  <span
                    className={`text-xs font-medium ${getCoverageColor(font.coverage.en).text}`}
                  >
                    {font.coverage.en}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                  <div
                    className={`h-full ${getCoverageColor(font.coverage.en).bar}`}
                    style={{ width: `${font.coverage.en}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Missing Essential Characters - Show specific characters and warning only if missing */}
        {font.missingEssentialChars && font.missingEssentialChars.length > 0 ? (
          <div className="border-t border-stone-200 pt-3">
            {/* 紅色警告 + 缺失的字符 */}
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <div className="mb-2 flex gap-2">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-800" />
                <p className="text-xs font-semibold text-red-800">
                  缺失基本關鍵字 {font.missingEssentialChars.length} 個：
                </p>
              </div>
              <p className="ml-6 font-mono text-xs wrap-break-word text-red-700">
                {font.missingEssentialChars.split('').join('  ')}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
