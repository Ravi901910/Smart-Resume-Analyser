import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

export default function SkillsChart({ skills }) {
  if (!skills || skills.length === 0) return null;

  // Transform skills into chart-friendly data
  const data = skills.map((skill) => ({
    name: skill.name || skill,
    proficiency: skill.proficiency || Math.floor(Math.random() * 40) + 60,
    fullMark: 100,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-2.5 shadow-lg">
          <p className="text-sm font-semibold text-slate-800">{payload[0].payload.name}</p>
          <p className="text-xs text-violet-600 font-medium mt-0.5">
            Proficiency: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          Skills Proficiency
        </h2>
        <p className="text-xs text-slate-400 mt-1">Radar view of detected skills</p>
      </div>

      <div className="p-4">
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="name"
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={false}
            />
            <Radar
              name="Proficiency"
              dataKey="proficiency"
              stroke="#8b5cf6"
              fill="url(#radarGradient)"
              fillOpacity={0.5}
              strokeWidth={2}
              animationBegin={300}
              animationDuration={1500}
            />
            <Tooltip content={<CustomTooltip />} />
            <defs>
              <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
