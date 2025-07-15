import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

const MermaidRenderer = ({ chart }) => {
  const ref = useRef(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true, theme: "dark" });
    if (ref.current) {
      ref.current.innerHTML = chart;
      mermaid.contentLoaded();
    }
  }, [chart]);

  return <div ref={ref} className="overflow-auto rounded-lg bg-gray-900 p-4" />;
};

export default MermaidRenderer;
