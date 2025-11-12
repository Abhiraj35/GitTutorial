import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";

export default function RepoInput({ value, onChange, onSubmit, loading }) {
  function isValidGitHubUrl(url) {
    return /^https:\/\/github\.com\/[^\/]+\/[^\/]+$/.test(url.trim());
  }

  const handleSubmit = (event) => {
    if (event && event.preventDefault) event.preventDefault();

    if (!isValidGitHubUrl(value)) {
      alert("❗ Please enter a valid GitHub repository URL.");
      return;
    }
    if (onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <motion.div
        className="relative"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative flex items-center gap-2 bg-gray-900/50 border-2 border-gray-700 rounded-2xl p-1 focus-within:border-purple-500 focus-within:shadow-lg focus-within:shadow-purple-500/20 transition-all duration-300">
          <input
            type="text"
            placeholder="Paste GitHub repository URL..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-transparent px-6 py-4 text-white placeholder-gray-400 outline-none"
          />

          <motion.button
            type="submit"
            disabled={loading || !value.trim()}
            className="mr-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Analyzing...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Generate Tutorial</span>
                <span className="sm:hidden">Generate</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </form>
  );
}
