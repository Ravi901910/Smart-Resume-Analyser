import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function FileUploader({ onFileAccepted }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setError('Unsupported file type. Please upload a PDF or DOCX file.');
      setFile(null);
      return;
    }
    if (acceptedFiles.length > 0) {
      setError('');
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = () => {
    setFile(null);
    setError('');
  };

  const handleAnalyze = () => {
    if (file && onFileAccepted) {
      onFileAccepted(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          relative group cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ease-out
          ${isDragActive
            ? 'border-violet-500 bg-violet-50 scale-[1.02]'
            : 'border-slate-300 hover:border-violet-400 hover:bg-violet-50/50'
          }
          ${file ? 'border-emerald-400 bg-emerald-50/50' : ''}
        `}
      >
        <input {...getInputProps()} id="resume-upload-input" />

        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-violet-400/10 to-indigo-400/10 transition-transform duration-500 ${isDragActive ? 'scale-150' : 'scale-100'}`} />
          <div className={`absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-gradient-to-br from-pink-400/10 to-violet-400/10 transition-transform duration-500 ${isDragActive ? 'scale-150' : 'scale-100'}`} />
        </div>

        <div className="relative z-10">
          {!file ? (
            <>
              <div className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 mb-5 transition-transform duration-300 ${isDragActive ? 'scale-110 -rotate-3' : 'group-hover:scale-105'}`}>
                <Upload className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {isDragActive ? 'Drop your resume here...' : 'Drag & drop your resume'}
              </h3>
              <p className="text-sm text-slate-500 mb-3">
                or <span className="text-violet-600 font-medium underline underline-offset-2">browse files</span>
              </p>
              <p className="text-xs text-slate-400">Supports PDF and DOCX • Max 10MB</p>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(); }}
                className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Analyze Button */}
      {file && (
        <button
          onClick={handleAnalyze}
          id="analyze-resume-btn"
          className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Analyze Resume
        </button>
      )}
    </div>
  );
}

function Sparkles(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
