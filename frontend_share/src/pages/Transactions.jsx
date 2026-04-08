import React, { useEffect, useState } from "react";
import DashBoardLayout from "../layout/DashBoardLayout";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import apiEndpoints from "../utils/apiEndPoints";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  ArrowUpDown, 
  Download, 
  ReceiptIndianRupee 
} from "lucide-react";
import toast from "react-hot-toast";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const fetchTransactions = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(apiEndpoints.GET_PAYMENT_HISTORY, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transaction history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [getToken]);

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            Completed
          </span>
        );
      case "FAILED":
      case "ERROR":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <XCircle className="w-3.5 h-3.5 mr-1.5" />
            Failed
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <DashBoardLayout activeMenu="Transactions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Transaction <span className="text-indigo-600">History</span>
            </h1>
            <p className="mt-2 text-gray-600">
              Track and manage all your credit purchases in one place.
            </p>
          </div>
          <button className="flex items-center justify-center px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold shadow-sm hover:bg-gray-50 transition-all">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <ReceiptIndianRupee className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total spent</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ₹ {transactions.filter(t => t.status === "SUCCESS").reduce((acc, curr) => acc + curr.amount/100, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Successful transactions</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {transactions.filter(t => t.status === "SUCCESS").length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {transactions.filter(t => t.status === "PENDING").length}
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Plan & Credits
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="5" className="px-6 py-8">
                        <div className="h-4 bg-gray-100 rounded w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-400">
                          {transaction.paymentId || "order_"+transaction.orderId.slice(-6)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 capitalize">
                            {transaction.planId} Plan
                          </span>
                          <span className="text-xs text-indigo-600 font-medium">
                            +{transaction.creditsAdded} Credits
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-extrabold text-gray-900">
                          ₹{transaction.amount / 100}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {formatDate(transaction.transactionDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(transaction.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashBoardLayout>
  );
};

export default Transactions;