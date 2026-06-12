export type AgnesErrorBody = {
	error?: {
		message?: string;
		type?: string;
		code?: string;
	};
};

export class AgnesApiError extends Error {
	readonly status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = "AgnesApiError";
		this.status = status;
	}
}

export type ChatCompletionMessage = {
	role: "user" | "assistant" | "system";
	content:
		| string
		| Array<{ type: string; text?: string; image_url?: { url: string } }>;
};

export type ChatCompletionRequest = {
	model: string;
	messages: ChatCompletionMessage[];
	stream?: boolean;
	temperature?: number;
	max_tokens?: number;
};

export type ChatCompletionResponse = {
	choices: Array<{
		message: {
			role: string;
			content: string;
		};
	}>;
};

export type ImageGenerationRequest = {
	model: string;
	prompt: string;
	size?: string;
	extra_body?: {
		image?: string[];
		response_format?: string;
	};
};

export type ImageGenerationResponse = {
	data: Array<{
		url?: string;
		b64_json?: string;
	}>;
};
