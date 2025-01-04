export type SystemPrompt = {
	name: string;
	id: string;
	prompt: string;
};

import NyawasticLangPrompt from "./system_prompts/nyawastic_lang";

export const SystemPrompts: SystemPrompt[] = [
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

export function getCurrentSystemPrompt(): string {
	if (!global.localStorage.skeet_system_prompt) {
		global.localStorage.skeet_system_prompt = "default";
	}
	const prompt = SystemPrompts.find(
		(p) => p.id === global.localStorage.skeet_system_prompt
	);
	if (!prompt) {
		return "";
	}
	return prompt.prompt;
}
