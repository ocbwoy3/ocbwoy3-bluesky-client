import { GoogleGenerativeAI } from "@google/generative-ai"

export { GenerateSkeet } from "./generateSkeet"

export function createGemini(apiKey: string): GoogleGenerativeAI {
	return new GoogleGenerativeAI(apiKey);
}