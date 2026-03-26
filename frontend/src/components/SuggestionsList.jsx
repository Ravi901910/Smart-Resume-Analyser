import { Lightbulb, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

export default function SuggestionsList({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null;

  const typeConfig = {
    improvement: {
      icon: Lightbulb,
      borderColor: 'border-l-amber-400',
      bgColor: 'bg-amber-50/50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      badge: 'Improvement',
      badgeBg: 'bg-amber-100 text-amber-700',
    },
    warning: {
      icon: AlertTriangle,
      borderColor: 'border-l-red-400',
      bgColor: 'bg-red-50/50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500',
      badge: 'Warning',
      badgeBg: 'bg-red-100 text-red-700',
    },
    positive: {
      icon: CheckCircle,
      borderColor: 'border-l-emerald-400',
      bgColor: 'bg-emerald-50/50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      badge: 'Strength',
      badgeBg: 'bg-emerald-100 text-emerald-700',
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          Suggestions & Insights
        </h2>
        <p className="text-xs text-slate-400 mt-1">{suggestions.length} recommendations found</p>
      </div>

      <div className="p-4 space-y-3">
        {suggestions.map((suggestion, i) => {
          const type = suggestion.type || 'improvement';
          const config = typeConfig[type] || typeConfig.improvement;
          const Icon = config.icon;

          return (
            <div
              key={i}
              className={`border-l-4 ${config.borderColor} ${config.bgColor} rounded-xl p-4 hover:translate-x-1 transition-transform duration-200 group`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${config.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-4 h-4 ${config.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.badgeBg}`}>
                      {config.badge}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{suggestion.text}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 flex-shrink-0 mt-1 transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
