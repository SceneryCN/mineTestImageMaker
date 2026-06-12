"use client";

import { useCallback, useState } from "react";
import { downloadImage } from "@/utils/download-image";

export function useDownloadImage() {
	const [downloadingId, setDownloadingId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const download = useCallback(async (url: string, filename: string) => {
		setDownloadingId(filename);
		setError(null);

		try {
			await downloadImage(url, filename);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Download failed";
			setError(message);
			throw err;
		} finally {
			setDownloadingId(null);
		}
	}, []);

	const isDownloading = useCallback(
		(id: string) => downloadingId === id,
		[downloadingId],
	);

	const clearError = useCallback(() => setError(null), []);

	return { download, isDownloading, downloadingId, error, clearError };
}
