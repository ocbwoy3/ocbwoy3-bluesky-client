// src/lib/api.ts
import { BskyAgent } from "@atproto/api";

(window as any).bskyAgent = new BskyAgent({
	service: "https://api.bsky.app"
})

export function setAgent(a: BskyAgent) {
	(window as any).bskyAgent = a;
}

export function getAgent() {
	return (window as any).bskyAgent;
}
