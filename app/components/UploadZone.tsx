import React from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface UploadZoneProps {
  isDragActive: boolean;
  isAnalyzing: boolean;
  uploadError?: string | null;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDragOver: (e: React.DragEvent<HTMLElement>) => void;
  onDrop: (e: React.DragEvent<HTMLElement>) => void;
  onClick: () => void;
  fileInputId: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  isDragActive,
  isAnalyzing,
  uploadError,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onClick,
  fileInputId,
  onFileChange,
}) => {
  return (
    <>
      <label
        htmlFor={fileInputId}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`flex min-h-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-all sm:min-h-52 sm:gap-3 sm:p-8 ${
          isDragActive
            ? 'border-primary/30 bg-primary-light'
            : isAnalyzing
              ? 'border-primary/50 bg-primary/5'
              : 'border-stone-300 hover:border-primary/30 hover:bg-stone-50'
        }`}
      >
        <input
          id={fileInputId}
          type="file"
          className="hidden"
          accept=".ttf,.otf,.woff,.woff2"
          onChange={onFileChange}
        />

        {isAnalyzing ? (
          <>
            <Loader2 className="h-7 w-7 animate-spin text-primary sm:h-8 sm:w-8" />
            <span className="text-xs text-stone-600 sm:text-sm">正在分析字型...</span>
          </>
        ) : (
          <>
            <div className="rounded-full bg-primary-light p-2 sm:p-3">
              <Upload className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-stone-700 sm:text-sm">點擊選擇或拖拽放入</p>
              <p className="text-xs text-stone-500">支援 TTF, OTF, WOFF, WOFF2</p>
            </div>
          </>
        )}
      </label>

      {uploadError && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
          {uploadError}
        </div>
      )}
    </>
  );
};
