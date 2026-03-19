/**
 * Geolocation abstraction — uses @capacitor/geolocation on native (via global registry),
 * falls back to navigator.geolocation on web.
 * Reference: D008 §12.5
 */

import { isNative } from "./platform";
import { getGeolocationPlugin } from "./capacitor-plugins";

export interface Position {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export async function getCurrentPosition(): Promise<Position | null> {
  if (isNative()) {
    return getPositionNative();
  }
  return getPositionWeb();
}

export function watchPosition(
  callback: (pos: Position) => void,
  errorCallback?: (err: Error) => void
): () => void {
  if (isNative()) {
    return watchPositionNative(callback, errorCallback);
  }
  return watchPositionWeb(callback, errorCallback);
}

/** Haversine distance between two GPS coordinates in meters. */
export function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// ─── Native ───

async function getPositionNative(): Promise<Position | null> {
  try {
    const Geolocation = getGeolocationPlugin();
    if (!Geolocation) return getPositionWeb();

    const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
    return {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      timestamp: pos.timestamp,
    };
  } catch (err) {
    console.warn("[Geolocation] Native failed, falling back to web:", err);
    return getPositionWeb();
  }
}

function watchPositionNative(
  callback: (pos: Position) => void,
  errorCallback?: (err: Error) => void
): () => void {
  const Geolocation = getGeolocationPlugin();
  if (!Geolocation) return watchPositionWeb(callback, errorCallback);

  let watchId: string | null = null;

  Geolocation.watchPosition(
    { enableHighAccuracy: true },
    (position: any, err: any) => {
      if (err) { errorCallback?.(new Error(err.message)); return; }
      if (position) {
        callback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      }
    }
  ).then((id: string) => { watchId = id; });

  return () => {
    if (watchId && Geolocation) {
      Geolocation.clearWatch({ id: watchId });
    }
  };
}

// ─── Web Fallback ───

function getPositionWeb(): Promise<Position | null> {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) { resolve(null); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp,
      }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

function watchPositionWeb(
  callback: (pos: Position) => void,
  errorCallback?: (err: Error) => void
): () => void {
  if (!("geolocation" in navigator)) return () => {};
  const id = navigator.geolocation.watchPosition(
    (pos) => callback({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      timestamp: pos.timestamp,
    }),
    (err) => errorCallback?.(new Error(err.message)),
    { enableHighAccuracy: true }
  );
  return () => navigator.geolocation.clearWatch(id);
}
