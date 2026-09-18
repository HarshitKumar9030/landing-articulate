"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { usePathname } from "next/navigation";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<LenisRef>(null);
  const pathname = usePathname();

  const isAppRoute = pathname?.startsWith("/dashboard") || 
                     pathname?.startsWith("/onboarding") || 
                     pathname?.startsWith("/chat") || 
                     pathname?.startsWith("/billing");

  useEffect(() => {
    if (isAppRoute) return;
    
    let frameId = 0;

    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time);
      frameId = window.requestAnimationFrame(update);
    };

    frameId = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isAppRoute]);

  if (isAppRoute) {
    return <>{children}</>;
  }

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