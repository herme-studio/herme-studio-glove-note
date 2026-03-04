import { useState, useEffect } from "react";
import { Glove } from "../types";
import { isAfter, parseISO } from "date-fns";

const STORAGE_KEY = "tiktok_gloves_data";

export function useGloves() {
  const [gloves, setGloves] = useState<Glove[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored gloves", e);
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever gloves change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gloves));
  }, [gloves]);

  // Expiration check logic
  useEffect(() => {
    const checkExpirations = () => {
      const now = new Date();
      let updated = false;
      const newGloves = gloves.map((glove) => {
        if (
          glove.status === "active" &&
          isAfter(now, parseISO(glove.expires_at))
        ) {
          updated = true;
          return { ...glove, status: "expired" as const };
        }
        return glove;
      });

      if (updated) {
        setGloves(newGloves);
      }
    };

    checkExpirations(); // Check on mount
    const interval = setInterval(checkExpirations, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [gloves]);

  const addGlove = (glove: Glove) => {
    setGloves((prev) => [...prev, glove]);
  };

  const updateGloveStatus = (id: string, status: Glove["status"]) => {
    setGloves((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              status,
              used_at: status === "used" ? new Date().toISOString() : g.used_at,
            }
          : g,
      ),
    );
  };

  const deleteListenerData = (listenerName: string) => {
    setGloves((prev) => prev.filter((g) => g.listener_name !== listenerName));
  };

  return {
    gloves,
    addGlove,
    updateGloveStatus,
    deleteListenerData,
  };
}
