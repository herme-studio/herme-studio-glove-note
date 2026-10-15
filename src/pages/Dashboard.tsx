import { useState } from "react";
import { useGloves } from "../hooks/useGloves";
import { GloveCard } from "../components/GloveCard";
import { AlertTriangle } from "lucide-react";
import { differenceInHours, parseISO, isAfter } from "date-fns";
import { cn } from "../lib/utils";
import { ItemType, ITEM_CONFIGS } from "../types";

type StatusFilterType = "active" | "expiring" | "all";
type ItemFilterType = "all" | ItemType;

export function Dashboard() {
  const { gloves, updateGloveStatus } = useGloves();
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("active");
  const [itemFilter, setItemFilter] = useState<ItemFilterType>("all");

  const activeGloves = gloves.filter((g) => g.status === "active");
  const activeGlovesCount = activeGloves.filter(
    (g) => (g.type || "glove") === "glove",
  ).length;
  const activeSongRushCount = activeGloves.filter(
    (g) => g.type === "song_rush",
  ).length;

  const expiringGloves = activeGloves.filter((g) => {
    const expiresAt = parseISO(g.expires_at);
    const now = new Date();
    return isAfter(expiresAt, now) && differenceInHours(expiresAt, now) <= 24;
  });

  const filteredGloves = gloves
    .filter((g) => {
      // Status filter
      if (statusFilter === "active" && g.status !== "active") return false;
      if (statusFilter === "expiring") {
        const expiresAt = parseISO(g.expires_at);
        const now = new Date();
        const isExpiring =
          g.status === "active" &&
          isAfter(expiresAt, now) &&
          differenceInHours(expiresAt, now) <= 24;
        if (!isExpiring) return false;
      }

      // Item type filter
      if (itemFilter !== "all") {
        const itemType = g.type || "glove";
        if (itemType !== itemFilter) return false;
      }

      return true;
    })
    .sort(
      (a, b) =>
        new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime(),
    );

  return (
    <div className="animate-in fade-in duration-300">
      <header className="mb-6 mt-4">
        <h1 className="text-sm text-[var(--color-tiktok-text-sub)] font-medium mb-1">
          有効なアイテム
        </h1>
        <div className="flex items-baseline gap-4 mb-3">
          <div className="text-5xl font-mono font-bold text-[var(--color-tiktok-cyan)]">
            {activeGloves.length}
          </div>
          <div className="flex gap-2 text-xs font-medium">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(254,44,85,0.12)] text-[var(--color-tiktok-pink)] border border-[rgba(254,44,85,0.25)]">
              <span>🥊</span>
              <span className="font-mono font-bold">{activeGlovesCount}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(37,244,238,0.12)] text-[var(--color-tiktok-cyan)] border border-[rgba(37,244,238,0.25)]">
              <span>🎵</span>
              <span className="font-mono font-bold">{activeSongRushCount}</span>
            </span>
          </div>
        </div>
      </header>

      {expiringGloves.length > 0 && (
        <div className="mb-6 bg-[var(--color-tiktok-orange)]/10 border border-[var(--color-tiktok-orange)]/30 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle
            className="text-[var(--color-tiktok-orange)] shrink-0 mt-0.5"
            size={20}
          />
          <div>
            <h3 className="text-[var(--color-tiktok-orange)] font-bold text-sm mb-1">
              期限間近のアイテムがあります
            </h3>
            <p className="text-xs text-[var(--color-tiktok-text-sub)]">
              24時間以内に {expiringGloves.length}{" "}
              個のアイテムが期限切れになります。
            </p>
          </div>
        </div>
      )}

      {/* Status filter bar */}
      <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide pb-1">
        {(["active", "expiring", "all"] as StatusFilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={cn(
              "btn-ghost whitespace-nowrap",
              statusFilter === f && "active",
            )}
          >
            {f === "active" && "有効のみ"}
            {f === "expiring" && "期限間近"}
            {f === "all" && "全ステータス"}
          </button>
        ))}
      </div>

      {/* Item filter chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => setItemFilter("all")}
          className={cn(
            "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border",
            itemFilter === "all"
              ? "bg-[var(--color-tiktok-input)] text-white border-white/20"
              : "text-[var(--color-tiktok-text-sub)] border-transparent hover:text-white",
          )}
        >
          すべて
        </button>
        {(["glove", "song_rush"] as ItemType[]).map((type) => {
          const cfg = ITEM_CONFIGS[type];
          const isSelected = itemFilter === type;
          return (
            <button
              key={type}
              onClick={() => setItemFilter(type)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5",
                isSelected
                  ? type === "glove"
                    ? "bg-[var(--color-tiktok-pink)]/20 text-[var(--color-tiktok-pink)] border-[var(--color-tiktok-pink)]"
                    : "bg-[var(--color-tiktok-cyan)]/20 text-[var(--color-tiktok-cyan)] border-[var(--color-tiktok-cyan)]"
                  : "text-[var(--color-tiktok-text-sub)] border-transparent hover:text-white",
              )}
            >
              <span>{cfg.icon}</span>
              <span>{cfg.name}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filteredGloves.length > 0 ? (
          filteredGloves.map((glove) => (
            <GloveCard
              key={glove.id}
              glove={glove}
              onUse={(id) => updateGloveStatus(id, "used")}
            />
          ))
        ) : (
          <div className="text-center py-12 text-[var(--color-tiktok-text-sub)]">
            <div className="text-4xl mb-3">📦</div>
            <p>アイテムがありません</p>
          </div>
        )}
      </div>
    </div>
  );
}

