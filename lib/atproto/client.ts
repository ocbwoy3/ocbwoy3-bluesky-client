import { AppBskyFeedDefs, BskyAgent } from "@atproto/api";

((globalThis || global) as any).bskyAgent = new BskyAgent({
	service: "https://api.bsky.app"
})

export function setAgent(a: BskyAgent) {
	((globalThis || global) as any).bskyAgent = a;
}

export function getAgent(): BskyAgent {
	return ((globalThis || global) as any).bskyAgent;
}

export async function fetchPosts({ feedUri, cursor }: { feedUri: string, cursor?: string }): Promise<{ newCursor?: string, feed: AppBskyFeedDefs.FeedViewPost[] }> {
	const agent = getAgent();
	if (!agent) {
		throw new Error("ATProto Agent not set");
	}
	const feed = await agent.app.bsky.feed.getFeed({
		feed: feedUri,
		limit: 50,
		cursor: cursor
	})
	return {
		newCursor: feed.data.cursor,
		feed: feed.data.feed
	};
}