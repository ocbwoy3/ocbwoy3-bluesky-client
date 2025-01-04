"use client";

import React, { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Globe2, ImageIcon, WandIcon, X } from "lucide-react";
import { closeWindow, updateWindow, WindowChildProps } from "../WM";
import { getAgent } from "@/lib/atproto/client";
import { toast } from "sonner";
import { ReplyRef } from "@atproto/api/dist/client/types/app/bsky/feed/post";
import { createGemini, GenerateSkeet } from "@/lib/gemini";

interface PostDialogProps {
	replyPost?: ReplyRef;
}

interface ImageWithAspectRatio {
	file: File;
	aspectRatio: number;
}

export function PostDialog(props: PostDialogProps & WindowChildProps) {
	const [content, setContent] = useState<string>("");
	const [isAIGenerating, setIsAIGenerating] = useState<boolean>(false);

	const [blobs, setBlobs] = useState<ImageWithAspectRatio[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const dropZoneRef = useRef<HTMLDivElement>(null);

	const agent = getAgent();
	const maxLength = 300;
	const maxBlobs = 4;

	const [isSending, setIsSending] = useState<boolean>(false);
	const [isDragging, setIsDragging] = useState<boolean>(false);

	React.useEffect(() => {
		if (props.replyPost) updateWindow(props.windowId, { title: "Reply" });
	}, [props.replyPost, props.windowId]);

	const calculateAspectRatio = (file: File): Promise<number> => {
		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => {
				const aspectRatio = img.width / img.height;
				resolve(aspectRatio);
			};
			img.src = URL.createObjectURL(file);
		});
	};

	const handlePost = async () => {
		setIsSending(true);
		try {
			const uploadedBlobs = await Promise.all(
				blobs.map(async ({ file, aspectRatio }) => {
					const { data } = await agent.uploadBlob(file, {
						encoding: file.type,
					});
					return { blob: data.blob, aspectRatio };
				})
			);

			await agent.post({
				text: content,
				reply: props.replyPost,
				posting_client: "OCbwoy3-SNS",
				embed:
					blobs.length > 0
						? {
								$type: "app.bsky.embed.images",
								images: uploadedBlobs.map(
									({ blob, aspectRatio }) => ({
										image: blob,
										alt: "",
										aspectRatio: {
											width: 100,
											height: Math.round(
												100 / aspectRatio
											),
										},
									})
								),
						  }
						: undefined,
			});

			closeWindow(props.windowId);
			toast("Success", {
				description: `Skeeted!`,
			});
		} catch (error) {
			console.error("Error posting:", error);
			toast("Error", {
				description: "Failed to create post. Please try again.",
			});
		} finally {
			setIsSending(false);
		}
	};

	const addBlobs = useCallback(
		async (files: File[]) => {
			const imageFiles = files.filter((file) =>
				file.type.startsWith("image/")
			);
			const newBlobsWithAspectRatio = await Promise.all(
				imageFiles
					.slice(0, maxBlobs - blobs.length)
					.map(async (file) => ({
						file,
						aspectRatio: await calculateAspectRatio(file),
					}))
			);
			setBlobs((prevBlobs) => [...prevBlobs, ...newBlobsWithAspectRatio]);

			if (imageFiles.length > newBlobsWithAspectRatio.length) {
				toast("Error lol", {
					description: `${newBlobsWithAspectRatio.length} exceeds the ${maxBlobs} blob maximum per skeet!`,
				});
			}
		},
		[blobs.length]
	);

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const files = event.target.files;
		if (files) {
			await addBlobs(Array.from(files));
		}
	};

	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
		const files = e.dataTransfer.files;
		await addBlobs(Array.from(files));
	};

	const handlePaste = async (e: React.ClipboardEvent) => {
		const items = e.clipboardData.items;
		const imageFiles = Array.from(items)
			.filter((item) => item.type.indexOf("image") !== -1)
			.map((item) => item.getAsFile())
			.filter((file): file is File => file !== null);
		await addBlobs(imageFiles);
	};

	const removeBlob = (index: number) => {
		setBlobs((prevBlobs) => prevBlobs.filter((_, i) => i !== index));
	};

	const generateAI = async (text: string) => {
		if (!window.localStorage.gemini_api_key) return;
		setIsAIGenerating(true);
		console.log(text);
		try {
			const gemini = createGemini(window.localStorage.gemini_api_key);
			const newSkeet = await GenerateSkeet(gemini, text);
			setContent(newSkeet);
			console.log(newSkeet);
		} catch (e_) {
			console.error(e_);
			setContent(
				"[ocbwoy3-bsky-client] Error AI generating skeet, check console!"
			);
		}
		setIsAIGenerating(false);
	};

	return (
		<div
			className="space-y-4 p-4"
			ref={dropZoneRef}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
		>
			{isSending ? (
				"Posting, please keep window open"
			) : (
				<div
					className={`block ${
						isDragging
							? "border-2 border-dashed border-ctp-blue"
							: ""
					}`}
				>
					<div className="p-2 border-ctp-blue ring-2 rounded-sm">
						<Textarea
							value={content}
							onChange={(e) => setContent(e.target.value)}
							onPaste={handlePaste}
							placeholder="What's up?"
							className="min-h-[100px] resize-none bg-transparent p-0 border-none focus:ring-0 ring-0 selection:ring-0 focus:border-none placeholder:text-ctp-blue"
							maxLength={maxLength}
						/>
					</div>
					<div className="py-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Button onClick={handlePost} variant="outline">
									Skeet
								</Button>
								<Button
									onClick={() =>
										fileInputRef.current?.click()
									}
									variant="outline"
									disabled={blobs.length >= maxBlobs}
								>
									<ImageIcon className="w-4 h-4 mr-2" />
									Add Image
								</Button>
								<Button
									onClick={() => {
										if (isAIGenerating) return;
										generateAI(content);
									}}
									variant="outline"
									disabled={blobs.length >= maxBlobs}
								>
									<WandIcon className="w-4 h-4 mr-2" />
									AI
								</Button>
								<input
									type="file"
									ref={fileInputRef}
									onChange={handleFileChange}
									accept="image/*"
									multiple
									className="hidden"
								/>
							</div>
							<div className="text-sm text-muted-foreground">
								{content.length}/{maxLength}
							</div>
						</div>
					</div>
					{blobs.length > 0 && (
						<div className="mt-4 grid grid-cols-2 gap-2">
							{blobs.map(({ file, aspectRatio }, index) => (
								<div key={index} className="relative">
									<img
										src={URL.createObjectURL(file)}
										alt={`Attached image ${index + 1}`}
										className="w-full h-32 object-cover rounded"
									/>
									<Button
										variant="destructive"
										size="icon"
										className="absolute top-1 right-1"
										onClick={() => removeBlob(index)}
									>
										<X className="w-4 h-4" />
									</Button>
									<span className="absolute bottom-1 left-1 bg-ctp-mantle bg-opacity-50 text-ctp-text text-xs px-1 rounded">
										{aspectRatio.toFixed(2)}
									</span>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
