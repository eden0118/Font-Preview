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
      <PageHeader title="字型分析" />

      {/* Information Banner */}
      <div className="bg-primary/20 p-1 sm:p-2 lg:col-span-4">
        <div className="mx-auto flex max-w-6xl items-start justify-center gap-2 text-xs text-blue-800 sm:text-sm">
          <Info size={16} className="mt-0.5 flex-shrink-0" />
          <p className="leading-relaxed font-semibold">
            專為繁體中文使用者設計。上傳日文、簡體或其他字型，快速檢測其對繁體中文的支援程度。覆蓋率越高，代表缺字情況越少。
          </p>
        </div>
      </div>

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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-6">
          <h2 className="mb-4 text-lg font-bold text-stone-800">字型分析邏輯說明</h2>
          <div className="space-y-4 text-sm text-stone-700">
            <div>
              <h3 className="font-semibold text-stone-800">📊 覆蓋率計算</h3>
              <p className="mt-1 text-xs text-stone-600">
                檢查 <strong>8,602 個繁體字符</strong>（生存字 72 + 核心字 6,373 + 粵語字 137 +
                台灣字 930 + 人名字 625）
                <br />
                <em>來源：JetBrains Font v0.9 官方 glyph 清單（最新版）</em>
              </p>
              <p className="mt-1 text-xs text-stone-600">
                公式：
                <code className="rounded bg-white px-2 py-1 font-mono">
                  覆蓋率 = (總字數 - 缺字數) / 總字數 × 100%
                </code>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-stone-800">⚖️ 得分加權</h3>
              <ul className="mt-2 space-y-1 text-xs text-stone-600">
                <li>
                  • <strong>生存字</strong> 40% — 日常溝通必需（72 字：的、一、是、人...）
                </li>
                <li>
                  • <strong>核心字</strong> 35% — 基礎溝通與商業文件（6,373 字）
                </li>
                <li>
                  • <strong>特定用途</strong> 15% — 粵語、台灣、人名（各佔 5%）
                </li>
                <li>
                  • <strong>標點符號</strong> 10% — 中文排版必需
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-stone-800">🏷️ 支援判定標準</h3>
              <ul className="mt-2 space-y-1 text-xs text-stone-600">
                <li>
                  • <strong>繁體中文</strong>：得分 &gt; 70% 且非簡體字型
                </li>
                <li>
                  • <strong>繁體中文（部分缺字）</strong>：得分 50~70%
                </li>
                <li>
                  • <strong>日文</strong>：日文假名 &gt; 80% 且日文漢字 &gt; 50%
                </li>
                <li>
                  • <strong>簡體中文</strong>：簡體獨有字 &gt; 70%
                </li>
                <li>
                  • <strong>粵語字、台灣字、人名字</strong>：各層級 &gt; 70%
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-stone-800">⚠️ 缺字警告</h3>
              <ul className="mt-2 space-y-1 text-xs text-stone-600">
                <li>
                  • <strong>生存字缺乏</strong>：顯示具體缺失字符（🔴 紅色警告）
                  <br />
                  <em>日常溝通將受影響，建議搭配備用字型</em>
                </li>
                <li>
                  • <strong>無生存字缺乏</strong>：只顯示覆蓋率統計
                  <br />
                  <em>日常使用無虞，可放心使用</em>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
}
