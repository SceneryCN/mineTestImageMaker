import type { ImageSize } from "@/Styles/variables";

export type ImageGenerationStatus = "idle" | "loading" | "success" | "error";

export type GeneratedImage = {
	id: string;
	url: string;
	prompt: string;
	size: ImageSize;
	createdAt: number;
};

export type ImageGenerationRequest = {
	prompt: string;
	size: ImageSize;
	referenceImageUrl?: string;
};
