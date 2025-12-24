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
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:gap-6 lg:gap-10">
      {/* Font Size */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <label className="mb-1 text-sm font-medium text-stone-600">字體大小</label>
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
      <div className="flex-1 sm:flex-none">
        <label className="mb-1 block text-sm font-medium text-stone-600">字體顏色</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={fontColor}
            onChange={(e) => onFontColorChange(e.target.value)}
            className="h-8 w-8 cursor-pointer overflow-hidden p-0"
          />
          <div className="text-infoText font-mono text-xs uppercase">{fontColor}</div>
        </div>
      </div>

      {/* Background Color */}
      <div className="flex-1 sm:flex-none">
        <label className="mb-1 block text-sm font-medium text-stone-600">背景顏色</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={bgColor}
            onChange={(e) => onBgColorChange(e.target.value)}
            className="h-8 w-8 cursor-pointer overflow-hidden p-0"
          />
          <div className="text-infoText font-mono text-xs uppercase">{bgColor}</div>
        </div>
      </div>
      <div className="flex w-full items-end justify-end sm:w-auto">
        <button onClick={onReset} className="small-btn secondary-btn">
          <RotateCcw size={12} />
          重置設定
        </button>
      </div>
    </div>
  );
};
