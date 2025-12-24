import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  backHref?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, backHref = '/' }) => {
  return (
    <header className="border-b border-stone-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href={backHref}
          className="flex items-center gap-2 text-stone-600 transition-colors hover:text-stone-900"
        >
          <ArrowLeft size={20} className="h-5 w-5" />
          <span className="text-sm font-medium">返回首頁</span>
        </Link>
        <h1 className="text-2xl font-bold text-stone-900">{title}</h1>
        <div className="w-24" />
      </div>
    </header>
  );
};
