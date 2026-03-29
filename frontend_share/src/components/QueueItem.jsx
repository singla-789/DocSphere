import React from "react";
import {
  FileText, ImageIcon, Music, Video, File, X,
  CheckCircle2, AlertCircle, Loader2,
} from "lucide-react";

// ─── File type config ─────────────────────────────────────────────────────────
const FILE_TYPES = [
  { exts: ["jpg","jpeg","png","gif","svg","webp"], icon: ImageIcon, color: "#7c3aed", bg: "#f5f3ff" },
  { exts: ["mp4","webm","mov","avi","mkv"],        icon: Video,     color: "#2563eb", bg: "#eff6ff" },
  { exts: ["mp3","wav","ogg","flac","m4a"],        icon: Music,     color: "#059669", bg: "#ecfdf5" },
  { exts: ["pdf","doc","docx","txt","rtf"],        icon: FileText,  color: "#d97706", bg: "#fffbeb" },
];

const getFileInfo = (name = "") => {
  const ext = name.split(".").pop()?.toLowerCase();
  return FILE_TYPES.find((t) => t.exts.includes(ext)) ?? {
    icon: File, color: "#6b7280", bg: "#f9fafb",
  };
};

const formatSize = (bytes) => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ─── Status badge config ──────────────────────────────────────────────────────
const STATUS_CONFIG = {
  queued:    { label: "Queued",     cls: "bg-gray-100 text-gray-600 border-gray-200" },
  uploading: { label: "Uploading",  cls: "bg-blue-50 text-blue-600 border-blue-200" },
  success:   { label: "Uploaded",   cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  error:     { label: "Failed",     cls: "bg-red-50 text-red-600 border-red-200" },
};

const StatusIcon = ({ status }) => {
  if (status === "success")   return <CheckCircle2 size={13} className="text-emerald-500" />;
  if (status === "error")     return <AlertCircle  size={13} className="text-red-500" />;
  if (status === "uploading") return <Loader2      size={13} className="text-blue-500 animate-spin" />;
  return null;
};

// ─── QueueItem ────────────────────────────────────────────────────────────────
const QueueItem = ({ item, onRemove, disabled = false }) => {
  const { file, status, id } = item;
  const info = getFileInfo(file.name);
  const Icon = info.icon;
  const badge = STATUS_CONFIG[status] ?? STATUS_CONFIG.queued;

  return (
    <li
      className="
        flex items-center gap-3 px-3 py-2.5 rounded-xl
        bg-white border border-gray-100
        hover:border-gray-200 hover:shadow-sm
        transition-all duration-150
      "
      style={{ animation: "queueIn 0.2s cubic-bezier(.34,1.4,.64,1) both" }}
    >
      <style>{`
        @keyframes queueIn {
          from { opacity:0; transform: translateX(-6px); }
          to   { opacity:1; transform: none; }
        }
      `}</style>

      {/* File type icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: info.bg }}
      >
        <Icon size={16} style={{ color: info.color }} />
      </div>

      {/* Name + size */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate leading-snug">
          {file.name}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{formatSize(file.size)}</p>
      </div>

      {/* Status badge */}
      <div className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded-full
        border text-[11px] font-semibold flex-shrink-0
        ${badge.cls}
      `}>
        <StatusIcon status={status} />
        {badge.label}
      </div>

      {/* Remove button */}
      {!disabled && status !== "success" && (
        <button
          onClick={() => onRemove(id)}
          title="Remove"
          className="
            w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
            text-gray-300 hover:text-red-500 hover:bg-red-50
            transition-all duration-150
          "
        >
          <X size={14} strokeWidth={2.2} />
        </button>
      )}

      {/* Spacer when no remove button to keep alignment */}
      {(disabled || status === "success") && <div className="w-7 flex-shrink-0" />}
    </li>
  );
};

export default QueueItem;
