import React from 'react';
import { Rubric } from '../types';
import { Award, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface RubricTabProps {
  rubric: Rubric;
}

export const RubricTab: React.FC<RubricTabProps> = ({ rubric }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">{rubric.title}</h3>
        </div>
        <span className="text-xs text-slate-500">
          ※ 성취수준(상·중·하)에 따른 구체적 행동 지표 초안
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-slate-900 text-white font-bold">
              <th className="p-3.5 border border-slate-700 w-1/4 rounded-tl-lg">평가 요소</th>
              <th className="p-3.5 border border-slate-700 w-1/4 bg-blue-900/60 text-blue-100">
                <div className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-300" />
                  <span>상 (매우 우수)</span>
                </div>
              </th>
              <th className="p-3.5 border border-slate-700 w-1/4 bg-slate-800 text-slate-200">
                <div className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>중 (보통 / 달성)</span>
                </div>
              </th>
              <th className="p-3.5 border border-slate-700 w-1/4 bg-amber-950/60 text-amber-200 rounded-tr-lg">
                <div className="flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>하 (기초 / Effort)</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rubric.criteria.map((criterion, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition">
                <td className="p-3.5 border border-slate-200 font-bold bg-slate-50 text-slate-900 align-top">
                  {criterion.element}
                </td>
                <td className="p-3.5 border border-slate-200 text-slate-800 leading-relaxed align-top bg-blue-50/20">
                  {criterion.high}
                </td>
                <td className="p-3.5 border border-slate-200 text-slate-800 leading-relaxed align-top">
                  {criterion.medium}
                </td>
                <td className="p-3.5 border border-slate-200 text-slate-800 leading-relaxed align-top bg-amber-50/20">
                  {criterion.low}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-start space-x-2">
        <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          교사 팁: 본 루브릭은 학급 특성에 맞춰 단어나 수행 수준을 자유롭게 변경할 수 있습니다. 상위 수준의 학생에게는 자기평가 체크리스트로 활용하게 하고, 하위 수준의 학생에게는 스몰스텝 성공 지표로 제시해 주세요.
        </p>
      </div>
    </div>
  );
};
