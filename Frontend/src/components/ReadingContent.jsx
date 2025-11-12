import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import MermaidRenderer from "./MermaidRenderer";

const ReadingContent = ({ content, isWideMode = false }) => {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = async (code, index) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(index);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className={`mx-auto transition-all duration-300 ${
        isWideMode ? "max-w-5xl" : "max-w-3xl"
      }`}
    >
      <article className="prose prose-lg prose-invert prose-slate max-w-none">
        <ReactMarkdown
          components={{
            // Headings
            h1: ({ children }) => (
              <h1 className="text-4xl font-bold text-white mb-6 mt-10 leading-tight">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-3xl font-semibold text-gray-100 mb-5 mt-10 leading-snug border-b border-gray-700 pb-3">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-2xl font-semibold text-gray-200 mb-4 mt-8">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-xl font-medium text-gray-300 mb-3 mt-6">
                {children}
              </h4>
            ),

            // Paragraphs
            p: ({ children }) => (
              <p className="text-gray-300 leading-[1.8] mb-6 text-lg">
                {children}
              </p>
            ),

            // Lists
            ul: ({ children }) => (
              <ul className="space-y-2 mb-6 text-gray-300 list-disc list-inside">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="space-y-2 mb-6 text-gray-300 list-decimal list-inside">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed pl-2">{children}</li>
            ),

            // Inline code
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              const codeString = String(children).replace(/\n$/, "");
              const codeIndex = `${codeString.substring(0, 20)}-${Math.random()}`;

              // Check if it's a Mermaid diagram
              if (!inline && match && match[1] === "mermaid") {
                return (
                  <div className="my-6">
                    <MermaidRenderer chart={codeString} id={`mermaid-${codeIndex}`} />
                  </div>
                );
              }

              return !inline && match ? (
                // Code block with syntax highlighting
                <div className="relative group my-6 rounded-lg overflow-hidden border border-gray-700/50 shadow-xl">
                  <div className="flex items-center justify-between bg-gray-900/80 px-4 py-2.5 border-b border-gray-700/50">
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-wide">
                      {match[1]}
                    </span>
                    <button
                      onClick={() => handleCopyCode(codeString, codeIndex)}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors px-2 py-1 rounded hover:bg-gray-800"
                    >
                      {copiedCode === codeIndex ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    className="!m-0 !bg-gray-900/50 text-sm"
                    customStyle={{
                      margin: 0,
                      padding: "1.25rem",
                      background: "transparent",
                      fontSize: "0.9rem",
                      lineHeight: "1.6",
                    }}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              ) : (
                // Inline code
                <code
                  className="px-2 py-0.5 bg-gray-800/60 text-blue-300 rounded text-sm font-mono border border-gray-700/50"
                  {...props}
                >
                  {children}
                </code>
              );
            },

            // Blockquotes
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 pl-6 py-2 my-6 bg-blue-500/5 rounded-r italic text-gray-300">
                {children}
              </blockquote>
            ),

            // Links
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/30 hover:decoration-blue-300 transition-colors"
              >
                {children}
              </a>
            ),

            // Strong/Bold
            strong: ({ children }) => (
              <strong className="font-semibold text-white">{children}</strong>
            ),

            // Emphasis/Italic
            em: ({ children }) => (
              <em className="italic text-gray-200">{children}</em>
            ),

            // Horizontal rule
            hr: () => <hr className="my-8 border-gray-700" />,

            // Tables
            table: ({ children }) => (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full border border-gray-700 rounded-lg">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-gray-800">{children}</thead>
            ),
            tbody: ({ children }) => (
              <tbody className="divide-y divide-gray-700">{children}</tbody>
            ),
            tr: ({ children }) => <tr>{children}</tr>,
            th: ({ children }) => (
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-3 text-sm text-gray-300">{children}</td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
};

export default ReadingContent;
