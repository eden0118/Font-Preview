import React from 'react';
import { FontDefinition, ComparisonFont } from '../types';

interface ComparisonPreviewProps {
  fonts: ComparisonFont[];
  inputText: string;
  fontColor: string;
  bgColor: string;
  fontSize: number;
}

const ComparisonPreview: React.FC<ComparisonPreviewProps> = ({
  fonts,
  inputText,
  fontColor,
  bgColor,
  fontSize,
}) => {
  const uploadedFonts = fonts.filter((f) => f.font !== null);

  if (uploadedFonts.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-stone-300 p-12 text-center">
        <p className="text-sm text-stone-500">請先上傳字體以查看預覽</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {uploadedFonts.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm"
        >
          {/* Preview Area */}
          <div
            className="relative flex min-h-72 flex-1 items-center justify-center overflow-auto p-8 transition-colors duration-300"
            style={{
              backgroundColor: bgColor,
            }}
          >
            <p
              style={{
                fontFamily: item.font ? `"${item.font.family}"` : 'sans-serif',
                color: fontColor,
                fontSize: `${fontSize}px`,
                lineHeight: 1.6,
                wordBreak: 'break-word',
                textAlign: 'center',
                whiteSpace: 'pre-wrap',
              }}
            >
              {inputText || '請輸入文字預覽效果'}
            </p>
          </div>

          {/* Footer */}
          <div className="border-t border-stone-100 bg-stone-50/50 px-4 py-3">
            <p className="text-xs font-medium text-stone-600">{item.font?.name}</p>
            <p className="text-xs text-stone-400">{item.font?.category}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComparisonPreview;
