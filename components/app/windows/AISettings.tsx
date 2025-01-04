import React, { useEffect, useState } from "react";
import { updateWindow, WindowChildProps } from "../WM";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
	getCurrentSystemPromptId,
	setCurrentSystemPrompt,
	SystemPrompt,
	SystemPromptsAISkeet,
	SystemPromptType,
} from "@/lib/gemini/prompts";

function AISettings({
	windowId,
	title,
	type,
	values,
}: {
	windowId: string;
	title: string;
	type: SystemPromptType;
	values: SystemPrompt[];
}) {
	const [promptId, setPromptId] = useState<string>(
		getCurrentSystemPromptId(type)
	);

	return (
		<div>
			<p className="text-sm text-ctp-blue">{title}</p>
			<RadioGroup
				className="pt-2"
				defaultValue={promptId}
				onValueChange={(v) => {
					setCurrentSystemPrompt(type, v);
				}}
			>
				{values.map((prompt) => (
					<div
						key={prompt.id}
						className="flex items-center space-x-2"
					>
						<RadioGroupItem
							value={prompt.id}
							id={`w${windowId}-systemPromptSelector-${type}-${prompt.id}`}
						/>
						<Label
							htmlFor={`w${windowId}-systemPromptSelector-${prompt.id}`}
						>
							{prompt.name}
						</Label>
					</div>
				))}
			</RadioGroup>
		</div>
	);
}

export function GeminiAISettings(props: WindowChildProps) {
	let deps = JSON.parse(process.env.packagejson!).dependencies! as {
		[v: string]: string;
	};
	let devDeps = JSON.parse(process.env.packagejson!).devDependencies! as {
		[v: string]: string;
	};

	useEffect(() => {
		updateWindow(props.windowId, { title: "AI Settings" });
	});

	const [apiKey, setApiKey] = useState(
		window.localStorage.gemini_api_key || ""
	);

	const [skeetPromptId, setSkeetPromptId] = useState(
		window.localStorage.skeet_system_prompt || "default"
	);

	return (
		<div className="space-y-4">
			<div className="block">
				{
					'"OCbwoy3 Bluesky Client" uses Google\'s Generative AI. To use the Gemini API, you need to '
				}
				<Link
					className="text-ctp-blue decoration-ctp-blue underline"
					href="https://ai.google.dev/gemini-api/docs/available-regions"
				>
					{"meet these requirements"}
				</Link>
				{"."}
				<br />
			</div>
			<div className="block space-y-4">
				<div>
					<p className="text-sm text-ctp-blue">Gemini API Key</p>
					<Input
						value={apiKey}
						type="password"
						aria-label="Gemini API key"
						onChange={(a) => {
							setApiKey(a.target.value);
							window.localStorage.gemini_api_key = a.target.value;
						}}
						placeholder="API Key"
					></Input>
				</div>
				<AISettings
					windowId={props.windowId}
					title="Post Composer Prompt"
					type="PostComposer"
					values={SystemPromptsAISkeet}
				/>
				<AISettings
					windowId={props.windowId}
					title="AI Summary Prompt"
					type="AISummary"
					values={SystemPromptsAISkeet}
				/>
			</div>
		</div>
	);
}
