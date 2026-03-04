import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useGloves } from "../hooks/useGloves";
import { ArrowLeft, Trash2, CheckCircle2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "../lib/utils";

export function ListenerDetail() {
  const { name } = useParams<{ name: string }>();
  const decodedName = decodeURIComponent(name || "");
  const navigate = useNavigate();
  const { gloves, updateGloveStatus, deleteListenerData } = useGloves();
  const [headerActionsContainer, setHeaderActionsContainer] = useState<HTMLElement | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setHeaderActionsContainer(document.getElementById('header-actions'));
  }, []);

  const listenerGloves = gloves
    .filter((g) => g.listener_name === decodedName)
    .sort(
      (a, b) =>
        new Date(b.acquired_at).getTime() - new Date(a.acquired_at).getTime(),
    );

  if (listenerGloves.length === 0) {
    return (
      <div className="p-4 text-center">
        <p>データが見つかりません</p>
        <button
          onClick={() => navigate("/listeners")}
          className="btn-secondary mt-4"
        >
          戻る
        </button>
      </div>
    );
  }

  const stats = listenerGloves.reduce(
    (acc, glove) => {
      acc.total++;
      acc[glove.status]++;
      return acc;
    },
    { total: 0, active: 0, used: 0, expired: 0 },
  );

  const usageBase = stats.used + stats.expired;
  const usageRate =
    usageBase > 0 ? Math.round((stats.used / usageBase) * 100) : 0;

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteListenerData(decodedName);
    navigate("/listeners");
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      {headerActionsContainer && createPortal(
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/listeners")}
            className="p-2 text-[var(--color-tiktok-text-sub)]"
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-[var(--color-tiktok-red)]"
          >
            <Trash2 size={24} />
          </button>
        </div>,
        headerActionsContainer
      )}

      <h1 className="text-3xl font-bold mb-6 mt-4 break-words">{decodedName}</h1>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[var(--color-tiktok-card)] rounded-2xl p-6 w-full max-w-sm border border-[var(--color-tiktok-border)] shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-2">データを削除しますか？</h3>
            <p className="text-[var(--color-tiktok-text-sub)] text-sm mb-6">
              {decodedName} の全データを削除します。この操作は取り消せません。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl font-bold bg-[var(--color-tiktok-input)] text-white active:scale-95 transition-transform"
              >
                キャンセル
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl font-bold bg-[var(--color-tiktok-red)] text-white active:scale-95 transition-transform"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-sm text-[var(--color-tiktok-text-sub)] mb-2">
            累計獲得数
          </div>
          <div className="text-4xl font-mono font-bold">{stats.total}</div>
        </div>
        <div className="card text-center">
          <div className="text-sm text-[var(--color-tiktok-text-sub)] mb-2">
            使用率
          </div>
          <div
            className={cn(
              "text-4xl font-mono font-bold",
              usageBase === 0
                ? "text-[var(--color-tiktok-text-muted)]"
                : usageRate >= 80
                  ? "text-[var(--color-tiktok-green)]"
                  : usageRate >= 50
                    ? "text-[var(--color-tiktok-orange)]"
                    : "text-[var(--color-tiktok-red)]",
            )}
          >
            {usageBase > 0 ? `${usageRate}%` : "-"}
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4">履歴</h2>
      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--color-tiktok-border)] before:to-transparent">
        {listenerGloves.map((glove) => (
          <div
            key={glove.id}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--color-tiktok-bg)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow",
                glove.status === "active"
                  ? "bg-[var(--color-tiktok-green)]"
                  : glove.status === "used"
                    ? "bg-[var(--color-tiktok-text-muted)]"
                    : "bg-[var(--color-tiktok-red)]",
              )}
            >
              <span className="text-xs">🥊</span>
            </div>

            <div className="card w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0 p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-mono text-[var(--color-tiktok-text-sub)]">
                  {format(parseISO(glove.acquired_at), "yyyy/MM/dd HH:mm")}
                </div>
                <span
                  className={cn(
                    "badge",
                    glove.status === "active"
                      ? "bg-[var(--color-tiktok-green)]/20 text-[var(--color-tiktok-green)]"
                      : glove.status === "used"
                        ? "bg-[var(--color-tiktok-input)] text-[var(--color-tiktok-text-sub)]"
                        : "bg-[var(--color-tiktok-red)]/20 text-[var(--color-tiktok-red)]",
                  )}
                >
                  {glove.status === "active"
                    ? "有効"
                    : glove.status === "used"
                      ? "使用済"
                      : "期限切れ"}
                </span>
              </div>

              {glove.status === "active" && (
                <button
                  onClick={() => updateGloveStatus(glove.id, "used")}
                  className="mt-3 w-full py-2 rounded-lg bg-[var(--color-tiktok-input)] text-white text-sm font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <CheckCircle2
                    size={16}
                    className="text-[var(--color-tiktok-green)]"
                  />
                  使用済みにする
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
