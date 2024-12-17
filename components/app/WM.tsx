"use client";

import { useState } from "react";
import { Window } from "./Window";
import { Button } from "@/components/ui/button";

interface WindowData {
	id: string;
	title: string;
	content: React.ReactNode;
	position: { x: number; y: number };
	size: { width: number; height: number };
	minSize?: { width: number; height: number };
}

export function WindowManager() {

	let deps = JSON.parse(process.env.packagejson!).dependencies! as {[v:string]: string}
	let devDeps = JSON.parse(process.env.packagejson!).devDependencies! as {[v:string]: string}
	

	const [windows, setWindows] = useState<WindowData[]>([
		{
			id: "1",
			title: "cool window",
			content: (
				<div className="space-y-4">
					<div className="block">
						<div className="font-bold text-lg">dependencies</div>
						{ Object.entries(deps).map((a: [string, string])=>(
							<div key={a[0]}>{a[0]} <span className="text-muted-foreground">{a[1]}</span></div>
						)) }
						<div className="font-bold text-lg">devDependencies</div>
						{ Object.entries(devDeps).map((a: [string, string])=>(
							<div key={a[0]}>{a[0]} <span className="text-muted-foreground">{a[1]}</span></div>
						)) }
					</div>
				</div>
			),
			position: { x: 100, y: 100 },
			size: { width: 400, height: 400 },
			minSize: { width: 350, height: 150 }
		},
	]);

	const addWindow = () => {
		const newWindow: WindowData = {
			id: Date.now().toString(),
			title: "New Window",
			content: <div>This is a new window</div>,
			position: { x: 150, y: 150 },
			size: { width: 300, height: 200 },
		};
		setWindows([...windows, newWindow]);
	};

	const removeWindow = (id: string) => {
		setWindows(windows.filter((w) => w.id !== id));
	};

	return (
		<div className="fixed inset-0 pointer-events-none z-[100]">
			<div className="absolute top-4 right-4 z-50 pointer-events-auto">
				<Button onClick={addWindow}>Add Window</Button>
			</div>
			{windows.map((window) => (
				<Window
					key={window.id}
					title={window.title}
					defaultPosition={window.position}
					defaultSize={window.size}
					minSize={window.minSize || { width: 200, height: 150 }}
					onClose={() => removeWindow(window.id)}
				>
					{window.content}
				</Window>
			))}
		</div>
	);
}
