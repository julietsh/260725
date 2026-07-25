import React from 'react';
import { LessonPlanData } from '../types';
import { BookmarkCheck, Trash2, ExternalLink, Calendar, X } from 'lucide-react';

interface SavedDesignsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlans: LessonPlanData[];
  onSelectPlan: (plan: LessonPlanData) => void;
  onDeletePlan: (id: string) => void;
}

export const SavedDesignsModal: React.FC<SavedDesignsModalProps> = ({
  isOpen,
  onClose,
  savedPlans,
  onSelectPlan,
  onDeletePlan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-600 rounded-lg text-white">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">저장된 수업 설계안 목록</h3>
              <p className="text-xs text-slate-400">보관된 설계안을 불러와서 수정하거나 내보낼 수 있습니다.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          {savedPlans.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <p className="font-semibold text-slate-600 mb-1">저장된 설계안이 없습니다.</p>
              <p>성취기준을 입력하고 생성된 결과 화면에서 '저장' 버튼을 눌러보세요.</p>
            </div>
          ) : (
            savedPlans.map((plan) => (
              <div
                key={plan.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/30 hover:border-blue-200 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold text-[10px]">
                      {plan.inputParams.achievementStandardCode || '성취기준'}
                    </span>
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">
                      {plan.title || plan.inputParams.achievementStandardContent}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                      {new Date(plan.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                    <span>• {plan.inputParams.lessonCount}차시 설계</span>
                    <span>• 정합성 점수: {plan.alignmentAudit.alignmentScore}점</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => {
                      onSelectPlan(plan);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center space-x-1"
                  >
                    <span>열기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeletePlan(plan.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
