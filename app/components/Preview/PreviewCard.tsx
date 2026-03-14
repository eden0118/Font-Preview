/**
 * PreviewCard 元件 - 字型預覽卡片（容器）
 *
 * 職責：
 * - 計算預覽文字覆蓋率
 * - 組織 PreviewCardHeader 和 PreviewCardContent
 * - 傳遞文字覆蓋信息至標頭
 *
 * 技術特點：
 * - useMemo 最佳化覆蓋率計算效能
 * - 子元件職責明確，易於維護
 */

import React, { useMemo } from 'react';
import { FontDefinition } from '@/lib/types';
import { PreviewCardHeader } from './PreviewCardHeader';
import { PreviewCardContent } from './PreviewCardContent';
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
      {/* 卡片標頭 */}
      <PreviewCardHeader
        fontName={font?.name || null}
        displayName={fontName}
        coverageInfo={textCoverageInfo}
      />

      {/* 卡片內容 */}
      <PreviewCardContent
        font={font}
        text={text}
        fontColor={fontColor}
        bgColor={bgColor}
        fontSize={fontSize}
      />
    </div>
  );
};
