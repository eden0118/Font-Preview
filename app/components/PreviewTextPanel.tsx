/**
 * PreviewTextPanel 元件 - 預覽文字與設定面板
 *
 * 功能：
 * - 文字輸入區域
 * - 語言切換（繁體中文 / 英文）
 * - 預設預覽文本快速選擇
 * - 預覽設定控制（字體大小、顏色、背景）
 * - 實時缺字檢測與顯示
 *
 * 架構：
 * - 上層：語言和預設文本選擇
 * - 中層：文字輸入框
 * - 下層：PreviewSetting 元件
 */

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
  // ★ 新增：缺字檢測相關屬性
  missingCharsInPreview?: string; // 預覽文本中的缺字
  hasGlyphFunc?: (char: string) => boolean; // 檢查字元是否存在的函數
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
  missingCharsInPreview,
  hasGlyphFunc,
}) => {
  // ★ 新增：實時檢查預覽文本中的缺字
  const [missingChars, setMissingChars] = React.useState<string>('');

  React.useEffect(() => {
    if (!hasGlyphFunc) {
      setMissingChars('');
      return;
    }

    // 檢查預覽文本中每個字元是否能顯示
    const charsInText = new Set(inputText);
    const missing: string[] = [];

    for (const char of charsInText) {
      // 跳過空白字符
      if (/\s/.test(char)) continue;
      if (!hasGlyphFunc(char)) {
        missing.push(char);
      }
    }

    setMissingChars(missing.join(''));
  }, [inputText, hasGlyphFunc]);
  return (
    <div className="card space-y-4 p-4 shadow-sm sm:p-6 lg:col-span-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-bold text-stone-800 sm:text-lg">預覽文字與設定</h3>
        <div className="flex gap-3 sm:gap-5">
          <div className="flex gap-3">
            <button
              onClick={() => onLanguageChange('cn')}
              className={`ghost-btn ${language === 'cn' ? 'border-b font-bold text-primary' : ''}`}
            >
              中文
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`ghost-btn ${language === 'en' ? 'border-b font-bold text-primary' : ''}`}
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
        className="mb-4 min-h-24 w-full resize-none rounded-xl border border-stone-200 bg-stone-50 p-4 text-stone-700 outline-none transition-all placeholder:text-stone-400 focus:border-transparent focus:ring-2 focus:ring-primary"
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
