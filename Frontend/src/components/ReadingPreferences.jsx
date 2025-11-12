import { Maximize2, Minimize2, Type } from "lucide-react";

const ReadingPreferences = ({ isWideMode, setIsWideMode, fontSize, setFontSize }) => {
  return (
    <div className="flex items-center gap-3 bg-gray-800/30 backdrop-blur-sm rounded-lg p-2 border border-gray-700/50">
      {/* Reading width toggle */}
      <button
        onClick={() => setIsWideMode(!isWideMode)}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm font-medium ${
          isWideMode
            ? "bg-blue-600 text-white"
            : "bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white"
        }`}
        title={isWideMode ? "Switch to narrow mode" : "Switch to wide mode"}
      >
        {isWideMode ? (
          <>
            <Minimize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Narrow</span>
          </>
        ) : (
          <>
            <Maximize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Wide</span>
          </>
        )}
      </button>

      {/* Font size controls */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-md">
        <Type className="w-4 h-4 text-gray-400" />
        <button
          onClick={() => setFontSize(Math.max(fontSize - 1, 14))}
          disabled={fontSize <= 14}
          className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-bold"
          title="Decrease font size"
        >
          −
        </button>
        <span className="text-xs text-gray-400 w-8 text-center">{fontSize}px</span>
        <button
          onClick={() => setFontSize(Math.min(fontSize + 1, 22))}
          disabled={fontSize >= 22}
          className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-bold"
          title="Increase font size"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ReadingPreferences;
