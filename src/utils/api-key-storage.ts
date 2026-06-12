import { API_KEY_STORAGE_KEY } from "@/Styles/variables";

export function getStoredApiKey(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(API_KEY_STORAGE_KEY);
}

export function setStoredApiKey(key: string): void {
	localStorage.setItem(API_KEY_STORAGE_KEY, key);
}

export function clearStoredApiKey(): void {
	localStorage.removeItem(API_KEY_STORAGE_KEY);
}

export function maskApiKey(key: string): string {
	if (key.length <= 8) return "••••••••";
	return `${key.slice(0, 4)}••••${key.slice(-4)}`;
}
