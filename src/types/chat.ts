export type MessageRole = "user" | "assistant" | "system";

export type TextContent = {
	type: "text";
	text: string;
};

export type ImageContent = {
	type: "image_url";
	image_url: { url: string };
};

export type MessageContent = string | Array<TextContent | ImageContent>;

export type GeneratedImageAttachment = {
	id: string;
	url: string;
	prompt: string;
	status: "generating" | "ready" | "error";
	parentId?: string;
};

export type ChatMessage = {
	id: string;
	role: MessageRole;
	content: MessageContent;
	createdAt: number;
	images?: GeneratedImageAttachment[];
	isStreaming?: boolean;
};

export type ChatStatus =
	| "idle"
	| "loading"
	| "streaming"
	| "generating-image"
	| "error";

export type ToolCallResult = {
	name: string;
	arguments: Record<string, unknown>;
};
