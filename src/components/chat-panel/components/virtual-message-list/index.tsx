"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowDown, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { t } from "@/i18n";
import type { ChatMessage } from "@/types/chat";
import { MessageBubble } from "../message-bubble";

type VirtualMessageListProps = {
	messages: ChatMessage[];
	emptyTitle: string;
	emptyDescription: string;
	onEditImage?: (messageId: string, imageId: string, prompt: string) => void;
};

function estimateMessageSize(message: ChatMessage): number {
	const text =
		typeof message.content === "string"
			? message.content
			: (message.content.find((p) => p.type === "text")?.text ?? "");

	const hasUploadImage =
		typeof message.content !== "string" &&
		message.content.some((p) => p.type === "image_url");

	const imageCount = message.images?.length ?? 0;
	const hasGeneratingImage = message.images?.some(
		(img) => img.status === "generating",
	);

	let height = 72;

	if (text.length > 0) {
		height += Math.min(Math.ceil(text.length / 40) * 24, 200);
	}

	if (hasUploadImage) height += 220;
	if (imageCount > 0) height += imageCount * 280;
	if (hasGeneratingImage) height += 40;
	if (message.isStreaming) height += 24;

	return height;
}

export function VirtualMessageList({
	messages,
	emptyTitle,
	emptyDescription,
	onEditImage,
}: VirtualMessageListProps) {
	const i18n = t();
	const parentRef = useRef<HTMLDivElement>(null);
	const [showJumpButton, setShowJumpButton] = useState(false);

	const virtualizer = useVirtualizer({
		count: messages.length,
		getScrollElement: () => parentRef.current,
		estimateSize: (index) => estimateMessageSize(messages[index]!),
		getItemKey: (index) => messages[index]!.id,
		overscan: 8,
		anchorTo: "end",
		followOnAppend: true,
		scrollEndThreshold: 80,
		measureElement: (element) => element.getBoundingClientRect().height,
	});

	const scrollToEnd = useCallback(
		(behavior: ScrollBehavior = "smooth") => {
			virtualizer.scrollToEnd({ behavior });
		},
		[virtualizer],
	);

	useEffect(() => {
		const el = parentRef.current;
		if (!el) return;

		const handleScroll = () => {
			setShowJumpButton(!virtualizer.isAtEnd(120));
		};

		handleScroll();
		el.addEventListener("scroll", handleScroll, { passive: true });
		return () => el.removeEventListener("scroll", handleScroll);
	}, [virtualizer]);

	useEffect(() => {
		setShowJumpButton(!virtualizer.isAtEnd(120));
	}, [messages, virtualizer]);

	if (messages.length === 0) {
		return (
			<div className="flex h-full flex-col items-center justify-center px-6 text-center">
				<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-muted)] ring-1 ring-[var(--border)]">
					<Sparkles className="h-7 w-7 text-[var(--accent)]" />
				</div>
				<h3 className="text-lg font-medium text-[var(--text)]">{emptyTitle}</h3>
				<p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--text-muted)]">
					{emptyDescription}
				</p>
			</div>
		);
	}

	const virtualItems = virtualizer.getVirtualItems();

	return (
		<div className="relative h-full min-h-0">
			<div
				ref={parentRef}
				className="h-full overflow-y-auto overscroll-contain px-4 py-5 sm:px-6"
			>
				<div
					className="relative mx-auto w-full max-w-3xl"
					style={{ height: `${virtualizer.getTotalSize()}px` }}
				>
					{virtualItems.map((virtualItem) => {
						const message = messages[virtualItem.index]!;
						return (
							<div
								key={virtualItem.key}
								data-index={virtualItem.index}
								ref={virtualizer.measureElement}
								className="absolute left-0 top-0 w-full pb-4"
								style={{ transform: `translateY(${virtualItem.start}px)` }}
							>
								<MessageBubble message={message} onEditImage={onEditImage} />
							</div>
						);
					})}
				</div>
			</div>

			{showJumpButton && (
				<button
					type="button"
					onClick={() => scrollToEnd("smooth")}
					className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text)] shadow-lg transition-colors hover:bg-[var(--surface-hover)]"
				>
					<ArrowDown className="h-3.5 w-3.5" />
					{i18n.common.jumpToLatest}
				</button>
			)}
		</div>
	);
}
