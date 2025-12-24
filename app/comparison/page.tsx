'use client';

import React from 'react';
import Link from 'next/link';
import { Info, Upload, Loader2, ArrowLeft, X } from 'lucide-react';
import { useFontComparison } from '../hooks/useFontComparison';
import { usePreviewSettings } from '../hooks/usePreviewSettings';
import { useDragDrop } from '../hooks/useDragDrop';
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
    <div className="relative min-h-screen bg-stone-100 font-sans text-stone-800">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-stone-600 transition-colors hover:text-stone-900"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">返回首頁</span>
          </Link>
          <h1 className="text-2xl font-bold text-stone-900">字型比較</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 pb-40 md:gap-8 lg:grid-cols-12">
        {/* Left Panel - Upload */}
        <div className="flex flex-col gap-6 lg:col-span-3">
          {/* Upload Section */}
          <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-bold text-stone-800">上傳字型</h2>
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
                    <Upload className="h-6 w-6 text-amber-600" />
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

          {/* Font List */}
          {hasFonts && (
            <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-stone-800">
                已上傳字型 ({comparisonSlots.filter((s) => s.font).length})
              </h3>
              <div className="space-y-2">
                {comparisonSlots
                  .filter((s) => s.font !== null)
                  .map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between rounded-lg border border-stone-200 bg-stone-50 p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-stone-700">
                          {slot.font?.name}
                        </p>
                        <p className="text-xs text-stone-500">{slot.font?.category}</p>
                      </div>
                      <button
                        onClick={() => removeFont(slot.id)}
                        className="ml-2 flex cursor-pointer items-center justify-center rounded-md p-1.5 text-stone-400 transition-colors hover:bg-white hover:text-red-600"
                        title="移除此字型"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Settings */}
          <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-stone-800">預覽設定</h3>

            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-stone-600">字體大小</label>
                  <span className="font-mono text-sm font-bold text-amber-600">
                    {settings.fontSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="150"
                  value={settings.fontSize}
                  onChange={(e) => updateFontSize(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-amber-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-600">字體顏色</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.fontColor}
                    onChange={(e) => updateFontColor(e.target.value)}
                    className="h-10 w-10 cursor-pointer overflow-hidden rounded-lg border-0 p-0 shadow-sm"
                  />
                  <div className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 font-mono text-sm text-stone-600 uppercase">
                    {settings.fontColor}
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-600">背景顏色</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.bgColor}
                    onChange={(e) => updateBgColor(e.target.value)}
                    className="h-10 w-10 cursor-pointer overflow-hidden rounded-lg border-0 p-0 shadow-sm"
                  />
                  <div className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 font-mono text-sm text-stone-600 uppercase">
                    {settings.bgColor}
                  </div>
                </div>
              </div>

              <button
                onClick={resetSettings}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-stone-100 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200"
              >
                重置設定
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Comparison Preview */}
        <div className="flex flex-col gap-6 lg:col-span-9">
          {/* Text Input */}
          <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-stone-800">預覽文字</h3>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="輸入預覽文字..."
              className="h-24 w-full resize-none rounded-xl border border-stone-200 bg-stone-50 p-4 text-stone-700 transition-all outline-none placeholder:text-stone-400 focus:border-transparent focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Comparison Previews - Side by Side */}
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
                      className="flex min-h-80 flex-1 items-center justify-center overflow-auto p-6 transition-colors duration-300"
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
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-stone-300 p-12 text-center">
              <p className="text-sm text-stone-500">請先上傳至少一個字型以查看比較</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
