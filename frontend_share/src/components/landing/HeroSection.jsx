import React from "react";
import { assets } from "../../assets/assets";

const HeroSection = () => {
  return (
    <div class="landing-page-content ralative ">
      <div className="absolute h-full inset-0 bg-gradient-to-r from-purple-50 to-indigo-50 opacity-80 z-0 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Share Files Securely with</span>
              <span className="block text-purple-500">CloudShare</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto tet-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Upload,manage,and share your files securly. Accessible anywhere,
              anytime.
            </p>
            <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
              <div className=" space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                <button className="flex items-center justify-centerpx-6 py-3 md:px-10 md:py-4text-base md:text-lg font-semibold rounded-md text-white bg-purple-500 hover:bg-purple-600shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                  Get Started
                </button>
                <button className="flex items-center justify-center px-6 py-3 md:px-10 md:py-4 text-base md:text-lg font-semibold rounded-md text-gray-700 bg-white border border-gray-200 shadow-md transition-all duration-300 ease-out hover:bg-gray-50 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-w-16 rounded-lg shadow-xl overflow-hidden">
            <img
              src={assets.dashboard}
              alt="cloudshare dashboard"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-t0-t from-black opacity-10 rounded-lg"></div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <p className="mt-4 text-base text-black">
          All your files are encrypted and stored securely with top-grade
          security protocols.
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
