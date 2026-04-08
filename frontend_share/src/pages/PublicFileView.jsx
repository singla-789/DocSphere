import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import apiEndpoints from "../utils/apiEndPoints";
import { 
  FileText, 
  Download, 
  Clock, 
  User, 
  Database,
  Image as ImageIcon,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";

const PublicFileView = () => {
  const { id } = useParams();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        const response = await axios.get(apiEndpoints.GET_PUBLIC_FILE(id));
        setFileData(response.data);
      } catch (err) {
        console.error("Error fetching public file:", err);
        setError(err.response?.data?.message || "File not found or not public");
      } finally {
        setLoading(false);
      }
    };
    fetchFileData();
  }, [id]);

  const handleDownload = () => {
    window.open(apiEndpoints.DOWNLOAD_FILE(id), "_blank");
  };

  const formatSize = (bytes) => {
    if (bytes === 0 || !bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-outfit">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading file details...</p>
      </div>
    );
  }

  if (error || !fileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-outfit px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center max-w-md w-full text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unavailable</h2>
          <p className="text-gray-600 mb-6">{error || "This file is no longer available."}</p>
          <a href="/" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition">
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  const isImage = fileData.type?.startsWith("image/");
  const isPdf = fileData.type === "application/pdf";
  const canPreview = isImage || isPdf;

  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-center shadow-sm">
        <a href="/" className="flex items-center gap-2">
          <img src={assets.logo} alt="DocSphere Logo" className="h-8" />
          <span className="font-extrabold text-2xl text-gray-900 tracking-tight">DocSphere</span>
        </a>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
          
          {/* File Preview Area */}
          <div className="lg:w-2/3 bg-gray-100 border-r border-gray-200 flex flex-col items-center justify-center min-h-[400px] p-6 relative">
            {canPreview ? (
              isImage ? (
                <img 
                  src={apiEndpoints.PREVIEW_FILE(id)} 
                  alt={fileData.name} 
                  className="max-w-full max-h-[600px] object-contain rounded-lg shadow-sm"
                />
              ) : (
                <iframe 
                  src={apiEndpoints.PREVIEW_FILE(id)} 
                  title={fileData.name}
                  className="w-full h-[600px] rounded-lg shadow-sm border-0 bg-white"
                />
              )
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <FileText className="w-32 h-32 mb-6 text-indigo-300" />
                <p className="text-lg font-medium text-gray-500">Preview not available for this file type</p>
              </div>
            )}
          </div>

          {/* File Details Sidebar */}
          <div className="lg:w-1/3 p-8 flex flex-col justify-between bg-white">
            <div>
              <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider mb-6">
                Public File
              </div>
              
              <h1 className="text-2xl font-extrabold text-gray-900 mb-6 break-words leading-tight">
                {fileData.name}
              </h1>

              <div className="space-y-6">
                <div className="flex items-center text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mr-4 shrink-0">
                    <Database className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Size</p>
                    <p className="font-semibold text-gray-900">{formatSize(fileData.size)}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mr-4 shrink-0">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Shared By</p>
                    <p className="font-semibold text-gray-900 lg:truncate max-w-[150px] xl:max-w-xs">{fileData.ownerName || "Unknown User"}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mr-4 shrink-0">
                    <Clock className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Uploaded</p>
                    <p className="font-semibold text-gray-900">{new Date(fileData.uploadedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button 
                onClick={handleDownload}
                className="w-full flex items-center justify-center px-6 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
              >
                <Download className="w-5 h-5 mr-2" />
                Download File
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PublicFileView;