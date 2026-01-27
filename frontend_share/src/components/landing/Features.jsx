import React from "react";

const Features = ({features}) => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Everything you need for the file sharing
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            CloudShare provides all the tools you need to manage your digital
            content
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature cards go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
