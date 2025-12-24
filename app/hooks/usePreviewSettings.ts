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

// 預設預覽文字
const DEFAULT_SAMPLE_TEXT =
  '信念、想法、思想很強的人，即使心情很糟、內心受傷，也還是會朝著目的奔跑。';

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

  return {
    settings,
    inputText,
    updateFontColor,
    updateBgColor,
    updateFontSize,
    resetSettings,
    clearText,
    setInputText,
    DEFAULT_SAMPLE_TEXT,
  };
};
