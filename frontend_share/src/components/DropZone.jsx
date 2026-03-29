import React, { useCallback, useRef, useState } from "react";
import { CloudUpload } from "lucide-react";

const ACCEPTED = [
  "image/*", "video/*", "audio/*",
  "application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
].join(",");

const TYPE_PILLS = ["PDF", "DOC", "Images", "Video", "Audio", "TXT"];

const DropZone = ({ onFilesAdded, disabled = false }) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver  = useCallback((e) => { e.preventDefault(); setIsDragging(true);  }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) onFilesAdded(e.dataTransfer.files);
  }, [disabled, onFilesAdded]);

  const handleChange = useCallback((e) => {
    if (!disabled) onFilesAdded(e.target.files);
    e.target.value = "";
  }, [disabled, onFilesAdded]);

  return (
    <>
      <style>{`
        @keyframes dz-bounce {
          0%,100% { transform: translateY(0)    scale(1);    }
          50%      { transform: translateY(-6px) scale(1.08); }
        }
        .dz-icon-bounce { animation: dz-bounce 0.55s cubic-bezier(.34,1.56,.64,1) both; }
      `}</style>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`
          relative rounded-2xl border-2 border-dashed p-10 text-center
          transition-all duration-200 cursor-pointer select-none
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${isDragging
            ? "border-indigo-400 bg-indigo-50/70 shadow-inner"
            : "border-gray-200 bg-gray-50/80 hover:border-indigo-300 hover:bg-indigo-50/30"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div
            className={`
              w-16 h-16 rounded-2xl flex items-center justify-center
              shadow-md transition-all duration-300
              ${isDragging
                ? "bg-indigo-600 shadow-indigo-200/80 dz-icon-bounce"
                : "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-200/60"
              }
            `}
          >
            <CloudUpload size={28} className="text-white" strokeWidth={1.8} />
          </div>
        </div>

        <h3 className="text-base font-semibold text-gray-800 mb-1">
          {isDragging ? "Release to add files" : "Drop files here"}
        </h3>
        <p className="text-sm text-gray-400 mb-5">
          or{" "}
          <span className="text-indigo-500 font-semibold underline underline-offset-2">
            browse from your device
          </span>
        </p>

        {/* Type pills */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {TYPE_PILLS.map((t) => (
            <span
              key={t}
              className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white border border-gray-200 text-gray-500"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default DropZone;
