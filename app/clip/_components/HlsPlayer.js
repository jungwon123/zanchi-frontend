"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { VideoTag } from "./style";

export default function HlsPlayer({
  src,
  clipId,
  autoPlay,
  muted = true,
  playsInline = true,
  onCanPlay,
  onPlay,
  onPause,
}) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const objectUrlRef = useRef(null);
  const abortRef = useRef(null);
  const lastSavedRef = useRef(0);
  const endedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // cleanup previous
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    const isHls = /\.m3u8($|\?)/i.test(src || "");
    let token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (token === "undefined" || token === "null" || token === "") token = null;

    if (isHls) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          backBufferLength: 30,
          xhrSetup: (xhr) => {
            if (token)
              xhr.setRequestHeader(
                "Authorization",
                /^bearer\s/i.test(token) ? token : `Bearer ${token}`
              );
            xhr.withCredentials = true;
          },
        });
        hlsRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src; // Native HLS (Safari) - cannot set headers
      } else {
        video.src = src;
      }
    } else {
      // e.g., MP4. Fetch with Authorization then play via blob URL
      if (token) {
        const controller = new AbortController();
        abortRef.current = controller;
        fetch(src, {
          headers: token
            ? {
                Authorization: /^bearer\s/i.test(token)
                  ? token
                  : `Bearer ${token}`,
              }
            : undefined,
          credentials: "include",
          signal: controller.signal,
        })
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.blob();
          })
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            objectUrlRef.current = url;
            video.src = url;
          })
          .catch(() => {
            video.src = src;
          });
      } else {
        video.src = src;
      }
    }

    const handleCanPlay = () => onCanPlay && onCanPlay();
    const handlePlay = () => {
      endedRef.current = false;
      onPlay && onPlay();
    };
    const handlePause = () => onPause && onPause();
    const handleEnded = () => {
      endedRef.current = true;
      try {
        if (clipId) sessionStorage.removeItem(`clip_pos_${clipId}`);
      } catch {}
    };
    const handleTimeUpdate = () => {
      if (!clipId) return;
      const now = Date.now();
      if (now - lastSavedRef.current < 500) return;
      lastSavedRef.current = now;
      try {
        const payload = {
          t: video.currentTime,
          d: video.duration || 0,
          ts: now,
        };
        sessionStorage.setItem(`clip_pos_${clipId}`, JSON.stringify(payload));
      } catch {}
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [src, clipId, onCanPlay, onPlay, onPause]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    if (autoPlay && !endedRef.current) {
      const tryPlay = async () => {
        try {
          // 복원 로직: 세션 저장된 위치가 있으면 복원 (최대 10분 내 기록만 인정)
          if (clipId) {
            try {
              const raw = sessionStorage.getItem(`clip_pos_${clipId}`);
              const leaveTsRaw = sessionStorage.getItem(`clip_leave_${clipId}`);
              const leaveTs = leaveTsRaw ? Number(leaveTsRaw) : 0;
              const awayMs = leaveTs ? Date.now() - leaveTs : 0;
              const allowResume = awayMs > 0 && awayMs < 2000; // 2초 미만만 이어보기 허용

              if (raw && allowResume) {
                const { t, d, ts } = JSON.parse(raw);
                if (
                  typeof t === "number" &&
                  Date.now() - (ts || 0) < 10 * 60 * 1000
                ) {
                  const target = Math.max(
                    0,
                    Math.min(t, (d || video.duration || 0) - 0.3)
                  );
                  if (!Number.isNaN(target) && target > 0)
                    video.currentTime = target;
                }
              } else {
                // 재진입 간격이 2초 이상이면 처음부터 재생
                try {
                  sessionStorage.removeItem(`clip_pos_${clipId}`);
                } catch {}
                video.currentTime = 0;
              }
              // 사용 후 leave 타임스탬프는 초기화
              try {
                sessionStorage.removeItem(`clip_leave_${clipId}`);
              } catch {}
            } catch {}
          }
          await video.play();
        } catch (e) {
          // ignored
        }
      };
      tryPlay();
    } else {
      video.pause();
      // 뷰에서 나갈 때 이탈 시각 저장 (이어보기 판단용)
      if (clipId) {
        try {
          sessionStorage.setItem(`clip_leave_${clipId}`, String(Date.now()));
        } catch {}
      }
    }
  }, [autoPlay, muted, clipId]);

  return (
    <VideoTag
      ref={videoRef}
      muted={muted}
      playsInline={playsInline}
      controls={false}
      preload="metadata"
    />
  );
}
