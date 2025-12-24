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
      <div className="group hover:border-primary relative cursor-pointer overflow-hidden rounded-2xl border-2 border-stone-200 bg-white p-8 transition-all duration-300 hover:shadow-lg">
        <div
          className={`text-primary absolute inset-0 bg-linear-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
        />
        <div className="relative">
          <div className={`text-primary mb-6 inline-block rounded-full p-3`}>
            <Icon size={32} />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-stone-900">{title}</h2>
          <p className="mb-6 text-stone-600">{description}</p>
          <div className={`text-primary flex items-center gap-2 font-semibold`}>
            {buttonText}{' '}
            <ArrowRight
              className="transition-all duration-500 group-hover:translate-x-3"
              size={20}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};
