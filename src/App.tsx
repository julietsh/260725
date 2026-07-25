import React, { useState, useEffect } from 'react';
import { LessonPlanData, LearnerPersona } from './types';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultView } from './components/ResultView';
import { RefinementModal } from './components/RefinementModal';
import { SavedDesignsModal } from './components/SavedDesignsModal';
import { Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentPlan, setCurrentPlan] = useState<LessonPlanData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals state
  const [isRefineModalOpen, setIsRefineModalOpen] = useState<boolean>(false);
  const [refineTargetLesson, setRefineTargetLesson] = useState<number | null>(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);

  // Saved Plans state in localStorage
  const [savedPlans, setSavedPlans] = useState<LessonPlanData[]>(() => {
    try {
      const saved = localStorage.getItem('saved_lesson_plans');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('saved_lesson_plans', JSON.stringify(savedPlans));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [savedPlans]);

  const handleGeneratePlan = async (params: {
    achievementStandardCode: string;
    achievementStandardContent: string;
    learnerPersona: LearnerPersona;
    lessonCount: number;
    assessmentMethod: string;
    additionalNotes: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-lesson-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '수업 설계안 생성에 실패했습니다.');
      }

      const newPlan: LessonPlanData = {
        id: `plan-${Date.now()}`,
        createdAt: new Date().toISOString(),
        title: `${params.achievementStandardCode || ''} ${params.achievementStandardContent}`.trim(),
        inputParams: params,
        deconstruction: data.data.deconstruction,
        alignmentAudit: data.data.alignmentAudit,
        lessonCards: data.data.lessonCards,
        rubric: data.data.rubric,
        complementaryQuestions: data.data.complementaryQuestions,
      };

      setCurrentPlan(newPlan);
      // Scroll to result view
      window.scrollTo({ top: 380, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error generating plan:', err);
      setErrorMessage(err.message || '수업 설계 도중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefinePlan = async (instruction: string, sectionTarget: string) => {
    if (!currentPlan) return;

    setIsRefining(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/refine-lesson-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPlan,
          instruction,
          sectionTarget,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '수업 설계안 보강에 실패했습니다.');
      }

      const updatedPlan: LessonPlanData = {
        ...currentPlan,
        deconstruction: data.data.deconstruction,
        alignmentAudit: data.data.alignmentAudit,
        lessonCards: data.data.lessonCards,
        rubric: data.data.rubric,
        complementaryQuestions: data.data.complementaryQuestions,
      };

      setCurrentPlan(updatedPlan);
    } catch (err: any) {
      console.error('Error refining plan:', err);
      setErrorMessage(err.message || '보강 반영 도중 오류가 발생했습니다.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleSavePlan = (plan: LessonPlanData) => {
    const exists = savedPlans.some((p) => p.id === plan.id);
    if (exists) {
      // update
      setSavedPlans(savedPlans.map((p) => (p.id === plan.id ? plan : p)));
    } else {
      setSavedPlans([plan, ...savedPlans]);
    }
  };

  const handleDeletePlan = (id: string) => {
    setSavedPlans(savedPlans.filter((p) => p.id !== id));
  };

  const isCurrentPlanSaved = currentPlan
    ? savedPlans.some((p) => p.id === currentPlan.id)
    : false;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased flex flex-col">
      {/* Header */}
      <Header
        savedCount={savedPlans.length}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onNewDesign={() => {
          setCurrentPlan(null);
          setErrorMessage(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-600 hover:text-red-800 font-bold text-xs shrink-0"
            >
              닫기
            </button>
          </div>
        )}

        {/* Input Form Section */}
        <InputForm onSubmit={handleGeneratePlan} isLoading={isLoading} />

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-4">
            <div className="inline-flex p-3 bg-blue-100 text-blue-600 rounded-full animate-bounce">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                AI 수석교사가 성취기준을 엄밀히 분해하고 있습니다...
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                목표-활동-평가 1:1 수직 정합성 점검 및 중1 학습자 페르소나(상위 20% vs 하위 30%) 맞춤 전략 적용 중
              </p>
            </div>
          </div>
        )}

        {/* Result View */}
        {currentPlan && !isLoading && (
          <ResultView
            planData={currentPlan}
            onOpenRefineModal={(lessonNum) => {
              setRefineTargetLesson(lessonNum || null);
              setIsRefineModalOpen(true);
            }}
            onSavePlan={handleSavePlan}
            isSaved={isCurrentPlanSaved}
          />
        )}
      </main>

      {/* Modals */}
      <RefinementModal
        isOpen={isRefineModalOpen}
        onClose={() => setIsRefineModalOpen(false)}
        onRefine={handleRefinePlan}
        initialLessonNumber={refineTargetLesson}
        isRefining={isRefining}
      />

      <SavedDesignsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedPlans={savedPlans}
        onSelectPlan={(plan) => setCurrentPlan(plan)}
        onDeletePlan={handleDeletePlan}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-300">
            성취기준 차시 설계 도우미 (Achievement Standard Lesson Plan Helper)
          </p>
          <p className="mt-1 text-slate-500">
            교사의 교육과정·수업·평가 자율성을 존중하며, AI 생성 초안은 최종 교육과정 적합성 검토 후 활용하십시오.
          </p>
        </div>
      </footer>
    </div>
  );
}
