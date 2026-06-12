import {
	clearStoredApiKey,
	getStoredApiKey,
	setStoredApiKey,
} from "@/utils/api-key-storage";

type Listener = () => void;

let listeners: Listener[] = [];

function emitChange(): void {
	listeners.forEach((listener) => listener());
}

export function subscribeApiKey(listener: Listener): () => void {
	listeners.push(listener);
	return () => {
		listeners = listeners.filter((l) => l !== listener);
	};
}

export function getApiKeySnapshot(): string {
	if (typeof window === "undefined") return "";
	return getStoredApiKey() ?? "";
}

export function getApiKeyServerSnapshot(): string {
	return "";
}

export function saveApiKeyToStore(key: string): void {
	setStoredApiKey(key.trim());
	emitChange();
}

export function removeApiKeyFromStore(): void {
	clearStoredApiKey();
	emitChange();
}
