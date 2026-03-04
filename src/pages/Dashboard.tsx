import { useState } from "react";
import { useGloves } from "../hooks/useGloves";
import { GloveCard } from "../components/GloveCard";
import { AlertTriangle } from "lucide-react";
import { differenceInHours, parseISO, isAfter } from "date-fns";
import { cn } from "../lib/utils";

type FilterType = "active" | "expiring" | "all";

export function Dashboard() {
  const { gloves, updateGloveStatus } = useGloves();
  const [filter, setFilter] = useState<FilterType>("active");

  const activeGloves = gloves.filter((g) => g.status === "active");
  const expiringGloves = activeGloves.filter((g) => {
    const expiresAt = parseISO(g.expires_at);
    const now = new Date();
    return isAfter(expiresAt, now) && differenceInHours(expiresAt, now) <= 24;
  });

  const filteredGloves = gloves
    .filter((g) => {
      if (filter === "active") return g.status === "active";
      if (filter === "expiring") {
        const expiresAt = parseISO(g.expires_at);
        const now = new Date();
        return (
          g.status === "active" &&
          isAfter(expiresAt, now) &&
          differenceInHours(expiresAt, now) <= 24
        );
      }
      return true; // all
    })
    .sort(
      (a, b) =>
        new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime(),
    );

  return (
    <div className="animate-in fade-in duration-300">
      <header className="mb-8 mt-4">
        <h1 className="text-sm text-[var(--color-tiktok-text-sub)] font-medium mb-1">
          有効なグローブ
        </h1>
        <div className="text-5xl font-mono font-bold text-[var(--color-tiktok-cyan)]">
          {activeGloves.length}
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
              期限間近のグローブがあります
            </h3>
            <p className="text-xs text-[var(--color-tiktok-text-sub)]">
              24時間以内に {expiringGloves.length}{" "}
              個のグローブが期限切れになります。
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
        {(["active", "expiring", "all"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "btn-ghost whitespace-nowrap",
              filter === f && "active",
            )}
          >
            {f === "active" && "有効のみ"}
            {f === "expiring" && "期限間近"}
            {f === "all" && "すべて"}
          </button>
        ))}
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
            <div className="text-4xl mb-3">🥊</div>
            <p>グローブがありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
