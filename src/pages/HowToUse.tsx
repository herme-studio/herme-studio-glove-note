import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function HowToUse() {
  useEffect(() => {
    localStorage.setItem('hasSeenHowToUse', 'true');
  }, []);

  return (
    <div className="animate-in slide-in-from-right-4 duration-300 pb-8">
      <h1 className="text-2xl font-bold mb-6 mt-4">使い方・ご注意</h1>

      <div className="space-y-4">
        {/* Section 1 */}
        <section className="bg-[var(--color-tiktok-card)] border border-[var(--color-tiktok-border)] rounded-[16px] p-5 shadow-sm">
          <h2 className="text-lg font-bold mb-3">グローブNoteとは</h2>
          <p className="text-[14px] leading-[1.8] text-[#E0E0E0]">
            グローブNoteは、TikTok LIVEのバトルで<br />
            リスナーが獲得したグローブを記録・管理するアプリです。<br />
            <br />
            ・誰がグローブを持っているか<br />
            ・いつ期限が切れるか<br />
            ・ちゃんと使ってくれたか<br />
            <br />
            をひと目で確認できます。
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-[var(--color-tiktok-card)] border border-[var(--color-tiktok-border)] rounded-[16px] p-5 shadow-sm">
          <h2 className="text-lg font-bold mb-3">基本の使い方</h2>
          <div className="text-[14px] leading-[1.8] text-[#E0E0E0] space-y-4">
            <div>
              <div className="font-bold text-white mb-1">① 記録する</div>
              <p className="pl-4">
                下のタブバー中央の「＋」ボタンから<br />
                リスナー名とグローブ獲得日時を入力
              </p>
            </div>
            <div>
              <div className="font-bold text-white mb-1">② 確認する</div>
              <p className="pl-4">
                ダッシュボードで有効なグローブを一覧表示<br />
                期限が近いものは自動でハイライト表示されます
              </p>
            </div>
            <div>
              <div className="font-bold text-white mb-1">③ 使用済みにする</div>
              <p className="pl-4">
                グローブをタップして「使用済み」に変更<br />
                期限切れのものは自動で「期限切れ」になります
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-[rgba(255,107,53,0.08)] rounded-[16px] p-5 border border-[rgba(255,107,53,0.2)] border-l-[4px] border-l-[#FF6B35] shadow-sm">
          <h2 className="text-lg font-bold mb-3 text-[#FF6B35]">⚠️ データに関する大事な注意</h2>
          <div className="text-[14px] leading-[1.8] text-[#E0E0E0]">
            <p className="mb-4">
              このアプリのデータは、あなたのスマホのブラウザに保存されています。<br />
              以下の操作をするとデータが消えてしまいます。
            </p>
            
            <div className="mb-4">
              <div className="font-bold text-white mb-2">🔴 データが消えること</div>
              <ul className="pl-2 space-y-2">
                <li>・ブラウザの「履歴」や「サイトデータ」を削除する</li>
                <li>・ブラウザの「キャッシュとCookieの削除」を実行する</li>
                <li>・ブラウザアプリをアンインストール（削除）する</li>
                <li>・スマホを初期化（リセット）する</li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-white mb-2">🟢 データが消えないこと</div>
              <ul className="pl-2 space-y-2">
                <li>・ブラウザを閉じる → 消えません</li>
                <li>・スマホの電源を切る → 消えません</li>
                <li>・アプリが更新される → 消えません</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-[var(--color-tiktok-card)] border border-[var(--color-tiktok-border)] rounded-[16px] p-5 shadow-sm">
          <h2 className="text-lg font-bold mb-3">📱 機種変やブラウザ変更について</h2>
          <div className="text-[14px] leading-[1.8] text-[#E0E0E0]">
            <p className="mb-4">
              データはお使いのスマホの、お使いのブラウザにだけ保存されています。
            </p>
            <ul className="pl-2 space-y-2 mb-4">
              <li>・別のスマホからは見えません</li>
              <li>・同じスマホでも別のブラウザ（Chrome → Safari等）では見えません</li>
            </ul>
            <p>
              機種変する場合は、データの引き継ぎができないため<br />
              事前にご注意ください。
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="bg-[var(--color-tiktok-card)] border border-[var(--color-tiktok-border)] rounded-[16px] p-5 shadow-sm">
          <h2 className="text-lg font-bold mb-3">📊 使用率って何？</h2>
          <div className="text-[14px] leading-[1.8] text-[#E0E0E0]">
            <p className="mb-4">
              リスナーがグローブをちゃんと使ってくれた割合です。
            </p>
            <p className="mb-4 font-mono bg-[#0F0F0F] p-2 rounded text-center">
              使用率 ＝ 使用済み ÷（使用済み ＋ 期限切れ）
            </p>
            <ul className="pl-2 space-y-2 mb-4">
              <li>・100% → 全部使ってくれてる！理想的 🎉</li>
              <li>・低い → もったいない！声掛けしてみよう</li>
            </ul>
            <p className="text-[12px] text-[#AAAAAA]">
              ※ まだ有効期限内のグローブは計算に含みません
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
