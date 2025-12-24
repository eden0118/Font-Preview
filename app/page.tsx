'use client';

import React, { useState, useEffect } from 'react';
import { Info, Upload, Trash2, X, Loader2 } from 'lucide-react';
import { analyzeFontFile, loadFontFace } from '@/lib/fontHelper';
import { FontDefinition, TabMode, ComparisonFont } from '@/lib/types';
import { SAMPLE_TEXTS } from '@/lib/constants';

interface ComparisonSlot {
  id: string;
  font: FontDefinition | null;
}

export default function App() {
  // Hydration Fix
  const [mounted, setMounted] = useState(false);

  // Tab State
  const [tab, setTab] = useState<TabMode>('analysis');

  // UI State
  const [fontColor, setFontColor] = useState<string>('#292524');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [fontSize, setFontSize] = useState<number>(32);
  const [inputText, setInputText] = useState<string>(SAMPLE_TEXTS.tc);

  // Analysis Mode State
  const [currentFont, setCurrentFont] = useState<FontDefinition | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  // Comparison Mode State
  const [comparisonSlots, setComparisonSlots] = useState<ComparisonSlot[]>([
    { id: '1', font: null },
    { id: '2', font: null },
  ]);
  const [analysingId, setAnalysingId] = useState<string | null>(null);
  const [dragActiveId, setDragActiveId] = useState<string | null>(null);

  // Ensure client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // ==================== Analysis Mode Functions ====================
  const processFont = async (file: File) => {
    setIsAnalyzing(true);
    setUploadError(null);
    setCurrentFont(null);

    try {
      const fontDef = await analyzeFontFile(file);
      const buffer = await file.arrayBuffer();
      await loadFontFace(fontDef.family, buffer);
      setCurrentFont(fontDef);
      setInputText(SAMPLE_TEXTS.tc);
    } catch (err) {
      console.error(err);
      setUploadError('Failed to parse font file. Please try another TTF/OTF/WOFF file.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFont(file);
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

  // ==================== Comparison Mode Functions ====================
  const processFontForComparison = async (file: File) => {
    setAnalysingId('main');

    try {
      const fontDef = await analyzeFontFile(file);
      const buffer = await file.arrayBuffer();
      await loadFontFace(fontDef.family, buffer);

      setComparisonSlots((prev) => {
        const emptySlot = prev.find((item) => item.font === null);
        if (emptySlot) {
          return prev.map((item) => (item.id === emptySlot.id ? { ...item, font: fontDef } : item));
        }
        return prev;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setAnalysingId(null);
    }
  };

  const handleComparisonFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFontForComparison(file);
  };

  const handleComparisonDrag = (_slotId: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActiveId(_slotId);
    } else if (e.type === 'dragleave') {
      setDragActiveId(null);
    }
  };

  const handleComparisonDrop = (_slotId: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveId(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
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
        processFontForComparison(file);
      }
    }
  };

  const handleRemoveComparisonFont = (slotId: string) => {
    setComparisonSlots((prev) =>
      prev.map((item) => (item.id === slotId ? { ...item, font: null } : item))
    );
  };

  // ==================== Common Functions ====================
  const handleReset = () => {
    setFontColor('#292524');
    setBgColor('#FFFFFF');
    setFontSize(32);
  };

  const handleClearText = () => {
    setInputText('');
  };

  // ==================== Render ====================
  return (
    <div className="relative min-h-screen bg-stone-100 font-sans text-stone-800">
      {/* Header */}
      <header className="mx-auto max-w-4xl py-12 text-center">
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-stone-900 md:text-4xl">
          字型預覽工具
        </h1>
        <p className="text-sm text-stone-500 md:text-base">
          上傳字型檔案，即時預覽效果，支援字型分析和多字型比較
        </p>

        {/* Tab Switcher */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => setTab('analysis')}
            className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${
              tab === 'analysis'
                ? 'bg-primary text-white shadow-md'
                : 'border border-stone-200 bg-white text-stone-600 hover:border-stone-300'
            }`}
          >
            分析字型
          </button>
          <button
            onClick={() => setTab('comparison')}
            className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${
              tab === 'comparison'
                ? 'bg-primary text-white shadow-md'
                : 'border border-stone-200 bg-white text-stone-600 hover:border-stone-300'
            }`}
          >
            比較字型
          </button>
        </div>

        <div className="border-primary/10 bg-primary/5 text-primary mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium">
          <Info className="h-3.5 w-3.5" />
          支援 TTF, OTF, WOFF, WOFF2 格式
        </div>
      </header>

      {/* Analysis Mode */}
      {tab === 'analysis' && (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 pb-40 md:gap-8 lg:grid-cols-12">
          {/* Left Panel */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            {/* Upload Section */}
            <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Upload className="text-primary h-5 w-5" />
                <h2 className="text-lg font-bold text-stone-800">上傳字型檔案</h2>
              </div>

              <div
                onClick={() => document.getElementById('file-input-analysis')?.click()}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`flex min-h-50 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                  isDragActive
                    ? 'border-primary/50 bg-primary/5'
                    : isAnalyzing
                      ? 'bg-primary/5 border-orange-200'
                      : 'hover:border-primary/50 border-stone-300 hover:bg-stone-50'
                }`}
              >
                <input
                  id="file-input-analysis"
                  type="file"
                  className="hidden"
                  accept=".ttf,.otf,.woff,.woff2"
                  onChange={handleFileUpload}
                />

                {isAnalyzing ? (
                  <>
                    <Loader2 className="text-primary h-8 w-8 animate-spin" />
                    <span className="text-sm text-stone-500">正在分析字型...</span>
                  </>
                ) : (
                  <>
                    <div className="rounded-full bg-stone-100 p-3">
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
                    <span className="text-primary font-mono text-sm font-bold">{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="150"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="accent-primary h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-600">字體顏色</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={fontColor}
                      onChange={(e) => setFontColor(e.target.value)}
                      className="h-10 w-10 cursor-pointer overflow-hidden rounded-lg border-0 p-0 shadow-sm"
                    />
                    <div className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 font-mono text-sm text-stone-600 uppercase">
                      {fontColor}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-600">背景顏色</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-10 w-10 cursor-pointer overflow-hidden rounded-lg border-0 p-0 shadow-sm"
                    />
                    <div className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 font-mono text-sm text-stone-600 uppercase">
                      {bgColor}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleReset}
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
                className="focus:ring-primary h-32 w-full resize-none rounded-xl border border-stone-200 bg-stone-50 p-4 text-stone-700 transition-all outline-none placeholder:text-stone-400 focus:border-transparent focus:ring-2"
              />
            </div>

            {/* Font Preview */}
            <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm">
              <div
                className="flex flex-1 items-center justify-center overflow-auto p-8 transition-colors duration-300"
                style={{ backgroundColor: bgColor }}
              >
                <p
                  style={{
                    fontFamily: currentFont ? `"${currentFont.family}"` : 'sans-serif',
                    color: fontColor,
                    fontSize: `${fontSize}px`,
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
                <p className="text-xs font-medium text-stone-400">
                  {currentFont
                    ? `使用字體: ${currentFont.name}`
                    : '尚無上傳字體，目前使用系統預設字體'}
                </p>
                {currentFont && (
                  <button
                    onClick={() => {
                      setCurrentFont(null);
                      setInputText('');
                    }}
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
      )}

      {/* Comparison Mode */}
      {tab === 'comparison' && (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 pb-40 md:gap-8 lg:grid-cols-12">
          {/* Left Panel - Upload */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            {/* Upload Section */}
            <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Upload className="text-primary h-5 w-5" />
                <h2 className="text-lg font-bold text-stone-800">上傳字型</h2>
              </div>

              <div
                onClick={() => document.getElementById('file-input-comparison')?.click()}
                onDragEnter={handleComparisonDrag('main')}
                onDragLeave={handleComparisonDrag('main')}
                onDragOver={handleComparisonDrag('main')}
                onDrop={handleComparisonDrop('main')}
                className={`flex min-h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                  dragActiveId === 'main'
                    ? 'border-primary/50 bg-primary/5'
                    : analysingId
                      ? 'bg-primary/5 border-orange-200'
                      : 'hover:border-primary/50 border-stone-300 hover:bg-stone-50'
                }`}
              >
                <input
                  id="file-input-comparison"
                  type="file"
                  className="hidden"
                  accept=".ttf,.otf,.woff,.woff2"
                  onChange={handleComparisonFileUpload('main')}
                />

                {analysingId ? (
                  <>
                    <Loader2 className="text-primary h-8 w-8 animate-spin" />
                    <span className="text-sm text-stone-500">正在分析字型...</span>
                  </>
                ) : (
                  <>
                    <div className="rounded-full bg-stone-100 p-3">
                      <Upload className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-700">點擊選擇或拖拽放入</p>
                      <p className="text-xs text-stone-500">支援 TTF, OTF, WOFF, WOFF2</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Font List */}
            {comparisonSlots.some((s) => s.font !== null) && (
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
                          onClick={() => handleRemoveComparisonFont(slot.id)}
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
                    <span className="text-primary font-mono text-sm font-bold">{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="150"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="accent-primary h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-600">字體顏色</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={fontColor}
                      onChange={(e) => setFontColor(e.target.value)}
                      className="h-10 w-10 cursor-pointer overflow-hidden rounded-lg border-0 p-0 shadow-sm"
                    />
                    <div className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 font-mono text-sm text-stone-600 uppercase">
                      {fontColor}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-600">背景顏色</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-10 w-10 cursor-pointer overflow-hidden rounded-lg border-0 p-0 shadow-sm"
                    />
                    <div className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 font-mono text-sm text-stone-600 uppercase">
                      {bgColor}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleReset}
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
                className="focus:ring-primary h-24 w-full resize-none rounded-xl border border-stone-200 bg-stone-50 p-4 text-stone-700 transition-all outline-none placeholder:text-stone-400 focus:border-transparent focus:ring-2"
              />
            </div>

            {/* Comparison Previews - Side by Side */}
            {comparisonSlots.some((s) => s.font !== null) ? (
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
                        style={{ backgroundColor: bgColor }}
                      >
                        <p
                          style={{
                            fontFamily: slot.font ? `"${slot.font.family}"` : 'sans-serif',
                            color: fontColor,
                            fontSize: `${fontSize}px`,
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
                        <p className="text-xs font-medium text-stone-600">{slot.font?.name}</p>
                        <p className="text-xs text-stone-400">{slot.font?.category}</p>
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
      )}
    </div>
  );
}
