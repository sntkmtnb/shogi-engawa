import { diaryEntries } from '@/data/diary';

export default function DiaryPage() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-8 pb-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-amber-900 mb-2">
          📔 源さんの日記
        </h1>
        <p className="text-sm text-amber-600">
          対局してない時の源さん
        </p>
      </div>

      {/* Diary entries */}
      <div className="flex flex-col gap-4">
        {diaryEntries.map((entry, i) => (
          <article
            key={i}
            className="ios-card p-5 relative"
          >
            {/* Mood emoji */}
            <span className="absolute top-4 right-4 text-2xl">
              {entry.mood}
            </span>

            {/* Avatar + date */}
            <div className="flex items-center gap-3 mb-3">
              <div className="chat-avatar flex-shrink-0" style={{ width: '36px', height: '36px', fontSize: '14px' }}>
                源
              </div>
              <div>
                <p className="text-xs text-amber-500 font-bold">
                  {entry.date}
                </p>
                <h2 className="text-base font-bold text-amber-900 leading-tight">
                  {entry.title}
                </h2>
              </div>
            </div>

            {/* Content */}
            <p className="text-base text-amber-800 leading-relaxed pl-12">
              {entry.content}
            </p>
          </article>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-xs text-amber-500/60">
          源さんは毎日を生きています
        </p>
      </div>
    </div>
  );
}
