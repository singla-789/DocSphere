import React, { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  ImageIcon,
  Music,
  Video,
  File,
  X,
  Zap,
  CheckCircle2,
} from "lucide-react";

// ─── File type helpers ────────────────────────────────────────────────────────

const FILE_TYPE_MAP = [
  { exts: ["jpg","jpeg","png","gif","svg","webp"], icon: ImageIcon, color: "#7c3aed", bg: "#f5f3ff", label: "Image" },
  { exts: ["mp4","webm","mov","avi","mkv"],        icon: Video,     color: "#2563eb", bg: "#eff6ff", label: "Video" },
  { exts: ["mp3","wav","ogg","flac","m4a"],        icon: Music,     color: "#059669", bg: "#ecfdf5", label: "Audio" },
  { exts: ["pdf","doc","docx","txt","rtf"],        icon: FileText,  color: "#d97706", bg: "#fffbeb", label: "Doc" },
];

const getFileInfo = (name = "") => {
  const ext = name.split(".").pop()?.toLowerCase();
  return (
    FILE_TYPE_MAP.find((t) => t.exts.includes(ext)) ?? {
      icon: File, color: "#6b7280", bg: "#f9fafb", label: "File",
    }
  );
};

const formatSize = (bytes) => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ACCEPTED = [
  "image/*","video/*","audio/*","application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
].join(",");

// ─── Sub-components ───────────────────────────────────────────────────────────

const FileRow = ({ file, index, onRemove, uploading }) => {
  const info = getFileInfo(file.name);
  const Icon = info.icon;
  return (
    <div className="ub-file-row">
      <div className="ub-file-icon" style={{ background: info.bg }}>
        <Icon size={16} style={{ color: info.color }} />
      </div>
      <div className="ub-file-meta">
        <span className="ub-file-name">{file.name}</span>
        <span className="ub-file-size">{info.label} · {formatSize(file.size)}</span>
      </div>
      {!uploading && (
        <button
          className="ub-remove"
          onClick={() => onRemove(index)}
          title="Remove"
        >
          <X size={13} strokeWidth={2.3} />
        </button>
      )}
    </div>
  );
};

// ─── UploadBox ────────────────────────────────────────────────────────────────

