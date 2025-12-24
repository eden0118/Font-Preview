import React from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface FontUploadProps {
  isDragActive: boolean;
  isAnalyzing: boolean;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
  inputId: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  variant?: 'default' | 'comparison';
  uploadError?: string | null;
}

export const FontUploadZone: React.FC<FontUploadProps> = ({
  isDragActive,
  isAnalyzing,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onClick,
  inputId,
  onChange,
  variant = 'default',
  uploadError,
}) => {
  const colorClass = variant === 'comparison' ? 'amber' : 'blue';

  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Upload className={`h-5 w-5 text-${colorClass}-600`} />
        <h2 className="text-lg font-bold text-stone-800">上傳字型檔案</h2>
      </div>

      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={onClick}
        className={`flex min-h-52 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all ${
          isDragActive
            ? `border-${colorClass}-400 bg-${colorClass}-50`
            : isAnalyzing
              ? 'border-orange-200 bg-orange-50'
              : `hover:border-${colorClass}-300 border-stone-300 hover:bg-stone-50`
        }`}
      >
        <input
          id={inputId}
          type="file"
          className="hidden"
          accept=".ttf,.otf,.woff,.woff2"
          onChange={onChange}
        />

        {isAnalyzing ? (
          <>
            <Loader2 className={`h-8 w-8 animate-spin text-${colorClass}-600`} />
            <span className="text-sm text-stone-600">正在分析字型...</span>
          </>
        ) : (
          <>
            <div className={`rounded-full bg-${colorClass}-100 p-3`}>
              <Upload className={`h-6 w-6 text-${colorClass}-600`} />
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
  );
};
