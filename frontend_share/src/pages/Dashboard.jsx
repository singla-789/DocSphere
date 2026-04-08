import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState, useContext } from "react";
import DashBoardLayout from "../layout/DashBoardLayout";
import axios from "axios";
import apiEndpoints from "../utils/apiEndPoints";
import { UserCreditsContext } from "../context/UserCreditContext";
import { 
  FileText, 
  Database, 
  Zap, 
  History, 
  Plus, 
  CreditCard, 
  ArrowRight, 
  Clock, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const { credits } = useContext(UserCreditsContext);
  
  const [files, setFiles] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = await getToken();
      
      // Fetch Files
      const filesRes = await axios.get(apiEndpoints.FETCH_MY_FILES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(filesRes.data);

      // Fetch Transactions
      const transRes = await axios.get(apiEndpoints.GET_PAYMENT_HISTORY, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecentTransactions(transRes.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [getToken]);

  // Calculate metrics
  const totalFiles = files.length;
  const storageUsed = files.reduce((acc, curr) => acc + (curr.size || 0), 0);
  const successTransactions = recentTransactions.filter(t => t.status === "SUCCESS").length;

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const MetricCard = ({ title, value, icon, bgColor, textColor }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgColor}`}>
          {React.cloneElement(icon, { className: `w-6 h-6 ${textColor}` })}
        </div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</span>
      </div>
      <div className="text-3xl font-extrabold text-gray-900">{value}</div>
    </div>
  );

  return (
    <DashBoardLayout activeMenu="Dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Welcome Section */}
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Welcome back, <span className="text-indigo-600">{user?.firstName || "User"}!</span>
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Here's what's happening with your documents today.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <MetricCard 
            title="Total Files" 
            value={loading ? "..." : totalFiles} 
            icon={<FileText />} 
            bgColor="bg-blue-50" 
            textColor="text-blue-600"
          />
          <MetricCard 
            title="Storage Used" 
            value={loading ? "..." : formatSize(storageUsed)} 
            icon={<Database />} 
            bgColor="bg-purple-50" 
            textColor="text-purple-600"
          />
          <MetricCard 
            title="Available Credits" 
            value={credits} 
            icon={<Zap />} 
            bgColor="bg-yellow-50" 
            textColor="text-yellow-600"
          />
          <MetricCard 
            title="Recent Success" 
            value={loading ? "..." : successTransactions} 
            icon={<History />} 
            bgColor="bg-green-50" 
            textColor="text-green-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Files */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Files</h2>
                <Link to="/my-files" className="text-indigo-600 font-semibold text-sm hover:underline flex items-center">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="p-4">
                {loading ? (
                  <div className="space-y-4 p-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 rounded-2xl animate-pulse" />)}
                  </div>
                ) : files.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">No files uploaded yet.</p>
                    <Link to="/upload" className="mt-4 inline-block text-indigo-600 font-bold">Start Uploading</Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {files.slice(0, 5).map((file) => (
                      <div key={file.id} className="flex items-center p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                        <div className="p-3 bg-indigo-50 rounded-xl mr-4 group-hover:bg-white group-hover:shadow-sm transition-colors">
                          <FileText className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500 flex items-center mt-0.5">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(file.uploadedAt).toLocaleDateString()} • {formatSize(file.size)}
                          </p>
                        </div>
                        {file.isPublic ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-md uppercase tracking-wider">Public</span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold rounded-md uppercase tracking-wider">Private</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Activity/Help */}
            <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
               <div className="relative z-10">
                 <h3 className="text-2xl font-bold mb-2">Need more Credits?</h3>
                 <p className="text-indigo-100 mb-6 max-w-sm">Upgrade your plan to get more space and advanced features for document sharing.</p>
                 <Link to="/subscription" className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg">
                   Check Pricing <Zap className="w-4 h-4 ml-2 fill-current" />
                 </Link>
               </div>
               <Zap className="absolute -right-8 -bottom-8 w-48 h-48 text-indigo-500 opacity-20 transform -rotate-12" />
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-4">
                <Link to="/upload" className="flex items-center p-4 bg-gray-50 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all group">
                  <div className="p-2 bg-white rounded-lg mr-4 group-hover:bg-indigo-500 transition-colors">
                    <Plus className="w-5 h-5 text-indigo-600 group-hover:text-white" />
                  </div>
                  <span className="font-bold">Upload New File</span>
                </Link>
                <Link to="/subscription" className="flex items-center p-4 bg-gray-50 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all group">
                  <div className="p-2 bg-white rounded-lg mr-4 group-hover:bg-indigo-500 transition-colors">
                    <CreditCard className="w-5 h-5 text-indigo-600 group-hover:text-white" />
                  </div>
                  <span className="font-bold">Buy More Credits</span>
                </Link>
                <Link to="/transactions" className="flex items-center p-4 bg-gray-50 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all group">
                  <div className="p-2 bg-white rounded-lg mr-4 group-hover:bg-indigo-500 transition-colors">
                    <History className="w-5 h-5 text-indigo-600 group-hover:text-white" />
                  </div>
                  <span className="font-bold">View Transactions</span>
                </Link>
              </div>
            </div>

            {/* Recent Payments Preview */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Payments</h3>
              <div className="space-y-6">
                {recentTransactions.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No transactions found.</p>
                ) : (
                  recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className={`mt-1 p-1.5 rounded-full mr-3 ${tx.status === 'SUCCESS' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {tx.status === 'SUCCESS' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 capitalize">{tx.planId} Purchase</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(tx.transactionDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="text-sm font-extrabold text-gray-900">₹{tx.amount / 100}</span>
                    </div>
                  ))
                )}
              </div>
              <Link to="/transactions" className="block text-center mt-8 text-indigo-600 font-bold text-sm hover:underline">
                Manage All Payments
              </Link>
            </div>
          </div>

        </div>
      </div>
    </DashBoardLayout>
  );
};

export default Dashboard;
