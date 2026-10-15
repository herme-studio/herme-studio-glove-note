export type ItemType = "glove" | "song_rush";

export interface ItemConfig {
  type: ItemType;
  name: string;
  icon: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

export const ITEM_CONFIGS: Record<ItemType, ItemConfig> = {
  glove: {
    type: "glove",
    name: "グローブ",
    icon: "🥊",
    color: "var(--color-tiktok-pink)",
    badgeBg: "rgba(254, 44, 85, 0.15)",
    badgeText: "var(--color-tiktok-pink)",
  },
  song_rush: {
    type: "song_rush",
    name: "ソングラッシュ",
    icon: "🎵",
    color: "var(--color-tiktok-cyan)",
    badgeBg: "rgba(37, 244, 238, 0.15)",
    badgeText: "var(--color-tiktok-cyan)",
  },
};

export interface Glove {
  id: string;
  type?: ItemType; // undefined defaults to 'glove'
  listener_name: string;
  acquired_at: string;
  expires_at: string;
  status: "active" | "used" | "expired";
  used_at: string | null;
}

