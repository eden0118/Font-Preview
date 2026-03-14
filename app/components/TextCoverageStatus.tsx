/**
 * TextCoverageStatus 元件 - 預覽文字的覆蓋率指標
 *
 * 職責：展示預覽文字相對於字型的覆蓋率
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { FontDefinition } from '@/lib/types';

interface TextCoverageStatusProps {
  font: FontDefinition | null;
  text: string;
}

interface CoverageInfo {
  coverage: number;
  total: number;
  missing: string[];
}

export const TextCoverageStatus: React.FC<TextCoverageStatusProps> = ({ font, text }) => {
  const textCoverageInfo = React.useMemo(() => {
    if (!font || !text || !font.supportedChars) return null;

    try {
      const chars = Array.from(text);
      let supported = 0;
      const missing: string[] = [];

      for (const char of chars) {
        if (/\s/.test(char)) continue;

        if (font.supportedChars.includes(char)) {
          supported++;
        } else {
          missing.push(char);
        }
      }

      const nonSpaceCount = chars.filter((c) => !/\s/.test(c)).length;
      const coverage = nonSpaceCount > 0 ? (supported / nonSpaceCount) * 100 : 100;

      return {
        coverage: Math.round(coverage),
        total: nonSpaceCount,
        missing: Array.from(new Set(missing)),
      };
    } catch (e) {
      console.warn('Failed to check text coverage:', e);
      return null;
    }
  }, [font, text]);

  if (!textCoverageInfo) return null;

  const { coverage, missing } = textCoverageInfo;

  return (
    <div className="border-t border-stone-200 pt-2">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-stone-600">預覽覆蓋率</span>
        <span className="font-mono text-sm font-bold text-stone-800">{coverage}%</span>
      </div>

      {/* 進度條 */}
      <div className="h-1.5 overflow-hidden rounded-full bg-stone-200">
        <div
          className={`h-full transition-all ${
            coverage >= 90 ? 'bg-green-500' : coverage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${coverage}%` }}
        />
      </div>

      {/* 缺字警告 */}
      {missing.length > 0 && (
        <div className="mt-2 flex items-start gap-2 rounded-lg bg-red-50 p-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <div className="text-xs text-red-700">
            <p className="font-medium">預覽文字缺字：{missing.length} 個</p>
            <p className="mt-1 wrap-break-word">
              {missing.slice(0, 10).join('')}
              {missing.length > 10 ? '...' : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
