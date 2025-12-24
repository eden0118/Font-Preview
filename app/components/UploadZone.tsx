import React from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface UploadZoneProps {
  isDragActive: boolean;
  isAnalyzing: boolean;
  uploadError?: string | null;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
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
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={onClick}
        className={`flex min-h-52 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all ${
          isDragActive
            ? 'border-primary/30 bg-primary-light'
            : isAnalyzing
              ? 'border-primary/50 bg-primary/5'
              : 'hover:border-primary/30 border-stone-300 hover:bg-stone-50'
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
    </>
  );
};
