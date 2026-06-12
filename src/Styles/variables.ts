export const COLORS = {
	bg: "#07070d",
	surface: "rgba(18, 18, 28, 0.75)",
	surfaceHover: "rgba(28, 28, 42, 0.85)",
	border: "rgba(255, 255, 255, 0.08)",
	text: "#f0f0f8",
	textMuted: "#8888a0",
	accent: "#818cf8",
	accentSecondary: "#ec4899",
	accentHover: "#a5b4fc",
	accentMuted: "rgba(129, 140, 248, 0.15)",
	error: "#f87171",
	success: "#4ade80",
} as const;

export const AGNES_BASE_URL = "https://apihub.agnes-ai.com/v1";
export const CHAT_MODEL = "agnes-2.0-flash";
export const IMAGE_MODEL = "agnes-image-2.1-flash";

export const IMAGE_SIZES = [
	"1024x1024",
	"1024x768",
	"768x1024",
	"1280x720",
	"720x1280",
] as const;

export type ImageSize = (typeof IMAGE_SIZES)[number];

export const API_KEY_STORAGE_KEY = "jlimimage-api-key";
