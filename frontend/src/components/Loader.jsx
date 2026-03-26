export default function Loader({ message = 'Analyzing your resume...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* Animated spinner */}
      <div className="relative w-20 h-20 mb-8">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-violet-100 animate-pulse" />
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-600 animate-spin" />
        {/* Inner glow */}
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 animate-pulse" />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-violet-600 animate-bounce" />
        </div>
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{message}</h3>
      <p className="text-sm text-slate-500">This may take a few seconds...</p>

      {/* Progress bar animation */}
      <div className="mt-6 w-64 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full animate-progress" />
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          80% { width: 90%; }
          100% { width: 95%; }
        }
        .animate-progress {
          animation: progress 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
