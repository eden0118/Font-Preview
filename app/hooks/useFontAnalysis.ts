import { useState, useCallback } from 'react';
import { analyzeFontFile, loadFontFace } from '@/lib/fontHelper';
import { FontDefinition } from '@/lib/types';
import { SAMPLE_TEXTS } from '@/lib/constants';

export const useFontAnalysis = () => {
  const [currentFont, setCurrentFont] = useState<FontDefinition | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const processFont = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setUploadError(null);
    setCurrentFont(null);

    try {
      const fontDef = await analyzeFontFile(file);
      const buffer = await file.arrayBuffer();
      await loadFontFace(fontDef.family, buffer);
      setCurrentFont(fontDef);
    } catch (err) {
      console.error(err);
      setUploadError('Failed to parse font file. Please try another TTF/OTF/WOFF file.');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearFont = useCallback(() => {
    setCurrentFont(null);
    setUploadError(null);
  }, []);

  return {
    currentFont,
    isAnalyzing,
    uploadError,
    processFont,
    clearFont,
  };
};
