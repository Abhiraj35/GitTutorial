import { ChevronRight } from "lucide-react";

const ChapterNavigation = ({
  activeChapter,
  totalChapters,
  setActiveChapter,
}) => (
  <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
    <button
      onClick={() => setActiveChapter(Math.max(0, activeChapter - 1))}
      disabled={activeChapter === 0}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
        activeChapter === 0
          ? "text-gray-500 cursor-not-allowed"
          : "text-blue-400 hover:text-blue-300 hover:bg-blue-600/20"
      }`}
    >
      <ChevronRight className="w-4 h-4 rotate-180" />
      Previous
    </button>

    <span className="text-sm text-gray-400">
      {activeChapter + 1} of {totalChapters}
    </span>

    <button
      onClick={() =>
        setActiveChapter(Math.min(totalChapters - 1, activeChapter + 1))
      }
      disabled={activeChapter === totalChapters - 1}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
        activeChapter === totalChapters - 1
          ? "text-gray-500 cursor-not-allowed"
          : "text-blue-400 hover:text-blue-300 hover:bg-blue-600/20"
      }`}
    >
      Next
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>
);

export default ChapterNavigation;