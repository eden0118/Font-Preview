import React from 'react';
import { X } from 'lucide-react';
import { FontDefinition } from '@/lib/types';
import { getCoverageColor } from '@/lib/coverageHelpers';

interface FontListItemProps {
  font: FontDefinition;
  onRemove: () => void;
}

export const FontListItem: React.FC<FontListItemProps> = ({ font, onRemove }) => {
  return (
    <div className="rounded-xl border border-stone-100 bg-white p-3 sm:p-4">
      <div className="mb-2 flex items-start justify-between gap-2 sm:mb-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-stone-800">{font.name}</p>
        </div>
        <button
          onClick={onRemove}
          className="text-infoText shrink-0 transition-colors hover:text-red-600"
        >
          <X size={18} />
        </button>
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        {font.coverage && (
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-xs text-stone-600">繁體覆蓋率</span>
            <span
              className={`whitespace-nowrap text-xs font-semibold sm:text-sm ${getCoverageColor(font.coverage.tc).text}`}
            >
              {font.coverage.tc}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
