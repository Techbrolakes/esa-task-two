import React from "react";

export const Skeleton = () => {
  return (
    <div className="min-h-screen py-6 text-white p-4 bg-gradient-to-br from-gray-900 via-[#060C21] to-gray-900">
      <div className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-800/50 rounded-lg w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-800/50 rounded-lg"></div>
            ))}
          </div>
          <div className="p-6 bg-gray-800/40 rounded-lg border border-gray-700 space-y-4">
            <div className="h-4 bg-gray-800/50 rounded-lg w-3/4"></div>
            <div className="h-4 bg-gray-800/50 rounded-lg w-2/3"></div>
            <div className="h-4 bg-gray-800/50 rounded-lg w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
