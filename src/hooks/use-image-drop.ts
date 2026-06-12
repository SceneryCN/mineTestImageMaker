"use client";

import { useCallback, useRef, useState } from "react";
import { readFileAsDataUrl, validateImageFile } from "@/utils/helpers";

export function useImageDrop(onImage: (dataUrl: string) => void) {
	const [isDragging, setIsDragging] = useState(false);
	const counterRef = useRef(0);

	const handleDragEnter = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer.types.includes("Files")) {
			counterRef.current += 1;
			setIsDragging(true);
		}
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		counterRef.current -= 1;
		if (counterRef.current <= 0) {
			counterRef.current = 0;
			setIsDragging(false);
		}
	}, []);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		e.dataTransfer.dropEffect = "copy";
	}, []);

	const handleDrop = useCallback(
		async (e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			counterRef.current = 0;
			setIsDragging(false);

			const file = e.dataTransfer.files[0];
			if (!file || !validateImageFile(file)) return;

			const dataUrl = await readFileAsDataUrl(file);
			onImage(dataUrl);
		},
		[onImage],
	);

	return {
		isDragging,
		dragHandlers: {
			onDragEnter: handleDragEnter,
			onDragLeave: handleDragLeave,
			onDragOver: handleDragOver,
			onDrop: handleDrop,
		},
	};
}
