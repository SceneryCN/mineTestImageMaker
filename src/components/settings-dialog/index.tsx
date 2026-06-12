"use client";

import { KeyRound, X } from "lucide-react";
import { useCallback, useState } from "react";
import { t } from "@/i18n";

type SettingsDialogProps = {
	open: boolean;
	currentKey: string;
	onClose: () => void;
	onSave: (key: string) => void;
};

function SettingsForm({
	currentKey,
	onClose,
	onSave,
}: Omit<SettingsDialogProps, "open">) {
	const i18n = t();
	const [value, setValue] = useState(currentKey);

	const handleSave = useCallback(() => {
		onSave(value.trim());
		onClose();
	}, [value, onSave, onClose]);

	return (
		<div className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
			<div className="mb-5 flex items-start justify-between">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-muted)]">
						<KeyRound className="h-5 w-5 text-[var(--accent)]" />
					</div>
					<div>
						<h2 className="text-lg font-semibold text-[var(--text)]">
							{i18n.settings.title}
						</h2>
						<p className="mt-0.5 text-sm text-[var(--text-muted)]">
							{i18n.settings.description}
						</p>
					</div>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
				>
					<X className="h-5 w-5" />
				</button>
			</div>

			<label className="mb-2 block text-sm font-medium text-[var(--text-muted)]">
				{i18n.settings.apiKey}
			</label>
			<input
				type="password"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder={i18n.settings.apiKeyPlaceholder}
				className="mb-4 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
				autoFocus
			/>

			<div className="flex items-center justify-between gap-3">
				<a
					href="https://agnes-ai.com"
					target="_blank"
					rel="noopener noreferrer"
					className="text-sm text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
				>
					{i18n.settings.getKey}
				</a>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={onClose}
						className="rounded-xl px-4 py-2.5 text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-hover)]"
					>
						{i18n.settings.cancel}
					</button>
					<button
						type="button"
						onClick={handleSave}
						disabled={!value.trim()}
						className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--bg)] transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-40"
					>
						{i18n.settings.save}
					</button>
				</div>
			</div>
		</div>
	);
}

export function SettingsDialog({
	open,
	currentKey,
	onClose,
	onSave,
}: SettingsDialogProps) {
	const i18n = t();

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<button
				type="button"
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				onClick={onClose}
				aria-label={i18n.settings.cancel}
			/>
			<SettingsForm
				key={currentKey}
				currentKey={currentKey}
				onClose={onClose}
				onSave={onSave}
			/>
		</div>
	);
}
