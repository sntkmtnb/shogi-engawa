import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-4">
      <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
        style={{ background: 'linear-gradient(135deg, #8B6914, #6B4F12)' }}>
        源
      </div>
      <h1 className="text-2xl font-bold text-amber-900">迷子になったか？</h1>
      <p className="text-amber-700">ワシもたまに道に迷うわ。ここに戻ろか。</p>
      <Link href="/" className="btn-ios bg-gradient-to-r from-amber-700 to-amber-800 text-white text-lg font-bold py-3 px-8 mt-4">
        縁台に戻る
      </Link>
    </div>
  );
}
