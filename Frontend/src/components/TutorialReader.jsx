import { useState, useEffect } from "react";
import { BookOpen, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import ModernSidebar from "./ModernSidebar";
import ModernChapterContent from "./ModernChapterContent";
import ReadingPreferences from "./ReadingPreferences";
import ReadingContent from "./ReadingContent";

const TutorialReader = ({ tutorial }) => {
  const [activeChapter, setActiveChapter] = useState(0);
  const [isWideMode, setIsWideMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [showSummary, setShowSummary] = useState(true);

  // Scroll to top when chapter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeChapter]);

  if (!tutorial || !tutorial.chapters) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-gray-400 italic">
        📄 No tutorial loaded yet. Please generate one from a GitHub repo.
      </div>
    );
  }

  const handleNextChapter = () => {
    if (activeChapter < tutorial.chapters.length - 1) {
      setActiveChapter(activeChapter + 1);
    }
  };

  const handlePrevChapter = () => {
    if (activeChapter > 0) {
      setActiveChapter(activeChapter - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Sticky Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-gray-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Title section */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={() => window.location.reload()}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                title="Back to home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <BookOpen className="flex-shrink-0 w-6 h-6 text-blue-400" />
              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-white truncate">
                  {tutorial.title}
                </h1>
                <p className="text-xs text-gray-400">
                  Chapter {activeChapter + 1} of {tutorial.chapters.length}
                </p>
              </div>
            </div>

            {/* Reading preferences */}
            <div className="hidden md:block">
              <ReadingPreferences
                isWideMode={isWideMode}
                setIsWideMode={setIsWideMode}
                fontSize={fontSize}
                setFontSize={setFontSize}
              />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <ModernSidebar
              chapters={tutorial.chapters}
              activeChapter={activeChapter}
              setActiveChapter={setActiveChapter}
              flowchart={tutorial.flowchart}
            />
          </div>

          {/* Main content area */}
          <main className="lg:col-span-9 space-y-8">
            {/* Tutorial summary (collapsible) */}
            {showSummary && tutorial.summary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-slate-900/60 via-blue-950/40 to-slate-900/60 rounded-xl border border-blue-500/30 p-6 lg:p-8 backdrop-blur-md shadow-xl shadow-blue-500/5"
              >
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold text-blue-300">
                     Tutorial Overview
                  </h2>
                  <button
                    onClick={() => setShowSummary(false)}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Hide
                  </button>
                </div>
                <div
                  className={`${isWideMode ? "max-w-5xl" : "max-w-3xl"} mx-auto`}
                >
                  <ReadingContent content={tutorial.summary} isWideMode={isWideMode} />
                </div>
              </motion.div>
            )}

            {/* Chapter content */}
            <ModernChapterContent
              chapter={tutorial.chapters[activeChapter]}
              isWideMode={isWideMode}
              fontSize={fontSize}
            />

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between pt-8 border-t border-gray-800"
            >
              <button
                onClick={handlePrevChapter}
                disabled={activeChapter === 0}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all ${
                  activeChapter === 0
                    ? "text-gray-600 cursor-not-allowed"
                    : "text-blue-400 hover:text-blue-300 hover:bg-blue-600/10"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="text-center">
                <div className="text-sm text-gray-400">
                  {activeChapter + 1} / {tutorial.chapters.length}
                </div>
              </div>

              <button
                onClick={handleNextChapter}
                disabled={activeChapter === tutorial.chapters.length - 1}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all ${
                  activeChapter === tutorial.chapters.length - 1
                    ? "text-gray-600 cursor-not-allowed"
                    : "text-blue-400 hover:text-blue-300 hover:bg-blue-600/10"
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          </main>
        </div>
      </div>

      {/* Mobile reading preferences */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <ReadingPreferences
          isWideMode={isWideMode}
          setIsWideMode={setIsWideMode}
          fontSize={fontSize}
          setFontSize={setFontSize}
        />
      </div>

      {/* Mobile chapter selector */}
      <div className="lg:hidden fixed bottom-20 left-4 right-4 z-40">
        <details className="bg-gray-800/90 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden">
          <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-gray-300 hover:text-white">
            Chapters ({activeChapter + 1}/{tutorial.chapters.length})
          </summary>
          <div className="max-h-64 overflow-y-auto p-2 space-y-1">
            {tutorial.chapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => setActiveChapter(index)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeChapter === index
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                {chapter.title}
              </button>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
};

export default TutorialReader;
