import React from 'react';
import { BarChart3, Zap } from 'lucide-react';
import { FeatureCard } from './components/FeatureCard';
import { Footer } from './components/Footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <main className="flex flex-1 items-center justify-center bg-linear-to-br from-stone-50 via-stone-100 to-stone-200 px-4 py-8 sm:p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center sm:mb-12">
            <h1 className="mb-2 text-3xl leading-tight font-bold text-stone-900 sm:text-4xl lg:text-5xl">
              FontFlow
            </h1>
            <p className="text-primaryText text-base sm:text-lg">
              專為繁體中文使用者打造的字型分析工具
            </p>
            <p className="text-infoText mt-2 text-xs leading-relaxed sm:mt-3 sm:text-sm">
              快速檢測日文、簡體或其他字型對繁體中文的支援程度，掌握缺字情況
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <FeatureCard
              href="/analysis"
              icon={BarChart3}
              title="字型分析"
              description="上傳字型檢測繁體中文支援度，深入分析缺字字符和語言覆蓋率。"
              buttonText="開始分析"
            />
            <FeatureCard
              href="/comparison"
              icon={Zap}
              title="字型比較"
              description="並排測試多個字型，快速找到最適合繁體中文的字體。"
              buttonText="開始比較"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
