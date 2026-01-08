/**
 * MissingCharsList 元件 - 詳細的缺字列表面板
 *
 * 職責：展示預覽文字中的所有缺字
 */

import React from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';

interface MissingCharsListProps {
  missingChars: string[];
  isCompact?: boolean;
}

export const MissingCharsList: React.FC<MissingCharsListProps> = ({
  missingChars,
  isCompact = false,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (missingChars.length === 0) {
    return (
      <div className="mt-2 flex items-center gap-2 rounded-lg bg-green-50 p-2">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <p className="text-xs text-green-700">完美支援：沒有缺字！</p>
      </div>
    );
  }

  const displayChars = isCompact ? missingChars.slice(0, 20) : missingChars;

  const handleCopy = () => {
    navigator.clipboard.writeText(missingChars.join(''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-2 rounded-lg border border-orange-200 bg-orange-50 p-2">
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-xs font-medium text-orange-800">缺字列表 ({missingChars.length})</p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-orange-700 transition-colors hover:text-orange-900"
          title="複製缺字"
        >
          <Copy className="h-3 w-3" />
          {copied ? '已複製' : '複製'}
        </button>
      </div>
      <div className="break-words font-mono text-xs text-orange-700">
        {displayChars.join('')}
        {isCompact && missingChars.length > 20 && '...'}
      </div>
    </div>
  );
};
