import React, { useState } from 'react';
import { ComplementaryQuestions } from '../types';
import { MessageSquare, Lightbulb, Compass, Copy, Check } from 'lucide-react';

interface QuestionsTabProps {
  questions: ComplementaryQuestions;
}

export const QuestionsTab: React.FC<QuestionsTabProps> = ({ questions }) => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Introduction / Thought Starters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <div className="p-1.5 bg-blue-100 text-blue-700 rounded-md">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">도입 및 생각 열기 발문 (Thought Starters)</h3>
        </div>

        <div className="space-y-2.5">
          {questions.introduction.map((q, idx) => {
            const key = `intro-${idx}`;
            const isCopied = copiedIndex === key;
            return (
              <div
                key={key}
                className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 flex items-center justify-between gap-3 hover:bg-slate-100/80 transition"
              >
                <div className="flex items-start space-x-2.5">
                  <span className="text-blue-600 font-extrabold text-sm shrink-0">Q{idx + 1}.</span>
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">{q}</p>
                </div>
                <button
                  onClick={() => handleCopy(q, key)}
                  className="shrink-0 text-slate-500 hover:text-blue-600 p-1.5 rounded bg-white border border-slate-200 transition"
                  title="발문 복사"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Misconception Correction Prompts */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <div className="p-1.5 bg-amber-100 text-amber-800 rounded-md">
            <Compass className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            '진로=직업' 오개념 교정 및 불안 해소 발문 (Reframing Prompts)
          </h3>
        </div>

        <div className="space-y-2.5">
          {questions.misconceptionCorrection.map((q, idx) => {
            const key = `misc-${idx}`;
            const isCopied = copiedIndex === key;
            return (
              <div
                key={key}
                className="bg-amber-50/50 border border-amber-200/60 rounded-lg p-3.5 flex items-center justify-between gap-3 hover:bg-amber-50 transition"
              >
                <div className="flex items-start space-x-2.5">
                  <span className="text-amber-800 font-extrabold text-sm shrink-0">Q{idx + 1}.</span>
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">{q}</p>
                </div>
                <button
                  onClick={() => handleCopy(q, key)}
                  className="shrink-0 text-slate-500 hover:text-amber-700 p-1.5 rounded bg-white border border-slate-200 transition"
                  title="발문 복사"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Advanced Extension Prompts */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-md">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">심화 및 확장 사고 발문 (Extension Prompts)</h3>
        </div>

        <div className="space-y-2.5">
          {questions.advancedExtension.map((q, idx) => {
            const key = `adv-${idx}`;
            const isCopied = copiedIndex === key;
            return (
              <div
                key={key}
                className="bg-indigo-50/40 border border-indigo-100 rounded-lg p-3.5 flex items-center justify-between gap-3 hover:bg-indigo-50/80 transition"
              >
                <div className="flex items-start space-x-2.5">
                  <span className="text-indigo-700 font-extrabold text-sm shrink-0">Q{idx + 1}.</span>
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">{q}</p>
                </div>
                <button
                  onClick={() => handleCopy(q, key)}
                  className="shrink-0 text-slate-500 hover:text-indigo-600 p-1.5 rounded bg-white border border-slate-200 transition"
                  title="발문 복사"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
