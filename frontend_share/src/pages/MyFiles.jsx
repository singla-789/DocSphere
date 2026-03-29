import React, { useState, useEffect } from "react";
import DashBoardLayout from "../layout/DashBoardLayout";
import { FileText, Grid, List } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import FileCard from "../components/FileCard";
import FileTable from "../components/FileTable"; // ← new
import apiEndpoints from "../utils/apiEndPoints";

const MyFiles = () => {
  const [files, setFiles] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.get(apiEndpoints.FETCH_MY_FILES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setFiles(response.data || []);
      }
    } catch (error) {
      toast.error(`Error fetching files: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Called by FileCard / FileTable after a successful delete
  const handleDelete = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // Called by FileCard / FileTable after a successful privacy toggle
  const handlePrivacyChange = (fileId, isPrivate) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, isPublic: !isPrivate } : f))
    );
  };

  useEffect(() => {
    fetchFiles();
  }, [getToken]);

  return (
    <DashBoardLayout activeMenu="My Files">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Files ({files.length})</h2>

          <div className="flex items-center gap-3">
            <List
              onClick={() => setViewMode("list")}
              size={24}
              className={`cursor-pointer transition-colors ${
                viewMode === "list"
                  ? "text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            />
            <Grid
              onClick={() => setViewMode("grid")}
              size={24}
              className={`cursor-pointer transition-colors ${
                viewMode === "grid"
                  ? "text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            />
          </div>
        </div>

        {/* UI States */}
        {loading ? (
          <p>Loading files...</p>
        ) : files.length === 0 ? (
          <div className="flex items-center justify-center">
            <div className="w-full max-w-3xl bg-white border rounded-2xl shadow-sm p-10 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-purple-100">
                  <FileText className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                No files uploaded yet
              </h3>
              <p className="text-gray-500 mt-2 text-sm">
                Start uploading files to see them listed here. You can upload
                documents, images, and other files to share and manage them
                securely.
              </p>
              <button
                onClick={() => navigate("/upload")}
                className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Upload Files
              </button>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onDelete={handleDelete}
                onPrivacyChange={handlePrivacyChange}
              />
            ))}
          </div>
        ) : (
          <FileTable
            files={files}
            onDelete={handleDelete}
            onPrivacyChange={handlePrivacyChange}
          />
        )}
      </div>
    </DashBoardLayout>
  );
};

export default MyFiles;
