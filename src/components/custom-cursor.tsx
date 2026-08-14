"use client";

import { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!supportsFinePointer) return;

    const updatePosition = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
      setIsVisible(true);
    };

    const handlePointerLeave = () => setIsVisible(false);
    const handlePointerDown = () => setIsActive(true);
    const handlePointerUp = () => setIsActive(false);
    const handlePointerOver = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const interactiveElement = target?.closest(
        "a, button, input, textarea, select, [role='button'], [data-cursor='pointer']",
      );
      setIsActive(Boolean(interactiveElement));
    };
    const handlePointerOut = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const relatedTarget = event.relatedTarget as Node | null;
      if (!relatedTarget || !target?.contains(relatedTarget)) {
        setIsActive(false);
      }
    };

    window.addEventListener("pointermove", updatePosition);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);

    return () => {
      window.removeEventListener("pointermove", updatePosition);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`custom-cursor${isVisible ? " is-visible" : ""}${isActive ? " is-active" : ""}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      <span className="custom-cursor__dot" />
    </div>
  );
}
