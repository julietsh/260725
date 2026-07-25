import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initializer for Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    deconstruction: {
      type: Type.OBJECT,
      properties: {
        knowledgeUnderstanding: { type: Type.STRING, description: "이해 요소 (개념, 핵심 원리)" },
        application: { type: Type.STRING, description: "적용 요소 (실습, 작성, 제작, 탐구)" },
        explanation: { type: Type.STRING, description: "설명 요소 (성찰, 발표, 자신의 언어로 표현)" },
      },
      required: ["knowledgeUnderstanding", "application", "explanation"],
    },
    alignmentAudit: {
      type: Type.OBJECT,
      properties: {
        alignmentScore: { type: Type.INTEGER, description: "목표-활동-평가 정합성 점수 (85-100)" },
        summaryNote: { type: Type.STRING, description: "정합성 종합 평가 및 연계 총평" },
        checkPoints: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "차시별 목표-활동-평가 정합성 핵심 검증 포인트",
        },
        personaCustomizations: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "학습자 페르소나(오개념/편차) 반영 특화 전략",
        },
      },
      required: ["alignmentScore", "summaryNote", "checkPoints", "personaCustomizations"],
    },
    lessonCards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          lessonNumber: { type: Type.INTEGER, description: "차시 번호 (1, 2, ...)" },
          topic: { type: Type.STRING, description: "차시 주제" },
          objective: { type: Type.STRING, description: "차시 목표 (~할 수 있다)" },
          activities: {
            type: Type.OBJECT,
            properties: {
              introduction: { type: Type.STRING, description: "도입 활동 (동기유발/생각열기)" },
              development: { type: Type.STRING, description: "전개 활동 (주요 탐구/실습/활동)" },
              summary: { type: Type.STRING, description: "정리 활동 (성찰/공유/다음 차시 안내)" },
            },
            required: ["introduction", "development", "summary"],
          },
          assessment: {
            type: Type.OBJECT,
            properties: {
              method: { type: Type.STRING, description: "평가 방식/도구" },
              criteria: { type: Type.STRING, description: "평가 기준 및 관점" },
            },
            required: ["method", "criteria"],
          },
          personaSupport: {
            type: Type.OBJECT,
            properties: {
              highMaturity: { type: Type.STRING, description: "상위 20% (높은 흥미/자기주도) 맞춤 지원 및 심화 과제" },
              lowMaturity: { type: Type.STRING, description: "하위 30% (무관심/불안/오개념) 맞춤 지원 및 스몰스텝 전략" },
            },
            required: ["highMaturity", "lowMaturity"],
          },
        },
        required: ["lessonNumber", "topic", "objective", "activities", "assessment", "personaSupport"],
      },
    },
    rubric: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "수행 루브릭 제목" },
        criteria: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              element: { type: Type.STRING, description: "평가 요소 (예: 자아개념 이해, 진로 탐색 태도)" },
              high: { type: Type.STRING, description: "성취수준 상 (매우 우수)" },
              medium: { type: Type.STRING, description: "성취수준 중 (보통/달성)" },
              low: { type: Type.STRING, description: "성취수준 하 (노력 요함/기초)" },
            },
            required: ["element", "high", "medium", "low"],
          },
        },
      },
      required: ["title", "criteria"],
    },
    complementaryQuestions: {
      type: Type.OBJECT,
      properties: {
        introduction: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "도입 및 생각 열기 발문 제안",
        },
        misconceptionCorrection: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "오개념(예: 진로=직업, 꿈 부재 불안) 교정 발문 제안",
        },
        advancedExtension: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "심화/확장 사고 촉진 발문 제안",
        },
      },
      required: ["introduction", "misconceptionCorrection", "advancedExtension"],
    },
  },
  required: ["deconstruction", "alignmentAudit", "lessonCards", "rubric", "complementaryQuestions"],
};

