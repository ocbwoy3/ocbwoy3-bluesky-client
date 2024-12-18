"use client";

import { JSX, ReactNode, useEffect, useState } from "react";
import { Window } from "./Window";
import { Button } from "@/components/ui/button";
import { LibraryList } from "./windows/LibraryList";
import EventEmitter from "events";

export interface WindowChildProps {
	windowId: string;
}

interface WindowData {
	id: string;
	title: string;
	content: JSX.Element;
	position: { x: number; y: number };
	size: { width: number; height: number };
	minSize?: { width: number; height: number };
}

const _addWindowEvent = new EventEmitter();

export function addWindow(w: WindowData) {
	(global as any)._SNSaddWindow(w);
}

export function updateWindow(id: string, w: Partial<WindowData>) {
	(global as any)._SNSWUpdateProps(id, w);
}

export function closeWindow(id: string) {
	(global as any)._SNScloseWindow(id);
}

export function WindowManager() {
	const [windows, setWindows] = useState<WindowData[]>([]);

	useEffect(() => {
		(global as any)._SNSaddWindow = (x: WindowData) => {
			setWindows((a) => {
				return [...a, x];
			});
		};

		(global as any)._SNSWUpdateProps = (
			id: string,
			x: Partial<WindowData>
		) => {
			const existingWindowIndex = windows.findIndex(
				(window) => window.id === id
			);

			if (existingWindowIndex !== -1) {
				const existingWindow = windows[existingWindowIndex];
				const updatedWindow = { ...existingWindow, ...x };
				setWindows((windows) => [
					...windows.slice(0, existingWindowIndex),
					updatedWindow,
					...windows.slice(existingWindowIndex + 1),
				]);
			} else {
				// console.warn(`Window with id "${id}" not found.`);
			}
		};
	});

	const addWindow = () => {
		const newWindow: WindowData = {
			id: Date.now().toString() + Math.random().toString(),
			title: "New Window",
			content: <div>This is a new window</div>,
			position: { x: 150, y: 150 },
			size: { width: 300, height: 200 },
			minSize: { width: 250, height: 100 },
		};
		setWindows([...windows, newWindow]);
	};

	const removeWindow = (id: string) => {
		setWindows(windows.filter((w) => w.id !== id));
	};

	(global as any)._SNScloseWindow = removeWindow;

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
