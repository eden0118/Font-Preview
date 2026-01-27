/**
 * useDragDrop Hook - 拖放上傳功能
 *
 * 功能：
 * - 處理拖放事件偵測
 * - 驗證檔案類型（TTF/OTF/WOFF/WOFF2）
 * - 視覺回饋（拖放時的樣式變化）
 *
 * 驗證方式：
 * - 檢查 MIME 類型
 * - 檢查檔案副檔名
 * - 同時支援兩種驗證以相容各種瀏覽器
 */

import { useState, useCallback } from 'react';

/**
 * 支援的 MIME 類型清單
 * 不同瀏覽器可能回報不同的 MIME 類型
 */
const VALID_TYPES = [
  'font/ttf',
  'font/otf',
  'font/woff',
  'font/woff2',
  'application/font-ttf',
  'application/font-otf',
  'application/font-woff',
];

/**
 * 支援的檔案副檔名清單
 */
const VALID_EXTENSIONS = ['.ttf', '.otf', '.woff', '.woff2'];

export const useDragDrop = () => {
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  const validateFile = useCallback((file: File): boolean => {
    const fileName = file.name.toLowerCase();
    const isValidType =
      VALID_TYPES.includes(file.type) || VALID_EXTENSIONS.some((ext) => fileName.endsWith(ext));
    return isValidType;
  }, []);

  const handleDragEnter = useCallback(() => {
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return {
    isDragActive,
    validateFile,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    setIsDragActive,
  };
};
