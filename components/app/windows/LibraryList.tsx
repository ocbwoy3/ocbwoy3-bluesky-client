import React, { useEffect } from "react";
import { updateWindow, WindowChildProps } from "../WM";
import { Title } from "@/components/Title";
import { platform } from "os";
import { getAgent } from "@/lib/atproto/client";
import Link from "next/link";

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
					"Also known as OCbwoy3-SNS, this is a work-in-progress window-based Bluesky Client partially inspired by Misskey."
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
						<span className="text-ctp-subtext0 font-mono">
							{process.env.atproto_api_version!.replace("^", "")}
						</span>
					</div>
					<div>
						{"Next.js"}{" "}
						<span className="text-ctp-subtext0 font-mono">
							{process.env.next_version!.replace("^", "")}
						</span>
					</div>
					<div>
						{"React"}{" "}
						<span className="text-ctp-subtext0 font-mono">
							{process.env.react_version!.replace("^", "")}
						</span>
					</div>
					<div>
						{"Google Generative AI"}{" "}
						<span className="text-ctp-subtext0 font-mono">
							{process.env.google_genai_version!.replace("^", "")}
						</span>
					</div>
					<div>
						{"TailwindCSS"}{" "}
						<span className="text-ctp-subtext0 font-mono">
							{process.env.tailwind_version!.replace("^", "")}
						</span>
					</div>
					<div>{"shadcn/ui"}</div>
				</span>
			</div>
			<div className="text-center font-bold text-sm text-ctp-subtext0">
				{"package.json"}
			</div>
			<div className="block">
				<div className="font-bold text-lg text-ctp-blue">
					Dependencies
				</div>
				{Object.entries(deps).map((a: [string, string]) => (
					<div key={a[0]} className="font-mono">
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
			<span className="text-sm font-mono">
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
				<div>
					{"PDS"}{" "}
					<span className="text-ctp-subtext0">
						{getAgent().pdsUrl?.toString().replace(/^https\:\/\/|\/$/g,"")}
					</span>
				</div>
				<div>
					{"DID"}{" "}
					<span className="text-ctp-subtext0">
						{getAgent().did}
					</span>
				</div>
			</span>
			<span className="text-sm font-mono space-x-2">
				<Link href={"https://atproto.com"} className="text-ctp-blue decoration-ctp-blue underline">AT Protocol</Link>
				<Link href={"https://bsky.social"} className="text-ctp-blue decoration-ctp-blue underline">Bluesky</Link>
			</span>
		</div>
	);
}
