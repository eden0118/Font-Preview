import { useState, useCallback, useEffect } from 'react';
import { getRandomPreviewText, PREVIEW_TEXTS_CN, PreviewLanguage } from '../lib/previewTexts';

interface PreviewSettings {
  fontColor: string;
  bgColor: string;
  fontSize: number;
  language: PreviewLanguage;
}

const DEFAULT_SETTINGS: PreviewSettings = {
  fontColor: '#292524',
  bgColor: '#FFFFFF',
  fontSize: 32,
  language: 'cn',
};

// 預設預覽文字 - 使用第一篇中文作為伺服器端預設值，避免 hydration mismatch
const INITIAL_SAMPLE_TEXT = PREVIEW_TEXTS_CN[0];

export const usePreviewSettings = () => {
  const [settings, setSettings] = useState<PreviewSettings>(DEFAULT_SETTINGS);
  const [inputText, setInputText] = useState<string>(INITIAL_SAMPLE_TEXT);

  // 在客戶端掛載時隨機選擇文字，避免 SSR/hydration 不匹配
  useEffect(() => {
    setInputText(getRandomPreviewText(DEFAULT_SETTINGS.language));
  }, []);

  const updateFontColor = useCallback((color: string) => {
    setSettings((prev) => ({ ...prev, fontColor: color }));
  }, []);

  const updateBgColor = useCallback((color: string) => {
    setSettings((prev) => ({ ...prev, bgColor: color }));
  }, []);

  const updateFontSize = useCallback((size: number) => {
    setSettings((prev) => ({ ...prev, fontSize: size }));
  }, []);

  const updateLanguage = useCallback((language: PreviewLanguage) => {
    setSettings((prev) => ({ ...prev, language }));
    // 更改語言時隨機選擇該語言的文字
    setInputText(getRandomPreviewText(language));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const clearText = useCallback(() => {
    setInputText('');
  }, []);

  const resetToDefault = useCallback(() => {
    setInputText(getRandomPreviewText(settings.language));
  }, [settings.language]);

  return {
    settings,
    inputText,
    updateFontColor,
    updateBgColor,
    updateFontSize,
    updateLanguage,
    resetSettings,
    clearText,
    resetToDefault,
    setInputText,
    DEFAULT_SAMPLE_TEXT: INITIAL_SAMPLE_TEXT,
  };
};
