import { AppShell } from "@/components/app-shell";
import { ImageLightboxProvider } from "@/components/image-lightbox";

export default function Home() {
	return (
		<div className="min-h-[100dvh] bg-[var(--bg)]">
			<ImageLightboxProvider>
				<AppShell />
			</ImageLightboxProvider>
		</div>
	);
}
