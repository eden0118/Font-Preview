import { useState, useCallback } from 'react';

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

export const usePreviewSettings = () => {
  const [settings, setSettings] = useState<PreviewSettings>(DEFAULT_SETTINGS);
  const [inputText, setInputText] = useState<string>('');

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

  return {
    settings,
    inputText,
    updateFontColor,
    updateBgColor,
    updateFontSize,
    resetSettings,
    clearText,
    setInputText,
  };
};
