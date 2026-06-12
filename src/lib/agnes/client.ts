import { AGNES_BASE_URL } from "@/Styles/variables";
import { AgnesApiError, type AgnesErrorBody } from "./types";

type RequestOptions = {
	apiKey: string;
	path: string;
	body?: unknown;
	signal?: AbortSignal;
};

async function parseError(response: Response): Promise<string> {
	try {
		const data = (await response.json()) as AgnesErrorBody;
		return data.error?.message ?? `Request failed (${response.status})`;
	} catch {
		return `Request failed (${response.status})`;
	}
}

export async function agnesRequest<T>({
	apiKey,
	path,
	body,
	signal,
}: RequestOptions): Promise<T> {
	const response = await fetch(`${AGNES_BASE_URL}${path}`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
		signal,
	});

	if (!response.ok) {
		const message = await parseError(response);
		throw new AgnesApiError(message, response.status);
	}

	return response.json() as Promise<T>;
}

export async function agnesStreamRequest({
	apiKey,
	path,
	body,
	signal,
}: RequestOptions): Promise<Response> {
	const response = await fetch(`${AGNES_BASE_URL}${path}`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
		signal,
	});

	if (!response.ok) {
		const message = await parseError(response);
		throw new AgnesApiError(message, response.status);
	}

	return response;
}
