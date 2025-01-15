import { AppBskyActorProfile, BskyAgent } from "@atproto/api";

let recordCache_appBskyActorProfile: {[did: string]: (AppBskyActorProfile.Record | null)} = {};

export async function prefetchProfileRecord(agent: BskyAgent, did: string): Promise<AppBskyActorProfile.Record | null> {
	if (recordCache_appBskyActorProfile[did]) {
		return recordCache_appBskyActorProfile[did];
	}

	try {
		const profile = await agent.app.bsky.actor.profile.get({
			repo: did,
			rkey: "self"
		});
		recordCache_appBskyActorProfile[did] = profile.value;
		return profile.value;
	} catch (error) {
		console.error(`Cannot fetch at://${did}/app.bsky.actor.profile/self:`, error);
		return null;
	}
}

export function getProfileRecord(did: string): AppBskyActorProfile.Record | null {
	return recordCache_appBskyActorProfile[did] || null;
}