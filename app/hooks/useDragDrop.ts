import { useState, useCallback } from 'react';

const VALID_TYPES = [
  'font/ttf',
  'font/otf',
  'font/woff',
  'font/woff2',
  'application/font-ttf',
  'application/font-otf',
  'application/font-woff',
];

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

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
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
