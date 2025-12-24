'use client';

import React from 'react';
import Link from 'next/link';
import { Info, Upload, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import { useFontAnalysis } from '../hooks/useFontAnalysis';
import { usePreviewSettings } from '../hooks/usePreviewSettings';
import { useDragDrop } from '../hooks/useDragDrop';
import { SAMPLE_TEXTS } from '@/lib/constants';

export default function AnalysisPage() {
  const { currentFont, isAnalyzing, uploadError, processFont, clearFont } = useFontAnalysis();
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
    if (currentFont && !inputText) {
      setInputText(SAMPLE_TEXTS.tc);
    }
  }, [currentFont, inputText, setInputText]);

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
    <div className="relative min-h-screen bg-stone-100 font-sans text-stone-800">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-stone-600 transition-colors hover:text-stone-900"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">返回首頁</span>
          </Link>
          <h1 className="text-2xl font-bold text-stone-900">字型分析</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 pb-40 md:gap-8 lg:grid-cols-12">
        {/* Left Panel */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          {/* Upload Section */}
          <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
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
                  ? 'border-blue-400 bg-blue-50'
                  : isAnalyzing
                    ? 'border-orange-200 bg-orange-50'
                    : 'border-stone-300 hover:border-blue-300 hover:bg-stone-50'
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
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="text-sm text-stone-600">正在分析字型...</span>
                </>
              ) : (
                <>
                  <div className="rounded-full bg-blue-100 p-3">
                    <Upload className="h-6 w-6 text-blue-600" />
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
          {currentFont && (
            <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-stone-800">字型信息</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-stone-500">名稱</p>
                  <p className="font-medium text-stone-700">{currentFont.name}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-500">類別</p>
                  <p className="font-medium text-stone-700">{currentFont.category}</p>
                </div>
                {currentFont.glyphCount && (
                  <div>
                    <p className="text-xs text-stone-500">字符數</p>
                    <p className="font-medium text-stone-700">
                      {currentFont.glyphCount.toLocaleString()}
                    </p>
                  </div>
                )}
                {currentFont.description && (
                  <div>
                    <p className="text-xs text-stone-500">描述</p>
                    <p className="text-sm text-stone-600">{currentFont.description}</p>
                  </div>
                )}

                {/* Coverage Info */}
                {currentFont.coverage && (
                  <div className="border-t border-stone-200 pt-3">
                    <p className="mb-3 text-xs font-semibold text-stone-600">語言覆蓋率</p>
                    <div className="space-y-2">
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs text-stone-600">繁體中文</span>
                          <span className="text-xs font-medium text-blue-600">
                            {currentFont.coverage.tc}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${currentFont.coverage.tc}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs text-stone-600">簡體中文</span>
                          <span className="text-xs font-medium text-green-600">
                            {currentFont.coverage.sc}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${currentFont.coverage.sc}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs text-stone-600">日文</span>
                          <span className="text-xs font-medium text-purple-600">
                            {currentFont.coverage.ja}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                          <div
                            className="h-full bg-purple-500"
                            style={{ width: `${currentFont.coverage.ja}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Preview Settings */}
          <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-stone-800">預覽設定</h3>

            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-stone-600">字體大小</label>
                  <span className="font-mono text-sm font-bold text-blue-600">
                    {settings.fontSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="150"
                  value={settings.fontSize}
                  onChange={(e) => updateFontSize(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-blue-600"
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

        {/* Right Panel */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          {/* Text Input */}
          <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-stone-800">預覽文字</h3>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="輸入預覽文字..."
              className="h-32 w-full resize-none rounded-xl border border-stone-200 bg-stone-50 p-4 text-stone-700 transition-all outline-none placeholder:text-stone-400 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Font Preview */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm">
            <div
              className="flex flex-1 items-center justify-center overflow-auto p-8 transition-colors duration-300"
              style={{ backgroundColor: settings.bgColor }}
            >
              <p
                style={{
                  fontFamily: currentFont ? `"${currentFont.family}"` : 'sans-serif',
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

            <div className="flex items-center justify-between border-t border-stone-100 bg-stone-50/50 px-4 py-3">
              <p className="text-xs font-medium text-stone-500">
                {currentFont
                  ? `使用字體: ${currentFont.name}`
                  : '尚無上傳字體，目前使用系統預設字體'}
              </p>
              {currentFont && (
                <button
                  onClick={clearFont}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-stone-500 transition-colors hover:bg-white hover:text-stone-700"
                >
                  <Trash2 className="h-4 w-4" />
                  清空
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
