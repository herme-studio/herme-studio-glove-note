import { useState, useMemo, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { addHours, format } from "date-fns";
import { useGloves } from "../hooks/useGloves";
import { Glove, ItemType, ITEM_CONFIGS } from "../types";
import { cn } from "../lib/utils";

export function AddGlove() {
  const navigate = useNavigate();
  const { gloves, addGlove } = useGloves();

  const [itemType, setItemType] = useState<ItemType>("glove");
  const [listenerName, setListenerName] = useState("");
  const [acquiredAt, setAcquiredAt] = useState(() => {
    // Current time formatted for datetime-local input
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });

  // Calculate expiration (120 hours / 5 days later)
  const expiresAt = useMemo(() => {
    if (!acquiredAt) return null;
    try {
      const date = new Date(acquiredAt);
      return addHours(date, 120);
    } catch {
      return null;
    }
  }, [acquiredAt]);

  // Get unique listener names for autocomplete
  const uniqueListeners = useMemo(() => {
    const names = new Set(gloves.map((g) => g.listener_name));
    return Array.from(names);
  }, [gloves]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!listenerName.trim() || !acquiredAt || !expiresAt) return;

    const newGlove: Glove = {
      id: uuidv4(),
      type: itemType,
      listener_name: listenerName.trim(),
      acquired_at: new Date(acquiredAt).toISOString(),
      expires_at: expiresAt.toISOString(),
      status: "active",
      used_at: null,
    };

    addGlove(newGlove);
    navigate("/");
  };

  const currentItemConfig = ITEM_CONFIGS[itemType];

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-300">
      <header className="mb-6 mt-4">
        <h1 className="text-2xl font-bold">アイテム追加</h1>
        <p className="text-[var(--color-tiktok-text-sub)] text-sm mt-1">
          グローブまたはソングラッシュを登録します
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[var(--color-tiktok-text-sub)] mb-2">
            アイテム種別
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-[var(--color-tiktok-input)] rounded-2xl border border-[var(--color-tiktok-border)]">
            {(["glove", "song_rush"] as ItemType[]).map((type) => {
              const cfg = ITEM_CONFIGS[type];
              const isSelected = itemType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setItemType(type)}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all",
                    isSelected
                      ? type === "glove"
                        ? "bg-[var(--color-tiktok-pink)] text-white shadow-[0_0_15px_rgba(254,44,85,0.4)]"
                        : "bg-[var(--color-tiktok-cyan)] text-black shadow-[0_0_15px_rgba(37,244,238,0.4)]"
                      : "text-[var(--color-tiktok-text-sub)] hover:text-white hover:bg-[var(--color-tiktok-card)]/50",
                  )}
                >
                  <span className="text-lg">{cfg.icon}</span>
                  <span>{cfg.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-tiktok-text-sub)] mb-2">
            リスナー名
          </label>
          <input
            type="text"
            value={listenerName}
            onChange={(e) => setListenerName(e.target.value)}
            className="input-field"
            placeholder="リスナー名を入力"
            list="listener-suggestions"
            required
          />
          <datalist id="listener-suggestions">
            {uniqueListeners.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-tiktok-text-sub)] mb-2">
            獲得日時
          </label>
          <input
            type="datetime-local"
            value={acquiredAt}
            onChange={(e) => setAcquiredAt(e.target.value)}
            className="input-field"
            required
          />
        </div>

        {expiresAt && (
          <div className="card bg-[var(--color-tiktok-bg)] border-dashed">
            <div className="text-sm text-[var(--color-tiktok-text-sub)] mb-1">
              有効期限 (120時間後)
            </div>
            <div className="font-mono text-[var(--color-tiktok-cyan)] font-bold text-lg">
              {format(expiresAt, "yyyy/MM/dd HH:mm")}
            </div>
          </div>
        )}

        <button
          type="submit"
          className={cn(
            "w-full mt-8 py-3 px-6 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg",
            itemType === "glove"
              ? "bg-[var(--color-tiktok-pink)] shadow-[0_0_20px_rgba(254,44,85,0.3)] active:shadow-[0_0_30px_rgba(254,44,85,0.5)]"
              : "bg-gradient-to-r from-[var(--color-tiktok-cyan)] to-[var(--color-tiktok-pink)] text-white shadow-[0_0_20px_rgba(37,244,238,0.3)]",
          )}
        >
          {currentItemConfig.name}を登録する
        </button>
      </form>
    </div>
  );
}

