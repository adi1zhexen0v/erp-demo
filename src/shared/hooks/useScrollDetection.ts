import { useEffect, useRef, useState } from "react";

export function useScrollDetection() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function checkScroll() {
      const currentEl = scrollRef.current;
      if (!currentEl) return;
      setHasScroll(currentEl.scrollHeight > currentEl.clientHeight);
    }

    checkScroll();

    window.addEventListener("resize", checkScroll);
    const observer = new MutationObserver(checkScroll);
    observer.observe(el, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("resize", checkScroll);
      observer.disconnect();
    };
  }, []);

  return { scrollRef, hasScroll };
}
