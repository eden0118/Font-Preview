import React from 'react';
import { PreviewSetting } from './PreviewSetting';
import { PreviewLanguage } from '@/lib/previewTexts';

interface PreviewTextPanelProps {
  inputText: string;
  onInputChange: (text: string) => void;
  language: PreviewLanguage;
  onLanguageChange: (language: PreviewLanguage) => void;
  fontSize: number;
  fontColor: string;
  bgColor: string;
  onFontSizeChange: (size: number) => void;
  onFontColorChange: (color: string) => void;
  onBgColorChange: (color: string) => void;
  onReset: () => void;
  onResetDefault: () => void;
  children?: React.ReactNode;
}

export const PreviewTextPanel: React.FC<PreviewTextPanelProps> = ({
  inputText,
  onInputChange,
  language,
  onLanguageChange,
  fontSize,
  fontColor,
  bgColor,
  onFontSizeChange,
  onFontColorChange,
  onBgColorChange,
  onReset,
  onResetDefault,
  children,
}) => {
  return (
    <div className="card space-y-4 p-6 shadow-sm lg:col-span-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-stone-800">預覽文字與設定</h3>
        <div className="flex gap-5">
          <div className="flex gap-3">
            <button
              onClick={() => onLanguageChange('cn')}
              className={`ghost-btn ${language === 'cn' ? 'text-primary border-b font-bold' : ''}`}
            >
              中文
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`ghost-btn ${language === 'en' ? 'text-primary border-b font-bold' : ''}`}
            >
              English
            </button>
          </div>
          <button onClick={onResetDefault} className="small-btn secondary-btn">
            使用預設
          </button>
        </div>
      </div>

      <textarea
        value={inputText}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="輸入預覽文字..."
        className="focus:ring-primary mb-4 min-h-24 w-full resize-none rounded-xl border border-stone-200 bg-stone-50 p-4 text-stone-700 transition-all outline-none placeholder:text-stone-400 focus:border-transparent focus:ring-2"
      />

      {children}

      {/* Settings Row */}
      <div className="border-y border-stone-100 py-4">
        <PreviewSetting
          fontSize={fontSize}
          fontColor={fontColor}
          bgColor={bgColor}
          onFontSizeChange={onFontSizeChange}
          onFontColorChange={onFontColorChange}
          onBgColorChange={onBgColorChange}
          onReset={onReset}
          accentColor="primary"
        />
      </div>
    </div>
  );
};
