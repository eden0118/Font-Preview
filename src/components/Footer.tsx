import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="absolute bottom-0 w-full border-t border-stone-200 bg-white py-8 text-center">
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-sm text-stone-700">
          🛡️ <span className="font-medium">隱私承諾</span>
          ：我們不存取、不存儲、不分享任何使用者資訊。所有字體分析和預覽均在您的瀏覽器本地完成，不上傳任何檔案。
        </p>
        <p className="text-xs text-stone-400">
          © 2024 FontFlow. All rights reserved. | Made with ❤️ using React + Vite + Tailwind CSS
        </p>
      </div>
    </footer>
  );
};

export default Footer;
