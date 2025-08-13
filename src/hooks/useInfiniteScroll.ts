import { useEffect, useRef } from "react";

export function useInfiniteScroll(
  onHit: () => Promise<void> | void,
  enabled = true,
  deps: unknown[] = []
) {
  const ref = useRef<HTMLDivElement | null>(null);
  const loading = useRef(false);
  const cooldown = useRef(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading.current && !cooldown.current) {
          loading.current = true;
          Promise.resolve(onHit())
            .finally(() => {
              loading.current = false;
              cooldown.current = true;
              
              setTimeout(() => {
                cooldown.current = false;
              }, 500);
            });
        }
      },
      {
        rootMargin: "0px",
        threshold: 1,
      }
    );

    observer.current.observe(el);
    return () => observer.current?.disconnect();
  }, [onHit, enabled, ...deps]);

  return ref;
}
