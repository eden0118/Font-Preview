import React from 'react';
import { FontDefinition } from '@/lib/types';
import { getCoverageColor } from '@/lib/coverageHelpers';

interface FontInfoProps {
  font: FontDefinition;
}

export const FontInfo: React.FC<FontInfoProps> = ({ font }) => {
  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-stone-800">字型信息</h3>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-stone-500">名稱</p>
          <p className="font-medium text-stone-700">{font.name}</p>
        </div>
        <div>
          <p className="text-xs text-stone-500">類別</p>
          <p className="font-medium text-stone-700">{font.category}</p>
        </div>
        {font.glyphCount && (
          <div>
            <p className="text-xs text-stone-500">字符數</p>
            <p className="font-medium text-stone-700">{font.glyphCount.toLocaleString()}</p>
          </div>
        )}
        {font.description && (
          <div>
            <p className="text-xs text-stone-500">描述</p>
            <p className="text-sm text-stone-600">{font.description}</p>
          </div>
        )}

        {/* Supported Languages */}
        {font.coverage && (
          <div>
            <p className="text-xs text-stone-500">支援語系</p>
            <div className="flex flex-wrap gap-2">
              {font.coverage.tc >= 80 && (
                <span className="inline-block rounded-full bg-stone-200 px-3 py-1 text-xs font-medium text-stone-700">
                  繁體中文
                </span>
              )}
              {font.coverage.sc >= 80 && (
                <span className="inline-block rounded-full bg-stone-200 px-3 py-1 text-xs font-medium text-stone-700">
                  簡體中文
                </span>
              )}
              {font.coverage.en >= 80 && (
                <span className="inline-block rounded-full bg-stone-200 px-3 py-1 text-xs font-medium text-stone-700">
                  英文
                </span>
              )}
              {font.coverage.ja >= 80 && (
                <span className="inline-block rounded-full bg-stone-200 px-3 py-1 text-xs font-medium text-stone-700">
                  日文
                </span>
              )}
              {font.coverage.tc < 80 &&
                font.coverage.sc < 80 &&
                font.coverage.en < 80 &&
                font.coverage.ja < 80 && (
                  <span className="text-xs text-stone-400">無主要語言支援</span>
                )}
            </div>
          </div>
        )}

        {/* Coverage Info */}
        {font.coverage && (
          <div className="border-t border-stone-200 pt-3">
            <p className="mb-3 text-xs font-semibold text-stone-600">語言覆蓋率</p>
            <div className="space-y-2">
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

              {/* Japanese */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-stone-600">日文</span>
                  <span
                    className={`text-xs font-medium ${getCoverageColor(font.coverage.ja).text}`}
                  >
                    {font.coverage.ja}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                  <div
                    className={`h-full ${getCoverageColor(font.coverage.ja).bar}`}
                    style={{ width: `${font.coverage.ja}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
