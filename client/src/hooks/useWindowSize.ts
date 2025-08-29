import { useState, useEffect } from "react";

/**
 * Custom React hook that returns the current window size and updates it on window resize events.
 * @returns An object containing the current `windowWidth` and `windowHeight`.
 * @example
 * ```typescript
 * const { width, height } = useWindowSize(200);
 * ```
 */
export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
