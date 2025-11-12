import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

const MermaidRenderer = ({ chart, id }) => {
  const mermaidRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize mermaid only once
    if (!isInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: {
          primaryColor: "#3b82f6",
          primaryTextColor: "#ffffff",
          primaryBorderColor: "#1e40af",
          lineColor: "#60a5fa",
          secondaryColor: "#1e3a8a",
          tertiaryColor: "#1e40af",
          background: "#1e293b",
          mainBkg: "#1e293b",
          secondBkg: "#0f172a",
          textColor: "#e2e8f0",
          border1: "#475569",
          border2: "#64748b",
          arrowheadColor: "#60a5fa",
          clusterBkg: "#1e3a8a",
          clusterBorder: "#3b82f6",
          defaultLinkColor: "#60a5fa",
          titleColor: "#ffffff",
          edgeLabelBackground: "#1e293b",
          actorBorder: "#3b82f6",
          actorBkg: "#1e3a8a",
          actorTextColor: "#ffffff",
          actorLineColor: "#60a5fa",
          signalColor: "#60a5fa",
          signalTextColor: "#ffffff",
          labelBoxBkgColor: "#1e3a8a",
          labelBoxBorderColor: "#3b82f6",
          labelTextColor: "#ffffff",
          loopTextColor: "#ffffff",
          noteBorderColor: "#3b82f6",
          noteBkgColor: "#1e3a8a",
          noteTextColor: "#ffffff",
          activationBorderColor: "#3b82f6",
          activationBkgColor: "#1e3a8a",
          sequenceNumberColor: "#ffffff",
        },
      });
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (!chart || !mermaidRef.current || !isInitialized) return;

    // Clear previous content
    mermaidRef.current.innerHTML = "";

    // Create a unique ID for this render
    const uniqueId = `mermaid-${id}-${Date.now()}`;

    // Render the chart
    mermaid
      .render(uniqueId, chart)
      .then((result) => {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = result.svg;
        }
      })
      .catch((error) => {
        console.error("Mermaid rendering error:", error);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `<div class="text-red-400 p-4 text-sm">Error rendering flowchart: ${error.message}</div>`;
        }
      });
  }, [chart, id, isInitialized]);

  if (!chart) return null;

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-gray-700/50 shadow-xl bg-gray-900/50 p-4">
      <div ref={mermaidRef} className="flex justify-center items-center min-h-[200px] overflow-x-auto"></div>
    </div>
  );
};

export default MermaidRenderer;

