import { cn } from "@/frontend/theme/tokens";

/**
 * SwipeableCard — Card with swipe-to-act gesture for mobile.
 * Supports left-swipe to reveal actions (delete, edit, archive).
 */

type SwipeAction = "delete" | "edit" | "archive" | { label: string; icon: React.ReactNode; color: string; onClick: () => void };

interface SwipeableCardProps {
  children: React.ReactNode;
  actions?: SwipeAction[];
  onDelete?: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
  className?: string;
}

const builtinActions = {
  delete: { label: "Delete", icon: <Trash2 className="w-4 h-4" />, color: "#EF4444" },
  edit: { label: "Edit", icon: <Pencil className="w-4 h-4" />, color: "#0288D1" },
  archive: { label: "Archive", icon: <Archive className="w-4 h-4" />, color: "#E8A838" },
};

export function SwipeableCard({
  children,
  actions = ["delete"],
  onDelete,
  onEdit,
  onArchive,
  className = "",
}: SwipeableCardProps) {
  const [swipeX, setSwipeX] = useState(0);
  const startX = useRef(0);
  const isSwiping = useRef(false);

  const actionWidth = actions.length * 64;

  const resolvedActions = actions.map((a) => {
    if (typeof a === "string") {
      const config = builtinActions[a];
      const handler = a === "delete" ? onDelete : a === "edit" ? onEdit : onArchive;
      return { ...config, onClick: handler || (() => {}) };
    }
    return a;
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isSwiping.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    const dx = startX.current - e.touches[0].clientX;
    if (dx > 0) {
      setSwipeX(Math.min(dx * 0.8, actionWidth));
    } else {
      setSwipeX(0);
    }
  };

  const handleTouchEnd = () => {
    isSwiping.current = false;
    if (swipeX > actionWidth / 2) {
      setSwipeX(actionWidth);
    } else {
      setSwipeX(0);
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <div
        className="absolute inset-y-0 right-0 flex items-stretch"
        style={{ width: actionWidth }}
      >
        {resolvedActions.map((action, i) => (
          <button
            key={i}
            onClick={() => {
              action.onClick();
              setSwipeX(0);
            }}
            className="flex-1 flex flex-col items-center justify-center gap-1 text-white text-[10px] cn-touch-target"
            style={{ background: action.color }}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>

      <div
        className="relative bg-white"
        style={{
          transform: `translateX(${-swipeX}px)`,
          transition: isSwiping.current ? "none" : "transform 0.25s ease",
          background: cn.bgCard,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}