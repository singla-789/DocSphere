import React, { useContext, useState } from "react";
import DashBoardLayout from "../layout/DashBoardLayout";
import UploadBox from "../components/UploadBox";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import axios from "axios";
import apiEndpoints from "../utils/apiEndPoints";
import { useAuth } from "@clerk/clerk-react";
import { UserCreditsContext } from "../context/UserCreditContext";

const MAX_FILES = 5;

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error" | "info"
  const { getToken } = useAuth();
  const { credits, setCredits } = useContext(UserCreditsContext);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (files.length + selectedFiles.length > MAX_FILES) {
      setMessage(`You can only upload a maximum of ${MAX_FILES} files at once.`);
      setMessageType("error");
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
    setMessage("");
    setMessageType("");
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setMessage("");
    setMessageType("");
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessageType("error");
      setMessage("Please select at least one file to upload.");
      return;
    }

    if (files.length > MAX_FILES) {
      setMessage(`You can only upload a maximum of ${MAX_FILES} files at once.`);
      setMessageType("error");
      return;
    }

    setUploading(true);
    setMessage("Uploading files…");
    setMessageType("info");

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const token = await getToken();
      const response = await axios.post(apiEndpoints.UPLOAD_FILES, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.remainingCredits !== undefined) {
        setCredits(response.data.remainingCredits);
      }

      setMessage("Files uploaded successfully!");
      setMessageType("success");
      setFiles([]);
    } catch (error) {
      console.error("Error uploading files:", error);
      setMessage(
        error.response?.data?.message || "Error uploading files. Please try again."
      );
      setMessageType("error");
    } finally {
      setUploading(false);
    }
  };

  // Fixed: was referencing undefined `isUploadingDisabled`
  const isUploadDisabled =
    files.length === 0 ||
    files.length > MAX_FILES ||
    credits <= 0 ||
    files.length > credits;

  // Message banner config
  const bannerConfig = {
    error:   { bg: "bg-red-50",   border: "border-red-200",   text: "text-red-700",   icon: <AlertCircle size={17} className="flex-shrink-0" /> },
    success: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: <CheckCircle2 size={17} className="flex-shrink-0" /> },
    info:    { bg: "bg-blue-50",  border: "border-blue-200",  text: "text-blue-700",  icon: <Info size={17} className="flex-shrink-0" /> },
  };
  const banner = bannerConfig[messageType];

  return (
    <DashBoardLayout activeMenu="Upload">
      <div className="p-6 max-w-2xl mx-auto">

        {/* ── Message banner ── */}
        {message && banner && (
          <div
            className={`
              mb-5 px-4 py-3 rounded-xl border flex items-center gap-2.5
              text-sm font-medium
              ${banner.bg} ${banner.border} ${banner.text}
            `}
          >
            {banner.icon}
            <span>{message}</span>
          </div>
        )}

        <UploadBox
          files={files}
          onFileChange={handleFileChange}
          onUpload={handleUpload}
          uploading={uploading}
          onRemoveFile={handleRemoveFile}
          remainingCredits={credits}
          isUploadDisabled={isUploadDisabled}
          maxFiles={MAX_FILES}
        />
      </div>
    </DashBoardLayout>
  );
};

export default Upload;
