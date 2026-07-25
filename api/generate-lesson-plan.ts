import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY가 설정되어 있지 않습니다.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const body = req.body || {};

    // 1. 프론트엔드가 보낸 요청 구조 파악
    let contents = body.contents;
    let config = body.config || {};

    // systemInstruction이 root 레벨에 있을 경우 config로 통합
    if (body.systemInstruction && !config.systemInstruction) {
      config.systemInstruction = body.systemInstruction;
    }

    // 2. contents가 단순 텍스트로 올 경우 규격 처리
    if (typeof body === 'string') {
      contents = body;
    } else if (body.prompt && !contents) {
      contents = body.prompt;
    }

    // 3. parts 내부 검증 (빈 inlineData나 data 필드가 없는 part가 들어가지 않도록 정제)
    if (Array.isArray(contents)) {
      contents = contents.map((c: any) => {
        if (c && Array.isArray(c.parts)) {
          const cleanedParts = c.parts.filter((p: any) => {
            if (p.inlineData) {
              // inlineData에 data 속성이 없거나 비어 있으면 제외
              return p.inlineData.data && p.inlineData.data.trim() !== '';
            }
            return true;
          });
          return { ...c, parts: cleanedParts.length > 0 ? cleanedParts : [{ text: '' }] };
        }
        return c;
      });
    }

    // 4. Gemini API 호출 (aiStudio 규격 원형 유지)
    const response = await ai.models.generateContent({
      model: body.model || 'gemini-2.5-flash',
      contents: contents,
      config: config,
    });

    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: error.message || 'AI 생성 처리 실패' });
  }
}
