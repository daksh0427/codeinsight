import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false, text = 'Loading...' }) => {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-dark-400 border-t-accent-purple animate-spin" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-b-accent-cyan animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-dark-200 text-sm font-medium"
      >
        {text}
      </motion.p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
};

// Skeleton card for dashboard loading state
export const SkeletonCard = () => (
  <div className="glass-card p-5">
    <div className="flex items-center gap-2 mb-3">
      <div className="skeleton w-16 h-5 rounded-full" />
      <div className="skeleton w-20 h-5 rounded-full" />
    </div>
    <div className="skeleton w-3/4 h-5 rounded mb-2" />
    <div className="skeleton w-full h-4 rounded mb-1" />
    <div className="skeleton w-2/3 h-4 rounded mb-4" />
    <div className="skeleton w-full h-24 rounded-lg mb-4" />
    <div className="flex items-center justify-between">
      <div className="skeleton w-20 h-4 rounded" />
      <div className="skeleton w-28 h-8 rounded-lg" />
    </div>
  </div>
);

export default Loader;
