export const IMAGE_GENERATION_TOOL = {
	type: "function" as const,
	function: {
		name: "generate_image",
		description:
			"Generate an image when the user wants to create, draw, design, or visualize something as a picture. Translate the user's intent into a detailed English prompt.",
		parameters: {
			type: "object",
			properties: {
				prompt: {
					type: "string",
					description:
						"Detailed English image generation prompt: subject, scene, style, lighting, composition, quality.",
				},
				size: {
					type: "string",
					enum: ["1024x1024", "1024x768", "768x1024"],
					description: "Output size, default 1024x1024",
				},
			},
			required: ["prompt"],
		},
	},
};

export const SYSTEM_PROMPT = `You are JLImage, an intelligent assistant that can chat naturally and generate images.

Rules:
- For normal conversation, questions, or analysis: reply directly in the user's language.
- When the user clearly wants to generate, draw, create, or visualize an image: call the generate_image tool.
- Image prompts must be in English with rich visual detail.
- After calling generate_image, briefly tell the user you are creating their image.
- Do NOT call generate_image for unrelated chat.`;
