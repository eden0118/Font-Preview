'use client';

import React from 'react';
import { Info, Upload, Trash2, Loader2 } from 'lucide-react';
import { useFontAnalysis } from '../hooks/useFontAnalysis';
import { usePreviewSettings } from '../hooks/usePreviewSettings';
import { usePreviewText } from '../hooks/usePreviewText';
import { useDragDrop } from '../hooks/useDragDrop';
import { PageHeader } from '../components/PageHeader';
import { PreviewSetting } from '../components/PreviewSetting';
import { Footer } from '../components/Footer';

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
                        ? 'border-orange-200 bg-orange-50'
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
                              <span className="text-primary text-xs font-medium">
                                {currentFont.coverage.tc}%
                              </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                              <div
                                className="bg-primary h-full"
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
                  accentColor="primary"
                />
              </div>
            </div>
          </div>

          {/* Bottom Panel - Font Analysis/Preview */}
          <div className="space-y-6">
            {currentFont && (
              <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <div className="bg-primary h-3 w-3 rounded-full" />
                  <p className="font-semibold text-stone-800">{currentFont.name}</p>
                  <p className="text-xs text-stone-500">Detected: {currentFont.category}</p>
                </div>
              </div>
            )}
            <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-stone-800">預覽</h3>
              <div
                className="flex min-h-64 flex-1 items-center justify-center overflow-auto p-6 transition-colors duration-300"
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
                  {inputText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
