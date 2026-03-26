import React, { createContext, useContext, useState } from 'react';

const ResumeContext = createContext();

export function useResume() {
  return useContext(ResumeContext);
}

export function ResumeProvider({ children }) {
  const [resumeData, setResumeData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, analyzed, error

  const value = {
    resumeData,
    setResumeData,
    isAnalyzing,
    setIsAnalyzing,
    uploadStatus,
    setUploadStatus
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}
