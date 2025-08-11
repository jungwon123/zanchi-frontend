"use client";

import { useEffect, useRef, useState } from "react";

export default function useIntersectionAutoPlay(options = { threshold: 0.6 }) {
  const elementRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsInView(entry.isIntersecting && entry.intersectionRatio >= (options.threshold ?? 0.6));
      },
      { threshold: options.threshold ?? 0.6 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options.threshold]);

  return { elementRef, isInView };
}


