/**
 * useFontAnalysis Hook - 單一字型分析邏輯
 *
 * 功能：
 * - 管理上傳的字型狀態
 * - 執行字型檔案分析
 * - 動態載入字型至瀏覽器
 * - 錯誤處理與清理
 *
 * 狀態：
 * - currentFont: 目前分析的字型定義
 * - isAnalyzing: 是否正在分析
 * - uploadError: 上傳或分析的錯誤訊息
 *
 * 方法：
 * - processFont: 接收 File，執行分析並載入
 * - clearFont: 清除目前字型並釋放資源
 */

import { useState, useCallback } from 'react';
import { analyzeFontFile, loadFontFace, removeFontFace } from '@/lib/fontHelper';
import { FontDefinition } from '@/lib/types';

export const useFontAnalysis = () => {
  const [currentFont, setCurrentFont] = useState<FontDefinition | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 清理舊字體的輔助函數
  const cleanupFont = useCallback((font: FontDefinition | null) => {
    if (font) {
      removeFontFace(font.family);
    }
  }, []);

  const processFont = useCallback(
    async (file: File) => {
      setIsAnalyzing(true);
      setUploadError(null);

      try {
        // 先清理舊字體
        setCurrentFont((prevFont) => {
          cleanupFont(prevFont);
          return null;
        });

        const fontDef = await analyzeFontFile(file);
        const buffer = await file.arrayBuffer();
        await loadFontFace(fontDef.family, buffer);
        setCurrentFont(fontDef);
      } catch (err) {
        console.error(err);
        const errorMessage =
          err instanceof Error ? err.message : '字型檔案解析失敗。請嘗試其他 TTF/OTF/WOFF 檔案。';
        setUploadError(errorMessage);
        setCurrentFont(null);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [cleanupFont]
  );

  const clearFont = useCallback(() => {
    setCurrentFont((prevFont) => {
      cleanupFont(prevFont);
      return null;
    });
    setUploadError(null);
  }, [cleanupFont]);

  return {
    currentFont,
    isAnalyzing,
    uploadError,
    processFont,
    clearFont,
  };
};
