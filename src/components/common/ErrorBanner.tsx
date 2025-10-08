import * as React from "react";
import { motion } from "motion/react";

export default function ErrorBanner({ error, onClose }: { error: string; onClose: () => void }) {
  return (
    <motion.div 
      className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm">{error}</p>
        <button 
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
}


