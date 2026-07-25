import React from 'react';
import { LessonCard } from '../types';
import { Target, Clock, CheckSquare, Sparkles, UserCheck, ArrowRight, Edit3 } from 'lucide-react';

interface LessonCardsTabProps {
  cards: LessonCard[];
  onRefineLesson?: (lessonNumber: number) => void;
}

export const LessonCardsTab: React.FC<LessonCardsTabProps> = ({ cards, onRefineLesson }) => {
  return (
    <div className="space-y-6">
      {cards.map((card) => (
        <div
          key={card.lessonNumber}
          className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition"
        >
          {/* Card Header */}
          <div className="bg-slate-900 text-white p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-600 text-white tracking-wider">
                {card.lessonNumber}차시
              </span>
              <h3 className="text-base sm:text-lg font-bold">{card.topic}</h3>
            </div>

            {onRefineLesson && (
              <button
                onClick={() => onRefineLesson(card.lessonNumber)}
                className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 transition self-end sm:self-auto"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1 text-blue-400" />
                이 차시 보강하기
              </button>
            )}
          </div>

          <div className="p-4 sm:p-6 space-y-5">
            {/* Objective */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-3.5 flex items-start space-x-3">
              <Target className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">차시 목표</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">{card.objective}</p>
              </div>
            </div>

            {/* Activities Sequence Timeline */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="w-4 h-4 text-slate-500" />
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  단계별 주요 수업 활동 (도입-전개-정리)
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Introduction */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      도입 (Thought Starter)
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed">{card.activities.introduction}</p>
                </div>

                {/* Development */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                      전개 (Main Practice/Exploration)
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed">{card.activities.development}</p>
                </div>

                {/* Summary */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      정리 (Reflection/Wrap-up)
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed">{card.activities.summary}</p>
                </div>
              </div>
            </div>

            {/* Assessment & Persona Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              {/* Assessment Plan */}
              <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-800">평가 도구 및 핵심 기준</h4>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="font-bold text-slate-600">평가 방식: </span>
                    <span className="text-slate-900 font-semibold">{card.assessment.method}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-600">평가 관점/기준: </span>
                    <span className="text-slate-800">{card.assessment.criteria}</span>
                  </div>
                </div>
              </div>

              {/* Persona Differentiated Support */}
              <div className="border border-slate-200 rounded-lg p-3.5 bg-amber-50/30">
                <div className="flex items-center space-x-2 mb-2">
                  <UserCheck className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold text-amber-900">학습자 편차 맞춤 지도 방안</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-white/80 p-2 rounded border border-amber-200/60">
                    <span className="font-bold text-indigo-700 block mb-0.5">
                      상위 20% (높은 흥미/자기주도):
                    </span>
                    <span className="text-slate-700 leading-snug">{card.personaSupport.highMaturity}</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded border border-amber-200/60">
                    <span className="font-bold text-amber-800 block mb-0.5">
                      하위 30% (무관심/불안/스몰스텝):
                    </span>
                    <span className="text-slate-700 leading-snug">{card.personaSupport.lowMaturity}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
