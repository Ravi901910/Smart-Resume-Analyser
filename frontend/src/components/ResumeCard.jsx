import { User, Mail, GraduationCap, Briefcase, MapPin, Phone } from 'lucide-react';

export default function ResumeCard({ data }) {
  if (!data) return null;

  const fields = [
    { label: 'Name', value: data.name, icon: User, color: 'violet' },
    { label: 'Email', value: data.email, icon: Mail, color: 'blue' },
    { label: 'Phone', value: data.phone, icon: Phone, color: 'emerald' },
    { label: 'Location', value: data.location, icon: MapPin, color: 'amber' },
    { label: 'Education', value: data.education, icon: GraduationCap, color: 'pink' },
    { label: 'Experience', value: data.experience, icon: Briefcase, color: 'indigo' },
  ];

  const colorMap = {
    violet: { bg: 'bg-violet-100', text: 'text-violet-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-600' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
          <div className="w-2 h-2 rounded-full bg-violet-500" />
          Extracted Information
        </h2>
      </div>

      {/* Fields Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ label, value, icon: Icon, color }) => {
          if (!value) return null;
          const colors = colorMap[color];
          return (
            <div
              key={label}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors group"
            >
              <div className={`w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                <Icon className={`w-4.5 h-4.5 ${colors.text}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm font-medium text-slate-800 break-words">{value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Skills Tags */}
      {data.skills && data.skills.length > 0 && (
        <div className="px-6 pb-6">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Skills</p>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 text-xs font-medium border border-violet-200/50 hover:border-violet-300 hover:shadow-sm transition-all cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
