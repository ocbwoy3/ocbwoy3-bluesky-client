"use client";

import { Title } from "./Title";
import Link from "next/link";
import { ProfileButton } from "./app/ProfileButton";
import { WindowManager } from "./app/WM";
import { useState } from "react";

export function App() {

	return (
		<>
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
					.next_version!}`}</span>
				{/* {process.env.packagejson!} */}
			</span>
		</>
	);
}
