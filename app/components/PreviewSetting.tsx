import React from 'react';
import { RotateCcw } from 'lucide-react';

interface PreviewSettingProps {
  fontSize: number;
  fontColor: string;
  bgColor: string;
  onFontSizeChange: (size: number) => void;
  onFontColorChange: (color: string) => void;
  onBgColorChange: (color: string) => void;
  onReset: () => void;
  accentColor?: 'primary' | 'accent';
}

export const PreviewSetting: React.FC<PreviewSettingProps> = ({
  fontSize,
  fontColor,
  bgColor,
  onFontSizeChange,
  onFontColorChange,
  onBgColorChange,
  onReset,
  accentColor = 'primary',
}) => {
  const accentClass = accentColor === 'accent' ? 'accent-accent' : 'accent-primary';
  const colorClass = accentColor === 'accent' ? 'text-accent' : 'text-primary';

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 md:gap-6">
        {/* Font Size */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-stone-600">字體大小</label>
            <span className={`font-mono text-sm font-bold ${colorClass}`}>{fontSize}px</span>
          </div>
          <input
            type="range"
            min="12"
            max="150"
            value={fontSize}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            className={`h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 ${accentClass}`}
          />
        </div>

        {/* Font Color */}
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-600">字體顏色</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={fontColor}
              onChange={(e) => onFontColorChange(e.target.value)}
              className="h-8 w-8 cursor-pointer overflow-hidden rounded border-0 p-0 shadow-sm"
            />
            <div className="font-mono text-xs uppercase text-stone-600">{fontColor}</div>
          </div>
        </div>

        {/* Background Color */}
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-600">背景顏色</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => onBgColorChange(e.target.value)}
              className="h-8 w-8 cursor-pointer overflow-hidden rounded border-0 p-0 shadow-sm"
            />
            <div className="font-mono text-xs uppercase text-stone-600">{bgColor}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2 border-t border-stone-100 pt-4">
        <button onClick={onReset} className="btn secondary-btn">
          <RotateCcw size={16} />
          重置設定
        </button>
      </div>
    </div>
  );
};
