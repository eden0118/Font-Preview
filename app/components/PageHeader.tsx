import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  backHref?: string;
  description?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, backHref = '/', description }) => {
  return (
    <header className="border-b border-stone-100 bg-white shadow-sm">
      <div className="border-b border-stone-100 p-4 sm:p-6">
        <div className="mx-auto flex max-w-7xl items-baseline gap-2 sm:gap-4">
          <Link href={backHref} className="icon-btn">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="truncate text-2xl font-bold text-stone-800 sm:text-3xl">{title}</h1>
            {description && (
              <p className="text-xs leading-relaxed text-stone-700 sm:text-sm">{description}</p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
