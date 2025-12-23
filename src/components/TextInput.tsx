import React from 'react';
import { Trash2 } from 'lucide-react';

interface TextInputProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onClear: () => void;
}

const TextInput: React.FC<TextInputProps> = ({ inputText, onInputChange, onClear }) => {
  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Trash2 className="text-primary h-5 w-5" />
        <h3 className="text-lg font-bold text-stone-800">字體預覽</h3>
      </div>
      <textarea
        value={inputText}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="輸入預覽文字..."
        className="focus:ring-primary h-32 w-full resize-none rounded-xl border border-stone-200 bg-stone-50 p-4 text-stone-700 transition-all outline-none placeholder:text-stone-400 focus:border-transparent focus:ring-2"
      />
    </div>
  );
};

export default TextInput;
