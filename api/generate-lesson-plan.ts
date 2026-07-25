import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // 1. POST 메서드만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 2. API Key 가져오기
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY가 Vercel 환경변수에 설정되어 있지 않습니다.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const body = req.body || {};

    // 3. 프론트엔드 요청 데이터 유연 추출
    let contents = body.contents || body.prompt || body.message || body;
    let config = body.config || {};

    if (body.systemInstruction && !config.systemInstruction) {
      config.systemInstruction = body.systemInstruction;
    }

    // 4. contents가 객체 단일건일 경우 배열화
    if (typeof contents === 'string') {
      contents = [{ parts: [{ text: contents }] }];
    } else if (contents && !Array.isArray(contents) && contents.parts) {
      contents = [contents];
    }

    // 5. contents의 parts 내에 빈 inlineData/data 속성이 들어가지 않도록 정제
    if (Array.isArray(contents)) {
      contents = contents.map((c: any) => {
        if (c && Array.isArray(c.parts)) {
          const cleanedParts = c.parts.filter((p: any) => {
            if (p.inlineData) {
              return p.inlineData.data && typeof p.inlineData.data === 'string' && p.inlineData.data.trim() !== '';
            }
            if (p.text !== undefined) {
              return typeof p.text === 'string';
            }
            return true;
          });
          return { ...c, parts: cleanedParts.length > 0 ? cleanedParts : [{ text: '설계 요청' }] };
        }
        return c;
      });
    }

    // 6. Gemini 2.5 Flash 호출
    const response = await ai.models.generateContent({
      model: body.model || 'gemini-2.5-flash',
      contents: contents,
      config: Object.keys(config).length > 0 ? config : undefined,
    });

    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: error.message || 'AI 생성 중 오류가 발생했습니다.' });
  }
}
