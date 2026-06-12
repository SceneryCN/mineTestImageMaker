"use client";

import { ImagePlus, Send, Square, Upload, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { useImageDrop } from "@/hooks/use-image-drop";
import { readFileAsDataUrl, validateImageFile } from "@/utils/helpers";

type MessageInputProps = {
	placeholder: string;
	uploadLabel: string;
	removeLabel: string;
	dropHint: string;
	sendLabel: string;
	isLoading: boolean;
	onSend: (text: string, imageUrl?: string) => void;
	onStop: () => void;
};

export function MessageInput({
	placeholder,
	uploadLabel,
	removeLabel,
	dropHint,
	sendLabel,
	isLoading,
	onSend,
	onStop,
}: MessageInputProps) {
	const reducedMotion = useReducedMotion();
	const [text, setText] = useState("");
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const fileRef = useRef<HTMLInputElement>(null);

	const handleImage = useCallback((dataUrl: string) => {
		setImageUrl(dataUrl);
	}, []);

	const { isDragging, dragHandlers } = useImageDrop(handleImage);

	const handleSend = useCallback(() => {
		if (!text.trim() && !imageUrl) return;
		onSend(text.trim() || "请根据这张图片处理", imageUrl ?? undefined);
		setText("");
		setImageUrl(null);
	}, [text, imageUrl, onSend]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				if (!isLoading) handleSend();
			}
		},
		[handleSend, isLoading],
	);

	const handleFileChange = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file || !validateImageFile(file)) return;
			const dataUrl = await readFileAsDataUrl(file);
			setImageUrl(dataUrl);
			e.target.value = "";
		},
		[],
	);

	return (
		<div className="relative" {...dragHandlers}>
			<AnimatePresence>
				{isDragging && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl border-2 border-dashed border-[var(--accent)] bg-[var(--accent-muted)] backdrop-blur-sm"
					>
						<div className="flex flex-col items-center gap-2 text-[var(--accent)]">
							<Upload className="h-6 w-6" />
							<span className="text-sm font-medium">{dropHint}</span>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{imageUrl && (
				<div className="mb-3 flex items-center gap-3 px-1">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={imageUrl}
						alt=""
						className="h-14 w-14 rounded-lg object-cover ring-1 ring-[var(--border)]"
					/>
					<button
						type="button"
						onClick={() => setImageUrl(null)}
						className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--error)]"
					>
						<X className="h-3.5 w-3.5" />
						{removeLabel}
					</button>
				</div>
			)}

			<div className="flex items-end gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-2">
				<input
					ref={fileRef}
					type="file"
					accept="image/*"
					className="hidden"
					onChange={handleFileChange}
				/>
				<button
					type="button"
					onClick={() => fileRef.current?.click()}
					title={uploadLabel}
					className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--text-muted)] transition-colors hover:bg-white/5 hover:text-[var(--text)]"
				>
					<ImagePlus className="h-5 w-5" />
				</button>
				<textarea
					value={text}
					onChange={(e) => setText(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					rows={1}
					className="max-h-28 min-h-[40px] flex-1 resize-none bg-transparent px-1 py-2.5 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
				/>
				{isLoading ? (
					<button
						type="button"
						onClick={onStop}
						className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--error)]/90 text-white"
					>
						<Square className="h-3.5 w-3.5 fill-current" />
					</button>
				) : (
					<motion.button
						type="button"
						onClick={handleSend}
						disabled={!text.trim() && !imageUrl}
						whileTap={reducedMotion ? undefined : { scale: 0.95 }}
						title={sendLabel}
						className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-white disabled:opacity-35"
					>
						<Send className="h-4 w-4" />
					</motion.button>
				)}
			</div>
		</div>
	);
}
