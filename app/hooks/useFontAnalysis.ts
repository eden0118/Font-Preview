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
import { useFontFileProcessing } from './useFontFileProcessing';
import { useFontCache } from './useFontCache';
import { trackEvent, trackPerformance, trackError } from '@/lib/analytics';
import { FontDefinition } from '@/lib/types';

export const useFontAnalysis = () => {
  const [currentFont, setCurrentFont] = useState<FontDefinition | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { processAndLoadFont, cleanupFont } = useFontFileProcessing();
  const { getCachedFont, setFontCache } = useFontCache({ maxSize: 20 });

  const processFont = useCallback(
    async (file: File) => {
      setIsAnalyzing(true);
      setUploadError(null);

      const startTime = performance.now();
      trackEvent('font_uploaded', { fileName: file.name, fileSize: file.size });

      try {
        // 先清理舊字體
        setCurrentFont((prevFont) => {
          cleanupFont(prevFont);
          return null;
        });

        // 1️⃣ 檢查快取（性能優化）
        const cachedFont = getCachedFont(file);
        if (cachedFont) {
          console.log('✅ 從快取載入字型:', cachedFont.name);
          trackEvent('cache_hit', { fontName: cachedFont.name });
          setCurrentFont(cachedFont);
          return;
        }

        trackEvent('cache_miss', { fileName: file.name });

        // 2️⃣ 使用共享 Hook 處理字型
        const fontDef = await processAndLoadFont(file);

        // 3️⃣ 將結果存入快取
        setFontCache(file, fontDef);

        // 4️⃣ 記錄分析完成事件
        const duration = performance.now() - startTime;
        trackPerformance('font_analysis', duration, {
          fontName: fontDef.name,
          glyphCount: fontDef.glyphCount,
        });
        trackEvent('font_analyzed', {
          fontName: fontDef.name,
          glyphCount: fontDef.glyphCount,
          tcScore: fontDef.coverage?.tc,
        });

        setCurrentFont(fontDef);
      } catch (err) {
        console.error(err);
        const errorMessage =
          err instanceof Error ? err.message : '字型檔案解析失敗。請嘗試其他 TTF/OTF/WOFF 檔案。';

        // 記錄錯誤事件
        trackError(
          'font_analysis_error',
          errorMessage,
          err instanceof Error ? err.stack : undefined
        );
        trackEvent('error_occurred', { errorType: 'font_analysis', message: errorMessage });

        setUploadError(errorMessage);
        setCurrentFont(null);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [processAndLoadFont, cleanupFont, getCachedFont, setFontCache]
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
