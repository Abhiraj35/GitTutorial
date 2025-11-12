import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Circle, BookOpen, GitBranch, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MermaidRenderer from "./MermaidRenderer";

const ModernSidebar = ({ chapters, activeChapter, setActiveChapter, flowchart }) => {
  const [completedChapters, setCompletedChapters] = useState(new Set());
  const [readingProgress, setReadingProgress] = useState(0);
  const [isFlowchartModalOpen, setIsFlowchartModalOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    // Mark chapters as completed when user moves past them
    if (activeChapter > 0) {
      setCompletedChapters((prev) => {
        const newSet = new Set(prev);
        for (let i = 0; i < activeChapter; i++) {
          newSet.add(i);
        }
        return newSet;
      });
    }

    // Calculate overall progress
    setReadingProgress(Math.round(((activeChapter + 1) / chapters.length) * 100));
  }, [activeChapter, chapters.length]);

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsFlowchartModalOpen(false);
      }
    };

    if (isFlowchartModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isFlowchartModalOpen]);

  return (
    <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-5">
        {/* Progress header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Progress
            </h2>
            <span className="text-xs font-medium text-blue-400">{readingProgress}%</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-400 h-full transition-all duration-500 ease-out"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
        </div>

        {/* Chapters list */}
        <nav className="space-y-1">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 px-2">
            Chapters
          </h3>
          {chapters.map((chapter, index) => {
            const isActive = activeChapter === index;
            const isCompleted = completedChapters.has(index);

            return (
              <button
                key={index}
                onClick={() => setActiveChapter(index)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                  isActive
                    ? "bg-blue-600/20 border border-blue-500/30"
                    : "hover:bg-gray-700/40 border border-transparent"
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
                )}

                <div className="flex items-start gap-3">
                  {/* Status icon */}
                  <div className="mt-0.5 flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : isActive ? (
                      <BookOpen className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-500" />
                    )}
                  </div>

                  {/* Chapter info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-medium ${
                          isActive ? "text-blue-400" : "text-gray-500"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p
                      className={`text-sm leading-snug transition-colors ${
                        isActive
                          ? "text-white font-medium"
                          : "text-gray-300 group-hover:text-white"
                      }`}
                    >
                      {chapter.title.replace(/^Chapter \d+:\s*/, "")}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Project Flowchart section */}
        {flowchart && (
          <div className="mt-6 pt-5 border-t border-gray-700/50">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 px-2 flex items-center gap-2">
              <GitBranch className="w-3.5 h-3.5" />
              Project Flowchart
            </h3>
            <div
              onClick={() => setIsFlowchartModalOpen(true)}
              className="bg-gray-900/50 rounded-lg p-2 border border-gray-700/50 overflow-auto max-h-[400px] cursor-pointer hover:border-blue-500/50 transition-colors group"
            >
              <div className="opacity-90 group-hover:opacity-100 transition-opacity">
                <MermaidRenderer chart={flowchart} id="sidebar-flowchart" />
              </div>
              <div className="text-xs text-gray-500 text-center mt-2 group-hover:text-blue-400 transition-colors">
                Click to enlarge
              </div>
            </div>
          </div>
        )}

        {/* Flowchart Modal - Rendered via Portal to document body */}
        {typeof document !== "undefined" &&
          createPortal(
            <AnimatePresence>
              {isFlowchartModalOpen && flowchart && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                  onClick={() => setIsFlowchartModalOpen(false)}
                >
                  <motion.div
                    ref={modalRef}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative bg-gray-900 rounded-xl border border-gray-700/50 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4 flex items-center justify-between z-10">
                      <div className="flex items-center gap-3">
                        <GitBranch className="w-5 h-5 text-blue-400" />
                        <h2 className="text-xl font-semibold text-white">Project Flowchart</h2>
                      </div>
                      <button
                        onClick={() => setIsFlowchartModalOpen(false)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        aria-label="Close modal"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6">
                      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
                        <MermaidRenderer chart={flowchart} id="modal-flowchart" />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}

        {/* Summary stats */}
        <div className="mt-6 pt-5 border-t border-gray-700/50">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-gray-700/30 rounded-lg p-3">
              <div className="text-2xl font-bold text-white">{chapters.length}</div>
              <div className="text-xs text-gray-400 mt-1">Chapters</div>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-400">
                {completedChapters.size}
              </div>
              <div className="text-xs text-gray-400 mt-1">Completed</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ModernSidebar;
