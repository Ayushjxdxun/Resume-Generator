import React from 'react';
import { useInterview } from '../hooks/useInterview'; 
import InterviewResultsUI from '../ui/InterviewResultsUI';

const Interview = () => {
  const { report, loading } = useInterview();

  // 1. If the API is still fetching data, show a temporary message
  if (loading) {
    return <div>Generating your report... Please wait.</div>;
  }

  // 2. If the API finished but there is no report data, don't render the UI
  if (!report) {
    return <div>No report found. Please go to the homepage and submit the form.</div>;
  }

  // 3. Only render this when we are 100% sure 'report' holds your actual data
  return <InterviewResultsUI data={report} />;
};

export default Interview;