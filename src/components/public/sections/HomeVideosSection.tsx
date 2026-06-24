import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaExternalLinkAlt,
    FaPlay,
    FaTimes,
    FaVideo,
} from "react-icons/fa";

import { useVideos } from "../../../api/hooks";
import { resolveMediaUrl } from "../../../lib/api-client";
import {
    containerClass,
    SectionHeading,
    softSectionClass,
} from "../PublicPrimitives";
import { EmptyState, ErrorState, PageLoading } from "../../ui";

type VideoItem = {
    id: number | string;
    title: string;
    description?: string | null;
    videoUrl?: string | null;
    thumbnailUrl?: string | null;
};

function getYoutubeEmbedUrl(url: string) {
    const match =
        url.match(/youtu\.be\/([^?&]+)/) ||
        url.match(/youtube\.com\/watch\?v=([^?&]+)/) ||
        url.match(/youtube\.com\/shorts\/([^?&]+)/) ||
        url.match(/youtube\.com\/embed\/([^?&]+)/);

    const id = match?.[1];

    return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
}

function getVimeoEmbedUrl(url: string) {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    const id = match?.[1];

    return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
}

function isDirectVideoUrl(url: string) {
    return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

function getPreviewData(videoUrl?: string | null) {
    const url = resolveMediaUrl(videoUrl);

    if (!url) {
        return {
            url: "",
            type: "empty" as const,
        };
    }

    const youtube = getYoutubeEmbedUrl(url);
    if (youtube) {
        return {
            url: youtube,
            originalUrl: url,
            type: "iframe" as const,
        };
    }

    const vimeo = getVimeoEmbedUrl(url);
    if (vimeo) {
        return {
            url: vimeo,
            originalUrl: url,
            type: "iframe" as const,
        };
    }

    if (isDirectVideoUrl(url)) {
        return {
            url,
            originalUrl: url,
            type: "video" as const,
        };
    }

    return {
        url,
        originalUrl: url,
        type: "iframe" as const,
    };
}

export function HomeVideosSection() {
    const videos = useVideos();
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

    const closeModal = () => setSelectedVideo(null);

    useEffect(() => {
        if (!selectedVideo) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") closeModal();
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [selectedVideo]);

    const preview = getPreviewData(selectedVideo?.videoUrl);

    return (
        <>
            <section className={softSectionClass}>
                <div className={containerClass}>
                    <SectionHeading
                        title="شاهد جودة الشغل"
                        description="فيديوهات مختارة توضح العناية بالتفاصيل قبل وبعد الخدمة."
                        link="/videos"
                    />

                    {videos.isLoading ? (
                        <PageLoading />
                    ) : videos.isError ? (
                        <ErrorState error={videos.error} retry={videos.refetch} />
                    ) : videos.data?.length ? (
                        <>
                            <div className="grid gap-5 md:grid-cols-3">
                                {videos.data.slice(0, 6).map((video) => (
                                    <article
                                        key={video.id}
                                        className="group overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-soft transition hover:-translate-y-1 hover:shadow-strong"
                                    >
                                        <button
                                            type="button"
                                            className="relative block aspect-video w-full overflow-hidden bg-[var(--color-navy)] text-start"
                                            onClick={() => setSelectedVideo(video)}
                                            aria-label={`مشاهدة ${video.title}`}
                                        >
                                            {video.thumbnailUrl ? (
                                                <img
                                                    className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-110 group-hover:opacity-90"
                                                    src={resolveMediaUrl(video.thumbnailUrl)}
                                                    alt={video.title}
                                                    loading="lazy"
                                                    onError={(event) => {
                                                        event.currentTarget.style.opacity = "0";
                                                    }}
                                                />
                                            ) : (
                                                <div className="grid h-full w-full place-items-center bg-[var(--color-navy)]">
                                                    <FaVideo className="text-5xl text-white/20" />
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                                            <span className="absolute inset-0 m-auto grid h-16 w-16 place-items-center rounded-full bg-white text-[var(--color-primary-dark)] shadow-strong transition group-hover:scale-110 group-hover:bg-[var(--color-primary)] group-hover:text-white">
                                                <FaPlay className="mr-1 text-xl" />
                                            </span>

                                            <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-black text-white backdrop-blur">
                                                <FaVideo className="text-rose-300" />
                                                فيديو
                                            </span>
                                        </button>

                                        <div className="p-6">
                                            <h3 className="font-display text-lg font-black text-[var(--color-text)]">
                                                {video.title}
                                            </h3>

                                            {video.description && (
                                                <p className="mt-3 line-clamp-2 text-sm font-semibold leading-7 text-[var(--color-muted)]">
                                                    {video.description}
                                                </p>
                                            )}

                                            <button
                                                type="button"
                                                className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[var(--color-primary-dark)] transition hover:-translate-x-1 dark:text-[var(--color-primary)]"
                                                onClick={() => setSelectedVideo(video)}
                                            >
                                                مشاهدة داخل الموقع
                                                <FaPlay className="text-xs" />
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-center">
                                <Link
                                    to="/videos"
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 text-sm font-black text-[var(--color-text)] shadow-soft transition hover:-translate-y-1 hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)] hover:shadow-strong dark:hover:text-[var(--color-primary)]"
                                >
                                    عرض كل الفيديوهات
                                    <FaVideo className="text-[var(--color-primary)]" />
                                </Link>
                            </div>
                        </>
                    ) : (
                        <EmptyState title="لا توجد فيديوهات متاحة" />
                    )}
                </div>
            </section>

            {selectedVideo && (
                <div
                    className="fixed inset-0 z-[100] flex items-center h justify-center bg-black/75 p-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-label={selectedVideo.title}
                    onMouseDown={closeModal}
                >
                    <div
                        className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-[var(--color-surface)] shadow-strong"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] p-4 sm:p-5">
                            <div>
                                <h2 className="font-display text-lg font-black text-[var(--color-text)] sm:text-xl">
                                    {selectedVideo.title}
                                </h2>

                                {selectedVideo.description && (
                                    <p className="mt-1 line-clamp-1 text-sm font-semibold text-[var(--color-muted)]">
                                        {selectedVideo.description}
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text)] transition hover:bg-red-500 hover:text-white"
                                onClick={closeModal}
                                aria-label="إغلاق"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="bg-black">
                            {preview.type === "video" ? (
                                <video
                                    className="aspect-video w-full"
                                    src={preview.url}
                                    controls
                                    autoPlay
                                    playsInline
                                />
                            ):(
                                <div className="grid aspect-video place-items-center p-6 text-center text-white">
                                    لا يمكن عرض هذا الفيديو حاليًا.
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                            <p className="text-sm font-bold text-[var(--color-muted)]">
                                اضغط خارج النافذة أو زر ESC للإغلاق.
                            </p>

                            {preview.originalUrl && (
                                <a
                                    href={preview.originalUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-5 text-sm font-black text-[var(--color-text)] transition hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)] dark:hover:text-[var(--color-primary)]"
                                >
                                    فتح في تبويب جديد
                                    <FaExternalLinkAlt className="text-xs" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}