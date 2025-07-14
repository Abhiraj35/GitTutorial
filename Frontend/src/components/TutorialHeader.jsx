import { BookOpen, Users, Clock } from "lucide-react";

const TutorialHeader = ({ title, chapters }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-6 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>Beginner Friendly</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{chapters.length} Chapters</span>
        </div>
      </div>
    </div>
  </div>
);

export default TutorialHeader;
