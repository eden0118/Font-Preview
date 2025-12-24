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
  layout?: 'vertical' | 'horizontal';
  showLabels?: boolean;
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
  layout = 'vertical',
  showLabels = true,
}) => {
  const accentClass = accentColor === 'accent' ? 'accent-accent' : 'accent-primary';
  const colorClass = accentColor === 'accent' ? 'text-accent' : 'text-primary';
  const gridClass = layout === 'horizontal' ? 'grid-cols-3' : 'grid-cols-1';

  return (
    <div
      className={
        layout === 'vertical' ? 'rounded-2xl border border-stone-100 bg-white p-6 shadow-sm' : ''
      }
    >
      {layout === 'vertical' && <h3 className="mb-6 text-lg font-bold text-stone-800">預覽設定</h3>}

      <div className={`grid ${gridClass} gap-4 md:gap-6`}>
        {/* Font Size */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-stone-600">
              {layout === 'horizontal' ? '字體大小' : '字體大小'}
            </label>
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
          {showLabels && (
            <label className="mb-2 block text-sm font-medium text-stone-600">字體顏色</label>
          )}
          <div
            className={
              layout === 'horizontal' ? 'flex items-center gap-2' : 'flex items-center gap-3'
            }
          >
            <input
              type="color"
              value={fontColor}
              onChange={(e) => onFontColorChange(e.target.value)}
              className={`h-10 w-10 cursor-pointer overflow-hidden rounded-lg border-0 p-0 shadow-sm ${layout === 'horizontal' ? 'h-8 w-8 rounded' : ''}`}
            />
            {showLabels && layout === 'vertical' && (
              <div className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 font-mono text-sm text-stone-600 uppercase">
                {fontColor}
              </div>
            )}
          </div>
        </div>

        {/* Background Color */}
        <div>
          {showLabels && (
            <label className="mb-2 block text-sm font-medium text-stone-600">背景顏色</label>
          )}
          <div
            className={
              layout === 'horizontal' ? 'flex items-center gap-2' : 'flex items-center gap-3'
            }
          >
            <input
              type="color"
              value={bgColor}
              onChange={(e) => onBgColorChange(e.target.value)}
              className={`h-10 w-10 cursor-pointer overflow-hidden rounded-lg border-0 p-0 shadow-sm ${layout === 'horizontal' ? 'h-8 w-8 rounded' : ''}`}
            />
            {showLabels && layout === 'vertical' && (
              <div className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 font-mono text-sm text-stone-600 uppercase">
                {bgColor}
              </div>
            )}
          </div>
        </div>
      </div>

      {layout === 'vertical' && (
        <button
          onClick={onReset}
          className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-stone-100 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200"
        >
          <RotateCcw size={16} />
          重置設定
        </button>
      )}

      {layout === 'horizontal' && (
        <div className="mt-6 flex gap-2 border-t border-stone-100 pt-6">
          <button
            onClick={onReset}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-stone-100 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200"
          >
            <RotateCcw size={16} />
            重置設定
          </button>
        </div>
      )}
    </div>
  );
};
