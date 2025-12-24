import React from 'react';
import { Shield, Github, Coffee, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-100 bg-white px-4 py-6 text-center text-xs text-stone-500 sm:py-8">
      <div className="mx-auto flex w-full max-w-7xl items-baseline justify-between px-6">
        {/* 左側：應用名稱 */}
        <div className="flex flex-col items-center gap-1 md:items-start">
          <h3 className="text-lg font-bold text-stone-900">FontFlow</h3>
          <p className="text-infoText text-xs font-medium">v1.0.0</p>
        </div>

        {/* 中間：功能說明 */}
        <div className="space-y-1 text-center">
          <p className="text-infoText flex items-center justify-center gap-1 text-xs">
            <Shield size={14} className="text-stone-400" />
            所有處理均在本地完成，不上傳任何資料到伺服器
          </p>
          <p className="text-secondaryText text-xs">
            © {new Date().getFullYear()} Eden Chang. All rights reserved.
          </p>
        </div>

        {/* 右側：版本資訊 */}
        <div className="flex flex-col items-center gap-1 md:items-end">
          <span className="text-secondaryText flex items-center gap-1">
            <a
              href="https://github.com/eden0118"
              target="_blank"
              className="icon-btn"
              rel="noopener noreferrer"
            >
              <Github size={14} strokeWidth={2.5} />
            </a>
            <a
              href="mailto:k307849@gmail.com"
              target="_blank"
              className="icon-btn"
              rel="noopener noreferrer"
            >
              <Send size={14} strokeWidth={2.5} />
            </a>
            <a
              href="https://www.buymeacoffee.com/eden0118"
              target="_blank"
              className="icon-btn"
              rel="noopener noreferrer"
            >
              <Coffee size={14} strokeWidth={2.5} />
            </a>
          </span>
          <p className="text-infoText text-xs">最後更新於 2025 年 12 月</p>
        </div>
      </div>
    </footer>
  );
};
