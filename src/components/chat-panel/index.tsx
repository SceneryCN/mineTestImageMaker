"use client";

import { AnimatePresence, motion } from "motion/react";
import { t } from "@/i18n";
import type { ChatMessage } from "@/types/chat";
import { MessageInput } from "./components/message-input";
import { MessageList } from "./components/message-list";

type ChatPanelProps = {
	messages: ChatMessage[];
	isLoading: boolean;
	error: string | null;
	onSend: (text: string, imageUrl?: string) => void;
	onStop: () => void;
	onEditImage?: (messageId: string, imageId: string, prompt: string) => void;
};

export function ChatPanel({
	messages,
	error,
	onEditImage,
}: Pick<ChatPanelProps, "messages" | "error" | "onEditImage">) {
	const i18n = t();

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="min-h-0 flex-1 overflow-hidden">
				<MessageList
					messages={messages}
					emptyTitle={i18n.chat.emptyTitle}
					emptyDescription={i18n.chat.emptyDescription}
					onEditImage={onEditImage}
				/>
			</div>

			<AnimatePresence>
				{error && (
					<motion.div
						initial={{ opacity: 0, y: 4 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="mx-4 mb-2 shrink-0 rounded-lg border border-[var(--error)]/25 bg-[var(--error)]/8 px-3 py-2 text-sm text-[var(--error)]"
					>
						{error}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export function ChatInputDock({
	isLoading,
	onSend,
	onStop,
}: Pick<ChatPanelProps, "isLoading" | "onSend" | "onStop">) {
	const i18n = t();

	return (
		<div className="shrink-0 px-3 pb-3 pt-3 sm:px-4 sm:pb-4">
			<div className="mx-auto max-w-3xl">
				<MessageInput
					placeholder={i18n.chat.placeholder}
					uploadLabel={i18n.chat.uploadImage}
					removeLabel={i18n.chat.removeImage}
					dropHint={i18n.chat.dropHint}
					sendLabel={i18n.common.send}
					isLoading={isLoading}
					onSend={onSend}
					onStop={onStop}
				/>
			</div>
		</div>
	);
}
