import React from 'react';
import { BookOpen, Sparkles, BookmarkCheck, ShieldAlert, FilePlus } from 'lucide-react';

interface HeaderProps {
  savedCount: number;
  onOpenSavedModal: () => void;
  onNewDesign: () => void;
}

export const Header: React.FC<HeaderProps> = ({ savedCount, onOpenSavedModal, onNewDesign }) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 text-white shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  성취기준 차시 설계 도우미
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-900/60 text-blue-200 border border-blue-700/50">
                  <Sparkles className="w-3 h-3 mr-1 text-blue-400" />
                  교사 전용 도구
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                성취기준을 넣으면 차시 목표·활동·평가가 정렬된 설계 카드를 만들어 줍니다.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 self-end md:self-auto">
            <button
              onClick={onNewDesign}
              className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium rounded-lg text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            >
              <FilePlus className="w-4 h-4 mr-1.5 text-slate-400" />
              새 설계
            </button>
            <button
              onClick={onOpenSavedModal}
              className="inline-flex items-center px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition relative"
            >
              <BookmarkCheck className="w-4 h-4 mr-1.5 text-blue-400" />
              저장된 설계안
              {savedCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">
                  {savedCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Security & Pedagogical Disclaimer Banner */}
        <div className="py-2.5 border-t border-slate-800/80 text-xs text-slate-300 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center space-x-2 shrink-0">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-amber-300 font-semibold">유의사항:</strong> 학생 개인정보는 입력하지 않습니다. AI가 생성한 목표·평가·루브릭은 ‘초안’이며 교사의 최종 교육과정 검토 후 사용하십시오.
            </span>
          </div>
          <span className="hidden lg:inline text-slate-400 text-right shrink-0 font-mono">
            중1 진로/성숙도 페르소나 및 정합성 검증 엔진 적용
          </span>
        </div>
      </div>
    </header>
  );
};
