import React, { useEffect } from "react";
import { updateWindow, WindowChildProps } from "../WM";
import { Title } from "@/components/Title";
import { platform } from "os";

export function LibraryList(props: WindowChildProps) {
	let deps = JSON.parse(process.env.packagejson!).dependencies! as {
		[v: string]: string;
	};
	let devDeps = JSON.parse(process.env.packagejson!).devDependencies! as {
		[v: string]: string;
	};

	useEffect(() => {
		updateWindow(props.windowId, { title: "Credits" });
	});

	return (
		<div className="space-y-4">
			<div className="block">
				<Title />
				{
					"This is a Bluesky Client built by me to test my coding skills making it :3"
				}
				<div className="text-center font-bold text-sm text-ctp-blue">
					<div className="w-2 h-2" />
				</div>
				<div className="font-bold text-sm text-ctp-blue">
					{"Built with..."}
				</div>
				<span className="text-sm">
					<div>
						{"ATProto"}{" "}
						<span className="text-ctp-subtext0">
							{process.env.atproto_api_version!.replace("^", "")}
						</span>
					</div>
					<div>
						{"Next.js"}{" "}
						<span className="text-ctp-subtext0">
							{process.env.next_version!.replace("^", "")}
						</span>
					</div>
					<div>
						{"React"}{" "}
						<span className="text-ctp-subtext0">
							{process.env.react_version!.replace("^", "")}
						</span>
					</div>
					<div>
						{"Google Generative AI"}{" "}
						<span className="text-ctp-subtext0">
							{process.env.google_genai_version!.replace("^", "")}
						</span>
					</div>
					<div>
						{"TailwindCSS"}{" "}
						<span className="text-ctp-subtext0">
							{process.env.tailwind_version!.replace("^", "")}
						</span>
					</div>
					<div>{"shadcn/ui"}</div>
				</span>
			</div>
			<div className="text-center font-bold text-sm text-ctp-subtext0">
				{"The package.json dependencies"}
			</div>
			<div className="block">
				<div className="font-bold text-lg text-ctp-blue">
					Dependencies
				</div>
				{Object.entries(deps).map((a: [string, string]) => (
					<div key={a[0]}>
						{a[0]} <span className="text-ctp-subtext0">{a[1]}</span>
					</div>
				))}
				<div className="font-bold text-lg text-ctp-blue">
					Dev Dependencies
				</div>
				{Object.entries(devDeps).map((a: [string, string]) => (
					<div key={a[0]}>
						{a[0]} <span className="text-ctp-subtext0">{a[1]}</span>
					</div>
				))}
			</div>
			<div className="font-bold text-sm text-ctp-blue">{"Debug"}</div>
			<span className="text-sm">
				<div>
					{"platform"}{" "}
					<span className="text-ctp-subtext0">
						{navigator.platform ? navigator.platform : "????"}
					</span>
				</div>{" "}
				<div>
					{"locale"}{" "}
					<span className="text-ctp-subtext0">
						{navigator.language}
					</span>
				</div>
				<div>
					{"NODE_ENV"}{" "}
					<span className="text-ctp-subtext0">
						{process.env.NODE_ENV}
					</span>
				</div>
			</span>
		</div>
	);
}
