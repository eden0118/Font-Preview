import { useState, useCallback } from 'react';
import { analyzeFontFile, loadFontFace, removeFontFace } from '@/lib/fontHelper';
import { FontDefinition } from '@/lib/types';

export const useFontAnalysis = () => {
  const [currentFont, setCurrentFont] = useState<FontDefinition | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const processFont = useCallback(
    async (file: File) => {
      setIsAnalyzing(true);
      setUploadError(null);

      // 清理舊字體以防止內存洩漏
      if (currentFont) {
        removeFontFace(currentFont.family);
      }
      setCurrentFont(null);

      try {
        const fontDef = await analyzeFontFile(file);
        const buffer = await file.arrayBuffer();
        await loadFontFace(fontDef.family, buffer);
        setCurrentFont(fontDef);
      } catch (err) {
        console.error(err);
        const errorMessage =
          err instanceof Error ? err.message : '字型檔案解析失敗。請嘗試其他 TTF/OTF/WOFF 檔案。';
        setUploadError(errorMessage);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [currentFont]
  );

  const clearFont = useCallback(() => {
    // 清理字體資源
    if (currentFont) {
      removeFontFace(currentFont.family);
    }
    setCurrentFont(null);
    setUploadError(null);
  }, [currentFont]);

  return {
    currentFont,
    isAnalyzing,
    uploadError,
    processFont,
    clearFont,
  };
};
