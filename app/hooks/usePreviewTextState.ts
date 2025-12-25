/**
 * usePreviewTextState Hook - 純預覽文字管理
 *
 * 職責：只管理預覽文字相關狀態
 */

import { useState, useCallback, useEffect } from 'react';
import { getRandomPreviewText, PREVIEW_TEXTS_CN, PreviewLanguage } from '../lib/previewTexts';

const INITIAL_SAMPLE_TEXT = PREVIEW_TEXTS_CN[0];

export const usePreviewTextState = () => {
  const [text, setText] = useState<string>(INITIAL_SAMPLE_TEXT);
  const [language, setLanguage] = useState<PreviewLanguage>('cn');

  // 在客戶端掛載時隨機選擇文字
  useEffect(() => {
    setText(getRandomPreviewText('cn'));
  }, []);

  const updateText = useCallback((newText: string) => {
    setText(newText);
  }, []);

  const switchLanguage = useCallback((lang: PreviewLanguage) => {
    setLanguage(lang);
    setText(getRandomPreviewText(lang));
  }, []);

  const resetToDefault = useCallback(() => {
    setText(getRandomPreviewText('cn'));
    setLanguage('cn');
  }, []);

  return {
    text,
    language,
    updateText,
    switchLanguage,
    resetToDefault,
    DEFAULT_SAMPLE_TEXT: INITIAL_SAMPLE_TEXT,
  };
};
