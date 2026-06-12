"use client";

import type { ChatMessage } from "@/types/chat";
import { VirtualMessageList } from "../virtual-message-list";

type MessageListProps = {
	messages: ChatMessage[];
	emptyTitle: string;
	emptyDescription: string;
	onEditImage?: (messageId: string, imageId: string, prompt: string) => void;
};

export function MessageList(props: MessageListProps) {
	return <VirtualMessageList {...props} />;
}
