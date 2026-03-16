'use client';

import { useState } from 'react';

interface Word {
  id: number;
  word: string;
  part_of_speech: string;
  meaning_kr: string;
  example_en: string;
  is_memorized: number;
}

interface FlashCardProps {
  word: Word;
  onMemorized: (id: number, memorized: boolean) => void;
}

const POS_COLORS: Record<string, string> = {
  noun: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  verb: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  adjective: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  adverb: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  preposition: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  conjunction: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  pronoun: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  determiner: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
};

export default function FlashCard({ word, onMemorized }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [memorized, setMemorized] = useState(word.is_memorized === 1);

  const posColor = POS_COLORS[word.part_of_speech] ?? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';

  function speak() {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(word.word);
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
  }

  async function toggleMemorized(e: React.MouseEvent) {
    e.stopPropagation();
    const next = !memorized;
    setMemorized(next);
    await fetch(`/api/words/${word.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_memorized: next }),
    });
    onMemorized(word.id, next);
  }

  return (
    <div className="card-flip w-full h-56 sm:h-64 cursor-pointer" onClick={() => setFlipped(!flipped)}>
      <div className={`card-inner w-full h-full ${flipped ? 'flipped' : ''}`}>

        {/* 앞면: 영어 단어 */}
        <div className="card-front w-full h-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-6 select-none">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mb-3 ${posColor}`}>
            {word.part_of_speech}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4 tracking-tight">
            {word.word}
          </h2>
          <button
            onClick={(e) => { e.stopPropagation(); speak(); }}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors px-3 py-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
            발음 듣기
          </button>
          <p className="text-xs text-slate-400 mt-4">탭하여 뜻 보기</p>
        </div>

        {/* 뒷면: 한국어 뜻 + 예문 */}
        <div className="card-back w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-6 select-none">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mb-3 ${posColor}`}>
            {word.part_of_speech}
          </span>
          <p className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-3 text-center">
            {word.meaning_kr}
          </p>
          {word.example_en && (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center italic px-2">
              &quot;{word.example_en}&quot;
            </p>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); speak(); }}
            className="mt-4 flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors px-3 py-1.5 rounded-full hover:bg-white dark:hover:bg-slate-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
            발음 듣기
          </button>
        </div>
      </div>

      {/* 암기 버튼 (카드 바깥) */}
      <button
        onClick={toggleMemorized}
        className={`mt-3 w-full py-2 rounded-xl text-sm font-medium transition-colors ${
          memorized
            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300'
            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
        }`}
      >
        {memorized ? '✓ 암기 완료' : '암기 전'}
      </button>
    </div>
  );
}
