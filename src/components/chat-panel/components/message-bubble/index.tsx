"use client";

import { ClickableImage } from "@/components/clickable-image";
import { GeneratedImageCard } from "@/components/generated-image-card";
import { StreamingCursor } from "@/components/streaming-cursor";
import type { ChatMessage } from "@/types/chat";

type MessageBubbleProps = {
	message: ChatMessage;
	onEditImage?: (messageId: string, imageId: string, prompt: string) => void;
};

function getTextContent(message: ChatMessage): string {
	if (typeof message.content === "string") return message.content;
	return message.content.find((p) => p.type === "text")?.text ?? "";
}

function getImageUrl(message: ChatMessage): string | null {
	if (typeof message.content === "string") return null;
	const imagePart = message.content.find((p) => p.type === "image_url");
	return imagePart?.image_url.url ?? null;
}

export function MessageBubble({ message, onEditImage }: MessageBubbleProps) {
	const isUser = message.role === "user";
	const text = getTextContent(message);
	const imageUrl = getImageUrl(message);
	const hasImages = (message.images?.length ?? 0) > 0;

	const showTextBubble = isUser
		? Boolean(text || imageUrl)
		: Boolean(text) || (message.isStreaming && !hasImages);

	if (!showTextBubble && !hasImages) return null;

	return (
		<div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
			<div
				className={`flex max-w-[85%] flex-col gap-2.5 sm:max-w-[75%] ${
					isUser ? "items-end" : "items-start"
				}`}
			>
				{showTextBubble && (
					<div
						className={`rounded-2xl px-4 py-2.5 ${
							isUser
								? "bg-[var(--user-bubble)] text-[var(--text)]"
								: "bg-[var(--assistant-bubble)] text-[var(--text)] ring-1 ring-[var(--border)]"
						}`}
					>
						{imageUrl && (
							<ClickableImage
								src={imageUrl}
								alt=""
								className="mb-2 max-h-52 w-full rounded-lg object-cover"
							/>
						)}
						{text ? (
							<p className="whitespace-pre-wrap text-[14px] leading-relaxed">
								{text}
								{message.isStreaming && <StreamingCursor />}
							</p>
						) : (
							message.isStreaming && (
								<span className="inline-flex items-center gap-1 py-1">
									{[0, 1, 2].map((i) => (
										<span
											key={i}
											className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--text-muted)]"
											style={{ animationDelay: `${i * 150}ms` }}
										/>
									))}
								</span>
							)
						)}
					</div>
				)}

				{hasImages && (
					<div className="flex w-full flex-col gap-2.5">
						{message.images?.map((img) => (
							<GeneratedImageCard
								key={img.id}
								image={img}
								onEdit={
									onEditImage
										? (imageId, prompt) =>
												onEditImage(message.id, imageId, prompt)
										: undefined
								}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
