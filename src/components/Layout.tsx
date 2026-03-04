import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Home, Plus, Users, HelpCircle, ArrowLeft } from "lucide-react";
import { cn } from "../lib/utils";
import { useEffect } from "react";

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasSeenHowToUse = localStorage.getItem('hasSeenHowToUse');
    if (!hasSeenHowToUse && location.pathname === '/') {
      navigate('/how-to-use');
    }
  }, [navigate, location.pathname]);

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-[100] bg-[#0F0F0F] border-b border-[#252525] px-4 py-2.5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {location.pathname === '/how-to-use' && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-[#AAAAAA] hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <div className="flex flex-col leading-[1.2]">
            <div>
              <span
                style={{ fontFamily: "'Noto Sans JP'" }}
                className="text-[#FFFFFF] font-bold text-[20px]"
              >
                グローブ
              </span>
              <span
                style={{ fontFamily: "'TikTok Sans'" }}
                className="text-[#FE2C55] font-bold text-[20px]"
              >
                Note
              </span>
            </div>
            <a
              href="https://www.tiktok.com/@suguru2026"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "'Noto Sans JP'" }}
              className="text-[#666666] text-[11px] mt-[2px] tracking-[0.3px] hover:text-[#FE2C55] transition-colors"
            >
              すぐにぃ@ココ🐱🍙🌸推し
            </a>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div id="header-actions"></div>
          {location.pathname !== '/how-to-use' && (
            <NavLink
              to="/how-to-use"
              className="p-2 text-[#AAAAAA] hover:text-white transition-colors"
            >
              <HelpCircle size={24} />
            </NavLink>
          )}
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-tiktok-bg)] border-t border-[var(--color-tiktok-border)] px-6 py-3 pb-safe">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive ? "text-white" : "text-[var(--color-tiktok-text-sub)]",
              )
            }
          >
            <Home size={24} />
            <span className="text-[10px] font-medium">Home</span>
          </NavLink>

          <NavLink
            to="/add"
            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[var(--color-tiktok-cyan)] to-[var(--color-tiktok-pink)] text-white shadow-lg active:scale-95 transition-transform -mt-6"
          >
            <Plus size={28} strokeWidth={3} />
          </NavLink>

          <NavLink
            to="/listeners"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive ? "text-white" : "text-[var(--color-tiktok-text-sub)]",
              )
            }
          >
            <Users size={24} />
            <span className="text-[10px] font-medium">Listeners</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
