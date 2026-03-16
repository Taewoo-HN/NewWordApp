'use client';

import { useState, useEffect, useCallback } from 'react';
import FlashCard from '@/components/FlashCard';

interface Word {
  id: number;
  word: string;
  part_of_speech: string;
  meaning_kr: string;
  example_en: string;
  is_memorized: number;
}

const PAGE_SIZE = 1;

export default function Home() {
  const [words, setWords] = useState<Word[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'memorized' | 'unmemorized'>('all');
  const [loading, setLoading] = useState(false);

  const fetchWords = useCallback(async (p: number, q: string, f: string) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: String(PAGE_SIZE) });
    if (q) params.set('search', q);
    if (f === 'memorized') params.set('memorized', 'true');
    if (f === 'unmemorized') params.set('memorized', 'false');
    const res = await fetch(`/api/words?${params}`);
    const data = await res.json();
    setWords(data.words);
    setTotal(data.total);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWords(page, search, filter);
  }, [page, search, filter, fetchWords]);

  function handleSearch(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  }

  function handleFilter(f: 'all' | 'memorized' | 'unmemorized') {
    setFilter(f);
    setPage(1);
  }

  function handleMemorized(id: number, memorized: boolean) {
    setWords(prev => prev.map(w => w.id === id ? { ...w, is_memorized: memorized ? 1 : 0 } : w));
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8">
      <div className="max-w-lg mx-auto">

        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">
            📚 WordFlash
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            영어 단어 플래시카드
          </p>
        </div>

        {/* 검색 */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="단어 또는 한국어 검색..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            검색
          </button>
        </form>

        {/* 필터 */}
        <div className="flex gap-2 mb-6">
          {(['all', 'unmemorized', 'memorized'] as const).map(f => (
            <button
              key={f}
              onClick={() => handleFilter(f)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {f === 'all' ? '전체' : f === 'memorized' ? '✓ 암기 완료' : '미암기'}
            </button>
          ))}
        </div>

        {/* 진행 상태 */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mb-4">
          {total > 0 ? `${page} / ${totalPages} 단어 (총 ${total}개)` : '결과 없음'}
        </p>

        {/* 카드 */}
        {loading ? (
          <div className="flex justify-center items-center h-56">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : words.length > 0 ? (
          <FlashCard key={words[0].id} word={words[0]} onMemorized={handleMemorized} />
        ) : (
          <div className="flex items-center justify-center h-56 text-slate-400">
            단어를 찾을 수 없습니다.
          </div>
        )}

        {/* 이전 / 다음 */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="flex-1 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium text-sm disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            ← 이전
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="flex-1 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm disabled:opacity-40 transition-colors"
          >
            다음 →
          </button>
        </div>

        {/* 안내 */}
        <p className="text-center text-xs text-slate-300 dark:text-slate-600 mt-6">
          카드를 탭하면 뜻이 보입니다
        </p>
      </div>
    </main>
  );
}
