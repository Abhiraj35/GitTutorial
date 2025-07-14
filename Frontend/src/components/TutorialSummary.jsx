const TutorialSummary = ({ summary, formatContent }) => (
  <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 mb-8 border border-blue-500/20">
    <h2 className="text-xl font-semibold mb-4 text-blue-300">
      Tutorial Summary
    </h2>
    <div
      className="text-gray-300 leading-relaxed"
      dangerouslySetInnerHTML={{
        __html: `<p class="mb-4">${formatContent(summary)}</p>`,
      }}
    />
  </div>
);

export default TutorialSummary;

