import { useEffect } from 'react';
import { FontDefinition } from '@/lib/types';
import { SAMPLE_TEXTS } from '@/lib/constants';

/**
 * Hook 用於管理預覽文字初始化
 * 當有字體被選擇但預覽文字為空時，自動設置默認文本
 */
export const usePreviewText = (
  fonts: FontDefinition | FontDefinition[] | null,
  inputText: string,
  setInputText: (text: string) => void
): void => {
  useEffect(() => {
    // 判斷是否有字體
    const hasFonts = Array.isArray(fonts) ? fonts.some((f) => f !== null) : fonts !== null;

    // 如果有字體但預覽文字為空，設置默認文本
    if (hasFonts && !inputText) {
      setInputText(SAMPLE_TEXTS.tc);
    }
  }, [fonts, inputText, setInputText]);
};
