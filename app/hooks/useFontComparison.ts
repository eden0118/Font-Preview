/**
 * useFontComparison Hook - 多字型並排比較邏輯
 *
 * 功能：
 * - 管理最多 3 個字型的比較插槽
 * - 逐個分析上傳的字型
 * - 動態載入多個字型至瀏覽器
 * - 支援字型移除和替換
 *
 * 狀態：
 * - comparisonSlots: 3 個比較插槽的字型陣列
 * - analysingId: 目前正在分析的插槽 ID
 * - uploadError: 分析錯誤訊息
 *
 * 使用場景：
 * - 比較頁面需要並排展示多個字型
 * - 快速判斷哪個字型最適合繁體中文
 */

import { useState, useCallback } from 'react';
import { analyzeFontFile, loadFontFace, removeFontFace } from '@/lib/fontHelper';
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
          { id: '3', font: null },
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
      const errorMessage =
        err instanceof Error ? err.message : '字型檔案解析失敗。請嘗試其他 TTF/OTF/WOFF 檔案。';
      setUploadError(errorMessage);
    } finally {
      setAnalysingId(null);
    }
  }, []);

  const removeFont = useCallback((slotId: string) => {
    setComparisonSlots((prev) => {
      const fontToRemove = prev.find((item) => item.id === slotId)?.font;
      // 清理字體資源
      if (fontToRemove) {
        removeFontFace(fontToRemove.family);
      }
      return prev.map((item) => (item.id === slotId ? { ...item, font: null } : item));
    });
  }, []);

  const clearAll = useCallback(() => {
    // 清理所有字體資源
    setComparisonSlots((prev) => {
      prev.forEach((slot) => {
        if (slot.font) {
          removeFontFace(slot.font.family);
        }
      });
      return prev.map((item) => ({ ...item, font: null }));
    });
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
