/**
 * useFontFileProcessing Hook - 共享的字型檔案處理邏輯
 *
 * 目的：
 * - 統一 useFontAnalysis 和 useFontComparison 的字型處理流程
 * - 減少代碼重複
 * - 集中管理字型資源的生命週期
 *
 * 功能：
 * - 分析字型檔案
 * - 動態加載字型至瀏覽器
 * - 清理字型資源
 */

import { useCallback } from 'react';
import { analyzeFontFile, loadFontFace, removeFontFace } from '@/lib/fontHelper';
import { FontDefinition } from '@/lib/types';

export const useFontFileProcessing = () => {
  /**
   * 處理並加載字型檔案
   * @param file - 上傳的字型檔案
   * @returns 分析後的字型定義
   */
  const processAndLoadFont = useCallback(async (file: File): Promise<FontDefinition> => {
    // 1. 分析字型檔案
    const fontDef = await analyzeFontFile(file);

    // 2. 讀取檔案 buffer
    const buffer = await file.arrayBuffer();

    // 3. 動態加載到瀏覽器
    await loadFontFace(fontDef.family, buffer);

    return fontDef;
  }, []);

  /**
   * 清理字型資源
   * @param font - 要清理的字型定義
   */
  const cleanupFont = useCallback((font: FontDefinition | null) => {
    if (font) {
      removeFontFace(font.family);
    }
  }, []);

  /**
   * 批量清理多個字型資源
   * @param fonts - 字型陣列
   */
  const cleanupFonts = useCallback(
    (fonts: (FontDefinition | null)[]) => {
      fonts.forEach((font) => {
        cleanupFont(font);
      });
    },
    [cleanupFont]
  );

  return {
    processAndLoadFont,
    cleanupFont,
    cleanupFonts,
  };
};
