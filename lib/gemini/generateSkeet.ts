import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCurrentSystemPrompt } from "./prompts";

export async function GenerateSkeet(
	ai: GoogleGenerativeAI,
	prompt: string
): Promise<string> {
	// check if <= 300 utf8 graphemes
	if (prompt.length > 300) {
		throw new Error("Prompt must be <= 300 characters");
	}
	// check if prompt is empty
	if (prompt.length === 0) return "";

	const model = ai.getGenerativeModel({
		model: "gemini-1.5-flash-8b",
		systemInstruction: [
			"You must generate a Bluesky post based on the given prompt.",
			"You can either work on top of it, or refine it.",
			"Only return the raw post text of a single post ONLY.",
			"No more than 300 chars.",
			"No hashtags nor emojis."
		].join("\n")+getCurrentSystemPrompt("PostComposer"),
	});

	const generationConfig = {
		temperature: 1,
		topP: 0.95,
		topK: 40,
		maxOutputTokens: 8192,
		responseMimeType: "text/plain",
	};

	const chatSession = model.startChat({
		generationConfig
	});

	const result = await chatSession.sendMessage(prompt);

	return result.response.text().slice(0,300);
}
