import React from "react";
import { AppBskyFeedDefs } from "@atproto/api";
import { Post } from "./Post";
import InfiniteScroll from "react-infinite-scroll-component";

interface FeedViewProps {
	posts: AppBskyFeedDefs.FeedViewPost[];
	feedUri: string /* at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot */;
}

import { useState, useEffect } from "react";
import { fetchPosts } from "../../../lib/atproto/client"; // Assume this function fetches more posts

export function FeedView({ posts: initialPosts = [], feedUri }: FeedViewProps) {
	const [posts, setPosts] = useState(initialPosts);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [cursor, setCursor] = useState<string | undefined>();

	const fetchMoreData = async () => {
		setLoading(true);
		(async () => {
			console.log("loading lol");
			if (posts.length >= 500) {
				setHasMore(false);
				return;
			}
			const newPosts = await fetchPosts({
				feedUri: feedUri,
				cursor: cursor,
			});
			setCursor(newPosts.newCursor);
			setHasMore(newPosts.newCursor ? true : false);
			setLoading(false);
			const existingUris = new Set(posts.map((post) => post.post.uri));
			const filteredNewPosts = newPosts.feed.filter(
				(post) => !existingUris.has(post.post.uri)
			);
			setPosts([...posts, ...filteredNewPosts]);
		})();
	};

	useEffect(() => {
		fetchMoreData();
	}, [feedUri]);

	return (
		<>
			{process.env.NODE_ENV === "development" ? (
				<span className="z-[100] bg-ctp-crust bg-transparent text-sm font-mono fixed bottom-4 right-8 p-2 rounded-lg text-ctp-red break-all">
					<span className="font-bold text-lg">{"feed debug"}</span>
					<br />
					{"posts: "}
					{posts.length}
					<br />
					{"loading: "}
					{loading ? "true" : "false"}
					<br />
					{"hasMore: "}
					{hasMore ? "true" : "false"}
				</span>
			) : (
				""
			)}
			<InfiniteScroll
				className="space-y-4 h-screen max-h-screen"
				dataLength={posts.length}
				next={fetchMoreData}
				hasMore={hasMore}
				loader={"Loading more posts..."}
				endMessage={"You've seen it all!"}
			>
				{posts.map((post) => (
					<Post key={post.post.uri} post={post} />
				))}
			</InfiniteScroll>
		</>
	);
}
