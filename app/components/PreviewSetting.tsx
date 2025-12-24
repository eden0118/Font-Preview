import React from 'react';

interface PreviewSettingProps {
  fontSize: number;
  fontColor: string;
  bgColor: string;
  onFontSizeChange: (size: number) => void;
  onFontColorChange: (color: string) => void;
  onBgColorChange: (color: string) => void;
  onReset: () => void;
  accentColor?: 'blue' | 'amber';
}

export const PreviewSetting: React.FC<PreviewSettingProps> = ({
  fontSize,
  fontColor,
  bgColor,
  onFontSizeChange,
  onFontColorChange,
  onBgColorChange,
  onReset,
  accentColor = 'blue',
}) => {
  const accentClass = accentColor === 'amber' ? 'accent-amber-600' : 'accent-blue-600';
  const colorClass = accentColor === 'amber' ? 'text-amber-600' : 'text-blue-600';

  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-bold text-stone-800">預覽設定</h3>

      <div className="space-y-6">
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

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-600">字體顏色</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={fontColor}
              onChange={(e) => onFontColorChange(e.target.value)}
              className="h-10 w-10 cursor-pointer overflow-hidden rounded-lg border-0 p-0 shadow-sm"
            />
            <div className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 font-mono text-sm text-stone-600 uppercase">
              {fontColor}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-600">背景顏色</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => onBgColorChange(e.target.value)}
              className="h-10 w-10 cursor-pointer overflow-hidden rounded-lg border-0 p-0 shadow-sm"
            />
            <div className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 font-mono text-sm text-stone-600 uppercase">
              {bgColor}
            </div>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-stone-100 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200"
        >
          重置設定
        </button>
      </div>
    </div>
  );
};
