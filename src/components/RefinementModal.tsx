import React, { useState } from 'react';
import { Edit3, Sparkles, X, Check } from 'lucide-react';

interface RefinementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefine: (instruction: string, sectionTarget: string) => Promise<void>;
  initialLessonNumber?: number | null;
  isRefining: boolean;
}

export const RefinementModal: React.FC<RefinementModalProps> = ({
  isOpen,
  onClose,
  onRefine,
  initialLessonNumber,
  isRefining,
}) => {
  const [sectionTarget, setSectionTarget] = useState<string>(
    initialLessonNumber ? `${initialLessonNumber}차시 카드` : '전체 설계안'
  );
  const [instruction, setInstruction] = useState<string>('');

  if (!isOpen) return null;

  const quickPresets = [
    '하위 30% 학생 활동을 더 쉬운 스몰스텝(카드 고르기/한 줄 적기)으로 구체화해줘',
    '활동에 스마트기기(패들렛, 구글폼, 모바일) 활용 단계를 추가해줘',
    '평가 부담을 줄이기 위해 형성평가 항목을 단순한 체크리스트 형태로 조정해줘',
    '수행 루브릭 성취수준(상/중/하) 기준을 관찰 가능한 구체적 행동 언어로 보강해줘',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) return;
    await onRefine(instruction, sectionTarget);
    setInstruction('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-600 rounded-lg text-white">
              <Edit3 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold">수업 설계안 이 부분 보강하기</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs text-slate-800">
          {/* Target Section Selection */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">보강할 대상 영역</label>
            <select
              value={sectionTarget}
              onChange={(e) => setSectionTarget(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="전체 설계안">전체 설계안 (목표-활동-평가 종합)</option>
              <option value="1차시 카드">1차시 설계 카드</option>
              <option value="2차시 카드">2차시 설계 카드</option>
              <option value="수행 루브릭">수행 루브릭 초안</option>
              <option value="보완 발문">보완 발문 제안</option>
            </select>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">자주 쓰는 보강 피드백 예시</label>
            <div className="space-y-1.5">
              {quickPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInstruction(preset)}
                  className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200/80 text-[11px] text-slate-700 hover:text-blue-900 transition flex items-center justify-between"
                >
                  <span className="line-clamp-1">{preset}</span>
                  <span className="text-blue-600 text-[10px] font-bold shrink-0 ml-1">선택</span>
                </button>
              ))}
            </div>
          </div>

          {/* Teacher Custom Instruction */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              교사 구체적 보강 지시 <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="예: 하위 학생을 위해 전개 활동을 무부담 모둠 보드게임으로 변경해주고, 2차시 평가 기준을 한 줄 성찰일지로 작성해줘."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isRefining || !instruction.trim()}
              className="px-5 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 shadow-sm transition flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>보강안 재생성</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
