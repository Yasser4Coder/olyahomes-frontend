"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const AUTO_MS = 4800;

export function useFeaturedCarousel(listLength) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const dragStartX = useRef(null);

  const count = listLength;
  const goTo = useCallback(
    (i) => {
      setIndex(((i % count) + count) % count);
    },
    [count],
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (isPaused || count <= 1) return undefined;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [isPaused, count]);

  const onPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragStartX.current = e.clientX;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onPointerUp = (e) => {
    if (dragStartX.current == null) return;
    const delta = e.clientX - dragStartX.current;
    const threshold = 48;
    if (delta < -threshold) goNext();
    else if (delta > threshold) goPrev();
    dragStartX.current = null;
  };

  const onPointerCancel = () => {
    dragStartX.current = null;
  };

  return {
    index,
    goTo,
    isPaused,
    setIsPaused,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    count,
  };
}
