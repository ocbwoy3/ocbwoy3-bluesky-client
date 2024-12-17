"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

interface WindowProps {
	title: string;
	children: React.ReactNode;
	onClose?: () => void;
	defaultSize?: { width: number; height: number };
	defaultPosition?: { x: number; y: number };
	minSize?: { width: number; height: number };
}

export function Window({
	title,
	children,
	onClose,
	defaultSize = { width: 400, height: 300 },
	defaultPosition = { x: 100, y: 100 },
	minSize = { width: 200, height: 150 },
}: WindowProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [isResizing, setIsResizing] = useState(false);
	const [resizeDirection, setResizeDirection] = useState<string | null>(null);
	const [position, setPosition] = useState(defaultPosition);
	const [size, setSize] = useState(defaultSize);

	const windowRef = useRef<HTMLDivElement>(null);
	const dragStart = useRef({ x: 0, y: 0 });
	const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (isDragging) {
				setPosition({
					x: Math.max(0, e.clientX - dragStart.current.x),
					y: Math.max(0, e.clientY - dragStart.current.y),
				});
			} else if (isResizing) {
				let newWidth = size.width;
				let newHeight = size.height;
				let newX = position.x;
				let newY = position.y;

				const deltaX =
					e.clientX -
					(resizeStart.current.x + resizeStart.current.width);
				const deltaY =
					e.clientY -
					(resizeStart.current.y + resizeStart.current.height);

				if (resizeDirection?.includes("e")) {
					newWidth = Math.max(
						minSize.width,
						resizeStart.current.width + deltaX
					);
				}
				if (resizeDirection?.includes("s")) {
					newHeight = Math.max(
						minSize.height,
						resizeStart.current.height + deltaY
					);
				}
				if (resizeDirection?.includes("w")) {
					const deltaX = e.clientX - resizeStart.current.x;
					newWidth = Math.max(
						minSize.width,
						resizeStart.current.width - deltaX
					);
					newX =
						resizeStart.current.x +
						(resizeStart.current.width - newWidth);
				}
				if (resizeDirection?.includes("n")) {
					const deltaY = e.clientY - resizeStart.current.y;
					newHeight = Math.max(
						minSize.height,
						resizeStart.current.height - deltaY
					);
					newY =
						resizeStart.current.y +
						(resizeStart.current.height - newHeight);
				}

				setSize({ width: newWidth, height: newHeight });
				setPosition({ x: newX, y: newY });
			}
		};

		const handleMouseUp = () => {
			setIsDragging(false);
			setIsResizing(false);
			setResizeDirection(null);
		};

		if (isDragging || isResizing) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, isResizing, resizeDirection, minSize, position, size]);

	const handleMouseDown = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			setIsDragging(true);
			dragStart.current = {
				x: e.clientX - position.x,
				y: e.clientY - position.y,
			};
		}
	};

	const handleResizeStart = (direction: string) => (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsResizing(true);
		setResizeDirection(direction);
		resizeStart.current = {
			x: position.x,
			y: position.y,
			width: size.width,
			height: size.height,
		};
	};

	return (
		<Card
			ref={windowRef}
			className="absolute shadow-lg dark overflow-hidden pointer-events-auto"
			style={{
				width: `${size.width}px`,
				height: `${size.height}px`,
				transform: `translate(${position.x}px, ${position.y}px)`,
			}}
		>
			<CardHeader
				className="cursor-move p-2 flex flex-row items-center justify-between bg-gray-900 select-none"
				onMouseDown={handleMouseDown}
			>
				<div className="text-sm font-medium text-white pointer-events-none">
					{title}{process.env.NODE_ENV === "development" ? ` (${position.x} ${position.y} ${size.width}x${size.height})` : ""}
				</div>
				<div className="flex items-center">
					{onClose && (
						<button
							onClick={onClose}
							className="p-1 hover:bg-gray-700 rounded"
						>
							<X className="h-4 w-4 text-white" />
						</button>
					)}
				</div>
			</CardHeader>
			<CardContent className="p-4 bg-gray-800 text-white h-[calc(100%-40px)] overflow-auto scrollbar-hide">
				{children}
			</CardContent>
			<div className="absolute top-0 left-0 w-full h-full pointer-events-none">
				<div
					className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize pointer-events-auto"
					onMouseDown={handleResizeStart("nw")}
				/>
				<div
					className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize pointer-events-auto"
					onMouseDown={handleResizeStart("ne")}
				/>
				<div
					className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize pointer-events-auto"
					onMouseDown={handleResizeStart("sw")}
				/>
				<div
					className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize pointer-events-auto"
					onMouseDown={handleResizeStart("se")}
				/>
				<div
					className="absolute top-0 left-3 right-3 h-3 cursor-ns-resize pointer-events-auto"
					onMouseDown={handleResizeStart("n")}
				/>
				<div
					className="absolute bottom-0 left-3 right-3 h-3 cursor-ns-resize pointer-events-auto"
					onMouseDown={handleResizeStart("s")}
				/>
				<div
					className="absolute left-0 top-3 bottom-3 w-3 cursor-ew-resize pointer-events-auto"
					onMouseDown={handleResizeStart("w")}
				/>
				<div
					className="absolute right-0 top-3 bottom-3 w-3 cursor-ew-resize pointer-events-auto"
					onMouseDown={handleResizeStart("e")}
				/>
			</div>
		</Card>
	);
}
