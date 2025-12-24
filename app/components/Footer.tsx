import React from 'react';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6 flex flex-col items-center justify-center gap-4 text-center md:flex-row md:justify-between">
          {/* 左側：應用名稱 */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-bold text-stone-900">FontFlow</h3>
            <p className="text-xs text-stone-500">字體預覽與分析工具</p>
          </div>

          {/* 中間：功能說明 */}
          <div className="text-center">
            <p className="flex items-center justify-center gap-2 text-xs text-stone-600">
              <Shield size={14} className="text-stone-400" />
              所有處理均在本地完成，不上傳任何資料到伺服器
            </p>
          </div>

          {/* 右側：版本資訊 */}
          <div className="flex flex-col items-center md:items-end">
            <p className="text-xs font-medium text-stone-600">v1.0.0</p>
            <p className="text-xs text-stone-500">最後更新於 2025 年 12 月</p>
          </div>
        </div>

        {/* 版權聲明 */}
        <div className="border-t border-stone-100 pt-6 text-center">
          <p className="text-xs text-stone-500">© {currentYear} FontFlow. 採用 MIT 授權。</p>
          <span>
            <a href="http://" target="_blank" rel="noopener noreferrer">
              Github
            </a>
            <a href="http://" target="_blank" rel="noopener noreferrer">
              Buy me a coffee
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};
