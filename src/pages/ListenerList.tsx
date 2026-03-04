import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useGloves } from "../hooks/useGloves";
import { ChevronRight, AlertCircle, Users } from "lucide-react";
import { cn } from "../lib/utils";

export function ListenerList() {
  const { gloves } = useGloves();
  const navigate = useNavigate();
  const [headerActionsContainer, setHeaderActionsContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setHeaderActionsContainer(document.getElementById('header-actions'));
  }, []);

  const listenerStats = useMemo(() => {
    const stats: Record<
      string,
      { total: number; active: number; used: number; expired: number }
    > = {};

    gloves.forEach((glove) => {
      if (!stats[glove.listener_name]) {
        stats[glove.listener_name] = {
          total: 0,
          active: 0,
          used: 0,
          expired: 0,
        };
      }
      stats[glove.listener_name].total += 1;
      stats[glove.listener_name][glove.status] += 1;
    });

    return Object.entries(stats)
      .map(([name, data]) => {
        const usageBase = data.used + data.expired;
        const usageRate =
          usageBase > 0 ? Math.round((data.used / usageBase) * 100) : 0;

        return {
          name,
          ...data,
          usageRate,
          hasUsageData: usageBase > 0,
        };
      })
      .sort((a, b) => b.total - a.total); // Sort by total descending
  }, [gloves]);

  return (
    <div className="animate-in fade-in duration-300">
      <header className="mb-6 mt-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">リスナー一覧</h1>
          <p className="text-[var(--color-tiktok-text-sub)] text-sm mt-1">
            獲得数と使用率の統計
          </p>
        </div>
      </header>

      <div className="space-y-3">
        {listenerStats.length > 0 ? (
          listenerStats.map((stat) => (
            <div
              key={stat.name}
              onClick={() =>
                navigate(`/listeners/${encodeURIComponent(stat.name)}`)
              }
              className="card cursor-pointer hover:bg-[var(--color-tiktok-input)] transition-colors"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg truncate pr-4">{stat.name}</h3>
                <ChevronRight
                  size={20}
                  className="text-[var(--color-tiktok-text-sub)] shrink-0"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[var(--color-tiktok-bg)] rounded-lg p-2">
                  <div className="text-[10px] text-[var(--color-tiktok-text-sub)] mb-1">
                    有効
                  </div>
                  <div className="font-mono font-bold text-[var(--color-tiktok-green)]">
                    {stat.active}
                  </div>
                </div>
                <div className="bg-[var(--color-tiktok-bg)] rounded-lg p-2">
                  <div className="text-[10px] text-[var(--color-tiktok-text-sub)] mb-1">
                    使用済
                  </div>
                  <div className="font-mono font-bold text-white">
                    {stat.used}
                  </div>
                </div>
                <div className="bg-[var(--color-tiktok-bg)] rounded-lg p-2 relative">
                  <div className="text-[10px] text-[var(--color-tiktok-text-sub)] mb-1">
                    使用率
                  </div>
                  <div
                    className={cn(
                      "font-mono font-bold flex items-center justify-center gap-1",
                      !stat.hasUsageData
                        ? "text-[var(--color-tiktok-text-muted)]"
                        : stat.usageRate >= 80
                          ? "text-[var(--color-tiktok-green)]"
                          : stat.usageRate >= 50
                            ? "text-[var(--color-tiktok-orange)]"
                            : "text-[var(--color-tiktok-red)]",
                    )}
                  >
                    {stat.hasUsageData ? `${stat.usageRate}%` : "-"}
                    {stat.hasUsageData && stat.usageRate < 50 && (
                      <AlertCircle
                        size={12}
                        className="text-[var(--color-tiktok-red)]"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-[var(--color-tiktok-text-sub)]">
            <Users size={48} className="mx-auto mb-3 opacity-20" />
            <p>リスナーデータがありません</p>
          </div>
        )}
      </div>
    </div>
  );
}


