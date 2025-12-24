import React from 'react';
import { FontDefinition } from '@/lib/types';

interface FontInfoProps {
  font: FontDefinition;
}

export const FontInfo: React.FC<FontInfoProps> = ({ font }) => {
  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-stone-800">字型信息</h3>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-stone-500">名稱</p>
          <p className="font-medium text-stone-700">{font.name}</p>
        </div>
        <div>
          <p className="text-xs text-stone-500">類別</p>
          <p className="font-medium text-stone-700">{font.category}</p>
        </div>
        {font.glyphCount && (
          <div>
            <p className="text-xs text-stone-500">字符數</p>
            <p className="font-medium text-stone-700">{font.glyphCount.toLocaleString()}</p>
          </div>
        )}
        {font.description && (
          <div>
            <p className="text-xs text-stone-500">描述</p>
            <p className="text-sm text-stone-600">{font.description}</p>
          </div>
        )}

        {/* Coverage Info */}
        {font.coverage && (
          <div className="border-t border-stone-200 pt-3">
            <p className="mb-3 text-xs font-semibold text-stone-600">語言覆蓋率</p>
            <div className="space-y-2">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-stone-600">繁體中文</span>
                  <span className="text-primary text-xs font-medium">{font.coverage.tc}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                  <div className="bg-primary h-full" style={{ width: `${font.coverage.tc}%` }} />
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-stone-600">簡體中文</span>
                  <span className="text-xs font-medium text-green-600">{font.coverage.sc}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                  <div className="h-full bg-green-500" style={{ width: `${font.coverage.sc}%` }} />
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-stone-600">日文</span>
                  <span className="text-xs font-medium text-purple-600">{font.coverage.ja}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                  <div className="h-full bg-purple-500" style={{ width: `${font.coverage.ja}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
