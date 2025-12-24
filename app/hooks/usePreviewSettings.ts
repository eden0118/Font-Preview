import { useState, useCallback } from 'react';
import { getRandomPreviewText, PREVIEW_TEXTS } from '../lib/factWords';

interface PreviewSettings {
  fontColor: string;
  bgColor: string;
  fontSize: number;
}

const DEFAULT_SETTINGS: PreviewSettings = {
  fontColor: '#292524',
  bgColor: '#FFFFFF',
  fontSize: 32,
};

// 預設預覽文字 - 隨機選擇
const DEFAULT_SAMPLE_TEXT = getRandomPreviewText();

export const usePreviewSettings = () => {
  const [settings, setSettings] = useState<PreviewSettings>(DEFAULT_SETTINGS);
  const [inputText, setInputText] = useState<string>(DEFAULT_SAMPLE_TEXT);

  const updateFontColor = useCallback((color: string) => {
    setSettings((prev) => ({ ...prev, fontColor: color }));
  }, []);

  const updateBgColor = useCallback((color: string) => {
    setSettings((prev) => ({ ...prev, bgColor: color }));
  }, []);

  const updateFontSize = useCallback((size: number) => {
    setSettings((prev) => ({ ...prev, fontSize: size }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const clearText = useCallback(() => {
    setInputText('');
  }, []);

  const resetToDefault = useCallback(() => {
    setInputText(DEFAULT_SAMPLE_TEXT);
  }, []);

  return {
    settings,
    inputText,
    updateFontColor,
    updateBgColor,
    updateFontSize,
    resetSettings,
    clearText,
    resetToDefault,
    setInputText,
    DEFAULT_SAMPLE_TEXT,
  };
};
