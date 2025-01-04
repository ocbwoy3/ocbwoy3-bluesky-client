import React, { useEffect, useState } from "react";
import { updateWindow, WindowChildProps } from "../WM";
import Link from "next/link";
import { Input } from "@/components/ui/input";

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
				<Input
					value={apiKey}
					onChange={(a) => {
						setApiKey(a.target.value);
						window.localStorage.gemini_api_key = a;
					}}
					placeholder="API Key"
				></Input>
			</div>
		</div>
	);
}
