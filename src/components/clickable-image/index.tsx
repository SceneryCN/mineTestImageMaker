"use client";

import Image from "next/image";
import { memo, useCallback } from "react";
import { useImageLightbox } from "@/components/image-lightbox";

type ClickableImageProps = {
	src: string;
	alt?: string;
	className?: string;
};

export const ClickableImage = memo(function ClickableImage({
	src,
	alt = "",
	className = "",
}: ClickableImageProps) {
	const { open } = useImageLightbox();

	const handleClick = useCallback(() => {
		open(src, alt);
	}, [open, src, alt]);

	return (
		<button
			type="button"
			aria-label={alt || undefined}
			className={`block cursor-zoom-in border-0 bg-transparent p-0 ${className}`}
			onClick={handleClick}
		>
			<Image
				src={src}
				alt={alt}
				width={1024}
				height={1024}
				unoptimized
				draggable={false}
				className="h-full w-full object-cover"
				sizes="(max-width: 768px) 85vw, 480px"
			/>
		</button>
	);
});
