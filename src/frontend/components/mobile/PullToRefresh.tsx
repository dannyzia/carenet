import { cn } from "@/frontend/theme/tokens";
import { RefreshCw } from "lucide-react";

/**
 * PullToRefresh — Pull-to-refresh gesture handler for list pages.
 * Wraps children; shows spinner when user pulls down past threshold.
 * Only active on touch devices.
 */

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  threshold?: number;
}

export function PullToRefresh({ onRefresh, children, threshold = 80 }: PullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const container = containerRef.current;
    if (!container || container.scrollTop > 0) return;
    startY.current = e.touches[0].clientY;
    isPulling.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling.current || isRefreshing) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) {
      const dampened = Math.min(dy * 0.4, 120);
      setPullDistance(dampened);
    }
  }, [isRefreshing]);

  const handleTouchEnd = useCallback(async () => {
    isPulling.current = false;
    if (pullDistance >= threshold * 0.4 && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(50);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex items-center justify-center overflow-hidden transition-all"
        style={{
          height: pullDistance > 0 ? `${pullDistance}px` : 0,
          opacity: pullDistance > 20 ? 1 : 0,
          transition: isPulling.current ? "none" : "all 0.3s ease",
        }}
      >
        <RefreshCw
          className="w-5 h-5 transition-transform"
          style={{
            color: cn.textSecondary,
            transform: isRefreshing ? "none" : `rotate(${pullDistance * 3}deg)`,
            animation: isRefreshing ? "spin 0.8s linear infinite" : "none",
          }}
        />
      </div>

      <div
        style={{
          transform: pullDistance > 0 ? `translateY(${Math.max(0, pullDistance - 50)}px)` : "none",
          transition: isPulling.current ? "none" : "transform 0.3s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}