/**
 * ImagePreviewCrop — displays an uploaded image with basic rotate + confirm controls.
 * (No actual cropping library — lightweight preview for mobile-first UX.)
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RotateCw, Check, X } from "lucide-react";

interface ImagePreviewCropProps {
  src: string;
  onConfirm: (src: string) => void;
  onCancel: () => void;
}

export function ImagePreviewCrop({ src, onConfirm, onCancel }: ImagePreviewCropProps) {
  const { t } = useTranslation();
  const [rotation, setRotation] = useState(0);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl overflow-hidden max-w-sm w-full">
        {/* Image preview */}
        <div className="relative bg-gray-100 flex items-center justify-center p-4 min-h-[300px]">
          <img
            src={src}
            alt="Preview"
            className="max-w-full max-h-[300px] object-contain transition-transform duration-300"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            {t("common.cancel", "Cancel")}
          </button>

          <button
            type="button"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={t("upload.rotate", "Rotate")}
          >
            <RotateCw className="w-5 h-5 text-gray-600" />
          </button>

          <button
            type="button"
            onClick={() => onConfirm(src)}
            className="flex items-center gap-1 px-4 py-2 text-sm bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Check className="w-4 h-4" />
            {t("common.confirm", "Confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
