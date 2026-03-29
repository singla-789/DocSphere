import React, { useCallback, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import {
  CloudUpload, Trash2, FileText,
  CheckCircle2, AlertCircle, Info,
} from "lucide-react";
import apiEndpoints from "../utils/apiEndPoints";
import DropZone from "./DropZone";
import QueueItem from "./QueueItem";

// ─── Helper ───────────────────────────────────────────────────────────────────

const formatTotalSize = (bytes) => {
  if (!bytes) return "0 B";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

// ─── FileUpload ───────────────────────────────────────────────────────────────

const FileUpload = ({ onUploaded }) => {
  const { getToken } = useAuth();

  const [queue, setQueue]             = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress]       = useState(0);
  const [successMsg, setSuccessMsg]   = useState("");
  const [error, setError]             = useState(null);
  const [remainingCredits, setRemainingCredits] = useState(null);

  const totalSize = useMemo(
    () => queue.reduce((acc, item) => acc + (item.file.size || 0), 0),
    [queue]
  );

  // ── Add files (deduped) ──
  const addFilesToQueue = useCallback((fileList) => {
    if (!fileList?.length) return;
    const incoming = Array.from(fileList);

    setQueue((prev) => {
      const map = new Map(prev.map((item) => [item.id, item]));
      incoming.forEach((file) => {
        const key = `${file.name}_${file.size}_${file.lastModified}`;
        if (!map.has(key)) map.set(key, { id: key, file, status: "queued" });
      });
      return Array.from(map.values());
    });

    setSuccessMsg("");
    setError(null);
  }, []);

  const handleRemoveFile = useCallback((id) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    setQueue([]);
    setProgress(0);
    setSuccessMsg("");
    setError(null);
    setRemainingCredits(null);
  }, []);

  // ── Upload ──
  const handleUpload = useCallback(async () => {
    if (!queue.length) {
      setError("Please add at least one file to upload.");
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setError(null);
    setSuccessMsg("");
    setQueue((prev) => prev.map((item) => ({ ...item, status: "uploading" })));

    try {
      const token = await getToken();

      const formData = new FormData();
      queue.forEach((item) => formData.append("files", item.file));

      const response = await axios.post(apiEndpoints.UPLOAD_FILES, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (event) => {
          if (!event.total) return;
          setProgress(Math.round((event.loaded * 100) / event.total));
        },
      });

      const data = response.data;

      if (typeof data?.remainingCredits === "number") {
        setRemainingCredits(data.remainingCredits);
      }

      setSuccessMsg(
        `${queue.length} file${queue.length > 1 ? "s" : ""} uploaded successfully.`
      );
      setQueue((prev) => prev.map((item) => ({ ...item, status: "success" })));

      if (typeof onUploaded === "function") onUploaded(data);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while uploading.";
      setError(message);
      setQueue((prev) => prev.map((item) => ({ ...item, status: "error" })));
    } finally {
      setIsUploading(false);
    }
  }, [queue, getToken, onUploaded]);

  const isUploadDisabled = isUploading || queue.length === 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .fu-root { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="fu-root space-y-4">

        {/* ── Drop zone ── */}
        <DropZone onFilesAdded={addFilesToQueue} disabled={isUploading} />

        {/* ── Feedback banners ── */}
        {error && (
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-sm font-medium text-red-700">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50 text-sm font-medium text-emerald-700">
            <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
            {successMsg}
            {remainingCredits !== null && (
              <span className="ml-auto text-xs font-semibold text-emerald-600 whitespace-nowrap">
                {remainingCredits} credits left
              </span>
            )}
          </div>
        )}

        {/* ── Queue panel ── */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Upload queue
                {queue.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-[11px] font-bold">
                    {queue.length}
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {queue.length === 0
                  ? "No files added yet."
                  : `${queue.length} file${queue.length > 1 ? "s" : ""} · ${formatTotalSize(totalSize)} total`}
              </p>
            </div>

            {queue.length > 0 && !isUploading && (
              <button
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={13} />
                Clear all
              </button>
            )}
          </div>

          {/* Queue body */}
          <div className="px-4 py-4">
            {queue.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                  <FileText size={18} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-400">No files in queue</p>
                <p className="text-xs text-gray-300 mt-1">Drop files above to add them here</p>
              </div>
            ) : (
              <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {queue.map((item) => (
                  <QueueItem
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveFile}
                    disabled={isUploading}
                  />
                ))}
              </ul>
            )}
          </div>

          {/* Progress bar */}
          {isUploading && (
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Info size={12} />
                  <span>Uploading…</span>
                </div>
                <span className="font-semibold text-indigo-600">{progress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer / action row */}
          <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/40">
            <button
              onClick={handleUpload}
              disabled={isUploadDisabled}
              className={`
                inline-flex items-center gap-2 rounded-xl px-5 py-2.5
                text-sm font-semibold transition-all duration-200
                ${isUploadDisabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-200 hover:shadow-md hover:shadow-indigo-300 hover:-translate-y-px active:translate-y-0"
                }
              `}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Uploading…
                </>
              ) : (
                <>
                  <CloudUpload size={15} strokeWidth={2} />
                  {queue.length > 0
                    ? `Upload ${queue.length} file${queue.length > 1 ? "s" : ""}`
                    : "Upload all"}
                </>
              )}
            </button>

            {queue.length > 0 && !isUploading && (
              <span className="text-xs text-gray-400">
                {formatTotalSize(totalSize)} total
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUpload;
