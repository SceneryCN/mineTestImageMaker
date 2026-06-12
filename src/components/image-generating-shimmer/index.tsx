"use client";

type ImageGeneratingShimmerProps = {
	label?: string;
	className?: string;
};

export function ImageGeneratingShimmer({
	label,
	className = "",
}: ImageGeneratingShimmerProps) {
	return (
		<div
			className={`image-shimmer relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl ${className}`}
			role="status"
			aria-label={label}
		>
			<div className="image-shimmer-wave" aria-hidden />
			<div className="image-shimmer-glow" aria-hidden />
			{label && (
				<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-4 pb-4 pt-10">
					<p className="text-xs text-white/50">{label}</p>
				</div>
			)}
		</div>
	);
}
