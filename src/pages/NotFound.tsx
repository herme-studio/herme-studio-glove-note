import { useNavigate } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in duration-300 px-4">
      <div className="w-20 h-20 rounded-full bg-[var(--color-tiktok-input)] flex items-center justify-center mb-6">
        <AlertCircle size={40} className="text-[var(--color-tiktok-text-sub)]" />
      </div>
      <h1 className="text-4xl font-bold mb-2 font-mono">404</h1>
      <h2 className="text-xl font-bold mb-4">ページが見つかりません</h2>
      <p className="text-[var(--color-tiktok-text-sub)] text-sm mb-8 max-w-[280px] leading-relaxed">
        お探しのページは削除されたか、URLが間違っている可能性があります。
      </p>
      <button
        onClick={() => navigate("/")}
        className="btn-primary flex items-center gap-2"
      >
        <Home size={20} />
        ホームに戻る
      </button>
    </div>
  );
}
