import React, { useState } from 'react';
import { LessonPlanData } from '../types';
import { DeconstructionTab } from './DeconstructionTab';
import { LessonCardsTab } from './LessonCardsTab';
import { RubricTab } from './RubricTab';
import { QuestionsTab } from './QuestionsTab';
import { formatPlanAsHtml, formatPlanAsText, downloadTextFile } from '../utils/exportUtils';
import {
  Brain,
  Layers,
  Award,
  MessageSquare,
  Edit3,
  Copy,
  Download,
  Printer,
  BookmarkPlus,
  Check,
  Sparkles,
  Share2,
} from 'lucide-react';

interface ResultViewProps {
  planData: LessonPlanData;
  onOpenRefineModal: (lessonNumber?: number) => void;
  onSavePlan: (plan: LessonPlanData) => void;
  isSaved: boolean;
}

export const ResultView: React.FC<ResultViewProps> = ({
  planData,
  onOpenRefineModal,
  onSavePlan,
  isSaved,
}) => {
  const [activeTab, setActiveTab] = useState<'deconstruction' | 'cards' | 'rubric' | 'questions'>('cards');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopyRichText = async () => {
    try {
      const htmlContent = formatPlanAsHtml(planData);
      const textContent = formatPlanAsText(planData);

      const blobHtml = new Blob([htmlContent], { type: 'text/html' });
      const blobText = new Blob([textContent], { type: 'text/plain' });

      const data = [
        new ClipboardItem({
          'text/html': blobHtml,
          'text/plain': blobText,
        }),
      ];

      await navigator.clipboard.write(data);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      // Fallback to text copy
      const textContent = formatPlanAsText(planData);
      await navigator.clipboard.writeText(textContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleDownloadTxt = () => {
    const textContent = formatPlanAsText(planData);
    const code = planData.inputParams.achievementStandardCode || '성취기준';
    const filename = `${code}_차시설계안_${new Date().toISOString().slice(0, 10)}.txt`;
    downloadTextFile(filename, textContent);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Overview */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-900/80 border border-blue-700/50 text-blue-200">
                {planData.inputParams.achievementStandardCode || '성취기준'}
              </span>
              <span>{planData.inputParams.learnerPersona.targetGrade}</span>
              <span>• {planData.inputParams.lessonCount}차시 설계</span>
              {planData.inputParams.targetAchievementLevel && (
                <span className="px-2 py-0.5 rounded bg-indigo-900/80 text-indigo-200 border border-indigo-700/50 font-medium">
                  {planData.inputParams.targetAchievementLevel.split(':')[0]}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              {planData.inputParams.achievementStandardContent}
            </h2>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-blue-600/20 border border-blue-500/30 px-3.5 py-1.5 rounded-xl text-right">
              <span className="text-[10px] text-blue-300 block font-bold uppercase">목표-활동-평가 정합성</span>
              <span className="text-lg font-extrabold text-blue-200">
                {planData.alignmentAudit.alignmentScore}점
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenRefineModal()}
              className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition"
            >
              <Edit3 className="w-4 h-4 mr-1.5" />
              이 부분 보강하기
            </button>
            <button
              onClick={() => onSavePlan(planData)}
              className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                isSaved
                  ? 'bg-emerald-900/60 text-emerald-200 border-emerald-700/60'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <BookmarkPlus className={`w-4 h-4 mr-1.5 ${isSaved ? 'text-emerald-400' : 'text-slate-400'}`} />
              {isSaved ? '저장 완료' : '설계안 저장'}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyRichText}
              className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 mr-1.5 text-emerald-400" />
                  <span className="text-emerald-300">한글/워드 복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1.5 text-blue-400" />
                  <span>한글/워드 복사</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadTxt}
              className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              title="텍스트 파일 다운로드"
            >
              <Download className="w-4 h-4 mr-1 text-slate-400" />
              TXT
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center p-2 rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              title="인쇄 / PDF 저장"
            >
              <Printer className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Output View Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1 shadow-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('cards')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'cards'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>2. 차시별 설계 카드 ({planData.lessonCards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('deconstruction')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'deconstruction'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>1. 성취기준 분석 & 정합성</span>
        </button>

        <button
          onClick={() => setActiveTab('rubric')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'rubric'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>3. 수행 루브릭 초안</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'questions'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>4. 보완 발문 제안</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'deconstruction' && (
          <DeconstructionTab
            deconstruction={planData.deconstruction}
            alignmentAudit={planData.alignmentAudit}
          />
        )}

        {activeTab === 'cards' && (
          <LessonCardsTab
            cards={planData.lessonCards}
            onRefineLesson={(lessonNum) => onOpenRefineModal(lessonNum)}
          />
        )}

        {activeTab === 'rubric' && <RubricTab rubric={planData.rubric} />}

        {activeTab === 'questions' && (
          <QuestionsTab questions={planData.complementaryQuestions} />
        )}
      </div>
    </div>
  );
};
