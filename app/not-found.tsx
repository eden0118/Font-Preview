import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold text-stone-900">404</h1>
        <p className="mb-6 text-xl text-stone-600">找不到頁面</p>
        <p className="mb-8 text-stone-500">抱歉，您請求的頁面不存在</p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-stone-900 px-6 py-3 text-white transition-colors hover:bg-stone-800"
        >
          返回首頁
        </Link>
      </div>
    </div>
  );
}
