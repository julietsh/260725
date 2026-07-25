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

    // 1. 프론트엔드에서 넘어온 payload 규격 분석 및 추출
    let contents = body.contents || body.prompt || body;
    let systemInstruction = body.systemInstruction || body.system_instruction || body.config?.systemInstruction;

    // 2. contents 구조가 객체/배열 형태라면 그대로 사용하고, 그 외에는 객체로 정제
    if (typeof contents === 'string') {
      contents = [{ parts: [{ text: contents }] }];
    } else if (!Array.isArray(contents) && contents.parts) {
      contents = [contents];
    }

    // 3. 빈 parts가 전달되는 현상 방지 필터링
    if (Array.isArray(contents)) {
      contents = contents.map((item: any) => {
        if (item.parts && Array.isArray(item.parts)) {
          // data/text 필드가 유효한 part만 선별
          const validParts = item.parts.filter((p: any) => p.text || p.inlineData || p.fileData);
          return { ...item, parts: validParts.length > 0 ? validParts : [{ text: '' }] };
        }
        return item;
      });
    }

    // 4. Gemini API 호출
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: systemInstruction ? { systemInstruction } : undefined,
    });

    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini API Call Error:', error);
    return res.status(500).json({ error: error.message || 'AI 생성 처리 중 오류가 발생했습니다.' });
  }
}
