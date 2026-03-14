/**
 * FontMissingChars 元件 - 缺字警告與列表
 *
 * 職責：展示字型的各類缺字警告（基本字、常用字、標點符號）
 * 機制：組織多個 CharacterWarning 元件，統一管理缺字顯示
 */

import React from 'react';
import { FontDefinition } from '@/lib/types';
import { CharacterWarning } from '../Shared/CharacterWarning';

interface FontMissingCharsProps {
  font: FontDefinition;
}

export const FontMissingChars: React.FC<FontMissingCharsProps> = ({ font }) => {
  return (
    <div className="space-y-3">
      {/* 基本關鍵字缺失 - 紅色，不可折疊 */}
      {font.missingEssentialChars && font.missingEssentialChars.length > 0 && (
        <CharacterWarning
          level="error"
          title={`缺失基本關鍵字 ${font.missingEssentialChars.length} 個：`}
          characters={font.missingEssentialChars}
          collapsible={false}
          defaultExpanded={true}
        />
      )}

      {/* JF7000 常用字缺失 - 橙色，可折疊 */}
      {font.missingCoreOnlyChars && font.missingCoreOnlyChars.length > 0 && (
        <CharacterWarning
          level="warning"
          title={`缺失 JF7000 常用字 ${font.missingCoreOnlyChars.length} 個`}
          characters={font.missingCoreOnlyChars}
          collapsible={true}
          defaultExpanded={true}
        />
      )}

      {/* 全形標點符號缺失 - 黃色，可折疊 */}
      {font.missingPunctuationFull && font.missingPunctuationFull.length > 0 && (
        <CharacterWarning
          level="note"
          title={`缺失全形標點符號 ${font.missingPunctuationFull.length} 個`}
          characters={font.missingPunctuationFull}
          collapsible={true}
          defaultExpanded={false}
        />
      )}

      {/* 半形標點符號缺失 - 黃色，可折疊 */}
      {font.missingPunctuationHalf && font.missingPunctuationHalf.length > 0 && (
        <CharacterWarning
          level="note"
          title={`缺失半形標點符號 ${font.missingPunctuationHalf.length} 個`}
          characters={font.missingPunctuationHalf}
          collapsible={true}
          defaultExpanded={false}
        />
      )}
    </div>
  );
};
