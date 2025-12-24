'use client';

import React from 'react';
import { Info, Upload, Trash2, Loader2 } from 'lucide-react';
import { useFontAnalysis } from '../../hooks/useFontAnalysis';
import { usePreviewSettings } from '../../hooks/usePreviewSettings';
import { usePreviewText } from '../../hooks/usePreviewText';
import { useDragDrop } from '../../hooks/useDragDrop';
import { PageHeader } from '../../components/PageHeader';
import { PreviewSetting } from '../../components/PreviewSetting';
import { Footer } from '../../components/Footer';
import { FontInfo } from '../../components/FontInfo';
import { PreviewCard } from '../../components/PreviewCard';
import { UploadZone } from '../../components/UploadZone';
import { PreviewTextPanel } from '../../components/PreviewTextPanel';
import { getCoverageColor } from '../../lib/coverageHelpers';

export default function AnalysisPage() {
  const { currentFont, isAnalyzing, uploadError, processFont, clearFont } = useFontAnalysis();
  const {
    settings,
    inputText,
    setInputText,
    updateFontColor,
    updateBgColor,
    updateFontSize,
    updateLanguage,
    resetSettings,
    resetToDefault,
    DEFAULT_SAMPLE_TEXT,
  } = usePreviewSettings();
  const { isDragActive, validateFile, handleDragEnter, handleDragLeave, handleDragOver } =
    useDragDrop();

  // 使用 Hook 自動初始化預覽文字
  usePreviewText(currentFont, inputText, setInputText);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      return;
    }

    processFont(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleDragLeave();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        processFont(file);
      }
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-stone-100">
      <PageHeader title="字型分析" />

      {/* Information Banner */}
      <div className="bg-primary/20 p-2 lg:col-span-4">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-1 text-sm text-blue-800">
          <Info size={16} />
          <p className="font-semibold">
            專為繁體中文使用者設計：
            上傳日文、簡體或其他字型，快速檢測其對繁體中文的支援程度。覆蓋率越高，代表缺字情況越少。
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto mb-6 grid max-w-7xl flex-1 grid-cols-1 gap-6 p-6 lg:grid-cols-4">
        {/* Upload */}
        <div className="flex flex-col gap-6">
          {/* Upload Section */}
          <div className="card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Upload className="text-primary h-5 w-5" />
              <h2 className="text-lg font-bold text-stone-800">上傳字型檔案</h2>
            </div>

            <UploadZone
              isDragActive={isDragActive}
              isAnalyzing={isAnalyzing}
              uploadError={uploadError}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input-analysis')?.click()}
              fileInputId="file-input-analysis"
              onFileChange={handleFileInput}
            />
          </div>

          {/* Font Info */}
          {currentFont && <FontInfo font={currentFont} />}
        </div>

        <div className="lg:col-span-3">
          {/* Upload and Preview Settings */}
          <PreviewTextPanel
            inputText={inputText}
            onInputChange={setInputText}
            language={settings.language}
            onLanguageChange={updateLanguage}
            fontSize={settings.fontSize}
            fontColor={settings.fontColor}
            bgColor={settings.bgColor}
            onFontSizeChange={updateFontSize}
            onFontColorChange={updateFontColor}
            onBgColorChange={updateBgColor}
            onReset={resetSettings}
            onResetDefault={resetToDefault}
          >
            {/* Preview Card */}
            <PreviewCard
              font={currentFont}
              text={inputText}
              fontColor={settings.fontColor}
              bgColor={settings.bgColor}
              fontSize={settings.fontSize}
            />
          </PreviewTextPanel>
        </div>
      </main>
      <Footer />
    </div>
  );
}
