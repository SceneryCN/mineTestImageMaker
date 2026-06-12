"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
	getApiKeyServerSnapshot,
	getApiKeySnapshot,
	removeApiKeyFromStore,
	saveApiKeyToStore,
	subscribeApiKey,
} from "@/utils/api-key-store";

export function useApiKey() {
	const apiKey = useSyncExternalStore(
		subscribeApiKey,
		getApiKeySnapshot,
		getApiKeyServerSnapshot,
	);

	const saveApiKey = useCallback((key: string) => {
		saveApiKeyToStore(key);
	}, []);

	const removeApiKey = useCallback(() => {
		removeApiKeyFromStore();
	}, []);

	const hasApiKey = apiKey.length > 0;

	return { apiKey, hasApiKey, saveApiKey, removeApiKey };
}
