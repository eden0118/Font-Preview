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

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl p-6">
          {/* Top Section - Upload and Preview Settings */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Left Panel - Upload */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              {/* Upload Section */}
              <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Upload className="text-primary h-5 w-5" />
                  <h2 className="text-lg font-bold text-stone-800">上傳字型檔案</h2>
                </div>

                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input-analysis')?.click()}
                  className={`flex min-h-52 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                    isDragActive
                      ? 'border-primary/30 bg-primary-light'
                      : isAnalyzing
                        ? 'border-primary/50 bg-primary/5'
                        : 'hover:border-primary/30 border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <input
                    id="file-input-analysis"
                    type="file"
                    className="hidden"
                    accept=".ttf,.otf,.woff,.woff2"
                    onChange={handleFileInput}
                  />

                  {isAnalyzing ? (
                    <>
                      <Loader2 className="text-primary h-8 w-8 animate-spin" />
                      <span className="text-sm text-stone-600">正在分析字型...</span>
                    </>
                  ) : (
                    <>
                      <div className="bg-primary-light rounded-full p-3">
                        <Upload className="text-primary h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-700">點擊選擇或拖拽放入</p>
                        <p className="text-xs text-stone-500">支援 TTF, OTF, WOFF, WOFF2</p>
                      </div>
                    </>
                  )}
                </div>

                {uploadError && (
                  <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                    {uploadError}
                  </div>
                )}
              </div>

              {/* Font Info */}
              {currentFont && <FontInfo font={currentFont} />}
            </div>

            {/* Right Panel - Text & Settings */}
            <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-stone-800">預覽文字與設定</h3>
                <div className="flex gap-2">
                  <div className="flex gap-1 rounded-lg bg-stone-100 p-1">
                    <button
                      onClick={() => updateLanguage('cn')}
                      className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                        settings.language === 'cn'
                          ? 'text-primary bg-white'
                          : 'text-stone-600 hover:text-stone-800'
                      }`}
                    >
                      中文
                    </button>
                    <button
                      onClick={() => updateLanguage('en')}
                      className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                        settings.language === 'en'
                          ? 'text-primary bg-white'
                          : 'text-stone-600 hover:text-stone-800'
                      }`}
                    >
                      English
                    </button>
                  </div>
                  <button
                    onClick={resetToDefault}
                    className="hover:text-primary rounded-lg bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-200"
                  >
                    使用預設
                  </button>
                </div>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="輸入預覽文字..."
                className="focus:ring-primary mb-4 min-h-24 w-full resize-none rounded-xl border border-stone-200 bg-stone-50 p-4 text-stone-700 transition-all outline-none placeholder:text-stone-400 focus:border-transparent focus:ring-2"
              />

              {/* Settings Row */}
              <div className="border-t border-stone-100 pt-4">
                <PreviewSetting
                  fontSize={settings.fontSize}
                  fontColor={settings.fontColor}
                  bgColor={settings.bgColor}
                  onFontSizeChange={updateFontSize}
                  onFontColorChange={updateFontColor}
                  onBgColorChange={updateBgColor}
                  onReset={resetSettings}
                  accentColor="primary"
                />
              </div>
            </div>
          </div>

          {/* Bottom Panel - Font Preview */}
          <PreviewCard
            font={currentFont}
            text={inputText}
            fontColor={settings.fontColor}
            bgColor={settings.bgColor}
            fontSize={settings.fontSize}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
