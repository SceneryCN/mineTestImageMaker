const MIME_EXTENSION: Record<string, string> = {
	"image/png": ".png",
	"image/jpeg": ".jpg",
	"image/jpg": ".jpg",
	"image/webp": ".webp",
	"image/gif": ".gif",
};

function withExtension(filename: string, mimeType?: string): string {
	const base = filename.replace(/\.(png|jpe?g|webp|gif)$/i, "");
	const ext = (mimeType && MIME_EXTENSION[mimeType]) || ".png";
	return `${base}${ext}`;
}

function triggerBlobDownload(blob: Blob, filename: string): void {
	const objectUrl = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = objectUrl;
	link.download = filename;
	link.rel = "noopener";
	link.style.display = "none";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
}

async function blobFromDataUrl(dataUrl: string): Promise<Blob> {
	const response = await fetch(dataUrl);
	return response.blob();
}

async function blobFromCorsFetch(url: string): Promise<Blob | null> {
	try {
		const response = await fetch(url, {
			mode: "cors",
			credentials: "omit",
			cache: "force-cache",
		});
		if (!response.ok) return null;
		const blob = await response.blob();
		return blob.size > 0 ? blob : null;
	} catch {
		return null;
	}
}

async function blobFromNoCorsFetch(url: string): Promise<Blob | null> {
	try {
		const response = await fetch(url, {
			mode: "no-cors",
			credentials: "omit",
			cache: "force-cache",
		});
		const blob = await response.blob();
		return blob.size > 0 ? blob : null;
	} catch {
		return null;
	}
}

async function blobFromCanvas(url: string): Promise<Blob | null> {
	return new Promise((resolve) => {
		const image = new Image();
		image.crossOrigin = "anonymous";

		image.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = image.naturalWidth;
			canvas.height = image.naturalHeight;

			const context = canvas.getContext("2d");
			if (!context) {
				resolve(null);
				return;
			}

			context.drawImage(image, 0, 0);
			canvas.toBlob((blob) => resolve(blob), "image/png", 1);
		};

		image.onerror = () => resolve(null);
		image.src = url;
	});
}

export async function downloadImage(
	url: string,
	filename: string,
): Promise<void> {
	if (!url) {
		throw new Error("Missing image URL");
	}

	const safeName = filename.trim() || "jlimimage";

	if (url.startsWith("data:")) {
		const blob = await blobFromDataUrl(url);
		triggerBlobDownload(blob, withExtension(safeName, blob.type));
		return;
	}

	const corsBlob = await blobFromCorsFetch(url);
	if (corsBlob) {
		triggerBlobDownload(corsBlob, withExtension(safeName, corsBlob.type));
		return;
	}

	const noCorsBlob = await blobFromNoCorsFetch(url);
	if (noCorsBlob) {
		triggerBlobDownload(noCorsBlob, withExtension(safeName, noCorsBlob.type));
		return;
	}

	const canvasBlob = await blobFromCanvas(url);
	if (canvasBlob) {
		triggerBlobDownload(canvasBlob, withExtension(safeName, canvasBlob.type));
		return;
	}

	throw new Error("Unable to download image");
}
