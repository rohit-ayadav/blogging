import { RefObject, useEffect, useState } from 'react';

interface UseIntersectionObserverInit extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

function useIntersectionObserver(
  elementRef: RefObject<Element>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  }: UseIntersectionObserverInit = {},
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  useEffect(() => {
    const node = elementRef?.current;
    const frozen = entry?.isIntersecting && freezeOnceVisible;

    if (!node || frozen) {
      return;
    }

    
    const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
      setEntry(entry);
    };

    
    const observer = new IntersectionObserver(updateEntry, {
      threshold,
      root,
      rootMargin,
    });

    
    observer.observe(node);

    
    return () => {
      observer.disconnect();
    };
  }, [
    elementRef?.current,
    threshold,
    root,
    rootMargin,
    freezeOnceVisible,
    entry?.isIntersecting,
  ]);

  return entry;
}


export interface IntersectionOptions extends UseIntersectionObserverInit {
  onIntersect?: (isIntersecting: boolean) => void;
  enabled?: boolean;
}

export function useIntersect({
  elementRef,
  onIntersect,
  enabled = true,
  ...options
}: {
  elementRef: RefObject<Element>;
} & IntersectionOptions) {
  const entry = useIntersectionObserver(elementRef, options);

  useEffect(() => {
    if (enabled && entry && onIntersect) {
      onIntersect(entry.isIntersecting);
    }
  }, [enabled, entry?.isIntersecting, onIntersect]);

  return entry;
}


export function useProgressiveIntersect(elementRef: RefObject<Element>) {
  return useIntersectionObserver(elementRef, {
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });
}


export function useViewportIntersect(elementRef: RefObject<Element>) {
  return useIntersectionObserver(elementRef, {
    rootMargin: '-50px 0px',
    threshold: 0,
  });
}

export {useIntersectionObserver};