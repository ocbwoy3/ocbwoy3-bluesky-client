"use client";

import { getAgent } from "@/lib/atproto/client";
import Link from "next/link";
import { FeedView } from "./app/feed/FeedView";
import { ProfileButton } from "./app/ProfileButton";
import { WindowManager } from "./app/WM";
import { Title } from "./Title";

export function App() {

	return (
		<>
			<FeedView feedUri="at://did:plc:s7cesz7cr6ybltaryy4meb6y"/>
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
				<span className="text-ctp-surface2 text-xs">{` @atproto/api ${process
					.env.atproto_api_version!} | next ${process.env
					.next_version!} - ${getAgent().pdsUrl} ${getAgent().did}`}</span>
				{/* {process.env.packagejson!} */}
			</span>
		</>
	);
}
