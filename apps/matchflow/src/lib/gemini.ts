import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI SDK
// Uses Vite environment variable safely
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "mock-gemini-key";
const genAI = new GoogleGenerativeAI(apiKey);

export class GeminiAssistantService {
  private model;

  constructor() {
    // Specifically use the Gemini 1.5 Flash model for low-latency stadium advice
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  /**
   * Generates a context-aware smart prompt for a fan based on stadium conditions
   */
  async generateNextBestAction(
    location: string, 
    matchState: any, 
    nearestCongestion: number
  ): Promise<string> {
    try {
      const prompt = `
        You are a smart stadium assistant. 
        The fan is currently at ${location}. 
        The match is at: ${JSON.stringify(matchState)}.
        The nearest zone congestion is ${nearestCongestion}%.
        Give a short, friendly, 1-sentence recommendation on what they should do next (e.g. grab a snack, stay in seat, use a specific gate).
      `;

      if (apiKey === "mock-gemini-key") {
        // Fallback for simulation/testing mode to prevent actual API calls without keys
        return nearestCongestion > 70 
          ? "It's getting crowded near you, consider waiting in your seat until the break is over."
          : "Looks like a great time to hit the concession stands!";
      }

      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Google Gemini Error:", error);
      return "Stay seated and enjoy the match!";
    }
  }
}

export const assistantService = new GeminiAssistantService();
