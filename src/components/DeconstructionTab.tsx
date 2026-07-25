import React from 'react';
import { LessonDeconstruction, AlignmentAudit } from '../types';
import { Brain, CheckCircle, Target, Users, ShieldCheck, Zap } from 'lucide-react';

interface DeconstructionTabProps {
  deconstruction: LessonDeconstruction;
  alignmentAudit: AlignmentAudit;
}

export const DeconstructionTab: React.FC<DeconstructionTabProps> = ({
  deconstruction,
  alignmentAudit,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Deconstruction Cards */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-slate-100">
          <Brain className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">성취기준 3차원 분해 (Deconstruction)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                이해 (Knowledge)
              </span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {deconstruction.knowledgeUnderstanding}
            </p>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                적용 (Skill/Practice)
              </span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {deconstruction.application}
            </p>
          </div>

          <div className="bg-amber-50/60 border border-amber-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                설명 (Attitude/Reflection)
              </span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {deconstruction.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Alignment Audit */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              목표 ↔ 활동 ↔ 평가 수직 정합성(Alignment) 자동 진단
            </h3>
          </div>
          <div className="flex items-center space-x-2 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full self-start sm:self-auto">
            <Zap className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-900">
              정합성 점수: <span className="text-indigo-600 text-sm font-extrabold">{alignmentAudit.alignmentScore}점</span> / 100점
            </span>
          </div>
        </div>

        {/* Audit Note */}
        <div className="bg-slate-50 border-l-4 border-indigo-500 p-3.5 rounded-r-lg mb-4 text-xs text-slate-800 leading-relaxed">
          <strong className="text-indigo-900 font-bold block mb-1">진단 총평:</strong>
          {alignmentAudit.summaryNote}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Key CheckPoints */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
            <div className="flex items-center space-x-1.5 mb-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-800">목표-활동-평가 1:1 수직 정합 포인트</h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {alignmentAudit.checkPoints.map((cp, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{cp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Persona Adaptation Strategies */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
            <div className="flex items-center space-x-1.5 mb-2.5">
              <Users className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-bold text-slate-800">학습자 페르소나(오개념/편차) 반영 특화 전략</h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {alignmentAudit.personaCustomizations.map((pc, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{pc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
