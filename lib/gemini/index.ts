import { GoogleGenerativeAI } from "@google/generative-ai";
export { GenerateSkeet } from "./generateSkeet";

export { SystemPromptsAISkeet as SystemPrompts } from "./prompts";

export function createGemini(apiKey: string): GoogleGenerativeAI {
	return new GoogleGenerativeAI(apiKey);
}
