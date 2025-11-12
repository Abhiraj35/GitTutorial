import { FaStar } from "react-icons/fa";

export default function TutorialCard({ repo, onClick }) {
  return (
    <button
      onClick={() => onClick && onClick(repo.url)}
      className="w-full p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all duration-300 hover:scale-105 text-left group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
          {repo.name}
        </h3>
        <div className="flex items-center gap-1 text-yellow-400 text-sm">
          <FaStar className="w-4 h-4" />
          <span>{repo.stars}</span>
        </div>
      </div>
      <p className="text-sm text-gray-400">{repo.description}</p>
    </button>
  );
}
