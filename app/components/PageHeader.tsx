import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  backHref?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, backHref = '/' }) => {
  return (
    <header className="border-b border-stone-100 bg-white p-4 shadow-sm sm:p-6">
      <div className="mx-auto flex max-w-7xl items-center gap-2 sm:gap-4">
        <Link
          href={backHref}
          className="text-primaryText hover:text-primary flex flex-shrink-0 items-center gap-1 transition-all duration-500 ease-in-out sm:gap-2"
        >
          <ArrowLeft size={20} className="transition-transform hover:-translate-x-1.5" />
        </Link>
        <h1 className="truncate text-2xl font-bold text-stone-800 sm:text-3xl">{title}</h1>
      </div>
    </header>
  );
};
