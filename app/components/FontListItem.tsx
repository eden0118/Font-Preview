import React from 'react';
import { X } from 'lucide-react';
import { FontDefinition } from '@/lib/types';

interface FontListItemProps {
  font: FontDefinition;
  onRemove: () => void;
}

export const FontListItem: React.FC<FontListItemProps> = ({ font, onRemove }) => {
  return (
    <div className="flex items-center justify-between rounded-lg border border-stone-300 bg-stone-100 px-2 py-1">
      <div className="flex-1">
        <p className="text-xs font-medium text-stone-800">{font.name}</p>
      </div>
      <button
        onClick={onRemove}
        className="text-secondaryText ml-2 inline-flex items-center justify-center rounded-full p-1.5 transition-colors hover:bg-white hover:text-red-600"
      >
        <X size={16} />
      </button>
    </div>
  );
};
