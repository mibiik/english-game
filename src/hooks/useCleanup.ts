import { useEffect, useRef } from 'react';

// Memory leak önleme için custom hook
export const useCleanup = () => {
  const cleanupRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    return () => {
      // Component unmount olduğunda tüm cleanup fonksiyonlarını çalıştır
      cleanupRef.current.forEach(cleanup => cleanup());
      cleanupRef.current = [];
    };
  }, []);

  const addCleanup = (cleanup: () => void) => {
    cleanupRef.current.push(cleanup);
  };

  return { addCleanup };
};

// Event listener cleanup için hook
export const useEventListener = (
  eventName: string,
  handler: EventListener,
  element: EventTarget = window,
  options?: AddEventListenerOptions
) => {
  const savedHandler = useRef<EventListener>(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event: Event) => savedHandler.current(event);
    
    element.addEventListener(eventName, eventListener, options);
    
    return () => {
      element.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
};

// Interval cleanup için hook
export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

// Timeout cleanup için hook
export const useTimeout = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setTimeout(() => savedCallback.current(), delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
};

// AbortController cleanup için hook
export const useAbortController = () => {
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return abortControllerRef.current;
};

// Intersection Observer cleanup için hook
export const useIntersectionObserverCleanup = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(callback, options);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, options]);

  return observerRef.current;
};

// Resize Observer cleanup için hook
export const useResizeObserverCleanup = (callback: ResizeObserverCallback) => {
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    observerRef.current = new ResizeObserver(callback);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback]);

  return observerRef.current;
}; 