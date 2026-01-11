
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const forgeAIService = {
  async getCodeRefactorSuggestion(code: string, fileName: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze the following code from ${fileName} and suggest a specific optimization or refactor using modern patterns. Provide the explanation and a diff-like snippet.\n\nCODE:\n${code}`,
      config: {
        thinkingConfig: { thinkingBudget: 2048 }
      }
    });
    return response.text;
  },

  async getSecurityFix(vulnerability: string, codeSnippet: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `As a security expert, fix this vulnerability: ${vulnerability}.\n\nSnippet:\n${codeSnippet}\n\nProvide the explanation and the corrected code.`,
      config: {
        thinkingConfig: { thinkingBudget: 4096 }
      }
    });
    return response.text;
  },

  async summarizeRepoActivity(commits: string[]) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize the following repository activities in a brief, professional paragraph for a dashboard:\n\n${commits.join('\n')}`,
    });
    return response.text;
  },

  async checkContentSafety(title: string, content: string): Promise<{ status: 'SAFE' | 'WARNING' | 'FLAGGED'; reason?: string }> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this community post for safety, professionalism, and spam.
      Title: "${title}"
      Content: "${content}"
      
      Respond in JSON format:
      {
        "status": "SAFE" | "WARNING" | "FLAGGED",
        "reason": "Brief explanation if not SAFE"
      }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["status"]
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      return { status: 'SAFE' };
    }
  },

  async getLiveChatResponse(message: string, history: { sender: string; text: string }[], sessionContext: string, participants: string[]) {
    const historyString = history.map(m => `${m.sender}: ${m.text}`).join('\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are ForgeAI, an advanced engineering co-pilot integrated into a live developer collaboration session. 
      
      SESSION CONTEXT: ${sessionContext}
      ACTIVE PARTICIPANTS: ${participants.join(', ')}

      RECENT CHAT HISTORY:
      ${historyString}

      USER MESSAGE: "${message}"

      INSTRUCTIONS:
      - Respond as a high-level Senior Software Architect.
      - Be concise, technical, and helpful.
      - If the user asks a technical question, provide a sharp, accurate answer.
      - If the message is social, be brief and professional.
      - Reference active participants if relevant (e.g., "As Sarah mentioned...").
      - If you are asked to provide code, use markdown code blocks with the correct language.
      - Keep responses technical and relevant to the session context.
      - Since this is a live session, if you detect a potential issue in the mentioned context, point it out politely.`,
      config: {
        temperature: 0.75,
        maxOutputTokens: 1000,
        thinkingConfig: { thinkingBudget: 4096 }
      }
    });
    return response.text;
  }
};
