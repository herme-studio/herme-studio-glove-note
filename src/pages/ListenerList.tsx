import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGloves } from "../hooks/useGloves";
import { ChevronRight, AlertCircle, Users } from "lucide-react";
import { cn } from "../lib/utils";

export function ListenerList() {
  const { gloves } = useGloves();
  const navigate = useNavigate();

  const listenerStats = useMemo(() => {
    const stats: Record<
      string,
      {
        total: number;
        active: number;
        activeGloves: number;
        activeSongRush: number;
        totalGloves: number;
        totalSongRush: number;
        used: number;
        expired: number;
      }
    > = {};

    gloves.forEach((glove) => {
      const itemType = glove.type || "glove";
      if (!stats[glove.listener_name]) {
        stats[glove.listener_name] = {
          total: 0,
          active: 0,
          activeGloves: 0,
          activeSongRush: 0,
          totalGloves: 0,
          totalSongRush: 0,
          used: 0,
          expired: 0,
        };
      }
      stats[glove.listener_name].total += 1;
      if (itemType === "glove") {
        stats[glove.listener_name].totalGloves += 1;
        if (glove.status === "active") stats[glove.listener_name].activeGloves += 1;
      } else {
        stats[glove.listener_name].totalSongRush += 1;
        if (glove.status === "active") stats[glove.listener_name].activeSongRush += 1;
      }

      if (glove.status === "active") stats[glove.listener_name].active += 1;
      if (glove.status === "used") stats[glove.listener_name].used += 1;
      if (glove.status === "expired") stats[glove.listener_name].expired += 1;
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
      <header className="mb-6 mt-4">
        <h1 className="text-2xl font-bold">リスナー一覧</h1>
        <p className="text-[var(--color-tiktok-text-sub)] text-sm mt-1">
          所持アイテム数と使用率の統計
        </p>
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
                <div className="flex items-center gap-2 truncate pr-2">
                  <h3 className="font-bold text-lg truncate">{stat.name}</h3>
                  <span className="text-xs text-[var(--color-tiktok-text-muted)] font-mono">
                    計{stat.total}個
                  </span>
                </div>
                <ChevronRight
                  size={20}
                  className="text-[var(--color-tiktok-text-sub)] shrink-0"
                />
              </div>

              {/* Multi-item breakdown tags */}
              <div className="flex items-center gap-2 mb-3 text-xs">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[rgba(254,44,85,0.12)] text-[var(--color-tiktok-pink)] font-mono">
                  <span>🥊</span>
                  <span>有効 {stat.activeGloves}</span>
                  <span className="text-[10px] text-[var(--color-tiktok-text-muted)]">
                    / 累計{stat.totalGloves}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[rgba(37,244,238,0.12)] text-[var(--color-tiktok-cyan)] font-mono">
                  <span>🎵</span>
                  <span>有効 {stat.activeSongRush}</span>
                  <span className="text-[10px] text-[var(--color-tiktok-text-muted)]">
                    / 累計{stat.totalSongRush}
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[var(--color-tiktok-bg)] rounded-lg p-2">
                  <div className="text-[10px] text-[var(--color-tiktok-text-sub)] mb-1">
                    有効総数
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



