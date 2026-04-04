"use client";

import { useState, useEffect } from "react";

export type ReadingDirection = "Vertical" | "Single";
export type ImageFit = "Width" | "Height";

interface ReaderSettings {
  readingDirection: ReadingDirection;
  imageFit: ImageFit;
}

const DEFAULT_SETTINGS: ReaderSettings = {
  readingDirection: "Vertical",
  imageFit: "Width",
};

export function useReaderSettings() {
  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("manga_vault_reader_settings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse reader settings from local storage");
      }
    }
    setIsLoaded(true);
  }, []);

  const updateSettings = (newSettings: Partial<ReaderSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem("manga_vault_reader_settings", JSON.stringify(updated));
      return updated;
    });
  };

  return { settings, updateSettings, isLoaded };
}
