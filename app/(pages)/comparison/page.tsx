'use client';

import React from 'react';
import { Upload, Loader2, X } from 'lucide-react';
import { useFontComparison } from '../../hooks/useFontComparison';
import { usePreviewSettings } from '../../hooks/usePreviewSettings';
import { usePreviewText } from '../../hooks/usePreviewText';
import { useDragDrop } from '../../hooks/useDragDrop';
import { PageHeader } from '../../components/PageHeader';
import { PreviewSetting } from '../../components/PreviewSetting';
import { Footer } from '../../components/Footer';
import { PreviewCard } from '../../components/PreviewCard';
import { FontListItem } from '../../components/FontListItem';
import { UploadZone } from '../../components/UploadZone';
import { PreviewTextPanel } from '../../components/PreviewTextPanel';

// 禁用預渲染（此頁面依賴客戶端交互和用戶輸入）
export const dynamic = 'force-dynamic';

export default function ComparisonPage() {
  const { comparisonSlots, analysingId, uploadError, processFont, removeFont } =
    useFontComparison();
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
  const comparisonFonts = comparisonSlots.map((s) => s.font).filter((f) => f !== null);
  usePreviewText(comparisonFonts.length > 0 ? comparisonFonts : null, inputText, setInputText);

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

  const hasFonts = comparisonSlots.some((s) => s.font !== null);

  return (
    <section className="relative flex min-h-screen flex-col bg-stone-100">
      <PageHeader
        title="字型比較"
        description="上傳多個字型，快速比較它們在相同文字下的顯示效果與差異。"
      />

      {/* Main Content */}
      <main className="mx-auto my-6 max-w-7xl flex-1 px-4 sm:p-6">
        {/* Top Section - Upload and Preview Settings */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:mb-6 sm:gap-6 lg:grid-cols-4">
          {/* Left Panel - Upload */}
          <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm sm:p-6 lg:col-span-1">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="text-primary h-5 w-5" />
                <h2 className="text-lg font-bold text-stone-800">上傳字體</h2>
              </div>
              <div className="text-sm font-medium text-stone-600">
                {comparisonSlots.filter((s) => s.font).length} / 3
              </div>
            </div>

            <UploadZone
              isDragActive={isDragActive}
              isAnalyzing={!!analysingId}
              uploadError={uploadError}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input-comparison')?.click()}
              fileInputId="file-input-comparison"
              onFileChange={handleFileInput}
            />

            {/* Uploaded Fonts List */}
            {comparisonSlots.some((s) => s.font) && (
              <div className="mt-4 space-y-2">
                {comparisonSlots
                  .filter((s) => s.font !== null)
                  .map((slot) => (
                    <FontListItem
                      key={slot.id}
                      font={slot.font!}
                      onRemove={() => removeFont(slot.id)}
                    />
                  ))}
              </div>
            )}
          </div>

          {/* Right Panel - Text & Settings */}
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
          />
        </div>

        {/* Bottom Panel - Comparison Previews */}
        {hasFonts ? (
          <div className="space-y-6">
            {comparisonSlots
              .filter((s) => s.font !== null)
              .map((slot) => (
                <PreviewCard
                  key={slot.id}
                  font={slot.font}
                  text={inputText}
                  fontColor={settings.fontColor}
                  bgColor={settings.bgColor}
                  fontSize={settings.fontSize}
                />
              ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-stone-300 bg-white p-24 text-center">
            <div className="mb-3 flex justify-center">
              <div className="text-4xl text-stone-300">T</div>
            </div>
            <p className="text-sm text-stone-400">尚未上傳字體</p>
            <p className="mt-1 text-xs text-stone-400">請在左側欄位上傳 TTF/OTF 檔案開始比較</p>
          </div>
        )}
      </main>
      <Footer />
    </section>
  );
}
