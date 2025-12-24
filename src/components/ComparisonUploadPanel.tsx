import React, { useRef } from 'react';
import { Upload, Loader2, X } from 'lucide-react';
import { FontDefinition } from '../types';

interface ComparisonUploadPanelProps {
  fonts: Array<{ id: string; font: FontDefinition | null }>;
  analysingId: string | null;
  dragActiveId: string | null;
  maxFonts: number;
  onFileUpload: (slotId: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragEnter: (slotId: string) => (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (slotId: string) => (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (slotId: string) => (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (slotId: string) => (e: React.DragEvent<HTMLDivElement>) => void;
  onRemove: (slotId: string) => void;
}

const ComparisonUploadPanel: React.FC<ComparisonUploadPanelProps> = ({
  fonts,
  analysingId,
  dragActiveId,
  maxFonts,
  onFileUpload,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onRemove,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedCount = fonts.filter((f) => f.font !== null).length;
  const hasSpace = uploadedCount < maxFonts;

  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Upload className="text-primary h-5 w-5" />
          <div>
            <h3 className="text-lg font-bold text-stone-800">上傳字體</h3>
            <p className="text-xs text-stone-400">
              已上傳 {uploadedCount}/{maxFonts} 個字體
            </p>
          </div>
        </div>
        <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-bold">
          {uploadedCount}/{maxFonts}
        </span>
      </div>

      {/* Upload Area - Show only if space available */}
      {hasSpace && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={onDragEnter('new')}
          onDragLeave={onDragLeave('new')}
          onDragOver={onDragOver('new')}
          onDrop={onDrop('new')}
          className={`mb-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all ${
            dragActiveId === 'new'
              ? 'border-primary/50 bg-primary/5'
              : analysingId === 'new'
                ? 'bg-primary/5 border-orange-200'
                : 'hover:border-primary/50 border-stone-300 hover:bg-stone-50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".ttf,.otf,.woff,.woff2"
            onChange={onFileUpload('new')}
          />

          {analysingId === 'new' ? (
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
      )}

      {/* Font List */}
      {uploadedCount > 0 && (
        <div className="space-y-2 border-t border-stone-100 pt-4">
          {fonts.map(
            (item, index) =>
              item.font && (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-stone-200 bg-stone-50 p-3"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-700">{item.font.name}</p>
                    <p className="text-xs text-stone-500">{item.font.category}</p>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="ml-3 flex cursor-pointer items-center justify-center rounded-md p-1.5 text-stone-400 transition-colors hover:bg-white hover:text-stone-600"
                    title="移除此字體"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default ComparisonUploadPanel;
