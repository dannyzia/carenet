import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

/** App-level state managed outside auth */
interface AppState {
  /** Current language code (e.g., "en", "bn") */
  language: string;
  /** Whether the user is currently online */
  isOnline: boolean;
  /** Number of pending offline sync actions */
  pendingSyncCount: number;
  /** Whether the global search drawer is open */
  searchOpen: boolean;
}

interface AppContextType extends AppState {
  setLanguage: (lang: string) => void;
  setOnline: (online: boolean) => void;
  setPendingSyncCount: (count: number) => void;
  toggleSearch: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const LANG_KEY = "carenet-lang";

function loadLanguage(): string {
  try {
    return localStorage.getItem(LANG_KEY) || "en";
  } catch {
    return "en";
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLangState] = useState(loadLanguage);
  const [isOnline, setOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);

  const setLanguage = useCallback((lang: string) => {
    setLangState(lang);
    try { localStorage.setItem(LANG_KEY, lang); } catch {}
  }, []);

  const toggleSearch = useCallback(() => {
    setSearchOpen((prev) => !prev);
  }, []);

  // Listen for online/offline events
  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        isOnline,
        pendingSyncCount,
        searchOpen,
        setLanguage,
        setOnline,
        setPendingSyncCount,
        toggleSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
