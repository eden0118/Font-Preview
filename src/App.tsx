import React, { useState, useRef } from 'react';
import {
  Upload,
  RefreshCw,
  Trash2,
  Info,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileType,
} from 'lucide-react';
import { analyzeFontFile, loadFontFace } from './utils/fontHelper';
import { FontDefinition, DetectedLanguage } from './types';
import { detectLanguage } from './utils/langUtils';
import { SAMPLE_TEXTS } from './constants';

const App: React.FC = () => {
  // UI State
  const [fontColor, setFontColor] = useState<string>('#292524');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [fontSize, setFontSize] = useState<number>(32);
  const [inputText, setInputText] = useState<string>(SAMPLE_TEXTS.tc);

  // Font State
  const [currentFont, setCurrentFont] = useState<FontDefinition | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setFontColor('#292524');
    setBgColor('#FFFFFF');
    setFontSize(32);
  };

  const handleClearText = () => {
    setInputText('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFont(file);
  };

  const processFont = async (file: File) => {
    setIsAnalyzing(true);
    setUploadError(null);
    setCurrentFont(null);

    try {
      const fontDef = await analyzeFontFile(file);
      const buffer = await file.arrayBuffer();
      await loadFontFace(fontDef.family, buffer);
      setCurrentFont(fontDef);

      const currentLang = detectLanguage(inputText);

      if (fontDef.tags.includes('ko') && currentLang !== DetectedLanguage.KO) {
        setInputText(SAMPLE_TEXTS.ko);
      } else if (fontDef.tags.includes('ja') && currentLang !== DetectedLanguage.JA) {
        setInputText(SAMPLE_TEXTS.ja);
      } else if (
        fontDef.tags.includes('tc') &&
        !fontDef.tags.includes('sc') &&
        currentLang !== DetectedLanguage.TC
      ) {
        setInputText(SAMPLE_TEXTS.tc);
      } else if (
        fontDef.tags.includes('sc') &&
        !fontDef.tags.includes('tc') &&
        currentLang !== DetectedLanguage.SC
      ) {
        setInputText(SAMPLE_TEXTS.sc);
      } else if (
        fontDef.tags.includes('en') &&
        fontDef.tags.length === 1 &&
        currentLang !== DetectedLanguage.EN
      ) {
        setInputText(SAMPLE_TEXTS.en);
      }
    } catch (err) {
      console.error(err);
      setUploadError('Failed to parse font file. Please try another TTF/OTF/WOFF file.');
    } finally {
      setIsAnalyzing(false);
    }
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
      // 驗證檔案類型
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

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-10 font-sans text-stone-800 md:px-8">
      <header className="mx-auto mb-12 max-w-3xl text-center">
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-stone-900 md:text-4xl">
          上傳字體檔案，即時預覽效果
        </h1>
        <p className="text-sm text-stone-500 md:text-base">
          上傳 TTF、OTF 等字體檔案，輸入自訂文字，立即查看字體效果，無需安裝字體到系統
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-1.5 text-xs font-medium text-orange-700">
          <Info className="h-3.5 w-3.5" />
          支援 TTF, OTF, WOFF, WOFF2 格式
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-4">
          <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5 text-orange-500" />
              <h2 className="text-lg font-bold text-stone-800">上傳字體檔案</h2>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`flex min-h-50 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all ${isDragActive ? 'border-orange-400 bg-orange-50' : isAnalyzing ? 'border-orange-200 bg-orange-50' : 'border-stone-300 hover:border-orange-400 hover:bg-stone-50'} `}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".ttf,.otf,.woff,.woff2"
                onChange={handleFileUpload}
              />

              {isAnalyzing ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                  <span className="text-sm text-stone-500">正在分析字型...</span>
                </>
              ) : isDragActive ? (
                <>
                  <Upload className="h-8 w-8 text-orange-500" />
                  <span className="text-sm font-medium text-orange-600">放開即可上傳</span>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 text-stone-400">
                    <FileType className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-stone-700">拖曳檔案或點擊選擇</p>
                    <p className="text-xs text-stone-400">支援 TTF, OTF, WOFF, WOFF2</p>
                  </div>
                </>
              )}
            </div>

            {uploadError && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-red-600">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {uploadError}
              </div>
            )}

            {currentFont && (
              <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="mb-1 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-800">分析完成</span>
                </div>
                <p className="mb-2 text-xs font-medium break-all text-emerald-700">
                  {currentFont.name}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {currentFont.tags.includes('tc') && (
                    <span className="rounded border border-emerald-200 bg-white px-2 py-0.5 text-xs font-bold text-emerald-600 uppercase shadow-sm">
                      繁體中文
                    </span>
                  )}
                  {currentFont.tags.includes('sc') && (
                    <span className="rounded border border-emerald-200 bg-white px-2 py-0.5 text-xs font-bold text-emerald-600 uppercase shadow-sm">
                      簡體中文
                    </span>
                  )}
                  {currentFont.tags.includes('ja') && (
                    <span className="rounded border border-pink-200 bg-white px-2 py-0.5 text-xs font-bold text-pink-600 uppercase shadow-sm">
                      日本語
                    </span>
                  )}
                  {currentFont.tags.includes('ko') && (
                    <span className="rounded border border-blue-200 bg-white px-2 py-0.5 text-xs font-bold text-blue-600 uppercase shadow-sm">
                      한국어
                    </span>
                  )}
                  {currentFont.tags.includes('en') && (
                    <span className="rounded border border-amber-200 bg-white px-2 py-0.5 text-xs font-bold text-amber-600 uppercase shadow-sm">
                      English
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-stone-800">預覽設定</h3>

            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-stone-600">字體大小</label>
                  <span className="font-mono text-sm font-bold text-orange-600">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="150"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-orange-500"
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
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-stone-100 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200"
              >
                <RefreshCw className="h-4 w-4" />
                重置設定
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-8">
          <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-bold text-stone-800">字體預覽</h3>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="輸入預覽文字..."
              className="h-32 w-full resize-none rounded-xl border border-stone-200 bg-stone-50 p-4 text-stone-700 transition-all outline-none placeholder:text-stone-400 focus:border-transparent focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex min-h-125 flex-1 flex-col rounded-2xl border border-stone-100 bg-white shadow-sm">
            <div
              className="relative flex flex-1 items-center justify-center overflow-auto rounded-t-2xl p-8 transition-colors duration-300"
              style={{
                backgroundColor: bgColor,
              }}
            >
              {!currentFont && !inputText && (
                <div className="text-center opacity-30 select-none">
                  <h2 className="mb-4 text-4xl font-bold" style={{ color: fontColor }}>
                    Preview
                  </h2>
                  <p style={{ color: fontColor }}>Upload a font to start</p>
                </div>
              )}

              <p
                style={{
                  fontFamily: currentFont ? `"${currentFont.family}"` : 'sans-serif',
                  color: fontColor,
                  fontSize: `${fontSize}px`,
                  lineHeight: 1.5,
                  wordBreak: 'break-word',
                  textAlign: 'center',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {inputText ||
                  (currentFont ? '請輸入文字預覽效果' : 'Hello, World! 這是一個字體預覽範例。')}
              </p>
            </div>

            <div className="flex items-center justify-between rounded-b-2xl border-t border-stone-100 bg-stone-50/50 p-4">
              <p className="text-xs text-stone-400">
                {currentFont
                  ? `使用字體: ${currentFont.name}`
                  : '尚無上傳字體，目前使用系統預設字體'}
              </p>
              <button
                onClick={handleClearText}
                className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-orange-600 hover:shadow-md"
              >
                <Trash2 className="h-4 w-4" />
                清空
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
