import React, { useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { FontDefinition } from '../types';

interface FontUploadSlotProps {
  fontIndex: number;
  currentFont: FontDefinition | null;
  isAnalyzing: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragActive: boolean;
}

const FontUploadSlot: React.FC<FontUploadSlotProps> = ({
  fontIndex,
  currentFont,
  isAnalyzing,
  onFileUpload,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  isDragActive,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Upload className="text-primary h-5 w-5" />
        <h3 className="text-lg font-bold text-stone-800">字體 {fontIndex}</h3>
      </div>

      {currentFont ? (
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
          <p className="text-sm font-medium text-stone-700">{currentFont.name}</p>
          <p className="mt-1 text-xs text-stone-500">{currentFont.category}</p>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          className={`flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-all ${
            isDragActive
              ? 'border-primary/50 bg-primary/5'
              : isAnalyzing
                ? 'bg-primary/5 border-orange-200'
                : 'hover:border-primary/50 border-stone-300 hover:bg-stone-50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".ttf,.otf,.woff,.woff2"
            onChange={onFileUpload}
          />

          {isAnalyzing ? (
            <>
              <Loader2 className="text-primary h-6 w-6 animate-spin" />
              <span className="text-xs text-stone-500">正在分析字型...</span>
            </>
          ) : (
            <>
              <Upload className="text-primary/50 h-6 w-6" />
              <div>
                <p className="text-sm font-medium text-stone-600">點擊選擇或拖拽放入</p>
                <p className="text-xs text-stone-400">TTF, OTF, WOFF, WOFF2</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FontUploadSlot;
