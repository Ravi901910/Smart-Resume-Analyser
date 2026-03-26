import { useResume } from '../context/ResumeContext';
import { useNavigate } from 'react-router-dom';
import ResumeCard from '../components/ResumeCard';
import ScoreCard from '../components/ScoreCard';
import SkillsChart from '../components/SkillsChart';
import SuggestionsList from '../components/SuggestionsList';
import ChatbotWidget from '../components/ChatbotWidget';
import { FileText, Shield, Target, TrendingUp, ArrowLeft, Download } from 'lucide-react';

export default function Dashboard() {
  const { resumeData } = useResume();
  const navigate = useNavigate();

  if (!resumeData) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
          <FileText className="w-9 h-9 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
          No Resume Analyzed Yet
        </h2>
        <p className="text-sm text-slate-500 mb-6">Upload a resume first to see the analysis dashboard.</p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 active:scale-[0.98] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Upload Resume
        </button>
      </div>
    );
  }

  const { extracted_info, analysis } = resumeData;

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Upload
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Analysis Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's the detailed analysis of your resume
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <ScoreCard
          label="Resume Score"
          score={analysis?.resume_score || 0}
          icon={TrendingUp}
          color="violet"
          description="Overall quality"
        />
        <ScoreCard
          label="ATS Score"
          score={analysis?.ats_score || 0}
          icon={Shield}
          color="emerald"
          description="ATS compatibility"
        />
        <ScoreCard
          label="Keyword Match"
          score={analysis?.keyword_match || 0}
          icon={Target}
          color="blue"
          description="Industry relevance"
        />
        <ScoreCard
          label="Impact Score"
          score={analysis?.impact_score || 0}
          icon={TrendingUp}
          color="amber"
          description="Achievement impact"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ResumeCard data={extracted_info} />
        <SkillsChart skills={analysis?.skills_proficiency} />
      </div>

      {/* Suggestions */}
      <SuggestionsList suggestions={analysis?.suggestions} />

      {/* Chatbot */}
      <ChatbotWidget resumeData={resumeData} />
    </div>
  );
}
