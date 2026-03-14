/**
 * PreviewCardContent 元件 - 預覽卡片內容區
 *
 * 職責：展示使用指定字型的預覽文字
 * 機制：應用動態樣式（fontFamily、顏色、背景色、大小）
 */

import React from 'react';
import { FontDefinition } from '@/lib/types';

interface PreviewCardContentProps {
  /** 字型物件 */
  font: FontDefinition | null;
  /** 預覽文字 */
  text: string;
  /** 字體顏色 */
  fontColor: string;
  /** 背景顏色 */
  bgColor: string;
  /** 字體大小（px） */
  fontSize: number;
}

export const PreviewCardContent: React.FC<PreviewCardContentProps> = ({
  font,
  text,
  fontColor,
  bgColor,
  fontSize,
}) => {
  return (
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
  );
};
