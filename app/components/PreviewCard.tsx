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
      <div className="bg-primary/5 flex items-center gap-2 border-b border-stone-100 px-6 py-3">
        <div className="bg-primary h-3 w-3 rounded-full" />
        <div className="flex-1">
          <p className="font-semibold text-stone-800">
            {font ? font.name : fontName || '預設字型'}
          </p>
          {textCoverageInfo && textCoverageInfo.coverage < 100 && (
            <div className="mt-2 space-y-1">
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
      </div>

      {/* Preview Area */}
      <div
        className="flex min-h-60 flex-1 items-center justify-center overflow-auto p-6 transition-colors duration-300"
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
