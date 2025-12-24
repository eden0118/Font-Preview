import { useState, useCallback } from 'react';
import { analyzeFontFile, loadFontFace } from '@/lib/fontHelper';
import { FontDefinition } from '@/lib/types';

interface ComparisonSlot {
  id: string;
  font: FontDefinition | null;
}

export const useFontComparison = (initialSlots: ComparisonSlot[] = []) => {
  const [comparisonSlots, setComparisonSlots] = useState<ComparisonSlot[]>(
    initialSlots.length > 0
      ? initialSlots
      : [
          { id: '1', font: null },
          { id: '2', font: null },
        ]
  );
  const [analysingId, setAnalysingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const processFont = useCallback(async (file: File) => {
    setAnalysingId('main');
    setUploadError(null);

    try {
      const fontDef = await analyzeFontFile(file);
      const buffer = await file.arrayBuffer();
      await loadFontFace(fontDef.family, buffer);

      setComparisonSlots((prev) => {
        const emptySlot = prev.find((item) => item.font === null);
        if (emptySlot) {
          return prev.map((item) => (item.id === emptySlot.id ? { ...item, font: fontDef } : item));
        }
        return prev;
      });
    } catch (err) {
      console.error(err);
      setUploadError('Failed to parse font file. Please try another TTF/OTF/WOFF file.');
    } finally {
      setAnalysingId(null);
    }
  }, []);

  const removeFont = useCallback((slotId: string) => {
    setComparisonSlots((prev) =>
      prev.map((item) => (item.id === slotId ? { ...item, font: null } : item))
    );
  }, []);

  const clearAll = useCallback(() => {
    setComparisonSlots((prev) => prev.map((item) => ({ ...item, font: null })));
  }, []);

  return {
    comparisonSlots,
    analysingId,
    uploadError,
    processFont,
    removeFont,
    clearAll,
  };
};
