import { useState } from "react";
import { BookOpen, Code, FileText, Lightbulb, Star, Clock } from "lucide-react";

import TutorialHeader from "./TutorialHeader";
import Sidebar from "./Sidebar";
import TutorialSummary from "./TutorialSummary";
import FlowchartSection from "./FlowchartSection";
import ChapterContent from "./ChapterContent";
import ChapterNavigation from "./ChapterNavigation";


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

  const formatContent = (content) =>
    content
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
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-800 text-white">
      <TutorialHeader title={tutorial.title} chapters={tutorial.chapters} />
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Sidebar
          chapters={tutorial.chapters}
          activeChapter={activeChapter}
          setActiveChapter={setActiveChapter}
          showFlowchart={showFlowchart}
          setShowFlowchart={setShowFlowchart}
          getChapterIcon={getChapterIcon}
        />

        <div className="lg:col-span-3">
          <TutorialSummary
            summary={tutorial.summary}
            formatContent={formatContent}
          />
          {showFlowchart && <FlowchartSection flowchart={tutorial.flowchart} />}
          <ChapterContent
            chapter={tutorial.chapters[activeChapter]}
            renderCodeBlock={renderCodeBlock}
            formatContent={formatContent}
            getChapterIcon={() => getChapterIcon(activeChapter)}
          />
          <ChapterNavigation
            activeChapter={activeChapter}
            totalChapters={tutorial.chapters.length}
            setActiveChapter={setActiveChapter}
          />
        </div>
      </div>
    </div>
  );
};

export default TutorialReader;
