import { ChevronRight, ChevronDown, FileText } from "lucide-react";

const Sidebar = ({
  chapters,
  activeChapter,
  setActiveChapter,
  showFlowchart,
  setShowFlowchart,
  getChapterIcon,
}) => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sticky top-32">
    <h2 className="text-lg font-semibold mb-4 text-gray-200">Chapters</h2>
    <nav className="space-y-2">
      {chapters.map((chapter, index) => (
        <button
          key={index}
          onClick={() => setActiveChapter(index)}
          className={`w-full text-left p-3 rounded-lg flex items-center gap-3 group ${
            activeChapter === index
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white"
          }`}
        >
          <div
            className={`${
              activeChapter === index
                ? "text-blue-200"
                : "text-gray-400 group-hover:text-gray-300"
            }`}
          >
            {getChapterIcon(index)}
          </div>
          <span className="text-sm font-medium truncate">
            {chapter.title.replace(/^Chapter \d+: /, "")}
          </span>
        </button>
      ))}
    </nav>

    <div className="mt-6 pt-4 border-t border-gray-700">
      <button
        onClick={() => setShowFlowchart(!showFlowchart)}
        className="w-full p-3 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg flex items-center gap-3 text-purple-300 hover:text-purple-200"
      >
        <FileText className="w-5 h-5" />
        <span className="text-sm font-medium">Project Structure</span>
        {showFlowchart ? (
          <ChevronDown className="w-4 h-4 ml-auto" />
        ) : (
          <ChevronRight className="w-4 h-4 ml-auto" />
        )}
      </button>
    </div>
  </div>
);

export default Sidebar;
