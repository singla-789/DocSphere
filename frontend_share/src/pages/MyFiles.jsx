import React, { useState, useEffect } from "react";
import DashBoardLayout from "../layout/DashBoardLayout";
import {
  Lock,
  File,
  Grid,
  List,
  FileText,
  Globe,
  Copy,
  Download,
  Trash2,
  Eye,
  CopyIcon,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";

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

      const response = await axios.get(
        "http://localhost:8080/api/v1.0/files/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200) {
        setFiles(response.data || []);
        console.log(response.data);
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error(`Error fetching files: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
          // ✅ Empty State
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
        ) : viewMode == "grid" ? (
          <div>grid view</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200">
            <table className="min-w-full text-sm">
              {/* HEADER */}
              <thead className="bg-gray-50 border-b">
                <tr className="text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Size</th>
                  <th className="px-6 py-3 text-left">Uploaded</th>
                  <th className="px-6 py-3 text-left">Sharing</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y">
                {files.map((file) => (
                  <tr
                    key={file.id || file._id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    {/* NAME */}
                    <td className="px-6 py-4 font-medium text-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <File size={18} className="text-blue-600" />
                        </div>
                        <span className="truncate max-w-[180px]">
                          {file.name || "Unnamed"}
                        </span>
                      </div>
                    </td>

                    {/* SIZE */}
                    <td className="px-6 py-4 text-gray-500">
                      {file.size ? `${(file.size / 1024).toFixed(1)} KB` : "-"}
                    </td>

                    {/* UPLOADED */}
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* STATUS BADGE */}
                        {file.isPublic ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                            <Globe size={14} /> Public
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                            <Lock size={14} /> Private
                          </span>
                        )}

                        {/* SHARE BUTTON */}
                        {file.isPublic && (
                          <button className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition">
                            <CopyIcon size={14} />
                            <span>Copy link</span>
                          </button>
                        )}
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2">
                        {/* VIEW */}
                        {file.isPublic && (
                          <Link
                            to={`/file/${file.id}`}
                            className="p-2 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition"
                          >
                            <Eye size={18} />
                          </Link>
                        )}

                        {/* DOWNLOAD */}
                        <button className="p-2 rounded-lg hover:bg-green-50 text-gray-500 hover:text-green-600 transition">
                          <Download size={18} />
                        </button>

                        {/* DELETE */}
                        <button className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashBoardLayout>
  );
};

export default MyFiles;
