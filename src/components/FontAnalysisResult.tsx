import React from 'react';
import { CheckCircle } from 'lucide-react';
import { FontDefinition } from '../types';

interface FontAnalysisResultProps {
  currentFont: FontDefinition | null;
}

const FontAnalysisResult: React.FC<FontAnalysisResultProps> = ({ currentFont }) => {
  if (!currentFont) return null;

  return (
    <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
      <div className="mb-1 flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-emerald-600" />
        <span className="text-sm font-bold text-emerald-800">分析完成</span>
      </div>
      <p className="mb-2 text-xs font-medium break-all text-emerald-700">{currentFont.name}</p>

      {currentFont.glyphCount && (
        <p className="mb-2 text-xs text-emerald-600">
          字符總數：<span className="font-bold">{currentFont.glyphCount.toLocaleString()}</span>
        </p>
      )}

      {/* 適用性分析 - 覆蓋率顯示 */}
      {currentFont.coverage && (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-bold text-stone-700">適用性分析</p>

          {/* 繁體中文覆蓋率 */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-xs text-stone-600">繁體中文</span>
            <div className="h-2 flex-1 rounded-full bg-stone-200">
              <div
                className={`h-2 rounded-full transition-all ${
                  currentFont.coverage.tc >= 90
                    ? 'bg-emerald-500'
                    : currentFont.coverage.tc >= 70
                      ? 'bg-yellow-500'
                      : currentFont.coverage.tc >= 50
                        ? 'bg-orange-500'
                        : 'bg-red-400'
                }`}
                style={{ width: `${currentFont.coverage.tc}%` }}
              />
            </div>
            <span
              className={`w-10 text-right text-xs font-bold ${
                currentFont.coverage.tc >= 90
                  ? 'text-emerald-600'
                  : currentFont.coverage.tc >= 70
                    ? 'text-yellow-600'
                    : currentFont.coverage.tc >= 50
                      ? 'text-orange-600'
                      : 'text-red-500'
              }`}
            >
              {currentFont.coverage.tc}%
            </span>
          </div>

          {/* 簡體中文覆蓋率 */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-xs text-stone-600">簡體中文</span>
            <div className="h-2 flex-1 rounded-full bg-stone-200">
              <div
                className="h-2 rounded-full bg-blue-400 transition-all"
                style={{ width: `${currentFont.coverage.sc}%` }}
              />
            </div>
            <span className="w-10 text-right text-xs font-bold text-blue-600">
              {currentFont.coverage.sc}%
            </span>
          </div>

          {/* 日文覆蓋率 */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-xs text-stone-600">日文假名</span>
            <div className="h-2 flex-1 rounded-full bg-stone-200">
              <div
                className="h-2 rounded-full bg-pink-400 transition-all"
                style={{ width: `${currentFont.coverage.ja}%` }}
              />
            </div>
            <span className="w-10 text-right text-xs font-bold text-pink-600">
              {currentFont.coverage.ja}%
            </span>
          </div>
        </div>
      )}

      {/* 適用性結論 */}
      {currentFont.description && (
        <p className="mt-3 text-xs leading-relaxed text-stone-600">{currentFont.description}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {currentFont.tags.includes('tc') && (
          <span className="rounded border border-emerald-200 bg-white px-2 py-0.5 text-xs font-bold text-emerald-600 shadow-sm">
            繁體適用
          </span>
        )}
        {currentFont.tags.includes('sc') && (
          <span className="rounded border border-blue-200 bg-white px-2 py-0.5 text-xs font-bold text-blue-600 shadow-sm">
            簡體適用
          </span>
        )}
        {currentFont.tags.includes('ja') && (
          <span className="rounded border border-pink-200 bg-white px-2 py-0.5 text-xs font-bold text-pink-600 shadow-sm">
            日文適用
          </span>
        )}
        {currentFont.tags.includes('en') && (
          <span className="rounded border border-amber-200 bg-white px-2 py-0.5 text-xs font-bold text-amber-600 shadow-sm">
            英文/拉丁
          </span>
        )}
      </div>
    </div>
  );
};

export default FontAnalysisResult;
