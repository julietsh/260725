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

    // 1. 프론트엔드가 보낸 데이터 위치 유연하게 추적
    let contents = body.contents || body.prompt || body.message || body.data;
    let config = body.config || {};

    if (body.systemInstruction && !config.systemInstruction) {
      config.systemInstruction = body.systemInstruction;
    }

    // 2. 만약 body 자체가 바로 contents 배열/객체로 넘어온 경우
    if (!contents && (Array.isArray(body) || typeof body === 'object')) {
      contents = body;
    }

    // 3. contents가 완전히 비어있을 때를 대비한 예외 방지 fallback
    if (!contents || (Array.isArray(contents) && contents.length === 0)) {
      contents = "수업 설계를 생성해 주세요.";
    }

    // 4. contents[0].parts 내의 빈 inlineData/data 객체 필터링
    if (Array.isArray(contents)) {
      contents = contents.map((c: any) => {
        if (c && Array.isArray(c.parts)) {
          const validParts = c.parts.filter((p: any) => {
            // inlineData 구조에서 data가 비어있는 잘못된 파트 제거
            if (p.inlineData && (!p.inlineData.data || p.inlineData.data.trim() === '')) {
              return false;
            }
            return true;
          });
          return { ...c, parts: validParts.length > 0 ? validParts : [{ text: '설계 요청' }] };
        }
        return c;
      });
    }

    // 5. Gemini API 호출
    const response = await ai.models.generateContent({
      model: body.model || 'gemini-2.5-flash',
      contents: contents,
      config: Object.keys(config).length > 0 ? config : undefined,
    });

    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini API Error Details:', error);
    return res.status(500).json({ error: error.message || 'AI 생성 처리 실패' });
  }
}
