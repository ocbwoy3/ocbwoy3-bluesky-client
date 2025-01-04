"use client";

import { AppBskyFeedDefs } from "@atproto/api";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Repeat2, Heart } from "lucide-react";
import { addWindow } from "../WM";
import { PostDialog } from "../windows/PostDialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getAgent } from "@/lib/atproto/client";
import { toast } from "sonner";

interface PostProps {
	post: AppBskyFeedDefs.FeedViewPost;
}

export function Post({ post: { post } }: PostProps) {
	const [isLiked, setIsLiked] = useState(post.viewer?.like ? true : false);
	const [isReposted, setIsReposted] = useState(post.viewer?.repost ? true : false);
	const [likeCount, setLikeCount] = useState(post.likeCount || 0);
	const [repostCount, setRepostCount] = useState(post.repostCount || 0);

	const agent = getAgent();

	const handleLike = async () => {
		try {
			if (!isLiked) {
				await agent.like(post.uri, post.cid);
				setLikeCount(prev => prev + 1);
			} else {
				await agent.deleteLike(post.viewer?.like!);
				setLikeCount(prev => prev - 1);
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
				setRepostCount(prev => prev + 1);
			} else {
				await agent.deleteRepost(post.viewer?.repost!);
				setRepostCount(prev => prev - 1);
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
		
	};

	const openPost = () => {
		const id = Date.now().toString() + Math.random().toString();
		// Add detailed post view window implementation here
	};

	return (
		<Card className="p-4 hover:bg-accent cursor-pointer" onClick={openPost}>
			<div className="flex space-x-4">
				<Avatar className="h-12 w-12">
					<AvatarImage src={post.author.avatar} />
					<AvatarFallback>
						{post.author.handle.slice(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div className="flex-1 space-y-2">
					<div className="flex items-center space-x-2">
						<span className="font-semibold">
							{post.author.displayName || post.author.handle}
						</span>
						<span className="text-muted-foreground">
							@{post.author.handle.replace(/\.bsky\.social^/,"")}
						</span>
					</div>
					<div className="text-sm">{(post.record as any).text || <span className="text-ctp-red">{"[OCbwoy3-SNS] post has no text record"}</span>}</div>
					<div className="flex items-center space-x-6 text-muted-foreground">
						<Button variant="ghost" size="sm" onClick={handleReply}>
							<MessageSquare className="h-4 w-4 mr-1" />
							{post.replyCount || 0}
						</Button>
						<Button 
							variant="ghost" 
							size="sm" 
							onClick={handleRepost}
							className={isReposted ? "text-green-500" : ""}
						>
							<Repeat2 className="h-4 w-4 mr-1" />
							{repostCount}
						</Button>
						<Button 
							variant="ghost" 
							size="sm" 
							onClick={handleLike}
							className={isLiked ? "text-red-500" : ""}
						>
							<Heart className="h-4 w-4 mr-1" />
							{likeCount}
						</Button>
					</div>
				</div>
			</div>
		</Card>
	);
}