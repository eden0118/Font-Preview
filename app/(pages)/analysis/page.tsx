'use client';

import React from 'react';
import { Info, Upload, Trash2, Loader2, BarChart3, Scale, Tag, AlertTriangle } from 'lucide-react';
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

// 禁用預渲染（此頁面依賴客戶端交互和用戶輸入）
export const dynamic = 'force-dynamic';

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
    <section className="relative flex min-h-screen flex-col bg-stone-100">
      <PageHeader
        title="字型分析"
        description="專為繁體中文使用者設計。上傳字型檔案，快速檢測其對繁體中文的支援程度。"
      />

      {/* Main Content */}
      <main className="mx-auto my-6 grid w-full max-w-7xl flex-1 grid-cols-1 gap-4 px-4 sm:gap-6 sm:p-6 lg:grid-cols-4">
        {/* Upload - 行動設備堆疊 */}
        <div className="flex flex-col gap-4 sm:gap-6">
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

        <div className="w-full lg:col-span-3">
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

      {/* Analysis Logic Explanation */}
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-6">
          <h2 className="mb-4 text-lg font-bold text-stone-800">分析方法說明</h2>
          <div className="mb-4 flex items-start gap-1">
            <Info size={16} className="shrink-0 text-blue-800" />
            <p className="text-xs text-stone-600 italic">
              本工具提供快速參考判斷，結果不保證完全準確。建議用於初步篩選，正式使用前請自行測試。
            </p>
          </div>
          <div className="grid grid-cols-2 space-y-3 text-sm text-stone-700">
            <div className="flex gap-1">
              <BarChart3 size={18} className="mt-0.5 shrink-0 text-stone-700" />
              <div>
                <h3 className="font-semibold text-stone-800">基本原理</h3>
                <p className="mt-1 text-xs text-stone-600">
                  逐字檢測字型是否包含繁體中文字符，計算字型的覆蓋率。字符集來自{' '}
                  <a
                    href="https://justfont.com/jf7000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 underline hover:text-blue-800"
                  >
                    JF7000
                  </a>
                  ，包含 7,000 個繁體中文常用字。
                </p>
              </div>
            </div>

            <div className="flex gap-1">
              <Scale size={18} className="mt-0.5 shrink-0 text-stone-700" />
              <div>
                <h3 className="font-semibold text-stone-800">評分方法</h3>
                <p className="mt-1 text-xs text-stone-600">
                  優先檢查日常常用字、核心字集、特殊用途字、標點符號等層級，按比例計算綜合評分。
                </p>
              </div>
            </div>

            <div className="flex gap-1">
              <Tag size={18} className="mt-0.5 shrink-0 text-stone-700" />
              <div>
                <h3 className="font-semibold text-stone-800">語言判定</h3>
                <p className="mt-1 text-xs text-stone-600">
                  根據各語言字符的支援程度進行標籤判定（繁體、日文、簡體等），供快速參考。
                </p>
              </div>
            </div>

            <div className="flex gap-1">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-stone-700" />
              <div>
                <h3 className="font-semibold text-stone-800">缺字提示</h3>
                <p className="mt-1 text-xs text-stone-600">
                  檢測預覽文字中的缺字情況，幫助快速了解字型相容性。實際排版效果因應用而異。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
}
