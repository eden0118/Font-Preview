import React from 'react';
import { Trash2 } from 'lucide-react';
import { FontDefinition } from '../types';

interface FontPreviewProps {
  currentFont: FontDefinition | null;
  inputText: string;
  fontColor: string;
  bgColor: string;
  fontSize: number;
  onClear: () => void;
}

const FontPreview: React.FC<FontPreviewProps> = ({
  currentFont,
  inputText,
  fontColor,
  bgColor,
  fontSize,
  onClear,
}) => {
  return (
    <div className="flex flex-1 flex-col rounded-2xl border border-stone-100 bg-white shadow-sm">
      <div
        className="relative flex flex-1 items-center justify-center overflow-auto rounded-t-2xl p-8 transition-colors duration-300"
        style={{
          backgroundColor: bgColor,
        }}
      >
        <p
          style={{
            fontFamily: currentFont ? `"${currentFont.family}"` : 'sans-serif',
            color: fontColor,
            fontSize: `${fontSize}px`,
            lineHeight: 1.5,
            wordBreak: 'break-word',
            textAlign: 'center',
            whiteSpace: 'pre-wrap',
          }}
        >
          {inputText || '請輸入文字預覽效果'}
        </p>
      </div>

      <div className="flex items-center justify-between rounded-b-2xl border-t border-stone-100 bg-stone-50/50 p-4">
        <p className="text-xs font-medium text-stone-400">
          {currentFont ? `使用字體: ${currentFont.name}` : '尚無上傳字體，目前使用系統預設字體'}
        </p>
        <button
          onClick={onClear}
          className="bg-primary flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
        >
          <Trash2 className="h-4 w-4" />
          清空
        </button>
      </div>
    </div>
  );
};

export default FontPreview;
