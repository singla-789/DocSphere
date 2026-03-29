import React, { useState } from "react";
import { Copy, Check, Link2 } from "lucide-react";
import Modal from "./Modal";

const ShareLinkModal = ({ isOpen, onClose, fileId, fileName }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/file/${fileId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("input");
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share File"
      hideFooter
      size="md"
    >
      <div className="flex flex-col gap-4">
        {/* File name pill */}
        {fileName && (
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl w-fit max-w-full">
            <Link2 size={13} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs font-medium text-gray-600 truncate">
              {fileName}
            </span>
          </div>
        )}

        <p className="text-sm text-gray-500 -mt-1">
          Anyone with this link can view the file.
        </p>

        {/* Link box + copy button */}
        <div className="flex items-center gap-2">
          <div
            className="
              flex-1 px-3 py-2.5 rounded-xl
              bg-gray-50 border border-gray-200
              text-xs text-gray-500 font-mono
              truncate select-all
            "
            title={shareUrl}
          >
            {shareUrl}
          </div>

          <button
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy link"}
            className={`
              flex-shrink-0 flex items-center gap-1.5
              px-3.5 py-2.5 rounded-xl text-xs font-semibold
              border transition-all duration-200 active:scale-95
              ${
                copied
                  ? "bg-green-50 border-green-200 text-green-600"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              }
            `}
          >
            {copied ? (
              <>
                <Check size={13} strokeWidth={2.5} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={13} strokeWidth={2} />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareLinkModal;
