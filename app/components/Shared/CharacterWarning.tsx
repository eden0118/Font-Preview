/**
 * CharacterWarning 元件 - 通用缺字警告
 *
 * 職責：統一展示缺字警告的UI，支援多個警告等級
 * 機制：可控制展開/收起，配置警告顏色與標題
 */

import React from 'react';
import { AlertTriangle, ChevronDown } from 'lucide-react';

export type WarningLevel = 'error' | 'warning' | 'note';

const WARNING_STYLES: Record<
  WarningLevel,
  { border: string; bg: string; title: string; icon: string; text: string }
> = {
  error: {
    border: 'border-red-200',
    bg: 'bg-red-50',
    title: 'text-red-800',
    icon: 'text-red-800',
    text: 'text-red-700',
  },
  warning: {
    border: 'border-orange-200',
    bg: 'bg-orange-50',
    title: 'text-orange-800',
    icon: 'text-orange-800',
    text: 'text-orange-700',
  },
  note: {
    border: 'border-yellow-200',
    bg: 'bg-yellow-50',
    title: 'text-yellow-800',
    icon: 'text-yellow-800',
    text: 'text-yellow-700',
  },
};

interface CharacterWarningProps {
  /** 警告等級（紅/橙/黃） */
  level: WarningLevel;
  /** 警告標題 */
  title: string;
  /** 缺失字符串 */
  characters: string;
  /** 是否預設展開 */
  defaultExpanded?: boolean;
  /** 是否可折疊 */
  collapsible?: boolean;
}

export const CharacterWarning: React.FC<CharacterWarningProps> = ({
  level,
  title,
  characters,
  defaultExpanded = false,
  collapsible = true,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const styles = WARNING_STYLES[level];

  if (!collapsible) {
    return (
      <div
        className={`mt-3 rounded-lg border border-t border-stone-200 pt-3 ${styles.border} ${styles.bg} p-3`}
      >
        <div className="flex gap-2">
          <AlertTriangle size={16} className={`mt-0.5 shrink-0 ${styles.icon}`} />
          <p className={`text-xs font-semibold ${styles.title}`}>{title}</p>
        </div>
        <p className={`ml-6 font-mono text-xs wrap-break-word ${styles.text}`}>
          {characters.split('').join('  ')}
        </p>
      </div>
    );
  }

  return (
    <button onClick={() => setIsExpanded(!isExpanded)} className="w-full text-left">
      <div
        className={`mt-3 rounded-lg border border-t border-stone-200 pt-3 ${styles.border} ${styles.bg} p-3`}
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            size={16}
            className={`mt-0.5 shrink-0 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            } ${styles.icon}`}
          />
          <AlertTriangle size={16} className={`mt-0.5 shrink-0 ${styles.icon}`} />
          <p className={`text-xs font-semibold ${styles.title}`}>{title}</p>
        </div>
        {isExpanded && (
          <p className={`mt-1 ml-6 font-mono text-xs wrap-break-word ${styles.text}`}>
            {characters.split('').join('  ')}
          </p>
        )}
      </div>
    </button>
  );
};
