import React from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";

interface SearchLoadingProps {
  searchQuery: string;
}

const SearchLoading: React.FC<SearchLoadingProps> = ({ searchQuery }) => {
  return (
    <div className="w-full">
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 mb-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center"
          >
            <Search className="w-4 h-4 text-white" />
          </motion.div>
          <Sparkles className="w-6 h-6 text-primary" />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-semibold mb-2"
        >
          Searching for "{searchQuery}"...
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground mb-8"
        >
          Analyzing market data and finding the best matches
        </motion.p>

        {/* Loading dots */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Loading skeleton */}
        <div className="mt-8 space-y-3 max-w-md mx-auto">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex items-center gap-3 p-3 glass rounded-lg"
            >
              <div className="w-8 h-8 bg-muted rounded animate-pulse" />
              <div className="flex-1 space-y-2">
                <div
                  className="h-4 bg-muted rounded animate-pulse"
                  style={{ width: `${60 + Math.random() * 30}%` }}
                />
                <div
                  className="h-3 bg-muted rounded animate-pulse"
                  style={{ width: `${40 + Math.random() * 20}%` }}
                />
              </div>
              <div className="w-16 h-4 bg-muted rounded animate-pulse" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchLoading;
