import { Copy } from "lucide-react";
import { useState } from "react";

const ChapterContent = ({
  chapter,
  renderCodeBlock,
  formatContent,
  getChapterIcon,
}) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = async (content, index) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="bg-gray-800/30 rounded-xl p-8 backdrop-blur-sm border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-blue-400">{getChapterIcon()}</div>
        <h2 className="text-2xl font-bold text-gray-100">{chapter.title}</h2>
      </div>

      <div className="prose prose-invert max-w-none">
        {renderCodeBlock(chapter.content).map((part, index) => (
          <div key={index}>
            {part.type === "code" ? (
              <div className="my-6 relative group">
                <div className="bg-gray-900 rounded-t-lg px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-mono">
                    {part.language}
                  </span>
                  <button
                    onClick={() => handleCopy(part.content, index)}
                    className="text-gray-400 hover:text-white flex items-center gap-1 text-xs transition-opacity opacity-0 group-hover:opacity-100"
                  >
                    <Copy className="w-4 h-4" />
                    {copiedIndex === index ? "Copied!" : "Copy"}
                  </button>
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
                  __html: `<p class="mb-4">${formatContent(part.content)}</p>`,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterContent;