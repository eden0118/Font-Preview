import React from 'react';
import Link from 'next/link';
import { ArrowRight, LucideIcon } from 'lucide-react';

type ColorVariant = 'primary' | 'accent';

interface FeatureCardProps {
  href: string;
  icon: LucideIcon;
  color?: ColorVariant;
  title: string;
  description: string;
  buttonText: string;
}

const colorMap: Record<ColorVariant, { bg: string; text: string; gradient: string }> = {
  primary: {
    bg: 'bg-primary-light',
    text: 'text-primary',
    gradient: 'from-[rgb(12,82,234,0.05)]',
  },
  accent: {
    bg: 'bg-accent-light',
    text: 'text-accent',
    gradient: 'from-[rgb(245,165,36,0.05)]',
  },
};

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
        <div className="bg-primary/10 mb-3 flex h-10 w-10 items-center justify-center rounded-full sm:mb-4 sm:h-12 sm:w-12">
          <Icon size={20} className="text-primary sm:h-6 sm:w-6" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-stone-800 sm:text-xl">{title}</h3>
        <p className="mb-4 text-xs leading-relaxed text-stone-600 sm:mb-6 sm:text-sm">
          {description}
        </p>
        <div className="flex items-center gap-1 font-medium">
          {buttonText}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};
