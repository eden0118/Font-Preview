import React from 'react';
import { FontDefinition } from '../types';

interface FontCardProps {
  font: FontDefinition;
  text: string;
  fontSize: number;
}

const FontCard: React.FC<FontCardProps> = ({ font, text, fontSize }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 group flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="font-semibold text-slate-800">{font.name}</h3>
          <p className="text-xs text-slate-400">{font.category} • {font.tags.map(t => t.toUpperCase()).join('/')}</p>
        </div>
        <button 
          className="opacity-0 group-hover:opacity-100 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded transition-opacity"
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
        className="flex-1 p-6 flex items-center justify-center min-h-[160px] overflow-hidden bg-white relative"
        style={{ 
          backgroundImage: 'radial-gradient(#f1f5f9 1px, transparent 1px)', 
          backgroundSize: '20px 20px' 
        }}
      >
        <p 
          style={{ 
            fontFamily: font.family, 
            fontSize: `${fontSize}px`,
            lineHeight: 1.4,
            wordBreak: 'break-word'
          }}
          className="text-center text-slate-900 transition-all duration-200"
        >
          {text}
        </p>
      </div>
      
      {/* Footer description */}
      {font.description && (
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
           {font.description}
        </div>
      )}
    </div>
  );
};

export default FontCard;