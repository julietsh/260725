import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY가 Vercel 환경 변수에 설정되어 있지 않습니다.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // 프론트엔드에서 보낼 수 있는 다양한 데이터 형식(prompt, contents, body 등)을 유연하게 감지
    const body = req.body || {};
    const contentPayload = body.contents || body.prompt || body.message || body;
    const systemInstruction = body.systemInstruction || body.system_instruction;

    if (!contentPayload) {
      return res.status(400).json({ error: '요청 본문(contents 또는 prompt)이 비어있습니다.' });
    }

    // AI Studio 2.5-flash 모델 호출
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contentPayload,
      config: systemInstruction ? { systemInstruction } : undefined,
    });

    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'AI 생성 처리 실패' });
  }
}
