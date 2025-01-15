import { fetchPosts } from "@/lib/atproto/client";
import { AppBskyFeedDefs } from "@atproto/api";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Post } from "./Post";

interface FeedViewProps {
	feedUri: string;
}

export function FeedView({ feedUri }: FeedViewProps) {
	const [posts, setPosts] = useState<AppBskyFeedDefs.FeedViewPost[]>([]);
	const [cursor, setCursor] = useState<string | undefined>();
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	const loadMore = async () => {
		if (isLoading) return;

		setIsLoading(true);
		try {
			const newPosts = await fetchPosts({
				feedUri,
				cursor,
			});

			if (newPosts && newPosts.feed.length > 0) {
				setPosts((prevPosts) => {
					return [...prevPosts, ...(newPosts.feed.filter(a=>{
						return prevPosts.find(b=>b.post.uri === a.post.uri) ? false : true
					}))];
				});
				setCursor(newPosts.newCursor); // Update with new cursor from response if available
			} else {
				setHasMore(false); // Stop loading if no more posts are returned
			}
		} catch (error) {
			console.error("Error fetching posts:", error);
			setHasMore(false); // Stop on error to prevent infinite loop
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		// Reset state when feedUri changes to avoid stale data being rendered at the beginning
		setPosts([]);
		setCursor(undefined);
		setHasMore(true);
		loadMore();
	}, [feedUri]);

	return (
		<div className="w-full max-w-2xl mx-auto max-h-screen overflow-y-scroll no-scrollbar">
			<InfiniteScroll
				dataLength={posts.length}
				next={loadMore}
				hasMore={hasMore}
				loader={
					<h4 className="text-center py-4">Loading more posts...</h4>
				}
				endMessage={
					<p className="text-center py-4">
						<b>You have reached the end.</b>
					</p>
				}
				// Add a refresh function if needed
				// refreshFunction={refresh}
				// pullDownToRefresh
				// pullDownToRefreshThreshold={50}
				// pullDownToRefreshContent={
				//     <h3 style={{ textAlign: 'center' }}>↓ Pull down to refresh</h3>
				// }
				// releaseToRefreshContent={
				//     <h3 style={{ textAlign: 'center' }}>↑ Release to refresh</h3>
				// }
			>
				{posts.map((post, index) => (
					<Post key={post.post.uri || index} post={post} />
				))}
			</InfiniteScroll>
		</div>
	);
}
