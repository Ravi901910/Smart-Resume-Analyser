import { useEffect, useState } from 'react';

export default function ScoreCard({ label, score, maxScore = 100, icon: Icon, color = 'violet', description }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const percentage = (score / maxScore) * 100;

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  const colorSchemes = {
    violet: {
      gradient: 'from-violet-500 to-indigo-500',
      bg: 'bg-violet-50',
      text: 'text-violet-600',
      ring: '#8b5cf6',
      shadow: 'shadow-violet-500/20',
    },
    emerald: {
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      ring: '#10b981',
      shadow: 'shadow-emerald-500/20',
    },
    blue: {
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      ring: '#3b82f6',
      shadow: 'shadow-blue-500/20',
    },
    amber: {
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      ring: '#f59e0b',
      shadow: 'shadow-amber-500/20',
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.violet;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (animatedScore / maxScore) * circumference;

  const getScoreLabel = (s) => {
    if (s >= 80) return { text: 'Excellent', color: 'text-emerald-600' };
    if (s >= 60) return { text: 'Good', color: 'text-blue-600' };
    if (s >= 40) return { text: 'Fair', color: 'text-amber-600' };
    return { text: 'Needs Work', color: 'text-red-500' };
  };

  const scoreLabel = getScoreLabel(score);

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md ${scheme.shadow} transition-all duration-300 group`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg ${scheme.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <Icon className={`w-4.5 h-4.5 ${scheme.text}`} />
          </div>
        )}
      </div>

      {/* Circular progress */}
      <div className="flex items-center gap-5">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
            {/* Progress circle */}
            <circle
              cx="50" cy="50" r="40" fill="none"
              stroke={scheme.ring}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-800">{animatedScore}</span>
          </div>
        </div>
        <div>
          <span className={`text-sm font-semibold ${scoreLabel.color}`}>{scoreLabel.text}</span>
          <p className="text-xs text-slate-400 mt-1">out of {maxScore}</p>
        </div>
      </div>
    </div>
  );
}
