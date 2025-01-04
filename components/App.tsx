"use client";

import { Title } from "./Title";
import Link from "next/link";
import { ProfileButton } from "./app/ProfileButton";
import { WindowManager } from "./app/WM";
import { useState } from "react";
import { FeedView } from "./app/feed/FeedView";
import { getAgent } from "@/lib/atproto/client";

export function App() {

	return (
		<>
			{/* <FeedView posts={[]} feedUri="at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot"/> */}
			<WindowManager/>
			<div className="absolute w-screen top-4 select-none">
				<Title />
			</div>
			<div className="absolute top-2 left-2 z-[70]">
				<ProfileButton />
			</div>
			<span className="absolute bottom-2 left-3 font-mono z-[60]">
				<Link
					className="underline"
					href="https://github.com/ocbwoy3/ocbwoy3-bluesky-client"
				>
					OCbwoy3 Bluesky Client
				</Link>
				{` (${process.env.NODE_ENV}) `}
				<span className="text-ctp-surface2">{` @atproto/api ${process
					.env.atproto_api_version!} | next ${process.env
					.next_version!} - ${getAgent().pdsUrl}`}</span>
				{/* {process.env.packagejson!} */}
			</span>
		</>
	);
}
