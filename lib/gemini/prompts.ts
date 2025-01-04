export type SystemPrompt = {
	name: string;
	id: string;
	prompt: string;
};

import NyawasticLangPrompt from "./system_prompts/nyawastic_lang";

export type SystemPromptType = "PostComposer" | "AISummary";

export const SystemPromptsAISkeet: SystemPrompt[] = [
	{
		name: "Default",
		id: "default",
		prompt: "",
	},
	{
		name: "Nyawastic lang",
		id: "nyaw",
		prompt: NyawasticLangPrompt,
	},
];

export const SystemPromptsAISummary: SystemPrompt[] = [
	{
		name: "Default",
		id: "default",
		prompt: "",
	},
	{
		name: "Nyawastic lang",
		id: "nyaw",
		prompt: NyawasticLangPrompt,
	},
];


export function getCurrentSystemPrompt(
	from: SystemPromptType
): string {
	if (!global.localStorage[`aisetting_${from}`]) {
		global.localStorage[`aisetting_${from}`] = "default";
	}
	const prompt = SystemPromptsAISkeet.find(
		(p) => p.id === global.localStorage[`aisetting_${from}`]
	);
	if (!prompt) {
		return "";
	}
	return prompt.prompt;
}

export function getCurrentSystemPromptId(
	from: SystemPromptType
): string {
	if (!global.localStorage[`aisetting_${from}`]) {
		global.localStorage[`aisetting_${from}`] = "default";
	}
	return global.localStorage[`aisetting_${from}`];
}

export function setCurrentSystemPrompt(
	from: SystemPromptType,
	id: string
) {
	global.localStorage[`aisetting_${from}`] = id;
}