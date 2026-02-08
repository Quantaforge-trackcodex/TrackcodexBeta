import { GoogleGenAI, Type } from "@google/genai";

export const forgeAIService = {
  async getCodeRefactorSuggestion(code: string, fileName: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: `Analyze the following code from ${fileName} and suggest a specific optimization or refactor using modern patterns. Provide the explanation and a diff-like snippet.\n\nCODE:\n${code}`,
      config: {
      }
    });
    return response.text;
  },

  async getAICompletion(prefix: string, suffix: string, fileName: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `You are an AI code completion engine. Complete the code for file "${fileName}". 
      
      CODE BEFORE CURSOR:
      ${prefix}

      CODE AFTER CURSOR:
      ${suffix}

      Only provide the code snippet that should be inserted between the prefix and suffix. Do not include triple backticks unless they are part of the code.`,
    });
    return response.text;
  },

  async getTechnicalAnswer(question: string, codeContext: string, fileName: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: `You are ForgeAI, an expert technical co-pilot. 
      File Context (${fileName}):
      \`\`\`
      ${codeContext}
      \`\`\`

      User Question: ${question}

      Provide a deep, technical, and helpful response. Use markdown formatting.`,
      config: {
      }
    });
    return response.text;
  },

  async getCodeReview(code: string, fileName: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: `Perform a comprehensive technical code review for the file "${fileName}".
      
      CODE:
      ${code}

      Focus on:
      1. Logic bugs or edge cases.
      2. Security vulnerabilities.
      3. Performance bottlenecks.
      4. Code style and modern patterns.

      Respond in a structured markdown format with clear headings.`,
      config: {
        thinkingConfig: { thinkingBudget: 4096 }
      }
    });
    return response.text;
  },

  async getSecurityFix(vulnerability: string, codeSnippet: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: `As a security expert, fix this vulnerability: ${vulnerability}.\n\nSnippet:\n${codeSnippet}\n\nProvide the explanation and the corrected code.`,
      config: {
        thinkingConfig: { thinkingBudget: 4096 }
      }
    });
    return response.text;
  },

  async summarizeRepoActivity(commits: string[]) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Summarize the following repository activities in a brief, professional paragraph for a dashboard:\n\n${commits.join('\n')}`,
    });
    return response.text;
  },

  async checkContentSafety(title: string, content: string): Promise<{ status: 'SAFE' | 'WARNING' | 'FLAGGED'; reason?: string }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const historyString = history.map(m => `${m.sender}: ${m.text}`).join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
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
        thinkingConfig: { thinkingBudget: 4096 },
      }
    });
    return response.text;
  }
};
