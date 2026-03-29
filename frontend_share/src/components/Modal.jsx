import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

const SIZE_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  confirmationButtonClass = "bg-blue-600 hover:bg-blue-700",
  size = "md",
  hideFooter = false,
}) => {
  const overlayRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Click outside to close
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.45)", backdropFilter: "blur(4px)" }}
    >
      {/* Panel */}
      <div
        className={`
          relative w-full ${SIZE_CLASSES[size] ?? SIZE_CLASSES.md}
          bg-white rounded-2xl shadow-2xl
          flex flex-col
          animate-modal-in
        `}
        style={{
          animation: "modalIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        }}
      >
        {/* ── Top accent line ── */}
        <div className="absolute top-0 left-6 right-6 h-[2px] rounded-b-full bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 opacity-70" />

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-base font-semibold text-gray-900 tracking-tight">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="
              flex items-center justify-center w-7 h-7 rounded-lg
              text-gray-400 hover:text-gray-600
              hover:bg-gray-100
              transition-all duration-150
              active:scale-90
            "
          >
            <X size={15} strokeWidth={2.2} />
          </button>
        </div>

        {/* ── Divider ── */}
        <div className="mx-6 border-t border-gray-100" />

        {/* ── Body ── */}
        <div className="px-6 py-5 text-sm text-gray-600 leading-relaxed">
          {children}
        </div>

        {/* ── Footer ── */}
        {!hideFooter && (
          <>
            <div className="mx-6 border-t border-gray-100" />
            <div className="flex items-center justify-end gap-2.5 px-6 py-4">
              <button
                onClick={onClose}
                className="
                  px-4 py-2 rounded-xl text-sm font-medium
                  text-gray-600 bg-gray-100
                  hover:bg-gray-200
                  active:scale-95
                  transition-all duration-150
                "
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium
                  text-white shadow-sm
                  active:scale-95
                  transition-all duration-150
                  ${confirmationButtonClass}
                `}
              >
                {confirmText}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Keyframe injected inline so no Tailwind config needed */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);     }
        }
      `}</style>
    </div>
  );
};

export default Modal;
