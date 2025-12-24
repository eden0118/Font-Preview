import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { FontDefinition } from '@/lib/types';
import { getCoverageColor } from '@/lib/coverageHelpers';

interface FontInfoProps {
  font: FontDefinition;
}

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

        {/* Coverage Info */}
        {font.coverage && (
          <div className="border-t border-stone-200 pt-3">
            <p className="mb-3 text-xs font-semibold text-stone-600">語言覆蓋率</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
              {/* Traditional Chinese */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-stone-600">繁體中文</span>
                  <span
                    className={`text-xs font-medium ${getCoverageColor(font.coverage.tc).text}`}
                  >
                    {font.coverage.tc}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                  <div
                    className={`h-full ${getCoverageColor(font.coverage.tc).bar}`}
                    style={{ width: `${font.coverage.tc}%` }}
                  />
                </div>
              </div>

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

        {/* Missing TC Characters */}
        {font.missingTCChars && font.missingTCChars.length > 0 && (
          <div className="border-t border-stone-200 pt-3">
            <p className="mb-2 text-xs font-semibold text-stone-600">
              缺失繁體字 ({font.missingTCChars.length})
            </p>
            <div className="space-y-2">
              {/* 只有當缺失的「核心字」超過 5 個時才顯示警告 */}
              {font.missingCoreTCChars && font.missingCoreTCChars.length > 5 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-2">
                  <div className="flex gap-2">
                    <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-amber-800" />
                    <p className="text-xs font-semibold text-amber-800">
                      核心字缺字超過5個，使用時可能經常遇到回退字型。
                    </p>
                  </div>
                </div>
              )}
              <div className="rounded-lg p-2">
                <p className="text-xs break-words text-red-700">
                  {font.missingTCChars.length > 50
                    ? font.missingTCChars.split('').slice(0, 50).join('、') + '...'
                    : font.missingTCChars.split('').join('、')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
