import React from 'react';
import { FontDefinition } from '../types';

interface FontCardProps {
  font: FontDefinition;
  text: string;
  fontSize: number;
}

const FontCard: React.FC<FontCardProps> = ({ font, text, fontSize }) => {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-blue-200 hover:shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/50 px-5 py-3">
        <div>
          <h3 className="font-semibold text-slate-800">{font.name}</h3>
          <p className="text-xs text-slate-400">
            {font.category} • {font.tags.map((t) => t.toUpperCase()).join('/')}
          </p>
        </div>
        <button
          className="rounded bg-slate-200 px-2 py-1 text-xs text-slate-700 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-300"
          onClick={() => {
            const css = `font-family: ${font.family};`;
            navigator.clipboard.writeText(css);
            alert(`Copied CSS: ${css}`);
          }}
        >
          Copy CSS
        </button>
      </div>

      {/* Preview Area */}
      <div
        className="relative flex min-h-[160px] flex-1 items-center justify-center overflow-hidden bg-white p-6"
        style={{
          backgroundImage: 'radial-gradient(#f1f5f9 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        <p
          style={{
            fontFamily: font.family,
            fontSize: `${fontSize}px`,
            lineHeight: 1.4,
            wordBreak: 'break-word',
          }}
          className="text-center text-slate-900 transition-all duration-200"
        >
          {text}
        </p>
      </div>

      {/* Footer description */}
      {font.description && (
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500">
          {font.description}
        </div>
      )}
    </div>
  );
};

export default FontCard;
