import { LearnerPersona, PresetStandard } from '../types';

export const DEFAULT_LEARNER_PERSONA: LearnerPersona = {
  targetGrade: '중학교 1학년 (남녀 공학)',
  careerMaturity: '상위 20%는 진로 관심도가 높고 스스로 탐색할 수 있으나, 하위 30%는 진로에 무관심하고 "어차피 꿈이 없어요"라는 태도를 보임.',
  learningTraitsAndMisconceptions: "'진로=직업'으로만 단순하게 인식하는 경향이 있음. 장래희망이 정해지지 않은 것을 불안해하거나 완전히 포기하는 극단적 양상을 보임.",
  attainmentGoal: '자신의 성향과 관심사를 진로 탐색의 출발점으로 이해하고, 당장 직업을 결정하지 않아도 다양한 진로 경로를 탐색해 볼 수 있는 적극적 태도 형성.',
};

export const PRESET_STANDARDS: PresetStandard[] = [
  {
    subject: '진로와 직업',
    code: '[9진01-01]',
    content: '자아개념과 흥미, 적성을 바탕으로 자신의 긍정적 가치를 인식한다.',
    defaultLessons: 2,
    defaultAssessment: '자기/동료평가 + 활동지(긍정 자아 카탈로그)',
  },
  {
    subject: '진로와 직업',
    code: '[9진01-02]',
    content: '변화하는 직업 세계의 특성을 이해하고, 자신의 진로와 연계하여 탐색한다.',
    defaultLessons: 3,
    defaultAssessment: '수행평가(미래 직업 탐색 보고서) + 관찰평가',
  },
  {
    subject: '국어',
    code: '[9국01-03]',
    content: '듣기·말하기 과정에서 상대방의 감정에 공감하며 진정성 있게 대화한다.',
    defaultLessons: 2,
    defaultAssessment: '동료평가 + 대화 실습 체크리스트',
  },
  {
    subject: '사회',
    code: '[9사03-01]',
    content: '현대 사회의 다양한 사회 문제의 원인을 다각도로 분석하고 해결 방안을 모색한다.',
    defaultLessons: 3,
    defaultAssessment: '모둠별 탐구보고서 + 발표 수행평가',
  },
  {
    subject: '도덕',
    code: '[9도02-02]',
    content: '타인과의 관계에서 공감과 배려의 자세를 바탕으로 갈등을 평화적으로 해결한다.',
    defaultLessons: 2,
    defaultAssessment: '역할극 관찰평가 + 자기성찰일지',
  },
  {
    subject: '과학',
    code: '[9과04-01]',
    content: '물질의 상태 변화와 열에너지의 흡수·방출 관계를 탐구하고 실생활 사례를 설명한다.',
    defaultLessons: 2,
    defaultAssessment: '실험 보고서 + 형성평가 퀴즈',
  },
];

export const ASSESSMENT_OPTIONS = [
  '자기/동료평가',
  '형성평가(체크리스트/퀴즈)',
  '수행평가(보고서/포트폴리오)',
  '발표/토의·토론 평가',
  '관찰평가(참여도/태도)',
  '역할극/실습 평가',
];
