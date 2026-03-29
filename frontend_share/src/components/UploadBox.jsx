import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FolderOpen } from "lucide-react";
import DashBoardLayout from "../layout/DashBoardLayout";
import FileUpload from "../components/FileUpload";

const Upload = () => {
  const navigate = useNavigate();

  const handleUploaded = () => {
    navigate("/my-files");
  };

  return (
    <DashBoardLayout activeMenu="Upload">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* ── Page header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 border border-indigo-100 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Quick upload
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Upload Files
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Drag & drop or browse — files are stored securely in your vault.
            </p>
          </div>

          <Link
            to="/my-files"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition self-start sm:self-auto"
          >
            <FolderOpen className="h-4 w-4" />
            My Files
          </Link>
        </div>

        {/* ── Upload widget ── */}
        <FileUpload onUploaded={handleUploaded} />
      </div>
    </DashBoardLayout>
  );
};

export default Upload;
