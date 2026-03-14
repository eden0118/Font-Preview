/**
 * PreviewColorPicker 元件 - 色彩選擇器
 *
 * 職責：統一管理字體色彩與背景色彩的選擇UI
 * 機制：提供color input並顯示十六進制值
 */

import React from 'react';

interface PreviewColorPickerProps {
  /** 字體顏色 */
  fontColor: string;
  /** 背景顏色 */
  bgColor: string;
  /** 字體顏色改變回調 */
  onFontColorChange: (color: string) => void;
  /** 背景顏色改變回調 */
  onBgColorChange: (color: string) => void;
}

export const PreviewColorPicker: React.FC<PreviewColorPickerProps> = ({
  fontColor,
  bgColor,
  onFontColorChange,
  onBgColorChange,
}) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
      {/* Font Color */}
      <div className="flex-1 sm:flex-none">
        <label htmlFor="font-color-input" className="mb-1 block text-sm font-medium text-stone-600">
          字體顏色
        </label>
        <div className="flex items-center gap-2">
          <input
            id="font-color-input"
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
        <label htmlFor="bg-color-input" className="mb-1 block text-sm font-medium text-stone-600">
          背景顏色
        </label>
        <div className="flex items-center gap-2">
          <input
            id="bg-color-input"
            type="color"
            value={bgColor}
            onChange={(e) => onBgColorChange(e.target.value)}
            className="h-8 w-8 cursor-pointer overflow-hidden p-0"
          />
          <div className="text-infoText font-mono text-xs uppercase">{bgColor}</div>
        </div>
      </div>
    </div>
  );
};
