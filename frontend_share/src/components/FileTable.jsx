import React, { useState } from "react";
import {
  FileText,
  ImageIcon,
  Music,
  Video,
  File,
  Share2,
  Download,
  Trash2,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import apiEndpoints from "../utils/apiEndPoints";
import ConformationDialog from "./ConformationDialog";
import ShareLinkModal from "./ShareLinkModal";

// ─── File type config ─────────────────────────────────────────────────────────

const FILE_TYPES = [
  {
    exts: ["jpg", "jpeg", "png", "gif", "svg", "webp"],
    icon: ImageIcon,
    bg: "bg-violet-50",
    color: "text-violet-500",
    accent: "bg-violet-400",
  },
  {
    exts: ["mp4", "webm", "mov", "avi", "mkv"],
    icon: Video,
    bg: "bg-blue-50",
    color: "text-blue-500",
    accent: "bg-blue-400",
  },
  {
    exts: ["mp3", "wav", "ogg", "flac", "m4a"],
    icon: Music,
    bg: "bg-emerald-50",
    color: "text-emerald-500",
    accent: "bg-emerald-400",
  },
  {
    exts: ["pdf", "doc", "docx", "txt", "rtf"],
    icon: FileText,
    bg: "bg-amber-50",
    color: "text-amber-500",
    accent: "bg-amber-400",
  },
];

const getFileConfig = (name) => {
  const ext = name?.split(".").pop()?.toLowerCase();
  return (
    FILE_TYPES.find((t) => t.exts.includes(ext)) ?? {
      icon: File,
      bg: "bg-gray-50",
      color: "text-gray-400",
      accent: "bg-gray-300",
    }
  );
};

const formatSize = (bytes) => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// ─── PrivacyToggle ────────────────────────────────────────────────────────────

const PrivacyToggle = ({ isPrivate, isUpdating, onToggle }) => (
  <button
    onClick={onToggle}
    disabled={isUpdating}
    title={isPrivate ? "Switch to public" : "Switch to private"}
    className={`
      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border
      text-[11px] font-semibold select-none transition-all duration-200
      ${isUpdating ? "opacity-40 pointer-events-none" : ""}
      ${
        isPrivate
          ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
          : "bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
      }
    `}
  >
    <div
      className={`relative w-6 h-3 rounded-full flex-shrink-0 transition-colors duration-200 ${
        isPrivate ? "bg-red-300" : "bg-green-400"
      }`}
    >
      <div
        className={`absolute top-0.5 w-2 h-2 rounded-full bg-white shadow-sm transition-all duration-200 ${
          isPrivate ? "left-0.5" : "left-[14px]"
        }`}
      />
    </div>
    <span>{isPrivate ? "Private" : "Public"}</span>
  </button>
);

// ─── ActionBtn ────────────────────────────────────────────────────────────────

const ActionBtn = ({ onClick, title, hoverClass, children, asLink, to }) => {
  const cls = `
    flex items-center justify-center w-8 h-8 rounded-xl
    bg-gray-50 border border-gray-100 text-gray-400
    hover:scale-110 hover:shadow-sm active:scale-95
    transition-all duration-150 ${hoverClass}
  `;
  if (asLink) {
    return (
      <Link to={to} onClick={(e) => e.stopPropagation()} title={title} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} title={title} className={cls}>
      {children}
    </button>
  );
};

// ─── FileRow ──────────────────────────────────────────────────────────────────

const FileRow = ({ file, onDelete, onPrivacyChange }) => {
  const { getToken } = useAuth();
  const { icon: Icon, bg, color, accent } = getFileConfig(file.name);

  const deriveIsPublic = (f) => {
    if (typeof f.isPublic === "boolean") return f.isPublic;
    if (typeof f.isPrivate === "boolean") return !f.isPrivate;
    return false;
  };

  const [isPublic, setIsPublic] = useState(() => deriveIsPublic(file));
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handlePrivacyToggle = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isUpdating) return;
    const newIsPublic = !isPublic;
    setIsPublic(newIsPublic);
    setIsUpdating(true);
    try {
      const token = await getToken();
      await axios.patch(
        apiEndpoints.TOGGLE_FILE_PUBLIC(file.id),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(newIsPublic ? "Set to public." : "Set to private.");
      onPrivacyChange?.(file.id, !newIsPublic);
    } catch (err) {
      setIsPublic(!newIsPublic);
      toast.error(`Failed to update: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowShareModal(true);
  };

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const a = document.createElement("a");
    a.href = apiEndpoints.DOWNLOAD_FILE(file.id);
    a.download = file.name || "download";
    a.click();
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteDialog(false);
    setIsDeleting(true);
    try {
      const token = await getToken();
      await axios.delete(apiEndpoints.DELETE_FILE(file.id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("File deleted.");
      onDelete?.(file.id);
    } catch (err) {
      toast.error(`Failed to delete: ${err.message}`);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ConformationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete File"
        message={`Are you sure you want to delete "${file.name || "this file"}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmationButtonClass="bg-red-600 hover:bg-red-700"
      />

      <ShareLinkModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        fileId={file.id}
        fileName={file.name}
      />

      <tr
        className={`
          group relative transition-all duration-300 ease-out
          border-b border-gray-100 last:border-0
          hover:bg-gray-50/80 hover:-translate-y-px
          hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]
          ${isDeleting ? "opacity-40 pointer-events-none" : ""}
        `}
      >
        {/* ── Left accent bar ── */}
        <td className="p-0" style={{ width: "3px", padding: 0 }}>
          <div
            className={`w-[3px] ${accent} rounded-r-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out origin-center`}
            style={{ minHeight: "56px" }}
          />
        </td>

        {/* ── Name ── */}
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div
              className={`
                ${bg} p-2 rounded-xl flex-shrink-0
                group-hover:scale-110 group-hover:-rotate-3
                transition-all duration-300 ease-out
              `}
            >
              <Icon size={17} className={color} />
            </div>
            <span className="text-sm font-semibold text-gray-800 truncate max-w-[200px] leading-snug">
              {file.name || "Unnamed file"}
            </span>
          </div>
        </td>

        {/* ── Size ── */}
        <td className="px-4 py-3.5 text-xs text-gray-400 whitespace-nowrap">
          {formatSize(file.size)}
        </td>

        {/* ── Uploaded ── */}
        <td className="px-4 py-3.5 text-xs text-gray-400 whitespace-nowrap">
          {formatDate(file.uploadedAt)}
        </td>

        {/* ── Privacy ── */}
        <td className="px-4 py-3.5">
          <PrivacyToggle
            isPrivate={!isPublic}
            isUpdating={isUpdating}
            onToggle={handlePrivacyToggle}
          />
        </td>

        {/* ── Actions ── */}
        <td className="px-4 py-3.5">
          <div
            className="
              flex items-center gap-2
              opacity-50 translate-x-1
              group-hover:opacity-100 group-hover:translate-x-0
              transition-all duration-200 ease-out
            "
          >
            {isPublic && (
              <ActionBtn
                asLink
                to={`/file/${file.id}`}
                title="View"
                hoverClass="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-500"
              >
                <Eye size={15} />
              </ActionBtn>
            )}

            {isPublic && (
              <ActionBtn
                onClick={handleShare}
                title="Share link"
                hoverClass="hover:bg-purple-50 hover:border-purple-200 hover:text-purple-500"
              >
                <Share2 size={15} />
              </ActionBtn>
            )}

            <ActionBtn
              onClick={handleDownload}
              title="Download"
              hoverClass="hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-500"
            >
              <Download size={15} />
            </ActionBtn>

            <div className="w-px h-4 bg-gray-200 flex-shrink-0" />

            <ActionBtn
              onClick={handleDeleteClick}
              title="Delete"
              hoverClass="hover:bg-red-50 hover:border-red-200 hover:text-red-500"
            >
              <Trash2 size={15} />
            </ActionBtn>
          </div>
        </td>
      </tr>
    </>
  );
};

// ─── FileTable ────────────────────────────────────────────────────────────────

const FileTable = ({ files = [], onDelete, onPrivacyChange }) => (
  <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
    <table className="min-w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-50 border-b border-gray-100">
          <th style={{ width: "3px", padding: 0 }} />
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Name
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Size
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Uploaded
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Sharing
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {files.map((file) => (
          <FileRow
            key={file.id || file._id}
            file={file}
            onDelete={onDelete}
            onPrivacyChange={onPrivacyChange}
          />
        ))}
        {files.length === 0 && (
          <tr>
            <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">
              No files yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default FileTable;
