import React from 'react';
import { FontDefinition } from '@/lib/types';

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
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm">
      {/* Header */}
      <div className="bg-primary/5 flex items-center gap-2 border-b border-stone-100 px-6 py-3">
        <div className="bg-primary h-3 w-3 rounded-full" />
        <p className="font-semibold text-stone-800">{font ? font.name : fontName || '預設字型'}</p>
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
