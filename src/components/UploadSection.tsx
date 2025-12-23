import React, { useRef } from 'react';
import { Upload, FileType, AlertCircle, Loader2 } from 'lucide-react';

interface UploadSectionProps {
  isAnalyzing: boolean;
  isDragActive: boolean;
  uploadError: string | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  isAnalyzing,
  isDragActive,
  uploadError,
  onFileUpload,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Upload className="text-primary h-5 w-5" />
        <h2 className="text-lg font-bold text-stone-800">上傳字體檔案</h2>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`flex min-h-50 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all ${
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
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <span className="text-sm text-stone-500">正在分析字型...</span>
          </>
        ) : isDragActive ? (
          <>
            <Upload className="text-primary h-8 w-8" />
            <span className="text-primary text-sm font-medium">放開即可上傳</span>
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
    </div>
  );
};

export default UploadSection;
