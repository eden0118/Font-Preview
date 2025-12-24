'use client';

import React from 'react';
import { BarChart3, Zap } from 'lucide-react';
import { FeatureCard } from './components/FeatureCard';
import { Footer } from './components/Footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <main className="flex flex-1 items-center justify-center bg-linear-to-br from-stone-50 via-stone-100 to-stone-200 p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-2 text-5xl font-bold text-stone-900">FontFlow</h1>
            <p className="text-lg text-stone-600">一站式字體預覽和分析工具</p>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <FeatureCard
              href="/analysis"
              icon={BarChart3}
              title="字型分析"
              description="上傳字型檔案，深入分析其覆蓋範圍、特性和適用語言"
              buttonText="開始分析"
            />
            <FeatureCard
              href="/comparison"
              icon={Zap}
              title="字型比較"
              description="並排預覽多個字型檔案，快速比較視覺效果和特性"
              buttonText="開始比較"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
