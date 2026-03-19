/**
 * Capacitor Plugin Accessor — avoids ES imports of @capacitor/* packages
 * which would fail Vite's import resolution when packages aren't installed.
 *
 * Capacitor registers all plugins on `window.Capacitor.Plugins` at runtime.
 * This module provides typed accessors that return null when not available.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

function getPlugin(name: string): any | null {
  try {
    return (window as any)?.Capacitor?.Plugins?.[name] ?? null;
  } catch {
    return null;
  }
}

/** @capacitor/camera */
export function getCameraPlugin(): any | null {
  return getPlugin("Camera");
}

/** @capacitor/geolocation */
export function getGeolocationPlugin(): any | null {
  return getPlugin("Geolocation");
}

/** @capacitor/push-notifications */
export function getPushNotificationsPlugin(): any | null {
  return getPlugin("PushNotifications");
}

/** @capacitor/status-bar */
export function getStatusBarPlugin(): any | null {
  return getPlugin("StatusBar");
}

/** @capacitor/haptics */
export function getHapticsPlugin(): any | null {
  return getPlugin("Haptics");
}

/** @capacitor/app */
export function getAppPlugin(): any | null {
  return getPlugin("App");
}

/** capacitor-native-biometric */
export function getNativeBiometricPlugin(): any | null {
  return getPlugin("NativeBiometric");
}

/** @capacitor/network */
export function getNetworkPlugin(): any | null {
  return getPlugin("Network");
}
