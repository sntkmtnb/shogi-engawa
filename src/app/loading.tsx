export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold animate-pulse"
        style={{ background: 'linear-gradient(135deg, #8B6914, #6B4F12)' }}>
        源
      </div>
      <p className="text-amber-600 text-sm font-medium">ちょっと待ってな…</p>
    </div>
  );
}
