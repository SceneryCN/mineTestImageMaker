export type AccumulatedToolCall = {
	id: string;
	name: string;
	arguments: string;
};

type StreamDelta = {
	choices?: Array<{
		delta?: {
			content?: string | null;
			tool_calls?: Array<{
				index: number;
				id?: string;
				function?: {
					name?: string;
					arguments?: string;
				};
			}>;
		};
		finish_reason?: string | null;
	}>;
};

export function parseStreamDelta(payload: string): {
	contentDelta: string;
	toolCallDeltas: Array<{
		index: number;
		id?: string;
		name?: string;
		arguments?: string;
	}>;
} {
	try {
		const parsed = JSON.parse(payload) as StreamDelta;
		const delta = parsed.choices?.[0]?.delta;
		const contentDelta = delta?.content ?? "";
		const toolCallDeltas =
			delta?.tool_calls?.map((tc) => ({
				index: tc.index,
				id: tc.id,
				name: tc.function?.name,
				arguments: tc.function?.arguments,
			})) ?? [];

		return { contentDelta, toolCallDeltas };
	} catch {
		return { contentDelta: "", toolCallDeltas: [] };
	}
}

export function accumulateToolCalls(
	store: Map<number, AccumulatedToolCall>,
	deltas: Array<{
		index: number;
		id?: string;
		name?: string;
		arguments?: string;
	}>,
): void {
	for (const delta of deltas) {
		const existing = store.get(delta.index) ?? {
			id: "",
			name: "",
			arguments: "",
		};

		if (delta.id) existing.id = delta.id;
		if (delta.name) existing.name = delta.name;
		if (delta.arguments) existing.arguments += delta.arguments;

		store.set(delta.index, existing);
	}
}

export function parseToolCallArguments(
	toolCall: AccumulatedToolCall,
): Record<string, unknown> | null {
	if (!toolCall.arguments.trim()) return null;
	try {
		return JSON.parse(toolCall.arguments) as Record<string, unknown>;
	} catch {
		return null;
	}
}
