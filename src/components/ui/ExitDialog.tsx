import { X } from "lucide-react";
import React from "react";

const ExitDialog = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700 shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-white">Your changes will be saved for a while</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-300 mb-6">it&apos;s okay to leave, your changes will be saved automatically for a while</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Stay
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitDialog;
