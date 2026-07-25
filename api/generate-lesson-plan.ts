import { GoogleGenAI, Type } from '@google/genai';

// 모델을 바꾸려면 이 한 줄만 수정하세요.
// 'model not found' 오류가 나면 'gemini-flash-latest' 로 바꿔 보세요.
const MODEL = 'gemini-3.6-flash';

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    deconstruction: {
      type: Type.OBJECT,
      properties: {
        knowledgeUnderstanding: { type: Type.STRING, description: '이해 요소 (개념, 핵심 원리)' },
        application: { type: Type.STRING, description: '적용 요소 (실습, 작성, 제작, 탐구)' },
        explanation: { type: Type.STRING, description: '설명 요소 (성찰, 발표, 자신의 언어로 표현)' },
      },
      required: ['knowledgeUnderstanding', 'application', 'explanation'],
    },
    alignmentAudit: {
      type: Type.OBJECT,
      properties: {
        alignmentScore: { type: Type.INTEGER, description: '목표-활동-평가 정합성 점수 (85-100)' },
        summaryNote: { type: Type.STRING, description: '정합성 종합 평가 및 연계 총평' },
        checkPoints: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '차시별 목표-활동-평가 정합성 핵심 검증 포인트',
        },
        personaCustomizations: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '학습자 페르소나(오개념/편차) 반영 특화 전략',
        },
      },
      required: ['alignmentScore', 'summaryNote', 'checkPoints', 'personaCustomizations'],
    },
    lessonCards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          lessonNumber: { type: Type.INTEGER, description: '차시 번호 (1, 2, ...)' },
          topic: { type: Type.STRING, description: '차시 주제' },
          objective: { type: Type.STRING, description: '차시 목표 (~할 수 있다)' },
          activities: {
            type: Type.OBJECT,
            properties: {
              introduction: { type: Type.STRING, description: '도입 활동 (동기유발/생각열기)' },
              development: { type: Type.STRING, description: '전개 활동 (주요 탐구/실습/활동)' },
              summary: { type: Type.STRING, description: '정리 활동 (성찰/공유/다음 차시 안내)' },
            },
            required: ['introduction', 'development', 'summary'],
          },
          assessment: {
            type: Type.OBJECT,
            properties: {
              method: { type: Type.STRING, description: '평가 방식/도구' },
              criteria: { type: Type.STRING, description: '평가 기준 및 관점' },
            },
            required: ['method', 'criteria'],
          },
          personaSupport: {
            type: Type.OBJECT,
            properties: {
              highMaturity: { type: Type.STRING, description: '상위 20% (높은 흥미/자기주도) 맞춤 지원 및 심화 과제' },
              lowMaturity: { type: Type.STRING, description: '하위 30% (무관심/불안/오개념) 맞춤 지원 및 스몰스텝 전략' },
            },
            required: ['highMaturity', 'lowMaturity'],
          },
        },
        required: ['lessonNumber', 'topic', 'objective', 'activities', 'assessment', 'personaSupport'],
      },
    },
    rubric: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: '수행 루브릭 제목' },
        criteria: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              element: { type: Type.STRING, description: '평가 요소 (예: 자아개념 이해, 진로 탐색 태도)' },
              high: { type: Type.STRING, description: '성취수준 상 (매우 우수)' },
              medium: { type: Type.STRING, description: '성취수준 중 (보통/달성)' },
              low: { type: Type.STRING, description: '성취수준 하 (노력 요함/기초)' },
            },
            required: ['element', 'high', 'medium', 'low'],
          },
        },
      },
      required: ['title', 'criteria'],
    },
    complementaryQuestions: {
      type: Type.OBJECT,
      properties: {
        introduction: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '도입 및 생각 열기 발문 제안',
        },
        misconceptionCorrection: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '오개념(예: 진로=직업, 꿈 부재 불안) 교정 발문 제안',
        },
        advancedExtension: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '심화/확장 사고 촉진 발문 제안',
        },
      },
      required: ['introduction', 'misconceptionCorrection', 'advancedExtension'],
    },
  },
  required: ['deconstruction', 'alignmentAudit', 'lessonCards', 'rubric', 'complementaryQuestions'],
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'GEMINI_API_KEY가 설정되어 있지 않습니다.' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { currentPlan, instruction, sectionTarget } = body;

    if (!currentPlan || !instruction) {
      return res.status(400).json({ success: false, error: '기존 설계안과 수정 요청사항이 필요합니다.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
당신은 대한민국 최고의 수업 설계 및 교육평가 전문가입니다.
기존 수업 설계 데이터와 교사의 보강/수정 요청사항을 받아, 기존 맥락과 정합성을 유지하면서 지정된 요청을 충실히 반영하여 수정된 완벽한 JSON 수업 설계 데이터를 다시 작성해 주세요.
수정 후에도 목표-활동-평가의 1:1 수직 정합성과 학습자 페르소나 지원 전략이 완벽히 유지되어야 합니다.
    `.trim();

    const prompt = `
[기존 수업 설계 데이터]
${JSON.stringify(currentPlan, null, 2)}

[교사의 보강 요청사항]
- 보강 대상 영역: ${sectionTarget || '전체'}
- 보강 지시: ${instruction}

교사의 보강 요청을 엄격하게 반영하되, 지정된 JSON schema 포맷을 완벽하게 유지하여 수정된 전체 수업 설계안 JSON을 반환해 주세요.
    `.trim();

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema as any,
        temperature: 0.3,
      },
    });

    const jsonText = response.text || '{}';
    const resultData = JSON.parse(jsonText);

    return res.status(200).json({ success: true, data: resultData });
  } catch (error: any) {
    console.error('Error in /api/refine-lesson-plan:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || '수업 설계 보강 중 오류가 발생했습니다.',
    });
  }
}
