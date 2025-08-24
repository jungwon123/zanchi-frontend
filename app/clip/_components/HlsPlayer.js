"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { VideoTag } from "./style";

export default function HlsPlayer({ src, autoPlay, muted = true, playsInline = true, onCanPlay, onPlay, onPause }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const objectUrlRef = useRef(null);
  const abortRef = useRef(null);

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
    let token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token === 'undefined' || token === 'null' || token === '') token = null;

    if (isHls) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          backBufferLength: 30,
          xhrSetup: (xhr) => {
            if (token) xhr.setRequestHeader('Authorization', /^bearer\s/i.test(token) ? token : `Bearer ${token}`);
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
          headers: token ? { Authorization: /^bearer\s/i.test(token) ? token : `Bearer ${token}` } : undefined,
          credentials: 'include',
          signal: controller.signal,
        })
          .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.blob(); })
          .then((blob) => { const url = URL.createObjectURL(blob); objectUrlRef.current = url; video.src = url; })
          .catch(() => { video.src = src; });
      } else {
        video.src = src;
      }
    }

    const handleCanPlay = () => onCanPlay && onCanPlay();
    const handlePlay = () => onPlay && onPlay();
    const handlePause = () => onPause && onPause();

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
      if (abortRef.current) { abortRef.current.abort(); abortRef.current = null; }
      if (objectUrlRef.current) { URL.revokeObjectURL(objectUrlRef.current); objectUrlRef.current = null; }
    };
  }, [src, onCanPlay, onPlay, onPause]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    if (autoPlay) {
      const tryPlay = async () => {
        try {
          await video.play();
        } catch (e) {
          // ignored
        }
      };
      tryPlay();
    } else {
      video.pause();
    }
  }, [autoPlay, muted]);

  return (
    <VideoTag ref={videoRef} muted={muted} playsInline={playsInline} controls={false} preload="metadata" />
  );
}


