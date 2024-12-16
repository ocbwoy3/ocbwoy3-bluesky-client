import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command";
import React from "react";
import { DialogTitle } from "../ui/dialog";
import { FeedItem } from "@atproto/api/dist/client/types/app/bsky/graph/starterpack";
import { Feed } from "@atproto/api/dist/client/types/app/bsky/feed/describeFeedGenerator";
import { getAgent } from "@/lib/atproto/client";
import { GeneratorView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";

export function CommandMenu() {
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const [feeds, setFeeds] = React.useState<GeneratorView[]>([]);
	const [feedSearchCache, setFeedSearchCache] = React.useState<{
		[q: string]: GeneratorView[];
	}>({});

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<DialogTitle></DialogTitle>
			<CommandInput
				onValueChange={async (q: string) => {
					let qq = q.trim();
					let f = feedSearchCache[qq] || null;

					const agent = getAgent();

					if (f === null) {
						const r =
							await agent.app.bsky.unspecced.getPopularFeedGenerators(
								{
									query: q.trim(),
								}
							);
						setFeedSearchCache((a) => {
							return {
								...a,
								qq: r.data.feeds,
							};
						});
						return setFeeds(r.data.feeds);
					}

					setFeeds(f);
				}}
				placeholder="Search Bluesky"
			/>
			<CommandList className="no-scrollbar">
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Feeds">
					{feeds.map((x) => (
						<CommandItem key={x.uri}>
							{x.displayName}
							<span className="text-xs text-muted-foreground">
								by {x.creator.displayName || x.creator.handle}
							</span>
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
