import React, { useState } from 'react';
import { LearnerPersona, PresetStandard } from '../types';
import { DEFAULT_LEARNER_PERSONA, PRESET_STANDARDS, ASSESSMENT_OPTIONS } from '../data/presets';
import { Sparkles, ChevronDown, ChevronUp, UserCheck, Compass, CheckCircle2, Award, Bookmark } from 'lucide-react';

interface InputFormProps {
  onSubmit: (params: {
    achievementStandardCode: string;
    achievementStandardContent: string;
    targetAchievementLevel: string;
    selectedLevelText: string;
    learnerPersona: LearnerPersona;
    lessonCount: number;
    assessmentMethod: string;
    additionalNotes: string;
  }) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [activeCategory, setActiveCategory] = useState<string>('(1) 진로와 나의 이해');
  const [selectedPreset, setSelectedPreset] = useState<PresetStandard>(PRESET_STANDARDS[0]);
  const [code, setCode] = useState<string>(PRESET_STANDARDS[0].code);
  const [content, setContent] = useState<string>(PRESET_STANDARDS[0].content);
  const [targetLevel, setTargetLevel] = useState<'ALL' | 'A' | 'B' | 'C'>('ALL');
  const [lessonCount, setLessonCount] = useState<number>(PRESET_STANDARDS[0].defaultLessons);
  const [assessmentMethod, setAssessmentMethod] = useState<string>(PRESET_STANDARDS[0].defaultAssessment);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Learner Persona state
  const [persona, setPersona] = useState<LearnerPersona>(DEFAULT_LEARNER_PERSONA);
  const [showPersonaDetails, setShowPersonaDetails] = useState<boolean>(false);

  const categories = Array.from(new Set(PRESET_STANDARDS.map((s) => s.category)));

  const filteredPresets = PRESET_STANDARDS.filter((s) => s.category === activeCategory);

  const handleSelectPreset = (preset: PresetStandard) => {
    setSelectedPreset(preset);
    setCode(preset.code);
    setContent(preset.content);
    setLessonCount(preset.defaultLessons);
    setAssessmentMethod(preset.defaultAssessment);
  };

  const getTargetLevelLabel = () => {
    if (targetLevel === 'ALL') return '전체 성취수준 (A/B/C 연계)';
    if (targetLevel === 'A') return `성취수준 A (상): ${selectedPreset.levels.A}`;
    if (targetLevel === 'B') return `성취수준 B (중): ${selectedPreset.levels.B}`;
    return `성취수준 C (하): ${selectedPreset.levels.C}`;
  };

