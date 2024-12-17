"use client";

import { useCallback, useEffect, useState } from "react";
import { Title } from "../Title";
import { Button } from "../ui/button";
import { getAgent } from "@/lib/atproto/client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";

export function ProfileButton() {
	const [params, setParams] = useState<{
		did: string;
		handle: string;
		displayName: string;
		pfpBlob: string;
	}>({
		did: "did:plc:s7cesz7cr6ybltaryy4meb6y",
		handle: "@handle.invalid",
		displayName: "Loading...",
		pfpBlob:
			"https://cdn.bsky.app/img/avatar/plain/did:plc:s7cesz7cr6ybltaryy4meb6y/bafkreidmmzt6jjrwtvkvgpk4mjh74otyc7uhchbjxldvoh4p7r7nqtpkpi@jpeg",
	});

	useEffect(() => {
		(async () => {
			const ag = await getAgent();
			const { data: p } = await ag.getProfile({
				actor: ag.did!,
			});

			setParams({
				did: ag.did!,
				handle: p.handle,
				displayName: p.displayName || p.handle,
				pfpBlob: p.avatar!,
			});
		})();
	}, []);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8">
					<img
						src={params.pfpBlob}
						className="w-8 h-8 rounded-full"
					/>
					{params.displayName}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				side="top"
				className="w-[--radix-popper-anchor-width]"
			>
				<DropdownMenuItem>
					<Link href={"https://bsky.app/profile/" + params.did}>
						View Profile (Bluesky)
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						localStorage.removeItem("login-details");
						localStorage.removeItem("atproto-session");
						location.reload();
					}}
				>
					<span>Sign out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);

	// return <>{params.did === "" ? "loading" : <>{JSON.stringify(params)}</>}</>;
}
