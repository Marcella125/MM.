"use client";

import { useEffect } from "react";

// Leave touch, trackpads, keyboard navigation and nested scroll areas to the browser.
// A short interpolation only softens the larger steps produced by a mouse wheel.
export default function SmoothScroll() {
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let target = window.scrollY;
    let lastTime = 0;
    let previousBehavior: string | null = null;

    function cancel() {
      window.cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      target = window.scrollY;
      if (previousBehavior !== null) {
        document.documentElement.style.scrollBehavior = previousBehavior;
        previousBehavior = null;
      }
    }

    function hasScrollableAncestor(node: EventTarget | null) {
      let element = node instanceof Element ? node : null;
      while (element && element !== document.documentElement) {
        const style = window.getComputedStyle(element);
        if (/^(auto|scroll)$/.test(style.overflowY) && element.scrollHeight > element.clientHeight + 1) {
          return true;
        }
        element = element.parentElement;
      }
      return false;
    }

    function tick(now: number) {
      const elapsed = Math.min(now - (lastTime || now - 16), 32);
      lastTime = now;
      const distance = target - window.scrollY;
      const step = 1 - Math.exp(-elapsed / 75);

      if (Math.abs(distance) < 0.5) {
        window.scrollTo(0, target);
        cancel();
        return;
      }

      window.scrollTo(0, window.scrollY + distance * step);
      frame = window.requestAnimationFrame(tick);
    }

    function onWheel(event: WheelEvent) {
      if (!finePointer.matches || reducedMotion.matches || event.ctrlKey || event.metaKey || event.shiftKey ||
          event.defaultPrevented || hasScrollableAncestor(event.target)) {
        cancel();
        return;
      }

      // Pixel deltas below this range generally come from a continuous trackpad.
      if (event.deltaMode === 0 && Math.abs(event.deltaY) < 80) {
        cancel();
        return;
      }

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * window.innerHeight : event.deltaY;
      target = Math.max(0, Math.min(maxScroll, (frame ? target : window.scrollY) + delta));
      event.preventDefault();
      if (!frame) {
        previousBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = "auto";
        frame = window.requestAnimationFrame(tick);
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("pointerdown", cancel);
    window.addEventListener("keydown", cancel);
    window.addEventListener("hashchange", cancel);
    finePointer.addEventListener("change", cancel);
    reducedMotion.addEventListener("change", cancel);

    return () => {
      cancel();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointerdown", cancel);
      window.removeEventListener("keydown", cancel);
      window.removeEventListener("hashchange", cancel);
      finePointer.removeEventListener("change", cancel);
      reducedMotion.removeEventListener("change", cancel);
    };
  }, []);

  return null;
}
