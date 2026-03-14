/**
 * PreviewSetting 元件 - 預覽設定控制器（主容器）
 *
 * 職責：組織預覽設定UI
 * - 字體大小調整（委派給 FontSizeSlider）
 * - 字體顏色選擇（委派給 PreviewColorPicker）
 * - 背景色選擇（委派給 PreviewColorPicker）
 * - 設定重置按鈕
 *
 * 設計特色：
 * - 實時更新預覽效果
 * - 支援兩種配色主題（primary/accent）
 * - 響應式佈局
 */

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { FontSizeSlider } from './controls/FontSizeSlider';
import { PreviewColorPicker } from './controls/PreviewColorPicker';

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
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:gap-6 lg:gap-10">
      {/* 字體大小滑塊 */}
      <FontSizeSlider
        fontSize={fontSize}
        onFontSizeChange={onFontSizeChange}
        accentColor={accentColor}
      />

      {/* 色彩選擇器 */}
      <PreviewColorPicker
        fontColor={fontColor}
        bgColor={bgColor}
        onFontColorChange={onFontColorChange}
        onBgColorChange={onBgColorChange}
      />

      {/* 重置按鈕 */}
      <div className="flex w-full items-end justify-end sm:w-auto">
        <button onClick={onReset} className="small-btn secondary-btn">
          <RotateCcw size={12} />
          重置設定
        </button>
      </div>
    </div>
  );
};
