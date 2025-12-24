import React from 'react';
import { X } from 'lucide-react';
import { FontDefinition } from '@/lib/types';

interface FontListItemProps {
  font: FontDefinition;
  onRemove: () => void;
}

export const FontListItem: React.FC<FontListItemProps> = ({ font, onRemove }) => {
  return (
    <div className="flex items-center justify-between rounded-lg border border-stone-200 bg-stone-50 p-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-stone-800">{font.name}</p>
      </div>
      <button
        onClick={onRemove}
        className="ml-2 inline-flex items-center justify-center rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-white hover:text-red-600"
      >
        <X size={18} />
      </button>
    </div>
  );
};
