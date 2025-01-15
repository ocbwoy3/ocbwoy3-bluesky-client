import { AppBskyFeedDefs, BskyAgent } from "@atproto/api";
import { prefetchProfileRecord } from "./cache";

((globalThis || global) as any).bskyAgent = new BskyAgent({
	service: "https://api.bsky.app"
})

export function setAgent(a: BskyAgent) {
	((globalThis || global) as any).bskyAgent = a;
}

export function getAgent(): BskyAgent {
	return ((globalThis || global) as any).bskyAgent;
}

export async function resolveAllFeedProfiles(f: AppBskyFeedDefs.FeedViewPost[]) {
	const agent = getAgent();

	for (var post in f) {
		try {
			await prefetchProfileRecord(agent, f[post].post.author.did);
		} catch {}
	}
}

export async function fetchPosts({ feedUri, cursor }: { feedUri: string, cursor?: string }): Promise<{ newCursor?: string, feed: AppBskyFeedDefs.FeedViewPost[] }> {
	const agent = getAgent();
	if (!agent) {
		throw new Error("ATProto Agent not set");
	}
	if (/app\.bsky\.feed\.generator/.test(feedUri)) {
		const feed = await agent.app.bsky.feed.getFeed({
			feed: feedUri,
			limit: 30,
			cursor: cursor
		})
		await resolveAllFeedProfiles(feed.data.feed);
		return {
			newCursor: feed.data.cursor,
			feed: feed.data.feed
		};
	}
	const feed = await agent.app.bsky.feed.getAuthorFeed({
		actor: feedUri.replace("at://", ""),
		limit: 30,
		cursor: cursor
	})
	await resolveAllFeedProfiles(feed.data.feed);
	return {
		newCursor: feed.data.cursor,
		feed: feed.data.feed
	};
}
