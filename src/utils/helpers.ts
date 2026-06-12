export function createId(): string {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function readFileAsDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject(new Error("Failed to read file"));
		reader.readAsDataURL(file);
	});
}

export function validateImageFile(file: File): boolean {
	return file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024;
}
