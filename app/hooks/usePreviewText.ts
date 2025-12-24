/**
 * usePreviewText Hook - 預覽文字初始化
 *
 * 功能：
 * - 監聽字型載入狀態
 * - 自動初始化預覽文字
 * - 避免預覽區域為空的情況
 *
 * 使用場景：
 * - 當使用者上傳字型後，自動填入預設文字
 * - 支援單一字型和多字型模式
 *
 * 依賴：
 * - usePreviewSettings 提供預設文字庫
 */

import { useEffect } from 'react';
import { FontDefinition } from '@/lib/types';
import { usePreviewSettings } from './usePreviewSettings';

/**
 * Hook 用於管理預覽文字初始化
 * 當有字體被選擇但預覽文字為空時，自動設置默認文本
 */
export const usePreviewText = (
  fonts: FontDefinition | FontDefinition[] | null,
  inputText: string,
  setInputText: (text: string) => void
): void => {
  const { DEFAULT_SAMPLE_TEXT } = usePreviewSettings();

  useEffect(() => {
    // 判斷是否有字體
    const hasFonts = Array.isArray(fonts) ? fonts.some((f) => f !== null) : fonts !== null;

    // 如果有字體但預覽文字為空，設置默認文本
    if (hasFonts && !inputText) {
      setInputText(DEFAULT_SAMPLE_TEXT);
    }
  }, [fonts, inputText, setInputText, DEFAULT_SAMPLE_TEXT]);
};
