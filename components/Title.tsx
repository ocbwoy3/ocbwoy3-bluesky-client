export function Title() {
	return (
		<div className="font-bold text-center text-indigo-600 font-mono text-base pointer-events-none select-none">
			<div
				className="text-yellow-300 font-bold text-base z-30 animatre"
				style={{
					// width: 0,
					height: 0,
					transform: "translate(100px,20px) rotate(-12deg)",
				}}
			>
				{"bsky i think"}
			</div>
			<span className="text-4xl">ocbwoy3.dev</span>
			<br />
			<span>{"it's time to skeet"}</span>
		</div>
	);
}
