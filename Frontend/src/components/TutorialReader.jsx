import React, { useState } from "react";
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  Code,
  FileText,
  Lightbulb,
  Star,
  Clock,
  Users,
} from "lucide-react";

const TutorialReader = ({ tutorial }) => {
  const [activeChapter, setActiveChapter] = useState(0);
  const [showFlowchart, setShowFlowchart] = useState(false);

  if (!tutorial || !tutorial.chapters) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-gray-400 italic">
        📄 No tutorial loaded yet. Please generate one from a GitHub repo.
      </div>
    );
  }

  const formatContent = (content) => {
    return content
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-semibold text-blue-400">$1</strong>'
      )
      .replace(/\*(.*?)\*/g, '<em class="italic text-yellow-400">$1</em>')
      .replace(
        /`(.*?)`/g,
        '<code class="bg-gray-800 text-green-400 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
      )
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, "<br/>");
  };

  const renderCodeBlock = (content) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: content.slice(lastIndex, match.index),
        });
      }
      parts.push({
        type: "code",
        language: match[1] || "text",
        content: match[2].trim(),
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({ type: "text", content: content.slice(lastIndex) });
    }

    return parts.length > 0 ? parts : [{ type: "text", content }];
  };

  const getChapterIcon = (index) => {
    const icons = [BookOpen, Code, FileText, Lightbulb, Star, Clock];
    const Icon = icons[index % icons.length];
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {tutorial.title}
            </h1>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Beginner Friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{tutorial.chapters.length} Chapters</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sticky top-32">
              <h2 className="text-lg font-semibold mb-4 text-gray-200">
                Chapters
              </h2>
              <nav className="space-y-2">
                {tutorial.chapters.map((chapter, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveChapter(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 group ${
                      activeChapter === index
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <div
                      className={`transition-colors ${
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
                  className="w-full p-3 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg transition-colors flex items-center gap-3 text-purple-300 hover:text-purple-200"
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
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 mb-8 border border-blue-500/20">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">
                Tutorial Summary
              </h2>
              <div
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: `<p class="mb-4">${formatContent(
                    tutorial.summary
                  )}</p>`,
                }}
              />
            </div>

            {showFlowchart && (
              <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-purple-300">
                  Project Structure Flowchart
                </h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-green-400 font-mono whitespace-pre">
                    {tutorial.flowchart}
                  </pre>
                </div>
              </div>
            )}

            {/* Chapter Content */}
            <div className="bg-gray-800/30 rounded-xl p-8 backdrop-blur-sm border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-blue-400">
                  {getChapterIcon(activeChapter)}
                </div>
                <h2 className="text-2xl font-bold text-gray-100">
                  {tutorial.chapters[activeChapter].title}
                </h2>
              </div>

              <div className="prose prose-invert max-w-none">
                {renderCodeBlock(
                  tutorial.chapters[activeChapter].content
                ).map((part, index) => (
                  <div key={index}>
                    {part.type === "code" ? (
                      <div className="my-6">
                        <div className="bg-gray-900 rounded-t-lg px-4 py-2 border-b border-gray-700">
                          <span className="text-xs text-gray-400 font-mono">
                            {part.language}
                          </span>
                        </div>
                        <pre className="bg-gray-900 rounded-b-lg p-4 overflow-x-auto border border-gray-700">
                          <code className="text-sm text-green-400 font-mono whitespace-pre">
                            {part.content}
                          </code>
                        </pre>
                      </div>
                    ) : (
                      <div
                        className="text-gray-300 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: `<p class="mb-4">${formatContent(
                            part.content
                          )}</p>`,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Chapter Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
                <button
                  onClick={() =>
                    setActiveChapter(Math.max(0, activeChapter - 1))
                  }
                  disabled={activeChapter === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeChapter === 0
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-blue-400 hover:text-blue-300 hover:bg-blue-600/20"
                  }`}
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Previous
                </button>

                <span className="text-sm text-gray-400">
                  {activeChapter + 1} of {tutorial.chapters.length}
                </span>

                <button
                  onClick={() =>
                    setActiveChapter(
                      Math.min(
                        tutorial.chapters.length - 1,
                        activeChapter + 1
                      )
                    )
                  }
                  disabled={activeChapter === tutorial.chapters.length - 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeChapter === tutorial.chapters.length - 1
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-blue-400 hover:text-blue-300 hover:bg-blue-600/20"
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialReader;
