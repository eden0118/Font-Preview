'use client';

import React from 'react';
import { Info, Upload, Loader2, X } from 'lucide-react';
import { useFontComparison } from '../hooks/useFontComparison';
import { usePreviewSettings } from '../hooks/usePreviewSettings';
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

  React.useEffect(() => {
    if (!inputText && comparisonSlots.some((s) => s.font)) {
      setInputText(SAMPLE_TEXTS.tc);
    }
  }, [comparisonSlots, inputText, setInputText]);

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
          {/* Top Panel - Upload */}
          <div className="mb-6 rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="text-accent h-5 w-5" />
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
                  ? 'border-amber-400 bg-amber-50'
                  : analysingId
                    ? 'border-orange-200 bg-orange-50'
                    : 'border-stone-300 hover:border-amber-300 hover:bg-stone-50'
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
                  <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                  <span className="text-sm text-stone-600">正在分析字型...</span>
                </>
              ) : (
                <>
                  <div className="rounded-full bg-amber-100 p-3">
                    <Upload className="text-accent h-6 w-6" />
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

          {/* Middle Panel - Text & Settings */}
          <div className="mb-6 rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-stone-800">預覽文字與設定</h3>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="輸入預覽文字..."
              className="focus:ring-accent min-h-24 w-full resize-none rounded-xl border border-stone-200 bg-stone-50 p-4 text-stone-700 transition-all outline-none placeholder:text-stone-400 focus:border-transparent focus:ring-2"
            />

            {/* Settings Row */}
            <div className="mt-6 border-t border-stone-100 pt-6">
              <PreviewSetting
                fontSize={settings.fontSize}
                fontColor={settings.fontColor}
                bgColor={settings.bgColor}
                onFontSizeChange={updateFontSize}
                onFontColorChange={updateFontColor}
                onBgColorChange={updateBgColor}
                onReset={resetSettings}
                accentColor="accent"
                layout="horizontal"
                showLabels={true}
              />
            </div>
          </div>

          {/* Bottom Panel - Comparison Previews */}
          {hasFonts ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {comparisonSlots
                .filter((s) => s.font !== null)
                .map((slot) => (
                  <div
                    key={slot.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm"
                  >
                    <div
                      className="flex min-h-96 flex-1 items-center justify-center overflow-auto p-6 transition-colors duration-300"
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

                    <div className="border-t border-stone-100 bg-stone-50/50 px-4 py-3">
                      <p className="text-xs font-medium text-stone-700">{slot.font?.name}</p>
                      <p className="text-xs text-stone-500">{slot.font?.category}</p>
                      <button
                        onClick={() => removeFont(slot.id)}
                        className="mt-2 text-xs text-red-600 hover:text-red-700"
                      >
                        移除此字型
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
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
