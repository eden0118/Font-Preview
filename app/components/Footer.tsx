import React from 'react';
import { Shield, Github, Coffee, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-100 bg-white px-4 py-6 text-center text-xs text-stone-500 sm:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-baseline justify-between gap-3 px-6 md:flex-row">
        {/* 應用名稱 */}
        <div className="flex w-full items-center justify-between gap-3 md:justify-start">
          <h3 className="text-lg font-bold text-stone-900">FontFlow</h3>
          <span className="text-infoText flex items-center gap-1">
            <a
              href="https://github.com/eden0118/Font-Preview.git"
              target="_blank"
              className="icon-btn"
              rel="noopener noreferrer"
            >
              <Github size={16} strokeWidth={2.5} />
            </a>
            <a
              href="mailto:k307849@gmail.com"
              target="_blank"
              className="icon-btn"
              rel="noopener noreferrer"
            >
              <Send size={16} strokeWidth={2.5} />
            </a>
            <a
              href="https://www.buymeacoffee.com/eden0118"
              target="_blank"
              className="icon-btn"
              rel="noopener noreferrer"
            >
              <Coffee size={16} strokeWidth={2.5} />
            </a>
          </span>
        </div>

        {/* 版權與功能說明 */}
        <div className="space-y-0.5 text-left text-[10px] md:text-right md:text-xs">
          <p className="text-infoText flex min-w-max gap-1">
            <Shield size={14} /> 所有處理均在本地完成，不上傳任何資料到伺服器。
          </p>
          <p>© {new Date().getFullYear()} Font Flow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
