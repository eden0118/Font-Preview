import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { analyzeFontFile, loadFontFace } from './utils/fontHelper';
import { FontDefinition, ComparisonMode, ComparisonFont } from './types';
import { SAMPLE_TEXTS } from './constants';

import {
  Footer,
  FontAnalysisResult,
  FontPreview,
  UploadSection,
  TextInput,
  PreviewSetting,
  ComparisonPreview,
  ComparisonUploadPanel,
} from './components';

const App: React.FC = () => {
  // UI State
  const [fontColor, setFontColor] = useState<string>('#292524');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [fontSize, setFontSize] = useState<number>(32);
  const [inputText, setInputText] = useState<string>(SAMPLE_TEXTS.tc);
  const [mode, setMode] = useState<ComparisonMode>('single');

  // Single Mode State
  const [currentFont, setCurrentFont] = useState<FontDefinition | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  // Comparison Mode State
  const [comparisonFonts, setComparisonFonts] = useState<ComparisonFont[]>([
    { id: '1', font: null },
    { id: '2', font: null },
    { id: '3', font: null },
  ]);
  const [analysingId, setAnalysingId] = useState<string | null>(null);
  const [dragActiveId, setDragActiveId] = useState<string | null>(null);

  const handleReset = () => {
    setFontColor('#292524');
    setBgColor('#FFFFFF');
    setFontSize(32);
  };

  const handleClearText = () => {
    setInputText('');
  };

  // Single Mode Functions
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFont(file);
  };

  const processFont = async (file: File) => {
    setIsAnalyzing(true);
    setUploadError(null);
    setCurrentFont(null);

    try {
      const fontDef = await analyzeFontFile(file);
      const buffer = await file.arrayBuffer();
      await loadFontFace(fontDef.family, buffer);
      setCurrentFont(fontDef);

      // 使用預設的繁體中文樣本文本
      setInputText(SAMPLE_TEXTS.tc);
    } catch (err) {
      console.error(err);
      setUploadError('Failed to parse font file. Please try another TTF/OTF/WOFF file.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Comparison Mode Functions
  const processFontForComparison = async (file: File, slotId: string) => {
    setAnalysingId(slotId);

    try {
      const fontDef = await analyzeFontFile(file);
      const buffer = await file.arrayBuffer();
      await loadFontFace(fontDef.family, buffer);

      if (slotId === 'new') {
        // Add new font if there's space
        const uploadedCount = comparisonFonts.filter((f) => f.font !== null).length;
        if (uploadedCount < 3) {
          setComparisonFonts((prev) => {
            const emptySlot = prev.find((f) => f.font === null);
            if (emptySlot) {
              return prev.map((item) =>
                item.id === emptySlot.id ? { ...item, font: fontDef } : item
              );
            }
            return prev;
          });
        }
      } else {
        setComparisonFonts((prev) =>
          prev.map((item) => (item.id === slotId ? { ...item, font: fontDef } : item))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalysingId(null);
    }
  };

  const handleComparisonFileUpload =
    (slotId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      processFontForComparison(file, slotId);
    };

  const handleComparisonDrag = (slotId: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActiveId(slotId);
    } else if (e.type === 'dragleave') {
      setDragActiveId(null);
    }
  };

  const handleComparisonDrop = (slotId: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveId(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const validTypes = [
        'font/ttf',
        'font/otf',
        'font/woff',
        'font/woff2',
        'application/font-ttf',
        'application/font-otf',
        'application/font-woff',
      ];
      const validExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
      const fileName = file.name.toLowerCase();
      const isValidType =
        validTypes.includes(file.type) || validExtensions.some((ext) => fileName.endsWith(ext));

      if (isValidType) {
        processFontForComparison(file, slotId);
      }
    }
  };

  const handleRemoveComparisonFont = (slotId: string) => {
    setComparisonFonts((prev) =>
      prev.map((item) => (item.id === slotId ? { ...item, font: null } : item))
    );
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // 驗證檔案類型
      const validTypes = [
        'font/ttf',
        'font/otf',
        'font/woff',
        'font/woff2',
        'application/font-ttf',
        'application/font-otf',
        'application/font-woff',
      ];
      const validExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
      const fileName = file.name.toLowerCase();
      const isValidType =
        validTypes.includes(file.type) || validExtensions.some((ext) => fileName.endsWith(ext));

      if (isValidType) {
        processFont(file);
      } else {
        setUploadError('Invalid file type. Please upload a TTF, OTF, WOFF, or WOFF2 file.');
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-stone-100 font-sans text-stone-800">
      <header className="mx-auto max-w-3xl py-16 text-center">
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-stone-900 md:text-4xl">
          上傳字體檔案，即時預覽效果
        </h1>
        <p className="text-sm text-stone-500 md:text-base">
          上傳 TTF、OTF 等字體檔案，輸入自訂文字，立即查看字體效果，無需安裝字體到系統
        </p>

        {/* Mode Toggle */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => setMode('single')}
            className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${
              mode === 'single'
                ? 'bg-primary text-white shadow-md'
                : 'border border-stone-200 bg-white text-stone-600 hover:border-stone-300'
            }`}
          >
            單個預覽
          </button>
          <button
            onClick={() => setMode('compare')}
            className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${
              mode === 'compare'
                ? 'bg-primary text-white shadow-md'
                : 'border border-stone-200 bg-white text-stone-600 hover:border-stone-300'
            }`}
          >
            比較模式 (2-3個)
          </button>
        </div>

        <div className="border-primary/10 bg-primary/5 text-primary mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium">
          <Info className="h-3.5 w-3.5" />
          支援 TTF, OTF, WOFF, WOFF2 格式
        </div>
      </header>

      {mode === 'single' ? (
        // Single Mode Layout
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 pb-60 md:gap-8 md:pb-40 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <UploadSection
              isAnalyzing={isAnalyzing}
              isDragActive={isDragActive}
              uploadError={uploadError}
              onFileUpload={handleFileUpload}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            />
            <FontAnalysisResult currentFont={currentFont} />

            <PreviewSetting
              fontSize={fontSize}
              fontColor={fontColor}
              bgColor={bgColor}
              onFontSizeChange={setFontSize}
              onFontColorChange={setFontColor}
              onBgColorChange={setBgColor}
              onReset={handleReset}
            />
          </div>

          <div className="flex flex-col gap-6 lg:col-span-8">
            <TextInput
              inputText={inputText}
              onInputChange={setInputText}
              onClear={handleClearText}
            />

            <FontPreview
              currentFont={currentFont}
              inputText={inputText}
              fontColor={fontColor}
              bgColor={bgColor}
              fontSize={fontSize}
              onClear={handleClearText}
            />
          </div>
        </div>
      ) : (
        // Comparison Mode Layout
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 pb-60 md:gap-8 md:pb-40 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <ComparisonUploadPanel
              fonts={comparisonFonts}
              analysingId={analysingId}
              dragActiveId={dragActiveId}
              maxFonts={3}
              onFileUpload={handleComparisonFileUpload}
              onDragEnter={handleComparisonDrag}
              onDragLeave={handleComparisonDrag}
              onDragOver={handleComparisonDrag}
              onDrop={handleComparisonDrop}
              onRemove={handleRemoveComparisonFont}
            />

            <PreviewSetting
              fontSize={fontSize}
              fontColor={fontColor}
              bgColor={bgColor}
              onFontSizeChange={setFontSize}
              onFontColorChange={setFontColor}
              onBgColorChange={setBgColor}
              onReset={handleReset}
            />
          </div>

          <div className="flex flex-col gap-6 lg:col-span-8">
            <TextInput
              inputText={inputText}
              onInputChange={setInputText}
              onClear={handleClearText}
            />

            <ComparisonPreview
              fonts={comparisonFonts}
              inputText={inputText}
              fontColor={fontColor}
              bgColor={bgColor}
              fontSize={fontSize}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
