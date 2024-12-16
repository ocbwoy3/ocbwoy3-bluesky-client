import { BskyAgent } from "@atproto/api";

((globalThis || global) as any).bskyAgent = new BskyAgent({
	service: "https://api.bsky.app"
})

export function setAgent(a: BskyAgent) {
	((globalThis || global) as any).bskyAgent = a;
}

export function getAgent() {
	return ((globalThis || global) as any).bskyAgent;
}
