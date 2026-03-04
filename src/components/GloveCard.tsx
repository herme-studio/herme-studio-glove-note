import { useState } from "react";
import { motion, useAnimation, PanInfo } from "motion/react";
import { Glove } from "../types";
import {
  formatDistanceToNowStrict,
  parseISO,
  differenceInHours,
  isAfter,
} from "date-fns";
import { ja } from "date-fns/locale";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

interface GloveCardProps {
  key?: string;
  glove: Glove;
  onUse: (id: string) => void;
}

export function GloveCard({ glove, onUse }: GloveCardProps) {
  const controls = useAnimation();
  const [isSwiped, setIsSwiped] = useState(false);

  const handleDragEnd = async (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 500) {
      setIsSwiped(true);
      await controls.start({
        x: "100%",
        opacity: 0,
        transition: { duration: 0.2 },
      });
      onUse(glove.id);
    } else {
      controls.start({
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      });
    }
  };

  const expiresAt = parseISO(glove.expires_at);
  const now = new Date();
  const isExpiringSoon =
    isAfter(expiresAt, now) && differenceInHours(expiresAt, now) <= 24;

  const getStatusDisplay = () => {
    switch (glove.status) {
      case "active":
        return (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-mono",
              isExpiringSoon
                ? "text-[var(--color-tiktok-orange)]"
                : "text-[var(--color-tiktok-green)]",
            )}
          >
            <Clock size={14} />
            <span>
              あと{formatDistanceToNowStrict(expiresAt, { locale: ja })}
            </span>
          </div>
        );
      case "used":
        return (
          <div className="flex items-center gap-1 text-xs text-[var(--color-tiktok-text-sub)]">
            <CheckCircle2 size={14} />
            <span>使用済</span>
          </div>
        );
      case "expired":
        return (
          <div className="flex items-center gap-1 text-xs text-[var(--color-tiktok-red)]">
            <AlertCircle size={14} />
            <span>期限切れ</span>
          </div>
        );
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl mb-3 bg-[var(--color-tiktok-green)]/20">
      {/* Background for swipe action */}
      {glove.status === "active" && (
        <div className="absolute inset-0 flex items-center px-6 text-[var(--color-tiktok-green)] font-bold">
          <CheckCircle2 className="mr-2" /> 使用済みにする
        </div>
      )}

      <motion.div
        drag={glove.status === "active" ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="card relative z-10 flex justify-between items-center"
      >
        <div>
          <h3 className="font-bold text-lg mb-1">{glove.listener_name}</h3>
          <div className="text-xs text-[var(--color-tiktok-text-sub)] mb-2">
            獲得:{" "}
            {parseISO(glove.acquired_at).toLocaleDateString("ja-JP", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          {getStatusDisplay()}
        </div>

        <div className="w-12 h-12 rounded-full bg-[var(--color-tiktok-input)] flex items-center justify-center text-2xl">
          🥊
        </div>
      </motion.div>
    </div>
  );
}
