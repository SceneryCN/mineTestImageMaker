import { CHAT_MODEL } from "@/Styles/variables";
import type { ChatMessage, ToolCallResult } from "@/types/chat";
import { agnesStreamRequest } from "./client";
import { IMAGE_GENERATION_TOOL, SYSTEM_PROMPT } from "./intent-tools";
import {
	type AccumulatedToolCall,
	accumulateToolCalls,
	parseStreamDelta,
	parseToolCallArguments,
} from "./stream-parser";
import type { ChatCompletionMessage } from "./types";

function toApiMessage(message: ChatMessage): ChatCompletionMessage {
	if (typeof message.content === "string") {
		return { role: message.role, content: message.content };
	}

	return {
		role: message.role,
		content: message.content.map((part) => {
			if (part.type === "text") {
				return { type: "text", text: part.text };
			}
			return { type: "image_url", image_url: part.image_url };
		}),
	};
}

export type StreamChatOptions = {
	apiKey: string;
	messages: ChatMessage[];
	signal?: AbortSignal;
	onDelta: (text: string) => void;
	onToolCall?: (tool: ToolCallResult) => void;
};

export type StreamChatResult = {
	content: string;
	toolCalls: ToolCallResult[];
};

export async function streamChat({
	apiKey,
	messages,
	signal,
	onDelta,
	onToolCall,
}: StreamChatOptions): Promise<StreamChatResult> {
	const apiMessages: ChatCompletionMessage[] = [
		{ role: "system", content: SYSTEM_PROMPT },
		...messages.map(toApiMessage),
	];

	const response = await agnesStreamRequest({
		apiKey,
		path: "/chat/completions",
		body: {
			model: CHAT_MODEL,
			messages: apiMessages,
			stream: true,
			temperature: 0.7,
			tools: [IMAGE_GENERATION_TOOL],
			tool_choice: "auto",
		},
		signal,
	});

	const reader = response.body?.getReader();
	if (!reader) {
		throw new Error("Stream not available");
	}

	const decoder = new TextDecoder();
	let fullContent = "";
	let buffer = "";
	const toolCallStore = new Map<number, AccumulatedToolCall>();
	const completedTools: ToolCallResult[] = [];

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		buffer += decoder.decode(value, { stream: true });
		const lines = buffer.split("\n");
		buffer = lines.pop() ?? "";

		for (const line of lines) {
			const trimmed = line.trim();
			if (!trimmed.startsWith("data:")) continue;

			const payload = trimmed.slice(5).trim();
			if (payload === "[DONE]") continue;

			const { contentDelta, toolCallDeltas } = parseStreamDelta(payload);

			if (contentDelta) {
				fullContent += contentDelta;
				onDelta(fullContent);
			}

			if (toolCallDeltas.length > 0) {
				accumulateToolCalls(toolCallStore, toolCallDeltas);
			}
		}
	}

	for (const toolCall of toolCallStore.values()) {
		const args = parseToolCallArguments(toolCall);
		if (args && toolCall.name) {
			const result: ToolCallResult = { name: toolCall.name, arguments: args };
			completedTools.push(result);
			onToolCall?.(result);
		}
	}

	return { content: fullContent, toolCalls: completedTools };
}

export async function sendChat({
	apiKey,
	messages,
	signal,
}: {
	apiKey: string;
	messages: ChatMessage[];
	signal?: AbortSignal;
}): Promise<string> {
	const { content } = await streamChat({
		apiKey,
		messages,
		signal,
		onDelta: () => {},
	});
	return content;
}
