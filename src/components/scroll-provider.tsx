"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    let frameId = 0;

    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time);
      frameId = window.requestAnimationFrame(update);
    };

    frameId = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        anchors: true,
        lerp: 0.08,
      }}
    >
      {children}
    </ReactLenis>
  );
}