import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const TAG_PROMPTS: Record<string, string> = {
  'feeling_stressed': 'You are Dia, an empathetic AI companion. The user is feeling stressed. Respond in a brief, calming, and supportive manner. Keep your response under 3 sentences. Use a warm tone.',
  'need_motivation': 'You are Dia, an empathetic AI companion. The user needs motivation. Respond with brief, encouraging, and uplifting words. Keep your response under 3 sentences. Use a warm, energetic tone.',
  'just_chat': 'You are Dia, an empathetic AI companion. The user just wants to chat. Be friendly, casual, and a good listener. Ask a gentle follow-up question. Keep your response under 3 sentences.',
  'feeling_anxious': 'You are Dia, an empathetic AI companion. The user is feeling anxious. Be very gentle, validating, and grounding. Suggest a tiny grounding exercise if appropriate. Keep your response under 3 sentences.',
  'default': 'You are Dia, an empathetic AI companion. Respond warmly, briefly, and supportively. Keep your response under 3 sentences.'
};

export async function POST(req: NextRequest) {
  try {
    const { messages, tag } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // Since this is a demo, we strictly limit to 3 user messages max.
    const userMessageCount = messages.filter(m => m.role === 'user').length;
    if (userMessageCount > 3) {
      return NextResponse.json({ error: 'Demo limit reached.' }, { status: 403 });
    }

    const lastMessage = messages[messages.length - 1];

    if (!process.env.GEMINI_API_KEY) {
      // Fallback for when API key is not configured locally yet
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json({
        response: `This is a mock response from Dia. To get real responses, please add GEMINI_API_KEY to your .env.local file. You said: "${lastMessage.content}"`
      });
    }

    const systemPrompt = TAG_PROMPTS[tag] || TAG_PROMPTS['default'];

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: systemPrompt });

    // Format history for Gemini
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessage(lastMessage.content);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText });

  } catch (error) {
    console.error('Demo Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
