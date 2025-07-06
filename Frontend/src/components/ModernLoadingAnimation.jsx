import { Github, Code, Brain, Zap } from 'lucide-react';

const ModernLoadingAnimation = ({ 
  title = "Processing Repository",
  subtitle = "Analyzing code and generating tutorial...",
  variant = "github"
}) => {
  const iconMap = {
    github: Github,
    code: Code,
    brain: Brain,
    zap: Zap
  };

  const SelectedIcon = iconMap[variant] || Github;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8">
      {/* Spinner and Icon */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500 animate-spin"></div>
        <div className="absolute inset-2 w-28 h-28 rounded-full border-4 border-transparent border-b-blue-500 border-l-cyan-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
        <div className="absolute inset-4 w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse flex items-center justify-center">
          <SelectedIcon className="w-10 h-10 text-white animate-bounce" />
        </div>
      </div>

      {/* Text and Progress */}
      <div className="mt-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300 mb-6">{subtitle}</p>
        
      </div>
    </div>
  );
};

export default ModernLoadingAnimation;
