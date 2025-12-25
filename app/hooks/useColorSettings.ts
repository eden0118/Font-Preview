/**
 * useColorSettings Hook - 顏色和字體大小管理
 *
 * 職責：只管理視覺相關的設定（顏色、字體大小）
 */

import { useState, useCallback } from 'react';

interface ColorSettings {
  fontColor: string;
  bgColor: string;
  fontSize: number;
}

const DEFAULT_COLORS: ColorSettings = {
  fontColor: '#292524',
  bgColor: '#FFFFFF',
  fontSize: 28,
};

export const useColorSettings = () => {
  const [colors, setColors] = useState<ColorSettings>(DEFAULT_COLORS);

  const updateFontColor = useCallback((color: string) => {
    setColors((prev) => ({ ...prev, fontColor: color }));
  }, []);

  const updateBgColor = useCallback((color: string) => {
    setColors((prev) => ({ ...prev, bgColor: color }));
  }, []);

  const updateFontSize = useCallback((size: number) => {
    setColors((prev) => ({ ...prev, fontSize: Math.min(Math.max(size, 12), 150) }));
  }, []);

  const resetColors = useCallback(() => {
    setColors(DEFAULT_COLORS);
  }, []);

  return {
    fontColor: colors.fontColor,
    bgColor: colors.bgColor,
    fontSize: colors.fontSize,
    updateFontColor,
    updateBgColor,
    updateFontSize,
    resetColors,
  };
};
