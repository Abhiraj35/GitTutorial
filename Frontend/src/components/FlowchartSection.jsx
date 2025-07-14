const FlowchartSection = ({ flowchart }) => (
  <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
    <h3 className="text-lg font-semibold mb-4 text-purple-300">
      Project Structure Flowchart
    </h3>
    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
      <pre className="text-sm text-green-400 font-mono whitespace-pre">
        {flowchart}
      </pre>
    </div>
  </div>
);

export default FlowchartSection;
