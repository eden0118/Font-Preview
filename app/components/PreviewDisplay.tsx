/**
 * PreviewDisplay 元件 - 純預覽展示區域
 *
 * 職責：展示使用上傳字型的文字預覽
 */

import React from 'react';
import { FontDefinition } from '@/lib/types';

interface PreviewDisplayProps {
  font: FontDefinition | null;
  fontName?: string;
  text: string;
  fontColor: string;
  bgColor: string;
  fontSize: number;
}

export const PreviewDisplay: React.FC<PreviewDisplayProps> = ({
  font,
  fontName,
  text,
  fontColor,
  bgColor,
  fontSize,
}) => {
  const fontFamily = font ? font.family : 'inherit';

  return (
    <div
      style={{
        fontFamily,
        color: fontColor,
        backgroundColor: bgColor,
        fontSize: `${fontSize}px`,
      }}
      className="min-h-32 rounded-xl p-4 transition-all duration-200 sm:min-h-40 sm:p-6"
    >
      {text || (
        <span className="text-infoText italic">{font ? '輸入預覽文字...' : '請先上傳字型'}</span>
      )}
    </div>
  );
};
