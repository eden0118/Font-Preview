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
