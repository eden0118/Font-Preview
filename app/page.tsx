'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, Zap } from 'lucide-react';
import { Footer } from './components/Footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-2 text-5xl font-bold text-stone-900">FontFlow</h1>
            <p className="text-lg text-stone-600">一站式字體預覽和分析工具</p>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Analysis Card */}
            <Link href="/analysis">
              <div className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-stone-200 bg-white p-8 transition-all duration-300 hover:border-stone-400 hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-6 inline-block rounded-full bg-blue-100 p-3 text-blue-600">
                    <BarChart3 size={32} />
                  </div>
                  <h2 className="mb-3 text-2xl font-bold text-stone-900">字型分析</h2>
                  <p className="mb-6 text-stone-600">
                    上傳字型檔案，深入分析其覆蓋範圍、特性和適用語言
                  </p>
                  <div className="flex items-center font-semibold text-blue-600">
                    開始分析 <ArrowRight className="ml-2" size={20} />
                  </div>
                </div>
              </div>
            </Link>

            {/* Comparison Card */}
            <Link href="/comparison">
              <div className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-stone-200 bg-white p-8 transition-all duration-300 hover:border-stone-400 hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-6 inline-block rounded-full bg-amber-100 p-3 text-amber-600">
                    <Zap size={32} />
                  </div>
                  <h2 className="mb-3 text-2xl font-bold text-stone-900">字型比較</h2>
                  <p className="mb-6 text-stone-600">
                    並排預覽多個字型檔案，快速比較視覺效果和特性
                  </p>
                  <div className="flex items-center font-semibold text-amber-600">
                    開始比較 <ArrowRight className="ml-2" size={20} />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-stone-500">
            <p>🔒 所有檔案處理均在本地完成，不上傳任何資料</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
