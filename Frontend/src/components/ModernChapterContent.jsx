import { motion } from "framer-motion";
import ReadingContent from "./ReadingContent";

const ModernChapterContent = ({ chapter, isWideMode, fontSize }) => {
  return (
    <motion.div
      key={chapter.title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 lg:p-12"
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Chapter header */}
      <div className="mb-8 pb-6 border-b border-gray-700/50">
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          {chapter.title.replace(/^Chapter \d+:\s*/, "")}
        </h1>
        <div className="flex items-center gap-4 mt-3">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide px-2 py-1 bg-gray-700/50 rounded">
            {chapter.title.match(/^Chapter \d+/)?.[0] || "Chapter"}
          </span>
        </div>
      </div>

      {/* Chapter content */}
      <ReadingContent content={chapter.content} isWideMode={isWideMode} />
    </motion.div>
  );
};

export default ModernChapterContent;
