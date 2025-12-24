'use client';

import React from 'react';
import { Info, Upload, Loader2, X } from 'lucide-react';
import { useFontComparison } from '../hooks/useFontComparison';
import { usePreviewSettings } from '../hooks/usePreviewSettings';
import { usePreviewText } from '../hooks/usePreviewText';
import { useDragDrop } from '../hooks/useDragDrop';
import { PageHeader } from '../components/PageHeader';
import { PreviewSetting } from '../components/PreviewSetting';
import { Footer } from '../components/Footer';
import { SAMPLE_TEXTS } from '@/lib/constants';

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
    resetSettings,
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
    <div className="relative flex min-h-screen flex-col bg-stone-100">
      <PageHeader title="字型比較" />

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl p-6">
          {/* Top Section - Upload and Preview Settings */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Left Panel - Upload */}
            <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm lg:col-span-1">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="text-primary h-5 w-5" />
                  <h2 className="text-lg font-bold text-stone-800">上傳字體</h2>
                </div>
                <div className="text-sm font-medium text-stone-600">
                  {comparisonSlots.filter((s) => s.font).length} / 3
                </div>
              </div>

              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input-comparison')?.click()}
                className={`flex min-h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                  isDragActive
                    ? 'border-primary/80 bg-primary/5'
                    : analysingId
                      ? 'border-primary/80 bg-primary/5'
                      : 'hover:border-primary/80 border-stone-300 hover:bg-stone-50'
                }`}
              >
                <input
                  id="file-input-comparison"
                  type="file"
                  className="hidden"
                  accept=".ttf,.otf,.woff,.woff2"
                  onChange={handleFileInput}
                />

                {analysingId ? (
                  <>
                    <Loader2 className="text-primary h-8 w-8 animate-spin" />
                    <span className="text-sm text-stone-600">正在分析字型...</span>
                  </>
                ) : (
                  <>
                    <div className="bg-primary/5 rounded-full p-3">
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

              {/* Uploaded Fonts List */}
              {comparisonSlots.some((s) => s.font) && (
                <div className="mt-4 space-y-2">
                  {comparisonSlots
                    .filter((s) => s.font !== null)
                    .map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between rounded-lg border border-stone-200 bg-stone-50 p-3"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-stone-800">{slot.font?.name}</p>
                        </div>
                        <button
                          onClick={() => removeFont(slot.id)}
                          className="ml-2 inline-flex items-center justify-center rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-white hover:text-red-600"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Right Panel - Text & Settings */}
            <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-stone-800">預覽文字與設定</h3>
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
                  accentColor="accent"
                />
              </div>
            </div>
          </div>

          {/* Bottom Panel - Comparison Previews */}
          {hasFonts && (
            <div className="space-y-6">
              {comparisonSlots
                .filter((s) => s.font !== null)
                .map((slot) => (
                  <div
                    key={slot.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-2 border-b border-stone-100 bg-stone-50/50 px-6 py-3">
                      <div className="bg-primary h-3 w-3 rounded-full" />
                      <p className="font-semibold text-stone-800">{slot.font?.name}</p>
                    </div>
                    <div
                      className="flex min-h-64 flex-1 items-center justify-center overflow-auto p-6 transition-colors duration-300"
                      style={{ backgroundColor: settings.bgColor }}
                    >
                      <p
                        style={{
                          fontFamily: slot.font ? `"${slot.font.family}"` : 'sans-serif',
                          color: settings.fontColor,
                          fontSize: `${settings.fontSize}px`,
                          lineHeight: 1.6,
                          wordBreak: 'break-word',
                          textAlign: 'center',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {inputText || '請輸入文字預覽效果'}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
          {!hasFonts && (
            <div className="rounded-2xl border-2 border-dashed border-stone-300 bg-white p-24 text-center">
              <div className="mb-3 flex justify-center">
                <div className="text-4xl text-stone-300">T</div>
              </div>
              <p className="text-sm text-stone-400">尚未上傳字體</p>
              <p className="mt-1 text-xs text-stone-400">請在左側欄位 TTF/OTF 檔案開始比較</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
