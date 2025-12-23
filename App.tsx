import React, { useState, useRef, useEffect } from 'react';
import { Upload, RefreshCw, Type, Trash2, Info, CheckCircle, AlertCircle, Loader2, FileType } from 'lucide-react';
import { analyzeFontFile, loadFontFace } from './utils/fontHelper';
import { FontDefinition, DetectedLanguage } from './types';
import { detectLanguage } from './utils/langUtils';
import { SAMPLE_TEXTS } from './constants';
import { generateCreativeText } from './services/geminiService';

const App: React.FC = () => {
  // UI State
  const [fontColor, setFontColor] = useState<string>('#292524'); // stone-800
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [fontSize, setFontSize] = useState<number>(32);
  const [inputText, setInputText] = useState<string>(SAMPLE_TEXTS.tc);
  
  // Font State
  const [currentFont, setCurrentFont] = useState<FontDefinition | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // AI Generation State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setFontColor('#292524'); // stone-800
    setBgColor('#FFFFFF');
    setFontSize(32);
    // Optional: Reset text or keep it
  };

  const handleClearText = () => {
    setInputText('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setUploadError(null);
    setCurrentFont(null); // Reset current font while loading

    try {
        // 1. Analyze
        const fontDef = await analyzeFontFile(file);
        
        // 2. Load
        const buffer = await file.arrayBuffer();
        await loadFontFace(fontDef.family, buffer);

        // 3. Set State
        setCurrentFont(fontDef);
        
        // 4. Smart Text Switch Logic
        // Priority: Korean > Japanese > Chinese > English
        // We check if the font supports a language, and if the current text DOESN'T match that language, we switch.
        
        const currentLang = detectLanguage(inputText);
        
        if (fontDef.tags.includes('ko') && currentLang !== DetectedLanguage.KO) {
             setInputText(SAMPLE_TEXTS.ko);
        } else if (fontDef.tags.includes('ja') && currentLang !== DetectedLanguage.JA) {
             setInputText(SAMPLE_TEXTS.ja);
        } else if (fontDef.tags.includes('tc') && !fontDef.tags.includes('sc') && currentLang !== DetectedLanguage.TC) {
             setInputText(SAMPLE_TEXTS.tc);
        } else if (fontDef.tags.includes('sc') && !fontDef.tags.includes('tc') && currentLang !== DetectedLanguage.SC) {
             setInputText(SAMPLE_TEXTS.sc);
        } else if (fontDef.tags.includes('en') && fontDef.tags.length === 1 && currentLang !== DetectedLanguage.EN) {
             setInputText(SAMPLE_TEXTS.en);
        }

    } catch (err) {
        console.error(err);
        setUploadError("Failed to parse font file. Please try another TTF/OTF/WOFF file.");
    } finally {
        setIsAnalyzing(false);
        // Clear input to allow re-uploading same file
        e.target.value = '';
    }
  };

  const handleGenerateText = async () => {
      setIsGenerating(true);
      try {
        const langInfo = detectLanguage(inputText);
        let requestLang: 'tc' | 'sc' | 'ja' | 'ko' | 'en' = 'tc';

        if (langInfo === DetectedLanguage.SC) requestLang = 'sc';
        else if (langInfo === DetectedLanguage.JA) requestLang = 'ja';
        else if (langInfo === DetectedLanguage.KO) requestLang = 'ko';
        else if (langInfo === DetectedLanguage.EN) requestLang = 'en';

        const moods = ['Poetic', 'Modern', 'Funny', 'Philosophical', 'Tech-savvy'];
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
  
        const text = await generateCreativeText({
          mood: randomMood,
          language: requestLang
        });
        
        if (text) setInputText(text);
      } catch (e) {
        alert("AI Text Generation unavailable (Check API Key).");
      } finally {
        setIsGenerating(false);
      }
    };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 py-10 px-4 md:px-8">
      
      {/* Header Section */}
      <header className="text-center mb-12 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-4 tracking-tight">
          上傳字體檔案，即時預覽效果
        </h1>
        <p className="text-stone-500 text-sm md:text-base">
          上傳 TTF、OTF 等字體檔案，輸入自訂文字，立即查看字體效果，無需安裝字體到系統
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-1.5 rounded-full text-xs font-medium border border-orange-100">
            <Info className="w-3.5 h-3.5" />
            支援 TTF, OTF, WOFF, WOFF2 格式
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Controls & Upload */}
        <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Upload Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <div className="flex items-center gap-2 mb-4">
                    <Upload className="w-5 h-5 text-orange-500" />
                    <h2 className="font-bold text-lg text-stone-800">上傳字體檔案</h2>
                </div>

                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                        flex flex-col items-center justify-center gap-3 min-h-[200px]
                        ${isAnalyzing ? 'bg-orange-50 border-orange-200' : 'border-stone-300 hover:border-orange-400 hover:bg-stone-50'}
                    `}
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
                            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                            <span className="text-sm text-stone-500">正在分析字型...</span>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center text-stone-400">
                                <FileType className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-stone-700">點擊或拖曳檔案到此處</p>
                                <p className="text-xs text-stone-400">支援 TTF, OTF, WOFF, WOFF2</p>
                            </div>
                        </>
                    )}
                </div>

                {uploadError && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg flex items-start gap-2 border border-red-100">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        {uploadError}
                    </div>
                )}

                {currentFont && (
                    <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-bold text-emerald-800">分析完成</span>
                        </div>
                        <p className="text-xs text-emerald-700 mb-2 font-medium break-all">{currentFont.name}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                            {currentFont.tags.includes('tc') && (
                                <span className="px-2 py-0.5 bg-white text-emerald-600 text-[10px] font-bold uppercase rounded border border-emerald-200 shadow-sm">
                                    繁體中文
                                </span>
                            )}
                            {currentFont.tags.includes('sc') && (
                                <span className="px-2 py-0.5 bg-white text-emerald-600 text-[10px] font-bold uppercase rounded border border-emerald-200 shadow-sm">
                                    簡體中文
                                </span>
                            )}
                            {currentFont.tags.includes('ja') && (
                                <span className="px-2 py-0.5 bg-white text-pink-600 text-[10px] font-bold uppercase rounded border border-pink-200 shadow-sm">
                                    日本語 (Japanese)
                                </span>
                            )}
                            {currentFont.tags.includes('ko') && (
                                <span className="px-2 py-0.5 bg-white text-blue-600 text-[10px] font-bold uppercase rounded border border-blue-200 shadow-sm">
                                    한국어 (Korean)
                                </span>
                            )}
                            {currentFont.tags.includes('en') && (
                                <span className="px-2 py-0.5 bg-white text-amber-600 text-[10px] font-bold uppercase rounded border border-amber-200 shadow-sm">
                                    English
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Settings Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <h3 className="font-bold text-lg text-stone-800 mb-6">預覽設定</h3>
                
                <div className="space-y-6">
                    {/* Font Size */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-stone-600">字體大小</label>
                            <span className="text-sm font-mono text-orange-600 font-bold">{fontSize}px</span>
                        </div>
                        <input 
                            type="range" 
                            min="12" 
                            max="150" 
                            value={fontSize} 
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                    </div>

                    {/* Colors */}
                    <div>
                        <label className="text-sm font-medium text-stone-600 mb-2 block">字體顏色</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="color" 
                                value={fontColor} 
                                onChange={(e) => setFontColor(e.target.value)}
                                className="w-10 h-10 p-0 border-0 rounded-lg cursor-pointer shadow-sm overflow-hidden" 
                            />
                            <div className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 font-mono uppercase">
                                {fontColor}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-stone-600 mb-2 block">背景顏色</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="color" 
                                value={bgColor} 
                                onChange={(e) => setBgColor(e.target.value)}
                                className="w-10 h-10 p-0 border-0 rounded-lg cursor-pointer shadow-sm overflow-hidden" 
                            />
                             <div className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 font-mono uppercase">
                                {bgColor}
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleReset}
                        className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        重置設定
                    </button>
                </div>
            </div>

        </div>

        {/* RIGHT COLUMN: Preview */}
        <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Input Area */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                 <div className="flex justify-between items-center mb-4">
                     <div className="flex items-center gap-2">
                        <Type className="w-5 h-5 text-orange-500" />
                        <h3 className="font-bold text-lg text-stone-800">字體預覽</h3>
                     </div>
                     <button 
                        onClick={handleGenerateText}
                        disabled={isGenerating}
                        className="text-xs flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50 transition-colors"
                     >
                        {isGenerating ? <Loader2 className="w-3 h-3 animate-spin"/> : <Type className="w-3 h-3" />}
                        AI 產生範例
                     </button>
                 </div>
                 <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="輸入預覽文字..."
                    className="w-full h-32 p-4 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-stone-700 transition-all placeholder:text-stone-400"
                 />
            </div>

            {/* Preview Canvas */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 flex-1 flex flex-col min-h-[500px]">
                <div 
                    className="flex-1 p-8 overflow-auto flex items-center justify-center relative rounded-t-2xl transition-colors duration-300"
                    style={{ 
                        backgroundColor: bgColor 
                    }}
                >   
                    {/* This ensures the user sees something even if no font is uploaded yet */}
                    {!currentFont && !inputText && (
                         <div className="text-center opacity-30 select-none">
                            <h2 className="text-4xl font-bold mb-4" style={{ color: fontColor }}>Preview</h2>
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
                            whiteSpace: 'pre-wrap'
                        }}
                    >
                        {inputText || (currentFont ? "請輸入文字預覽效果" : "Hello, World! 這是一個字體預覽範例。")}
                    </p>
                </div>

                {/* Footer Action Bar */}
                <div className="p-4 border-t border-stone-100 bg-stone-50/50 rounded-b-2xl flex justify-between items-center">
                    <p className="text-xs text-stone-400">
                        {currentFont 
                            ? `使用字體: ${currentFont.name}` 
                            : "尚無上傳字體，目前使用系統預設字體"}
                    </p>
                    <button 
                        onClick={handleClearText}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
                    >
                        <Trash2 className="w-4 h-4" />
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