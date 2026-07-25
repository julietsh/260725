import React, { useState } from 'react';
import { LearnerPersona, PresetStandard } from '../types';
import { DEFAULT_LEARNER_PERSONA, PRESET_STANDARDS, ASSESSMENT_OPTIONS } from '../data/presets';
import { Sparkles, ChevronDown, ChevronUp, UserCheck, Layers, HelpCircle, CheckCircle2 } from 'lucide-react';

interface InputFormProps {
  onSubmit: (params: {
    achievementStandardCode: string;
    achievementStandardContent: string;
    learnerPersona: LearnerPersona;
    lessonCount: number;
    assessmentMethod: string;
    additionalNotes: string;
  }) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [selectedPreset, setSelectedPreset] = useState<PresetStandard | null>(PRESET_STANDARDS[0]);
  const [code, setCode] = useState(PRESET_STANDARDS[0].code);
  const [content, setContent] = useState(PRESET_STANDARDS[0].content);
  const [lessonCount, setLessonCount] = useState<number>(PRESET_STANDARDS[0].defaultLessons);
  const [assessmentMethod, setAssessmentMethod] = useState<string>(PRESET_STANDARDS[0].defaultAssessment);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Learner Persona state
  const [persona, setPersona] = useState<LearnerPersona>(DEFAULT_LEARNER_PERSONA);
  const [showPersonaDetails, setShowPersonaDetails] = useState<boolean>(false);

  const handleSelectPreset = (preset: PresetStandard) => {
    setSelectedPreset(preset);
    setCode(preset.code);
    setContent(preset.content);
    setLessonCount(preset.defaultLessons);
    setAssessmentMethod(preset.defaultAssessment);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit({
      achievementStandardCode: code.trim(),
      achievementStandardContent: content.trim(),
      learnerPersona: persona,
      lessonCount,
      assessmentMethod,
      additionalNotes: additionalNotes.trim(),
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      {/* Top Banner & Preset Quick Picker */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg font-bold text-xs">예시 선택</span>
            <h2 className="text-sm font-bold text-slate-800">대표 성취기준 빠르게 입력하기</h2>
          </div>
          <span className="text-xs text-slate-500">원하는 과목의 성취기준을 클릭하면 자동 채워집니다.</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESET_STANDARDS.map((preset) => {
            const isSelected = selectedPreset?.code === preset.code;
            return (
              <button
                key={preset.code}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/30'
                    : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                <span className={`mr-1.5 font-bold ${isSelected ? 'text-blue-100' : 'text-blue-600'}`}>
                  [{preset.subject}]
                </span>
                <span>{preset.code}</span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
        {/* Main Inputs: Code & Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              성취기준 코드 <span className="text-slate-400 font-normal">(선택)</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="예: [9진01-01]"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              성취기준 내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="예: 자아개념과 흥미, 적성을 바탕으로 자신의 긍정적 가치를 인식한다."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
            />
          </div>
        </div>

        {/* Options Row: Lesson Count & Assessment Method */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
          {/* Lesson Count Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              희망 차시 수
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setLessonCount(count)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition border ${
                    lessonCount === count
                      ? 'bg-blue-50 text-blue-700 border-blue-500 ring-1 ring-blue-500'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {count}차시
                </button>
              ))}
            </div>
          </div>

          {/* Assessment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              희망 평가 방식
            </label>
            <input
              type="text"
              value={assessmentMethod}
              onChange={(e) => setAssessmentMethod(e.target.value)}
              placeholder="예: 자기/동료평가 + 수행평가(보고서)"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {ASSESSMENT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    if (assessmentMethod.includes(opt)) return;
                    setAssessmentMethod((prev) => (prev ? `${prev}, ${opt}` : opt));
                  }}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] border border-slate-200 transition"
                >
                  + {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Learner Persona Collapsible Section */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 overflow-hidden transition">
          <button
            type="button"
            onClick={() => setShowPersonaDetails(!showPersonaDetails)}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-100/80 transition"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-md">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800">
                  학습자 페르소나 설정 <span className="text-blue-600 ml-1">(고정 규칙 반영)</span>
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  대상: <span className="font-semibold text-slate-700">{persona.targetGrade}</span> · 상위 20% vs 하위 30% 편차 및 오개념 교정 규칙
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
              <span>{showPersonaDetails}</span>
              {showPersonaDetails ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </div>
          </button>

          {showPersonaDetails && (
            <div className="p-4 border-t border-slate-200 bg-white space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1 text-slate-800">대상 학년/환경</label>
                  <input
                    type="text"
                    value={persona.targetGrade}
                    onChange={(e) => setPersona({ ...persona, targetGrade: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-800">진로 성숙도 및 학습자 편차</label>
                  <input
                    type="text"
                    value={persona.careerMaturity}
                    onChange={(e) => setPersona({ ...persona, careerMaturity: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-800">학습 특성 및 오개념</label>
                <textarea
                  rows={2}
                  value={persona.learningTraitsAndMisconceptions}
                  onChange={(e) =>
                    setPersona({ ...persona, learningTraitsAndMisconceptions: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-800">도달 목표</label>
                <textarea
                  rows={2}
                  value={persona.attainmentGoal}
                  onChange={(e) => setPersona({ ...persona, attainmentGoal: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setPersona(DEFAULT_LEARNER_PERSONA)}
                  className="text-[11px] text-blue-600 hover:underline font-medium"
                >
                  초기 PRD 권장 페르소나로 복원
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Additional Custom Requests */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            교사 추가 요구사항 <span className="text-slate-400 font-normal">(선택)</span>
          </label>
          <input
            type="text"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="예: 디지털 기기(스마트폰/패드) 활용, 모둠별 토의·토론 포함, 활동지 중심 진행 등"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        {/* Submit Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 shadow-md shadow-blue-500/20 transition flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>성취기준 분석 및 목표-활동-평가 정합성 자동 점검 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-blue-200" />
                <span>설계 생성하기 (목표·활동·평가 정합성 및 페르소나 자동 검증)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
