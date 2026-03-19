/**
 * Camera abstraction — uses @capacitor/camera on native (via global plugin registry),
 * falls back to <input type="file" accept="image/*"> on web.
 * Reference: D008 §12.4
 */

import { isNative } from "./platform";
import { getCameraPlugin } from "./capacitor-plugins";

export interface PhotoResult {
  dataUrl: string;
  format: string;
}

export async function takePhoto(): Promise<PhotoResult | null> {
  if (isNative()) {
    return takePhotoNative("CAMERA");
  }
  return takePhotoWeb();
}

export async function pickImage(): Promise<PhotoResult | null> {
  if (isNative()) {
    return takePhotoNative("PHOTOS");
  }
  return takePhotoWeb();
}

// ─── Native Implementation (uses global Capacitor plugin registry) ───

async function takePhotoNative(source: "CAMERA" | "PHOTOS"): Promise<PhotoResult | null> {
  try {
    const Camera = getCameraPlugin();
    if (!Camera) return takePhotoWeb();

    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: "dataUrl",   // CameraResultType.DataUrl
      source: source === "CAMERA" ? "CAMERA" : "PHOTOS", // CameraSource enum
      width: 1200,
      height: 1200,
    });
    if (image.dataUrl) {
      return { dataUrl: image.dataUrl, format: image.format };
    }
    return null;
  } catch (err) {
    console.warn("[Camera] Native failed, falling back to web:", err);
    return takePhotoWeb();
  }
}

// ─── Web Fallback ───

function takePhotoWeb(): Promise<PhotoResult | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) { resolve(null); return; }

      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          dataUrl: reader.result as string,
          format: file.type.split("/")[1] || "jpeg",
        });
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    };

    input.oncancel = () => resolve(null);
    input.click();
  });
}
