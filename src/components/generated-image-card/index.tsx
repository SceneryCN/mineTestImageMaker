"use client";

import { Download, Loader2, Pencil, ZoomIn } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useState } from "react";
import { ClickableImage } from "@/components/clickable-image";
import { ImageGeneratingShimmer } from "@/components/image-generating-shimmer";
import { useImageLightbox } from "@/components/image-lightbox";
import { useDownloadImage } from "@/hooks/use-download-image";
import { t } from "@/i18n";
import type { GeneratedImageAttachment } from "@/types/chat";

type GeneratedImageCardProps = {
  image: GeneratedImageAttachment;
  onEdit?: (imageId: string, prompt: string) => void;
};

export function GeneratedImageCard({ image, onEdit }: GeneratedImageCardProps) {
  const i18n = t();
  const { open: openLightbox } = useImageLightbox();
  const { download, isDownloading } = useDownloadImage();
  const reducedMotion = useReducedMotion();
  const [editing, setEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");

  const handleDownload = useCallback(async () => {
    if (!image.url) return;
    try {
      await download(image.url, `jlimimage-${image.id}`);
    } catch {
      // Error state handled by hook
    }
  }, [download, image.url, image.id]);

  const downloading = isDownloading(`jlimimage-${image.id}`);

  const handleEditSubmit = useCallback(() => {
    if (!editPrompt.trim() || !onEdit) return;
    onEdit(image.id, editPrompt.trim());
    setEditing(false);
    setEditPrompt("");
  }, [editPrompt, onEdit, image.id]);

  return (
    <div className="group relative w-full max-w-sm overflow-hidden rounded-2xl ring-1 ring-[var(--border)]">
      {image.status === "generating" && (
        <ImageGeneratingShimmer label={i18n.chat.imageGenerating} />
      )}

      {image.status === "error" && (
        <div className="flex aspect-[4/3] items-center justify-center bg-[var(--error)]/8">
          <p className="text-sm text-[var(--error)]">{i18n.chat.imageError}</p>
        </div>
      )}

      {image.status === "ready" && image.url && (
        <>
          <ClickableImage
            src={image.url}
            alt={image.prompt}
            className="aspect-[4/3] w-full object-cover"
          />

          {!editing && (
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100">
              <div className="pointer-events-auto flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openLightbox(image.url, image.prompt)}
                  className="flex items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1.5 text-xs text-white backdrop-blur-sm hover:bg-white/25"
                >
                  <ZoomIn className="h-3 w-3" />
                  {i18n.common.imagePreview}
                </button>
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1.5 text-xs text-white backdrop-blur-sm hover:bg-white/25"
                  >
                    <Pencil className="h-3 w-3" />
                    {i18n.chat.editImage}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1.5 text-xs text-white backdrop-blur-sm hover:bg-white/25 disabled:opacity-60"
                >
                  {downloading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Download className="h-3 w-3" />
                  )}
                  {i18n.chat.download}
                </button>
              </div>
              <p className="pointer-events-none mt-1.5 text-[10px] text-white/50 [@media(hover:hover)]:hidden">
                {i18n.chat.tapToEdit}
              </p>
            </div>
          )}

          <AnimatePresence>
            {editing && (
              <motion.div
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0 }}
                className="absolute inset-0 flex flex-col justify-end bg-black/80 p-3"
              >
                <textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder={i18n.chat.editPlaceholder}
                  rows={2}
                  className="mb-2 w-full resize-none rounded-lg border border-white/15 bg-white/10 px-2.5 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-[var(--accent)]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setEditPrompt("");
                    }}
                    className="rounded-lg px-2.5 py-1.5 text-xs text-white/70"
                  >
                    {i18n.chat.editCancel}
                  </button>
                  <button
                    type="button"
                    onClick={handleEditSubmit}
                    disabled={!editPrompt.trim()}
                    className="rounded-lg bg-[var(--accent)] px-2.5 py-1.5 text-xs font-medium text-white disabled:opacity-40"
                  >
                    {i18n.chat.editSubmit}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
