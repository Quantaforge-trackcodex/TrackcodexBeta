
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

async function testKey() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Testing Key:", key ? key.substring(0, 10) + "..." : "MISSING");

    if (!key) {
        console.error("No GEMINI_API_KEY found in process.env");
        return;
    }

    try {
        const ai = new GoogleGenAI({ apiKey: key });
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: "Hello, are you working?",
        });
        console.log("Success! Response:", response.text());
    } catch (error) {
        console.error("API Error:", error.message || error);
    }
}

testKey();
