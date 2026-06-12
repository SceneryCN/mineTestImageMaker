"use client";

import Image from "next/image";
import { X } from "lucide-react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { t } from "@/i18n";

type LightboxPayload = {
	url: string;
	alt: string;
};

type ImageLightboxContextValue = {
	open: (url: string, alt?: string) => void;
	close: () => void;
};

const ImageLightboxContext = createContext<ImageLightboxContextValue | null>(
	null,
);

function LightboxOverlay({
	payload,
	onClose,
}: {
	payload: LightboxPayload;
	onClose: () => void;
}) {
	const i18n = t();

	return (
		<div
			className="lightbox-root fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
			role="dialog"
			aria-modal="true"
			aria-label={i18n.common.imagePreview}
		>
			<button
				type="button"
				className="lightbox-backdrop absolute inset-0 bg-black/85"
				onClick={onClose}
				aria-label={i18n.common.close}
			/>
			<button
				type="button"
				className="lightbox-close absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6 sm:top-6"
				onClick={onClose}
				aria-label={i18n.common.close}
			>
				<X className="h-[18px] w-[18px]" aria-hidden />
			</button>
			<div className="relative z-[1] max-h-[90vh] max-w-[min(100%,960px)]">
				<Image
					src={payload.url}
					alt={payload.alt}
					width={960}
					height={960}
					unoptimized
					priority
					draggable={false}
					className="lightbox-image h-auto max-h-[90vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
					sizes="960px"
				/>
			</div>
		</div>
	);
}

export function ImageLightboxProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [payload, setPayload] = useState<LightboxPayload | null>(null);
	const canPortal = typeof window !== "undefined";

	const open = useCallback((url: string, alt = "") => {
		setPayload({ url, alt });
	}, []);

	const close = useCallback(() => {
		setPayload(null);
	}, []);

	useEffect(() => {
		if (!payload) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") close();
		};

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [payload, close]);

	const value = useMemo(() => ({ open, close }), [open, close]);

	return (
		<ImageLightboxContext.Provider value={value}>
			{children}
			{canPortal &&
				payload &&
				createPortal(
					<LightboxOverlay payload={payload} onClose={close} />,
					document.body,
				)}
		</ImageLightboxContext.Provider>
	);
}

export function useImageLightbox(): ImageLightboxContextValue {
	const context = useContext(ImageLightboxContext);
	if (!context) {
		throw new Error(
			"useImageLightbox must be used within ImageLightboxProvider",
		);
	}
	return context;
}
