/**
 * FeatureCard - 首頁功能卡片元件
 *
 * @description
 * 可點擊的功能卡片，用於展示主要功能入口點（字型分析、字型比較）
 *
 * @features
 * - 響應式設計（桌面/行動裝置自適應）
 * - 流暢的 hover 轉場效果
 * - 圖示與文字混合佈局
 *
 * @example
 * ```tsx
 * <FeatureCard
 *   href="/analysis"
 *   icon={BarChart3}
 *   title="字型分析"
 *   description="上傳字型檢測繁體中文支援度..."
 *   buttonText="開始分析"
 * />
 * ```
 */
import React from 'react';
import Link from 'next/link';
import { ArrowRight, LucideIcon } from 'lucide-react';

/**
 * FeatureCard 屬性定義
 */
interface FeatureCardProps {
  /** 點擊後導向的路徑 */
  href: string;
  /** Lucide 圖示元件 */
  icon: LucideIcon;
  /** 卡片標題 */
  title: string;
  /** 功能說明文字 */
  description: string;
  /** 按鈕文字 */
  buttonText: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  href,
  icon: Icon,
  title,
  description,
  buttonText,
}) => {
  return (
    <Link href={href}>
      <div className="group h-full cursor-pointer rounded-2xl border border-stone-100 bg-white p-6 shadow-md transition-shadow hover:shadow-lg sm:p-8">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-all group-hover:shadow-md sm:mb-4 sm:h-12 sm:w-12">
          <Icon size={20} className="text-primary sm:h-6 sm:w-6" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-stone-800 sm:text-xl">{title}</h3>
        <p className="mb-4 text-xs leading-relaxed text-stone-600 sm:mb-6 sm:text-sm">
          {description}
        </p>
        <div className="hover:text-primary flex items-center gap-1 font-medium transition-colors">
          {buttonText}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};
