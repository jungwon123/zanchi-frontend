"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { VideoTag } from "./style";

export default function HlsPlayer({ src, autoPlay, muted = true, playsInline = true, onCanPlay, onPlay, onPause }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        backBufferLength: 30,
      });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
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
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
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