// API Route: Generate Lesson Plan
app.post("/api/generate-lesson-plan", async (req, res) => {
  try {
    const {
      achievementStandardCode,
      achievementStandardContent,
      targetAchievementLevel = "전체 (A/B/C)",
      selectedLevelText = "",
      learnerPersona,
      lessonCount = 2,
      assessmentMethod = "자기/동료평가 + 수행평가",
      additionalNotes = "",
    } = req.body;

    if (!achievementStandardContent) {
      return res.status(400).json({ error: "성취기준 내용을 입력해 주세요." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `
당신은 대한민국 2022 개정 교육과정 '진로와 직업' 과목에 정통한 수석교사이자 AI 교육과정 연구원입니다.
선택된 중학교 '진로와 직업' 성취기준 및 해당 성취기준의 공식 [성취수준 A, B, C]을 바탕으로, 목표-활동-평가의 1:1 수직 정합성(Alignment)이 완벽한 차시별 수업 설계안과 수행 루브릭을 작성합니다.

[설계 및 검증 원칙]
1. 성취기준 분해: 입력된 진로 성취기준을 '이해(Knowledge)', '적용(Skill/Practice)', '설명(Attitude/Reflection)' 세 차원으로 명확히 분석하십시오.
2. 성취수준 A, B, C 준수:
   - 공식 교육과정에 명시된 성취수준 A(상), B(중), C(하) 명세(${selectedLevelText || "A, B, C 수준 명세"})를 수업 활동 및 수행 루브릭의 개별 요소와 정확히 연동합니다.
   - 타겟 선택 성취수준(${targetAchievementLevel})에 주안점을 두되, 상/중/하 학생 모두가 각자의 도달 목표에 맞춰 성장을 도모할 수 있도록 스몰스텝 및 심화 과제를 유기적으로 구성합니다.
3. 정합성(Alignment) 엄수:
   - [차시 목표]는 성취기준 및 성취수준에서 도출되며 명확한 행위 동사(~할 수 있다)로 작성합니다.
   - [차시 활동]은 목표를 달성하기 위해 필요한 행동을 직접 실행하는 단계적 경험(도입-전개-정리)이어야 합니다.
   - [평가 계획]은 목표가 실제로 달성되었는지를 직접 측정할 수 있는 평가 방식과 구체적 성취 기준이어야 합니다.
4. 학습자 페르소나 반영:
   - 대상: ${learnerPersona?.targetGrade || "중학교 1학년 (남녀 공학)"}
   - 진로 성숙도: ${learnerPersona?.careerMaturity || "상위 20%는 진로 관심도 높음 / 하위 30%는 무관심 및 '어차피 꿈이 없어요' 태도"}
   - 오개념 및 특성: ${learnerPersona?.learningTraitsAndMisconceptions || "'진로=직업'으로 단순 인식, 장래희망 미정 시 불안/포기 극단적 양상"}
   - 도달 목표: ${learnerPersona?.attainmentGoal || "자신의 성향/관심사를 진로 탐색의 출발점으로 이해, 직업 미결정해도 다양한 진로 경로 탐색 태도 형성"}
   - 하위 30%(성취수준 C 대상) 학생들이 소외되거나 부담을 느끼지 않도록 스몰스텝(Small Steps)과 친근한 활동지를 구성합니다.
   - 상위 20%(성취수준 A 대상) 학생들을 위한 주도적 심화 탐색 과제도 명확히 명시합니다.
5. 모든 문장은 현장 교사가 5분 내 다듬어 바로 수업 및 평가계획서에 반영할 수 있도록 완성도 높게 한국어로 작성합니다.
    `.trim();

    const prompt = `
[입력 데이터]
- 성취기준 코드 및 내용: ${achievementStandardCode || ''} ${achievementStandardContent}
- 성취수준 타겟 설정: ${targetAchievementLevel}
- 공식 성취기준별 성취수준 (A, B, C):
  ${selectedLevelText || '공식 성취수준 A, B, C 반영'}
- 희망 차시 수: ${lessonCount}차시
- 희망 평가 방식: ${assessmentMethod}
- 교사 추가 요청사항: ${additionalNotes || '없음'}

[학습자 페르소나 상세]
- 학년 및 환경: ${learnerPersona?.targetGrade || '중학교 1학년 (남녀 공학)'}
- 진로 성숙도/편차: ${learnerPersona?.careerMaturity || ''}
- 학습 특성 및 오개념: ${learnerPersona?.learningTraitsAndMisconceptions || ''}
- 도달 목표: ${learnerPersona?.attainmentGoal || ''}

위 조건에 맞추어 정확히 지정된 JSON 구조로 수업 설계 결과(성취기준 분해, 정합성 검증, 차시별 카드 ${lessonCount}개, 수행 루브릭, 보완 발문)를 생성해 주세요.
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema as any,
        temperature: 0.2,
      },
    });

    const jsonText = response.text || "{}";
    const resultData = JSON.parse(jsonText);

    return res.json({
      success: true,
      data: resultData,
    });
  } catch (error: any) {
    console.error("Error in /api/generate-lesson-plan:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "수업 설계안 생성 중 오류가 발생했습니다.",
    });
  }
});

// API Route: Refine Lesson Plan
app.post("/api/refine-lesson-plan", async (req, res) => {
  try {
    const { currentPlan, instruction, sectionTarget } = req.body;

    if (!currentPlan || !instruction) {
      return res.status(400).json({ error: "기존 설계안과 수정 요청사항이 필요합니다." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `
당신은 대한민국 최고의 수업 설계 및 교육평가 전문가입니다.
기존 수업 설계 데이터와 교사의 보강/수정 요청사항을 받아, 기존 맥락과 정합성을 유지하면서 지정된 요청을 충실히 반영하여 수정된 완벽한 JSON 수업 설계 데이터를 다시 작성해 주세요.
수정 후에도 목표-활동-평가의 1:1 수직 정합성과 학습자 페르소나 지원 전략이 완벽히 유지되어야 합니다.
    `.trim();

    const prompt = `
[기존 수업 설계 데이터]
${JSON.stringify(currentPlan, null, 2)}

[교사의 보강 요청사항]
- 보강 대상 영역: ${sectionTarget || "전체"}
- 보강 지시: ${instruction}

교사의 보강 요청을 엄격하게 반영하되, 지정된 JSON schema 포맷을 완벽하게 유지하여 수정된 전체 수업 설계안 JSON을 반환해 주세요.
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema as any,
        temperature: 0.3,
      },
    });

    const jsonText = response.text || "{}";
    const resultData = JSON.parse(jsonText);

    return res.json({
      success: true,
      data: resultData,
    });
  } catch (error: any) {
    console.error("Error in /api/refine-lesson-plan:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "수업 설계 보강 중 오류가 발생했습니다.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
