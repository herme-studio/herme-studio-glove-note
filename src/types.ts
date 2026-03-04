export interface Glove {
  id: string;
  listener_name: string;
  acquired_at: string;
  expires_at: string;
  status: "active" | "used" | "expired";
  used_at: string | null;
}
