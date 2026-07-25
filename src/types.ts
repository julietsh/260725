export interface LearnerPersona {
  targetGrade: string;
  careerMaturity: string;
  learningTraitsAndMisconceptions: string;
  attainmentGoal: string;
}

export interface LessonDeconstruction {
  knowledgeUnderstanding: string;
  application: string;
  explanation: string;
}

export interface AlignmentAudit {
  alignmentScore: number;
  summaryNote: string;
  checkPoints: string[];
  personaCustomizations: string[];
}

export interface ActivityDetail {
  introduction: string;
  development: string;
  summary: string;
}

export interface LessonAssessment {
  method: string;
  criteria: string;
}

export interface PersonaSupport {
  highMaturity: string;
  lowMaturity: string;
}

export interface LessonCard {
  lessonNumber: number;
  topic: string;
  objective: string;
  activities: ActivityDetail;
  assessment: LessonAssessment;
  personaSupport: PersonaSupport;
}

export interface RubricCriterion {
  element: string;
  high: string;
  medium: string;
  low: string;
}

export interface Rubric {
  title: string;
  criteria: RubricCriterion[];
}

export interface ComplementaryQuestions {
  introduction: string[];
  misconceptionCorrection: string[];
  advancedExtension: string[];
}

export interface LessonPlanData {
  id: string;
  createdAt: string;
  title: string;
  inputParams: {
    achievementStandardCode: string;
    achievementStandardContent: string;
    learnerPersona: LearnerPersona;
    lessonCount: number;
    assessmentMethod: string;
    additionalNotes?: string;
  };
  deconstruction: LessonDeconstruction;
  alignmentAudit: AlignmentAudit;
  lessonCards: LessonCard[];
  rubric: Rubric;
  complementaryQuestions: ComplementaryQuestions;
}

export interface PresetStandard {
  subject: string;
  code: string;
  content: string;
  defaultLessons: number;
  defaultAssessment: string;
}
