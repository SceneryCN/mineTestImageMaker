"use client";

import { MessageSquarePlus, Settings } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { ChatInputDock, ChatPanel } from "@/components/chat-panel";
import { SettingsDialog } from "@/components/settings-dialog";
import { useApiKey } from "@/hooks/use-api-key";
import { useSmartChat } from "@/hooks/use-smart-chat";
import { t } from "@/i18n";
import { maskApiKey } from "@/utils/api-key-storage";

export function AppShell() {
	const i18n = t();
	const reducedMotion = useReducedMotion();
	const [settingsOpen, setSettingsOpen] = useState(false);

	const { apiKey, hasApiKey, saveApiKey } = useApiKey();
	const chat = useSmartChat(apiKey);

	return (
		<div className="relative z-10 mx-auto flex h-[100dvh] w-full max-w-4xl flex-col">
			<header className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
				<div className="flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-muted)] ring-1 ring-[var(--border)]">
						<span className="text-sm font-bold text-[var(--accent)]">JL</span>
					</div>
					<div>
						<h1 className="text-base font-semibold text-[var(--text)]">
							{i18n.app.title}
						</h1>
						<p className="text-[11px] text-[var(--text-muted)]">
							{i18n.app.subtitle}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-1">
					<motion.button
						type="button"
						onClick={chat.clearMessages}
						whileTap={reducedMotion ? undefined : { scale: 0.95 }}
						title={i18n.common.newSession}
						className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm text-[var(--text-muted)] transition-colors hover:bg-white/5 hover:text-[var(--text)] sm:px-3"
					>
						<MessageSquarePlus className="h-4 w-4" />
						<span className="hidden sm:inline">{i18n.common.newSession}</span>
					</motion.button>
					<motion.button
						type="button"
						onClick={() => setSettingsOpen(true)}
						whileTap={reducedMotion ? undefined : { scale: 0.95 }}
						className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm transition-colors sm:px-3 ${
							hasApiKey
								? "text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text)]"
								: "bg-[var(--accent-muted)] text-[var(--accent)]"
						}`}
					>
						<Settings className="h-4 w-4" />
						<span className="hidden sm:inline">
							{hasApiKey ? maskApiKey(apiKey) : i18n.settings.notConfigured}
						</span>
					</motion.button>
				</div>
			</header>

			<AnimatePresence>
				{!hasApiKey && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="mx-4 mb-2 overflow-hidden"
					>
						<div className="flex items-center justify-between rounded-xl border border-[var(--accent)]/20 bg-[var(--accent-muted)] px-4 py-2.5">
							<p className="text-sm text-[var(--accent)]">
								{i18n.settings.notConfigured}
							</p>
							<button
								type="button"
								onClick={() => setSettingsOpen(true)}
								className="rounded-lg bg-[var(--accent)] px-3 py-1 text-xs font-medium text-white"
							>
								{i18n.settings.openSettings}
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<main className="mx-3 min-h-0 flex-1 overflow-hidden rounded-2xl glass-panel sm:mx-4">
				<ChatPanel
					messages={chat.messages}
					error={chat.error}
					onEditImage={chat.editImage}
				/>
			</main>

			<ChatInputDock
				isLoading={chat.isLoading}
				onSend={chat.sendMessage}
				onStop={chat.stopGeneration}
			/>

			<SettingsDialog
				open={settingsOpen}
				currentKey={apiKey}
				onClose={() => setSettingsOpen(false)}
				onSave={saveApiKey}
			/>
		</div>
	);
}
