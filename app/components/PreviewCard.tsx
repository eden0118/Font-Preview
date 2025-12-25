/**
 * PreviewCard 元件 - 字型預覽卡片
 *
 * 功能：
 * - 使用上傳的字型實時渲染預覽文字
 * - 動態計算預覽文字的字型覆蓋率
 * - 視覺化缺字警告
 * - 支援字體大小、顏色、背景色自訂
 *
 * 技術特點：
 * - 使用 CSS @font-face 動態載入字型
 * - useMemo 最佳化覆蓋率計算效能
 * - 響應式設計，支援各尺寸螢幕
 */

import React, { useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import { FontDefinition } from '@/lib/types';
import { checkTextCoverage } from '@/lib/fontHelper';

interface PreviewCardProps {
  font: FontDefinition | null;
  fontName?: string;
  text: string;
  fontColor: string;
  bgColor: string;
  fontSize: number;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({
  font,
  fontName,
  text,
  fontColor,
  bgColor,
  fontSize,
}) => {
  // 計算預覽文字的實際覆蓋率
  const textCoverageInfo = useMemo(() => {
    if (!font || !text || !font.supportedChars) return null;

    try {
      // 直接檢查支援的字符列表
      const chars = Array.from(text);
      let supported = 0;
      const missing: string[] = [];

      for (const char of chars) {
        if (/\s/.test(char)) continue; // 跳過空格和換行

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

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm">
      {/* Header */}
      <div className="bg-primary/5 flex flex-col gap-1 border-b border-stone-100 px-4 py-2 sm:flex-row sm:items-center sm:gap-2 sm:px-6 sm:py-3">
        <div className="flex flex-1 items-center gap-2">
          <div className="bg-primary h-3 w-3 shrink-0 rounded-full" />
          <p className="truncate text-sm font-semibold text-stone-800">
            {font ? font.name : fontName || '預設字型'}
          </p>
        </div>
        {textCoverageInfo && textCoverageInfo.coverage < 100 && (
          <div className="mt-2 space-y-1 text-xs">
            {textCoverageInfo.coverage < 80 && (
              <p className="text-xs text-amber-700">
                ⚠️ 預覽文字覆蓋率 {textCoverageInfo.coverage}%，有缺字
              </p>
            )}
            {textCoverageInfo.missing && textCoverageInfo.missing.length > 0 && (
              <p className="text-xs text-stone-600">
                缺字: {textCoverageInfo.missing.slice(0, 10).join('')}
                {textCoverageInfo.missing.length > 10 ? '...' : ''}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Preview Area */}
      <div
        className="flex min-h-40 flex-1 items-center justify-center overflow-auto p-4 transition-colors duration-300 sm:min-h-60 sm:p-6"
        style={{ backgroundColor: bgColor }}
      >
        {text ? (
          <p
            style={{
              fontFamily: font ? `"${font.family}"` : 'sans-serif',
              color: fontColor,
              fontSize: `${fontSize}px`,
              lineHeight: 1.6,
              wordBreak: 'break-word',
              textAlign: 'center',
              whiteSpace: 'pre-wrap',
            }}
          >
            {text}
          </p>
        ) : (
          <p style={{ color: '#A89B8F', fontSize: '16px' }}>請輸入文字以預覽</p>
        )}
      </div>
    </div>
  );
};
