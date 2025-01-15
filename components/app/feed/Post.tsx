"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Separator } from "@/components/ui/separator";
import { getProfileRecord } from "@/lib/atproto/cache";
import { getAgent } from "@/lib/atproto/client";
import { segmentize } from "@atcute/bluesky-richtext-segmenter";
import { AppBskyActorProfile, AppBskyFeedDefs } from "@atproto/api";
import { Heart, MessageSquare, Repeat2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { addWindow } from "../WM";
import { PostDialog } from "../windows/PostDialog";

interface PostProps {
	post: AppBskyFeedDefs.FeedViewPost;
}

let cachedUserProfiles: { [did: string]: AppBskyActorProfile.Record } = {};

export function Post({ post: { post } }: PostProps) {
	const [isLiked, setIsLiked] = useState(post.viewer?.like ? true : false);
	const [isReposted, setIsReposted] = useState(
		post.viewer?.repost ? true : false
	);
	const [likeCount, setLikeCount] = useState(post.likeCount || 0);
	const [repostCount, setRepostCount] = useState(post.repostCount || 0);

	const [poster, setPoster] = useState<null | AppBskyActorProfile.Record>(
		getProfileRecord(post.author.did)
	);

	const agent = getAgent();

	const handleLike = async () => {
		try {
			if (!isLiked) {
				await agent.like(post.uri, post.cid);
				setLikeCount((prev) => prev + 1);
			} else {
				await agent.deleteLike(post.viewer?.like!);
				setLikeCount((prev) => prev - 1);
			}
			setIsLiked(!isLiked);
		} catch (error) {
			toast("Error", {
				description: "Failed to like post. Please try again.",
			});
		}
	};

	const handleRepost = async () => {
		try {
			if (!isReposted) {
				await agent.repost(post.uri, post.cid);
				setRepostCount((prev) => prev + 1);
			} else {
				await agent.deleteRepost(post.viewer?.repost!);
				setRepostCount((prev) => prev - 1);
			}
			setIsReposted(!isReposted);
		} catch (error) {
			toast("Error", {
				description: "Failed to repost. Please try again.",
			});
		}
	};

	const handleReply = () => {
		const id = Date.now().toString() + Math.random().toString();
		addWindow({
			id: id,
			title: "Reply",
			content: (
				<PostDialog
					windowId={id}
					replyPost={{
						root: post,
						parent: post,
					}}
				/>
			),
			position: { x: 100, y: 100 },
			size: { width: 500, height: 250 },
			minSize: { width: 450, height: 250 },
		});
	};

	const openPost = () => {
		const id = Date.now().toString() + Math.random().toString();
		// Add detailed post view window implementation here
	};

	const [contentWarning, setContentWarning] = useState(false);

	let allLabels = [
		...(post.labels || []),
		...(post.author.labels || []),
	].filter((a) => {
		if (a.val === "!no-unauthenticated" && a.src === post.author.did)
			return false;
		return true;
	});

	const rt = segmentize(
		(post.record as any).text || "",
		(post.record as any).facets || []
	);
	let text = [];

	for (const segment of rt) {
		let type: "NONE" | "LINK" | "TAG" | "USER" = "NONE";
		let linkToOpen = ""; // url or atproto did
		let style: string[] = ["decoration-ctp-blue"];

		function pushStyle(s: string) {
			if (!style.includes(s)) {
				style.push(s);
			}
		}

		for (const f of segment.features || []) {
			if (f.$type === "app.bsky.richtext.facet#mention") {
				type = "USER";
				linkToOpen = f.did;
			}
			if (f.$type === "app.bsky.richtext.facet#link") {
				type = "LINK";
				linkToOpen = f.uri;
				pushStyle("text-ctp-blue");
			}
			if (f.$type === "app.bsky.richtext.facet#tag") {
				type = "TAG";
				linkToOpen = f.tag;
				pushStyle("text-ctp-blue");
				pushStyle("decoration-ctp-blue");
				pushStyle("underline");
			}
			if ((f.$type as string) === "dev.ocbwoy3.sns.facet#bold") {
				pushStyle("font-bold");
			}
			if ((f.$type as string) === "dev.ocbwoy3.sns.facet#underline") {
				pushStyle("underline");
				pushStyle("decoration-ctp-text");
			}
		}

		if (type === "LINK") {
			text.push(
				<Link href={linkToOpen} key={JSON.stringify(segment)} className={style.join(" ")}>
					{segment.text}
				</Link>
			);
		} else {
			text.push(
				<span key={JSON.stringify(segment)} className={style.join(" ")}>
					{segment.text}
				</span>
			);
		}
	}

	// text = [JSON.stringify(post.record)]

	return (
		<>
			<Card
				className="p-4 hover:bg-ctp-crust border-none shadow-none cursor-pointer bg-transparent mx-1 my-2"
				onClick={openPost}
			>
				<ContextMenu>
					<ContextMenuTrigger>
						<div className="flex space-x-4">
							<Avatar className="h-12 w-12">
								<AvatarImage src={post.author.avatar} />
								<AvatarFallback>
									{post.author.handle
										.slice(0, 2)
										.toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1 space-y-2">
								<div className="flex items-center space-x-2">
									<span className="font-semibold">
										{post.author.displayName ||
											post.author.handle}
									</span>
									<span className="text-muted-foreground">
										@
										{post.author.handle.replace(
											/\.bsky\.social$/,
											""
										)}
									</span>
									<span className="text-muted-foreground text-xs">
										{poster && poster.pronouns
											? `(${poster.pronouns})`
											: ""}
									</span>
									{(post.record as any).ai_generated ? (
										<Badge
											className="text-muted-foreground text-sm"
											variant="outline"
										>
											AI Generated
										</Badge>
									) : (
										""
									)}
								</div>
								<div className="text-sm space-y-2">
									{allLabels.length !== 0 ? (
										<span className="text-xs text-ctp-subtext1">
											{allLabels.map((a) => (
												<span
													key={`${a.cid}/${a.cts}/${a.exp}/${a.neg}/${a.sig}/${a.src}/${a.uri}/${a.val}/${a.ver}`}
												>
													{a.val}
												</span>
											))}
											<br />
										</span>
									) : (
										<></>
									)}
									<span className="text-sm text-ctp-text whitespace-pre-line">
										{...text}
									</span>
								</div>
								<div className="flex items-center space-x-6 text-muted-foreground">
									<Button
										variant="ghost"
										size="sm"
										onClick={handleReply}
									>
										<MessageSquare className="h-4 w-4 mr-1" />
										{post.replyCount || 0}
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={handleRepost}
										className={
											isReposted ? "text-green-500" : ""
										}
									>
										<Repeat2 className="h-4 w-4 mr-1" />
										{repostCount}
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={handleLike}
										className={
											isLiked ? "text-red-500" : ""
										}
									>
										<Heart className="h-4 w-4 mr-1" />
										{likeCount}
									</Button>
									{(post.record as any).posting_client ? (
										<span className="text-sm font-mono text-muted">
											{
												(post.record as any)
													.posting_client
											}
										</span>
									) : (
										<></>
									)}
								</div>
							</div>
						</div>
					</ContextMenuTrigger>
					<ContextMenuContent className="font-sans">
						<ContextMenuItem>Open Post</ContextMenuItem>
						<ContextMenuItem>Quote</ContextMenuItem>
						<ContextMenuSeparator />
						<ContextMenuItem
							onClick={() => {
								window.open(
									"https://pdsls.dev/" +
										post.uri.replace("://", "/")
								);
							}}
						>
							View Record
						</ContextMenuItem>
						<ContextMenuItem
							onClick={() => {
								navigator.clipboard.writeText(post.uri);
							}}
						>
							Copy URI
						</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenu>
			</Card>
			<Separator />
		</>
	);
}
