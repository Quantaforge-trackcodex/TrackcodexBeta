import { GoogleGenAI } from "@google/genai";
import axios from "axios";

export type AIProvider = "google" | "local";

export interface AIResponse {
  content: string;
  provider: string;
  model: string;
}

export class AIOrchestrator {
  private static googleAI: GoogleGenAI | null = null;
  private static GOOGLE_API_KEY =
    process.env.GEMINI_API_KEY || process.env.VITE_API_KEY || "";
  private static LOCAL_URL =
    process.env.LOCAL_AI_URL || "http://localhost:11434/api/chat";

  private static initGoogle() {
    if (!this.googleAI && this.GOOGLE_API_KEY) {
      this.googleAI = new GoogleGenAI({ apiKey: this.GOOGLE_API_KEY });
    }
  }

  static async generateResponse(
    prompt: string,
    options: {
      provider?: AIProvider;
      model?: string;
      systemPrompt?: string;
      context?: any;
    } = {},
  ): Promise<AIResponse> {
    const provider = options.provider || "google";

    if (provider === "google") {
      return this.generateGoogleResponse(prompt, options);
    } else {
      return this.generateLocalResponse(prompt, options);
    }
  }

  private static async generateGoogleResponse(
    prompt: string,
    options: any,
  ): Promise<AIResponse> {
    this.initGoogle();
    if (!this.googleAI) {
      throw new Error("Google AI provider not configured. Set GEMINI_API_KEY.");
    }

    const modelName = options.model || "gemini-1.5-flash";
    const model = this.googleAI.getGenerativeModel({ model: modelName });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      systemInstruction:
        options.systemPrompt ||
        "You are ForgeAI, an expert engineering assistant.",
    });

    return {
      content: result.response.text(),
      provider: "google",
      model: modelName,
    };
  }

  private static async generateLocalResponse(
    prompt: string,
    options: any,
  ): Promise<AIResponse> {
    const modelName = options.model || "deepseek-coder";

    try {
      const response = await axios.post(this.LOCAL_URL, {
        model: modelName,
        messages: [
          {
            role: "system",
            content:
              options.systemPrompt ||
              "You are ForgeAI, an expert engineering assistant.",
          },
          { role: "user", content: prompt },
        ],
        stream: false,
      });

      return {
        content: response.data.message.content || response.data.response,
        provider: "local",
        model: modelName,
      };
    } catch (error: any) {
      console.error("Local AI Error:", error.message);
      throw new Error(
        "Failed to connect to local AI provider (Ollama/DeepSeek).",
      );
    }
  }
}