  const getFormattedSelectedLevels = () => {
    return `[성취수준 A]\n${selectedPreset.levels.A}\n\n[성취수준 B]\n${selectedPreset.levels.B}\n\n[성취수준 C]\n${selectedPreset.levels.C}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit({
      achievementStandardCode: code.trim(),
      achievementStandardContent: content.trim(),
      targetAchievementLevel: getTargetLevelLabel(),
      selectedLevelText: getFormattedSelectedLevels(),
      learnerPersona: persona,
      lessonCount,
      assessmentMethod,
      additionalNotes: additionalNotes.trim(),
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      {/* Top Banner & Category Selection */}
      <div className="bg-slate-900 text-white p-4 sm:p-6 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-blue-500 text-white rounded-lg font-bold text-xs flex items-center gap-1">
              <Compass className="w-4 h-4" /> 중학교 진로와 직업
            </span>
            <h2 className="text-sm sm:text-base font-bold">2022 개정 교육과정 성취기준 및 성취수준 선택</h2>
          </div>
          <span className="text-xs text-slate-300">
            * 첨부 교육과정 문서의 공식 성취기준 14개 및 A/B/C 성취수준 탑재
          </span>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
                const first = PRESET_STANDARDS.find((s) => s.category === cat);
                if (first) handleSelectPreset(first);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow border border-blue-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preset Standard Buttons under Active Category */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5">
        <div className="text-xs font-bold text-slate-600 mb-2.5 flex items-center justify-between">
          <span>{activeCategory} 성취기준 목록 ({filteredPresets.length}개):</span>
          <span className="text-[11px] font-normal text-slate-500">원하는 성취기준을 클릭하여 바로 선택하세요.</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredPresets.map((preset) => {
            const isSelected = selectedPreset.code === preset.code;
            return (
              <button
                key={preset.code}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`text-left p-3 rounded-xl border transition text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 text-blue-900 font-medium shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-mono font-bold ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                    {preset.code}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="line-clamp-2 text-[11px] text-slate-600 leading-relaxed">{preset.content}</p>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
        {/* Selected Standard Display & Edit */}
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center space-x-1">
              <span className="p-1 bg-blue-100 text-blue-800 rounded text-[11px]">선택된 성취기준</span>
              <span className="text-blue-700">{selectedPreset.code}</span>
            </label>
            <span className="text-[11px] text-slate-500">직접 수정 가능</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-1">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="코드 예: [9진로01-01]"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </div>
            <div className="md:col-span-3">
              <textarea
                required
                rows={2}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* Official Achievement Levels (A, B, C) Cards from Image */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800">
                공식 성취기준별 성취수준 (첨부 교육과정 문서 명세)
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">
              ※ 클릭 시 해당 성취수준을 수업 목표 및 루브릭의 핵심 타겟으로 지정합니다.
            </span>
          </div>

          {/* Target Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTargetLevel('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                targetLevel === 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              전체 A·B·C 연계 설계 (기본)
            </button>
            <button
              type="button"
              onClick={() => setTargetLevel('A')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                targetLevel === 'A'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
              }`}
            >
              성취수준 A (상) 중심
            </button>
            <button
              type="button"
              onClick={() => setTargetLevel('B')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                targetLevel === 'B'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              성취수준 B (중) 중심
            </button>
            <button
              type="button"
              onClick={() => setTargetLevel('C')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                targetLevel === 'C'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'
              }`}
            >
              성취수준 C (하) 중심
            </button>
          </div>

          {/* Level Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Level A */}
            <div
              onClick={() => setTargetLevel('A')}
              className={`p-3.5 rounded-xl border transition cursor-pointer ${
                targetLevel === 'A' || targetLevel === 'ALL'
                  ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20'
                  : 'bg-slate-50 border-slate-200 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="px-2 py-0.5 rounded font-bold text-xs bg-blue-600 text-white">
                  성취수준 A (상)
                </span>
                {targetLevel === 'A' && <span className="text-[11px] font-bold text-blue-600">주요 타겟</span>}
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {selectedPreset.levels.A}
              </p>
            </div>

            {/* Level B */}
            <div
              onClick={() => setTargetLevel('B')}
              className={`p-3.5 rounded-xl border transition cursor-pointer ${
                targetLevel === 'B' || targetLevel === 'ALL'
                  ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20'
                  : 'bg-slate-50 border-slate-200 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="px-2 py-0.5 rounded font-bold text-xs bg-emerald-600 text-white">
                  성취수준 B (중)
                </span>
                {targetLevel === 'B' && <span className="text-[11px] font-bold text-emerald-600">주요 타겟</span>}
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {selectedPreset.levels.B}
              </p>
            </div>

            {/* Level C */}
            <div
              onClick={() => setTargetLevel('C')}
              className={`p-3.5 rounded-xl border transition cursor-pointer ${
                targetLevel === 'C' || targetLevel === 'ALL'
                  ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-500/20'
                  : 'bg-slate-50 border-slate-200 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="px-2 py-0.5 rounded font-bold text-xs bg-amber-600 text-white">
                  성취수준 C (하)
                </span>
                {targetLevel === 'C' && <span className="text-[11px] font-bold text-amber-600">주요 타겟</span>}
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {selectedPreset.levels.C}
              </p>
            </div>
          </div>
        </div>

        {/* Options Row: Lesson Count & Assessment Method */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-slate-100">
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
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
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
                  학습자 페르소나 설정 <span className="text-blue-600 ml-1">(상위 20% vs 하위 30% 맞춤 규칙)</span>
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  대상: <span className="font-semibold text-slate-700">{persona.targetGrade}</span> · 오개념 교정 및 스몰스텝 전략 자동 반영
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
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
                  기본 페르소나 설정으로 복원
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
            placeholder="예: 디지털 기기(스마트폰/패드) 활용, 모둠별 토의·토론 포함, 성취수준 A/B/C별 활동지 구분 제공 등"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
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
                <span>진로 성취기준 및 A/B/C 성취수준 정합성 검증 수업 설계 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-blue-200" />
                <span>진로 수업 설계안 생성하기 (성취수준 A·B·C 및 목표-활동-평가 자동 정합)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

