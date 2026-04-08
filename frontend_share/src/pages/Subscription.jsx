import React, { useContext, useEffect, useState } from "react";
import DashBoardLayout from "../layout/DashBoardLayout";
import { useAuth, useUser } from "@clerk/clerk-react";
import { UserCreditsContext } from "../context/UserCreditContext";
import { Check, Loader2, Sparkles, Zap, ShieldCheck } from "lucide-react";
import axios from "axios";
import apiEndpoints from "../utils/apiEndPoints";
import toast from "react-hot-toast";

const plans = [
  {
    id: "free",
    name: "Starter",
    price: 0,
    credits: 5,
    features: ["5 Credits", "Basic File Sharing", "Email Support", "Community Access"],
    buttonText: "Current Plan",
    recommended: false,
    icon: <Zap className="w-6 h-6 text-blue-500" />,
  },
  {
    id: "premium",
    name: "Premium",
    price: 499,
    amount: 49900, // paise
    credits: 500,
    features: ["500 Credits", "Priority Support", "Public & Private Sharing", "Ad-free Experience", "No Expiry on Credits"],
    buttonText: "Buy Now",
    recommended: true,
    icon: <Sparkles className="w-6 h-6 text-purple-500" />,
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: 1999,
    amount: 199900, // paise
    credits: 5000,
    features: ["5000 Credits", "VIP Support", "Advanced Security", "Unlimited Sharing", "Priority Processing", "Custom Branding"],
    buttonText: "Buy Now",
    recommended: false,
    icon: <ShieldCheck className="w-6 h-6 text-indigo-500" />,
  },
];

const Subscription = () => {
  const [processingPayment, setProcessingPayment] = useState(null); // stores plan.id
  const { getToken } = useAuth();
  const { user } = useUser();
  const { credits, setCredits, fetchUserCredits } = useContext(UserCreditsContext);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (plan) => {
    if (plan.id === "free") return;

    setProcessingPayment(plan.id);
    try {
      const token = await getToken();

      // 1. Create Order in Backend
      const orderResponse = await axios.post(
        apiEndpoints.CREATE_ORDER,
        {
          amount: plan.amount,
          currency: "INR",
          planId: plan.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || "Failed to create order");
      }

      const { orderId } = orderResponse.data;

      // 2. Open Razorpay Checkout
      const options = {
        key: "rzp_test_SXnVIp1u3lqsCr", // This should ideally be an env variable
        amount: plan.amount,
        currency: "INR",
        name: "DocSphere",
        description: `Purchase ${plan.credits} Credits`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // 3. Verify Payment in Backend
            const verifyResponse = await axios.post(
              apiEndpoints.VERIFY_PAYMENT,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: plan.id,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (verifyResponse.data.success) {
              toast.success("Payment Successful!");
              if (verifyResponse.data.credits) {
                setCredits(verifyResponse.data.credits);
              } else {
                fetchUserCredits();
              }
            } else {
              toast.error(verifyResponse.data.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Verification Error:", error);
            toast.error("Error verifying payment");
          }
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
        },
        theme: {
          color: "#4F46E5",
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error(error.response?.data?.message || "Failed to initiate payment");
    } finally {
      setProcessingPayment(null);
    }
  };

  return (
    <DashBoardLayout activeMenu="Subscription">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Choose Your <span className="text-indigo-600">Plan</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Get more credits to share your documents securely.
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium">
            <Zap className="w-4 h-4 mr-2" />
            Active Credits: <span className="ml-1 font-bold">{credits}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border ${
                plan.recommended
                  ? "border-indigo-600 shadow-xl scale-105 z-10"
                  : "border-gray-200 shadow-sm"
              } bg-white p-8 flex flex-col`}
            >
              {plan.recommended && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide">
                  Most Popular
                </span>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gray-50">{plan.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              </div>

              <div className="mb-8">
                <p className="flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight text-gray-900">
                    ₹{plan.price}
                  </span>
                  <span className="ml-1 text-xl font-semibold text-gray-500">
                    /one-time
                  </span>
                </p>
                <p className="mt-2 text-indigo-600 font-semibold">
                  {plan.credits} Credits Included
                </p>
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePayment(plan)}
                disabled={(plan.id === "free" && credits >= 0) || processingPayment === plan.id}
                className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-200 flex items-center justify-center ${
                  plan.id === "free"
                    ? "bg-gray-100 text-gray-500 cursor-default"
                    : plan.recommended
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200"
                    : "bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50"
                } ${processingPayment === plan.id ? "opacity-75 cursor-wait" : ""}`}
              >
                {processingPayment === plan.id ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  plan.buttonText
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Need a Custom Plan?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                If you have specific requirements for your organization or enterprise,
                we can create a tailored package just for you.
              </p>
              <button className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
                Contact Sales
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Secure", desc: "Enterprise-grade encryption" },
                { title: "Fast", desc: "Global CDN delivery" },
                { title: "24/7", desc: "Round-the-clock support" },
                { title: "Safe", desc: "Compliant with regulations" },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashBoardLayout>
  );
};

export default Subscription;
