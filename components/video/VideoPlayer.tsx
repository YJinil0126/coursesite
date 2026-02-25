"use client";

import MuxPlayer from "@mux/mux-player-react/lazy";

/**
 * VideoPlayer: Wraps Mux Player for lesson videos.
 *
 * Must be a Client Component because Mux Player is interactive (play, pause, etc.).
 * We pass the playbackId from Supabase (lesson.mux_playback_id).
 *
 * Uses lazy import so the player loads when it enters the viewport (better performance).
 * Mux Playback IDs come from uploading a video in Mux Dashboard or via the Mux API.
 */
type VideoPlayerProps = {
  playbackId: string;
  title?: string;
};

export function VideoPlayer({ playbackId, title }: VideoPlayerProps) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
      <MuxPlayer
        playbackId={playbackId}
        metadata={{
          video_title: title ?? undefined,
        }}
        streamType="on-demand"
        loading="viewport"
        style={{ aspectRatio: "16/9" }}
        className="h-full w-full"
      />
    </div>
  );
}
