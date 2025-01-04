import React from "react";
import { AppBskyFeedDefs } from "@atproto/api";
import { Post } from "./Post";

interface FeedViewProps {
	posts: AppBskyFeedDefs.FeedViewPost[];
	feedUri: string /* at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot */;
}

import { useState, useEffect, useCallback } from "react";
import { fetchPosts } from "../../../lib/atproto/client"; // Assume this function fetches more posts

export function FeedView({ posts: initialPosts, feedUri }: FeedViewProps) {
	const [posts, setPosts] = useState(initialPosts);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [cursor, setCursor] = useState<string | undefined>();

	const loadMorePosts = useCallback(async () => {
		if (loading || !hasMore) return;
		setLoading(true);
		try {
			const newPosts = await fetchPosts({
				feedUri: feedUri,
				cursor: cursor,
			});
			if (newPosts.feed.length === 0) {
				setHasMore(false);
			} else {
				setCursor(newPosts.newCursor);
				setPosts((prevPosts) => [...prevPosts, ...newPosts.feed]);
			}
		} catch (error) {
			console.error("Failed to fetch more posts", error);
		} finally {
			setLoading(false);
		}
	}, [loading, hasMore]);

	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + document.documentElement.scrollTop !==
				document.documentElement.offsetHeight
			)
				return;
			loadMorePosts();
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [loadMorePosts]);

	return (
		<div className="space-y-4">
			{posts.map((post) => (
				<Post key={post.post.uri} post={post} />
			))}
			{loading && <div>Loading more posts...</div>}
		</div>
	);
}
