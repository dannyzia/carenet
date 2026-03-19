/**
 * Biometric authentication abstraction — uses capacitor-native-biometric on native
 * (via global plugin registry), hidden/unavailable on web.
 * Reference: D008 §12.8
 */

import { isNative } from "./platform";
import { getNativeBiometricPlugin } from "./capacitor-plugins";

export type BiometricType = "fingerprint" | "face" | "iris" | "none";

export interface BiometricAvailability {
  available: boolean;
  type: BiometricType;
}

export async function isBiometricAvailable(): Promise<BiometricAvailability> {
  if (!isNative()) return { available: false, type: "none" };

  const NativeBiometric = getNativeBiometricPlugin();
  if (!NativeBiometric) return { available: false, type: "none" };

  try {
    const result = await NativeBiometric.isAvailable();
    return { available: result.isAvailable, type: mapBiometricType(result.biometryType) };
  } catch {
    return { available: false, type: "none" };
  }
}

export async function verifyBiometric(reason: string = "Verify your identity"): Promise<boolean> {
  if (!isNative()) return false;

  const NativeBiometric = getNativeBiometricPlugin();
  if (!NativeBiometric) return false;

  try {
    await NativeBiometric.verifyIdentity({
      reason,
      title: "CareNet Authentication",
      subtitle: reason,
      description: "Place your finger on the sensor or look at the camera",
    });
    return true;
  } catch {
    return false;
  }
}

export async function storeCredentials(server: string, username: string, password: string): Promise<boolean> {
  if (!isNative()) return false;
  const NativeBiometric = getNativeBiometricPlugin();
  if (!NativeBiometric) return false;

  try {
    await NativeBiometric.setCredentials({ server, username, password });
    return true;
  } catch {
    return false;
  }
}

export async function getCredentials(server: string): Promise<{ username: string; password: string } | null> {
  if (!isNative()) return null;
  const NativeBiometric = getNativeBiometricPlugin();
  if (!NativeBiometric) return null;

  try {
    const creds = await NativeBiometric.getCredentials({ server });
    return { username: creds.username, password: creds.password };
  } catch {
    return null;
  }
}

function mapBiometricType(type: number): BiometricType {
  switch (type) {
    case 1: return "fingerprint";
    case 2: return "face";
    case 3: return "iris";
    default: return "none";
  }
}
