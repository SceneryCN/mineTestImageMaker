"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { t } from "@/i18n";
import { generateImage, streamChat } from "@/lib/agnes";
import type { ImageSize } from "@/Styles/variables";
import type {
	ChatMessage,
	ChatStatus,
	GeneratedImageAttachment,
} from "@/types/chat";
import { createId } from "@/utils/helpers";

function extractImagePrompt(args: Record<string, unknown>): {
	prompt: string;
	size: ImageSize;
} | null {
	const prompt = args.prompt;
	if (typeof prompt !== "string" || !prompt.trim()) return null;

	const sizeRaw = args.size;
	const validSizes: ImageSize[] = ["1024x1024", "1024x768", "768x1024"];
	const size =
		typeof sizeRaw === "string" && validSizes.includes(sizeRaw as ImageSize)
			? (sizeRaw as ImageSize)
			: "1024x1024";

	return { prompt: prompt.trim(), size };
}

export function useSmartChat(apiKey: string) {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [status, setStatus] = useState<ChatStatus>("idle");
	const [error, setError] = useState<string | null>(null);
	const abortRef = useRef<AbortController | null>(null);
	const messagesRef = useRef(messages);

	useEffect(() => {
		messagesRef.current = messages;
	}, [messages]);

	const updateMessage = useCallback(
		(id: string, patch: Partial<ChatMessage>) => {
			setMessages((prev) =>
				prev.map((msg) => (msg.id === id ? { ...msg, ...patch } : msg)),
			);
		},
		[],
	);

	const appendImageToMessage = useCallback(
		(messageId: string, image: GeneratedImageAttachment) => {
			setMessages((prev) =>
				prev.map((msg) =>
					msg.id === messageId
						? { ...msg, images: [...(msg.images ?? []), image] }
						: msg,
				),
			);
		},
		[],
	);

	const updateImageInMessage = useCallback(
		(
			messageId: string,
			imageId: string,
			patch: Partial<GeneratedImageAttachment>,
		) => {
			setMessages((prev) =>
				prev.map((msg) => {
					if (msg.id !== messageId) return msg;
					return {
						...msg,
						images: msg.images?.map((img) =>
							img.id === imageId ? { ...img, ...patch } : img,
						),
					};
				}),
			);
		},
		[],
	);

	const runImageGeneration = useCallback(
		async (
			messageId: string,
			imageId: string,
			prompt: string,
			size: ImageSize,
			referenceImageUrl?: string,
			signal?: AbortSignal,
		) => {
			try {
				const url = await generateImage({
					apiKey,
					prompt,
					size,
					referenceImageUrl,
					signal,
				});
				updateImageInMessage(messageId, imageId, {
					url,
					status: "ready",
					prompt,
				});
			} catch (err) {
				if (signal?.aborted) return;
				updateImageInMessage(messageId, imageId, { status: "error" });
				throw err;
			}
		},
		[apiKey, updateImageInMessage],
	);

	const handleToolCalls = useCallback(
		async (
			messageId: string,
			toolCalls: Array<{ name: string; arguments: Record<string, unknown> }>,
			signal: AbortSignal,
			referenceImageUrl?: string,
		) => {
			for (const tool of toolCalls) {
				if (tool.name !== "generate_image") continue;

				const extracted = extractImagePrompt(tool.arguments);
				if (!extracted) continue;

				const imageId = createId();
				const attachment: GeneratedImageAttachment = {
					id: imageId,
					url: "",
					prompt: extracted.prompt,
					status: "generating",
				};

				appendImageToMessage(messageId, attachment);
				setStatus("generating-image");

				await runImageGeneration(
					messageId,
					imageId,
					extracted.prompt,
					extracted.size,
					referenceImageUrl,
					signal,
				);
			}
		},
		[appendImageToMessage, runImageGeneration],
	);

	const sendMessage = useCallback(
		async (content: string, imageUrl?: string) => {
			if (!apiKey || (!content.trim() && !imageUrl)) return;

			abortRef.current?.abort();
			const controller = new AbortController();
			abortRef.current = controller;

			const userMessage: ChatMessage = {
				id: createId(),
				role: "user",
				content: imageUrl
					? [
							{ type: "text", text: content },
							{ type: "image_url", image_url: { url: imageUrl } },
						]
					: content,
				createdAt: Date.now(),
			};

			const assistantId = createId();
			const assistantMessage: ChatMessage = {
				id: assistantId,
				role: "assistant",
				content: "",
				createdAt: Date.now(),
				isStreaming: true,
				images: [],
			};

			const nextMessages = [...messagesRef.current, userMessage];
			setMessages([...nextMessages, assistantMessage]);
			setStatus("streaming");
			setError(null);

			try {
				const { toolCalls, content: streamedContent } = await streamChat({
					apiKey,
					messages: nextMessages,
					signal: controller.signal,
					onDelta: (text) => {
						updateMessage(assistantId, { content: text, isStreaming: true });
					},
				});

				const finalContent =
					streamedContent.trim() ||
					(toolCalls.length > 0 ? t().chat.generatingImage : "");

				updateMessage(assistantId, {
					content: finalContent,
					isStreaming: false,
				});

				if (toolCalls.length > 0) {
					await handleToolCalls(
						assistantId,
						toolCalls,
						controller.signal,
						imageUrl,
					);
				}

				setStatus("idle");
			} catch (err) {
				if (controller.signal.aborted) return;
				const message = err instanceof Error ? err.message : "Unknown error";
				setError(message);
				setStatus("error");
				setMessages((prev) =>
					prev.map((msg) =>
						msg.id === assistantId
							? { ...msg, isStreaming: false, content: msg.content || message }
							: msg,
					),
				);
			}
		},
		[apiKey, updateMessage, handleToolCalls],
	);

	const editImage = useCallback(
		async (messageId: string, imageId: string, editPrompt: string) => {
			if (!apiKey || !editPrompt.trim()) return;

			const message = messagesRef.current.find((m) => m.id === messageId);
			const sourceImage = message?.images?.find((img) => img.id === imageId);
			if (!sourceImage?.url) return;

			abortRef.current?.abort();
			const controller = new AbortController();
			abortRef.current = controller;

			const newImageId = createId();
			const attachment: GeneratedImageAttachment = {
				id: newImageId,
				url: "",
				prompt: editPrompt.trim(),
				status: "generating",
				parentId: imageId,
			};

			appendImageToMessage(messageId, attachment);
			setStatus("generating-image");
			setError(null);

			const fullPrompt = `${editPrompt.trim()}. Based on the reference image, preserve composition where appropriate.`;

			try {
				await runImageGeneration(
					messageId,
					newImageId,
					fullPrompt,
					"1024x1024",
					sourceImage.url,
					controller.signal,
				);
				setStatus("idle");
			} catch (err) {
				if (controller.signal.aborted) return;
				const msg = err instanceof Error ? err.message : "Unknown error";
				setError(msg);
				setStatus("error");
			}
		},
		[apiKey, appendImageToMessage, runImageGeneration],
	);

	const clearMessages = useCallback(() => {
		abortRef.current?.abort();
		setMessages([]);
		setStatus("idle");
		setError(null);
	}, []);

	const stopGeneration = useCallback(() => {
		abortRef.current?.abort();
		setStatus("idle");
		setMessages((prev) => prev.map((msg) => ({ ...msg, isStreaming: false })));
	}, []);

	return {
		messages,
		status,
		error,
		sendMessage,
		editImage,
		clearMessages,
		stopGeneration,
		isLoading:
			status === "streaming" ||
			status === "loading" ||
			status === "generating-image",
	};
}