const UploadBox = ({
  files = [],
  onFileChange,
  onUpload,
  uploading = false,
  onRemoveFile,
  remainingCredits = 0,
  isUploadDisabled = false,
  maxFiles = 5,
}) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    // Synthesise a fake event so parent's handleFileChange works unchanged
    const dt = e.dataTransfer;
    if (dt.files.length) {
      onFileChange({ target: { files: dt.files } });
    }
  };

  const canAddMore = files.length < maxFiles && !uploading;
  const uploadedAll = !uploading && files.length === 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap');

        .ub-wrap { font-family: 'DM Sans', sans-serif; }

        .ub-card {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.06), 0 8px 40px rgba(0,0,0,0.07);
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* header */
        .ub-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }
        .ub-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #1e1b4b;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .ub-subtitle {
          font-size: 12.5px;
          color: #94a3b8;
          margin-top: 3px;
        }
        .ub-credits-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11.5px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
          background: #fef9c3;
          color: #92400e;
          border: 1px solid #fde68a;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* drop zone */
        .ub-zone {
          border: 2px dashed #e2e8f0;
          border-radius: 16px;
          padding: 32px 20px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          background: #fafafa;
          position: relative;
        }
        .ub-zone:hover, .ub-zone.drag { border-color: #6366f1; background: #f5f3ff; }
        .ub-zone.drag .ub-zone-icon { transform: translateY(-5px) scale(1.08); }
        .ub-zone-icon {
          display: inline-flex; align-items: center; justify-content: center;
          width: 56px; height: 56px; border-radius: 18px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
          margin-bottom: 14px;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .ub-zone-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 800; color: #1e1b4b; margin-bottom: 4px;
        }
        .ub-zone-sub { font-size: 13px; color: #94a3b8; }
        .ub-zone-sub span { color: #6366f1; font-weight: 600; }
        .ub-pills { display: flex; flex-wrap: wrap; gap: 5px; justify-content: center; margin-top: 12px; }
        .ub-pill {
          font-size: 10.5px; font-weight: 600; padding: 2px 8px;
          border-radius: 999px; background: #f1f5f9; color: #64748b;
        }

        /* add-more strip */
        .ub-add-more {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1.5px dashed #c7d2fe;
          background: #f5f3ff;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          color: #6366f1;
          transition: background 0.15s, border-color 0.15s;
        }
        .ub-add-more:hover { background: #ede9fe; border-color: #a5b4fc; }

        /* file list */
        .ub-file-list { display: flex; flex-direction: column; gap: 8px; }
        .ub-file-list-label {
          font-size: 11px; font-weight: 700; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.06em;
          margin-bottom: 2px;
        }
        .ub-file-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          animation: rowIn 0.2s cubic-bezier(0.34,1.4,0.64,1) both;
        }
        @keyframes rowIn {
          from { opacity: 0; transform: translateY(4px) scale(0.97); }
          to   { opacity: 1; transform: none; }
        }
        .ub-file-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .ub-file-meta { flex: 1; min-width: 0; }
        .ub-file-name {
          font-size: 13px; font-weight: 600; color: #1e293b;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          display: block;
        }
        .ub-file-size { font-size: 11px; color: #94a3b8; margin-top: 1px; display: block; }
        .ub-remove {
          flex-shrink: 0; width: 26px; height: 26px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          color: #94a3b8; background: transparent; border: none; cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .ub-remove:hover { background: #fee2e2; color: #ef4444; }

        /* slots indicator */
        .ub-slots {
          font-size: 11.5px; color: #94a3b8; text-align: right;
        }
        .ub-slots span { font-weight: 600; color: #6366f1; }

        /* divider */
        .ub-divider { height: 1px; background: #f1f5f9; margin: 0 -28px; }

        /* upload button */
        .ub-btn {
          width: 100%; padding: 13px; border-radius: 14px;
          border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s;
        }
        .ub-btn.ready {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          box-shadow: 0 4px 14px rgba(99,102,241,0.38);
        }
        .ub-btn.ready:hover { box-shadow: 0 6px 20px rgba(99,102,241,0.5); transform: translateY(-1px); }
        .ub-btn.ready:active { transform: translateY(0); }
        .ub-btn.off { background: #f1f5f9; color: #94a3b8; cursor: not-allowed; }
        .ub-btn.loading {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white; opacity: 0.75; cursor: not-allowed;
        }
        .ub-spinner {
          width: 16px; height: 16px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: white; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* warning */
        .ub-warn {
          display: flex; align-items: center; gap: 6px;
          font-size: 11.5px; font-weight: 500; color: #ef4444;
          background: #fef2f2; border: 1px solid #fecaca;
          padding: 8px 12px; border-radius: 10px;
        }
      `}</style>

      <div className="ub-wrap">
        <div className="ub-card">

          {/* ── Header ── */}
          <div className="ub-header">
            <div>
              <h2 className="ub-title">Upload Files</h2>
              <p className="ub-subtitle">Up to {maxFiles} files per batch · 10 MB each</p>
            </div>
            <div className="ub-credits-badge">
              <Zap size={11} strokeWidth={2.5} style={{ color: "#f59e0b" }} />
              {remainingCredits} credit{remainingCredits !== 1 ? "s" : ""} left
            </div>
          </div>

          {/* ── Drop zone (shown when no files yet) ── */}
          {files.length === 0 && (
            <div
              className={`ub-zone${isDragging ? " drag" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                multiple
                accept={ACCEPTED}
                style={{ display: "none" }}
                onChange={onFileChange}
              />
              <div className="ub-zone-icon">
                <UploadCloud size={26} color="white" strokeWidth={1.8} />
              </div>
              <p className="ub-zone-title">Drop files here</p>
              <p className="ub-zone-sub">
                or <span>browse</span> from your computer
              </p>
              <div className="ub-pills">
                {["PDF", "DOC", "Images", "Video", "Audio", "TXT"].map((t) => (
                  <span key={t} className="ub-pill">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── File list ── */}
          {files.length > 0 && (
            <div className="ub-file-list">
              <p className="ub-file-list-label">
                {files.length} file{files.length !== 1 ? "s" : ""} selected
              </p>
              {files.map((file, i) => (
                <FileRow
                  key={`${file.name}-${i}`}
                  file={file}
                  index={i}
                  onRemove={onRemoveFile}
                  uploading={uploading}
                />
              ))}

              {/* Slots counter */}
              <p className="ub-slots">
                <span>{maxFiles - files.length}</span> slot{maxFiles - files.length !== 1 ? "s" : ""} remaining
              </p>

              {/* Add more strip */}
              {canAddMore && (
                <div
                  className="ub-add-more"
                  onClick={() => inputRef.current?.click()}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={ACCEPTED}
                    style={{ display: "none" }}
                    onChange={onFileChange}
                  />
                  <UploadCloud size={15} strokeWidth={2} />
                  Add more files
                </div>
              )}
            </div>
          )}

          {/* ── No credits warning ── */}
          {remainingCredits <= 0 && (
            <div className="ub-warn">
              <Zap size={13} strokeWidth={2.5} />
              You have no credits left. Please upgrade your plan to upload.
            </div>
          )}

          {/* ── Divider ── */}
          <div className="ub-divider" />

          {/* ── Upload button ── */}
          <button
            className={`ub-btn ${uploading ? "loading" : isUploadDisabled ? "off" : "ready"}`}
            onClick={onUpload}
            disabled={isUploadDisabled || uploading}
          >
            {uploading ? (
              <>
                <div className="ub-spinner" />
                Uploading {files.length} file{files.length !== 1 ? "s" : ""}…
              </>
            ) : (
              <>
                <UploadCloud size={17} strokeWidth={2} />
                {files.length === 0
                  ? "Select files to upload"
                  : `Upload ${files.length} file${files.length !== 1 ? "s" : ""}`}
              </>
            )}
          </button>

          {/* ── Bottom hint ── */}
          <p style={{ textAlign: "center", fontSize: 11.5, color: "#cbd5e1", marginTop: -12 }}>
            Each file costs 1 credit · {remainingCredits} remaining
          </p>

        </div>
      </div>
    </>
  );
};

export default UploadBox;
