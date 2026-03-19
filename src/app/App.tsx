import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "@/frontend/components/shared/ThemeProvider";
import { AuthProvider } from "@/backend/store/auth/AuthContext";
import { registerBackButton, unregisterBackButton } from "@/frontend/native/backButton";
import { Toaster } from "sonner";
import { startDemoSimulation, stopDemoSimulation } from "@/backend/services/realtime";

// Initialize i18n — must be imported before any component that uses useTranslation
import "@/frontend/i18n";

// Force clean rebuild v5
export default function App() {
  // Register Android hardware back button handler (no-op on web/iOS)
  useEffect(() => {
    registerBackButton();
    return unregisterBackButton;
  }, []);

  // Start demo real-time simulation in mock mode
  useEffect(() => {
    startDemoSimulation();
    return stopDemoSimulation;
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} fallbackElement={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" /></div>} />
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: { fontSize: "13px" },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}