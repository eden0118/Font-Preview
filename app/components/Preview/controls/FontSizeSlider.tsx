/**
 * FontSizeSlider 元件 - 字體大小滑塊
 *
 * 職責：提供直覺的字體大小調整UI
 * 機制：Range input 搭配實時文字顯示
 */

import React from 'react';

interface FontSizeSliderProps {
  /** 當前字體大小 */
  fontSize: number;
  /** 大小改變回調 */
  onFontSizeChange: (size: number) => void;
  /** 強調色（primary 或 accent） */
  accentColor?: 'primary' | 'accent';
}

export const FontSizeSlider: React.FC<FontSizeSliderProps> = ({
  fontSize,
  onFontSizeChange,
  accentColor = 'primary',
}) => {
  const accentClass = accentColor === 'accent' ? 'accent-accent' : 'accent-primary';
  const colorClass = accentColor === 'accent' ? 'text-accent' : 'text-primary';

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <label htmlFor="font-size-input" className="mb-1 text-sm font-medium text-stone-600">
          字體大小
        </label>
        <span className={`font-mono text-sm font-bold ${colorClass}`}>{fontSize}px</span>
      </div>
      <input
        id="font-size-input"
        type="range"
        min="12"
        max="150"
        value={fontSize}
        onChange={(e) => onFontSizeChange(Number(e.target.value))}
        className={`h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 ${accentClass}`}
      />
    </div>
  );
};
