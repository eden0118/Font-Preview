import { GoogleGenAI } from "@google/genai";
import { TextGenerationConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCreativeText = async (config: TextGenerationConfig): Promise<string> => {
  try {
    let languagePrompt = '';
    switch (config.language) {
      case 'tc': languagePrompt = 'Traditional Chinese (繁體中文)'; break;
      case 'sc': languagePrompt = 'Simplified Chinese (简体中文)'; break;
      case 'ja': languagePrompt = 'Japanese (日本語, including Kanji/Kana)'; break;
      case 'ko': languagePrompt = 'Korean (한국어)'; break;
      case 'en': languagePrompt = 'English'; break;
      default: languagePrompt = 'Traditional Chinese';
    }

    const prompt = `
      Generate a single, short, visually interesting sentence or phrase (10-15 characters max) in ${languagePrompt}.
      The mood should be: ${config.mood}.
      It should be suitable for testing font rendering (e.g., using characters with varied density).
      Return ONLY the text string, no markdown, no quotes.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || '';
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};