import { IMAGE_MODEL } from "@/Styles/variables";
import type { ImageGenerationRequest } from "@/types/image";
import { agnesRequest } from "./client";
import type { ImageGenerationResponse } from "./types";

export async function generateImage({
	apiKey,
	prompt,
	size,
	referenceImageUrl,
	signal,
}: ImageGenerationRequest & {
	apiKey: string;
	signal?: AbortSignal;
}): Promise<string> {
	const body: Record<string, unknown> = {
		model: IMAGE_MODEL,
		prompt,
		size,
		extra_body: {
			response_format: "url",
		},
	};

	if (referenceImageUrl) {
		body.extra_body = {
			...(body.extra_body as Record<string, unknown>),
			image: [referenceImageUrl],
		};
	}

	const response = await agnesRequest<ImageGenerationResponse>({
		apiKey,
		path: "/images/generations",
		body,
		signal,
	});

	const item = response.data[0];
	if (item?.url) return item.url;
	if (item?.b64_json) return `data:image/png;base64,${item.b64_json}`;

	throw new Error("No image returned from API");
}
