import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import FileUploader from '../components/FileUploader';
import Loader from '../components/Loader';
import axios from 'axios';
import { Sparkles, Shield, Zap, BarChart3, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { setResumeData, isAnalyzing, setIsAnalyzing, uploadStatus, setUploadStatus } = useResume();

  const handleFileAccepted = async (file) => {
    setIsAnalyzing(true);
    setUploadStatus('uploading');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResumeData(response.data);
      setUploadStatus('analyzed');
      setIsAnalyzing(false);
      navigate('/dashboard');
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadStatus('error');
      setIsAnalyzing(false);
    }
  };

  const features = [
    { icon: Zap, title: 'AI-Powered Analysis', description: 'Advanced NLP extracts skills, experience & education instantly.' },
    { icon: Shield, title: 'ATS Compatibility', description: 'Check if your resume passes Applicant Tracking Systems.' },
    { icon: BarChart3, title: 'Smart Scoring', description: 'Get a detailed score with actionable improvement tips.' },
  ];

  if (isAnalyzing) {
    return <Loader message="Analyzing your resume..." />;
  }

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto pt-8 pb-12">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered Resume Analyzer
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Elevate Your Resume
          <br />
          <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Land Your Dream Job
          </span>
        </h1>

        <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Upload your resume and get instant AI-powered insights — skill extraction, ATS compatibility scores, and personalized improvement suggestions.
        </p>

        {/* Uploader */}
        <FileUploader onFileAccepted={handleFileAccepted} />

        {/* Error State */}
        {uploadStatus === 'error' && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2 max-w-2xl mx-auto">
            <span className="font-semibold">Upload failed.</span> Please make sure the backend server is running on port 8000.
          </div>
        )}
      </div>

      {/* Features */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 mt-4 mb-12">
        {features.map(({ icon: Icon, title, description }, i) => (
          <div
            key={i}
            className="relative group p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-violet-200 transition-all duration-300 cursor-default"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1.5">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="w-full max-w-2xl mx-auto mb-12 p-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-500/20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold">10K+</p>
            <p className="text-xs text-violet-200 mt-1">Resumes Analyzed</p>
          </div>
          <div className="border-x border-white/20">
            <p className="text-3xl font-bold">95%</p>
            <p className="text-xs text-violet-200 mt-1">Accuracy Rate</p>
          </div>
          <div>
            <p className="text-3xl font-bold">&lt; 5s</p>
            <p className="text-xs text-violet-200 mt-1">Average Analysis Time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
