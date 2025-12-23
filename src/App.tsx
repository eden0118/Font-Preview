import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { analyzeFontFile, loadFontFace } from './utils/fontHelper';
import { FontDefinition } from './types';
import { SAMPLE_TEXTS } from './constants';

import {
  Footer,
  FontAnalysisResult,
  FontPreview,
  UploadSection,
  TextInput,
  PreviewSetting,
} from './components';

const App: React.FC = () => {
  // UI State
  const [fontColor, setFontColor] = useState<string>('#292524');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [fontSize, setFontSize] = useState<number>(32);
  const [inputText, setInputText] = useState<string>(SAMPLE_TEXTS.tc);

  // Font State
  const [currentFont, setCurrentFont] = useState<FontDefinition | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  const handleReset = () => {
    setFontColor('#292524');
    setBgColor('#FFFFFF');
    setFontSize(32);
  };

  const handleClearText = () => {
    setInputText('');
  };

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
        <div className="border-primary/10 bg-primary/5 text-primary mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium">
          <Info className="h-3.5 w-3.5" />
          支援 TTF, OTF, WOFF, WOFF2 格式
        </div>
      </header>

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
          <TextInput inputText={inputText} onInputChange={setInputText} onClear={handleClearText} />

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

      {/* Footer */}

      <Footer />
    </div>
  );
};

export default App;
