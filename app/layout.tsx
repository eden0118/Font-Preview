import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Font Preview',
  description: 'Upload and preview fonts in real-time',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className="bg-stone-50">{children}</body>
    </html>
  );
}
