import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { useInterview } from '../hooks/useInterview'; 
import InterviewResultsUI from '../ui/InterviewResultsUI';

const Interview = () => {
  const { id } = useParams(); 
  const { report, loading, generateReportById } = useInterview();

  useEffect(() => {
    if (id && !report) {
      generateReportById(id);
    }
  }, [id, report, generateReportById]);

  // 1. ✨ Beautiful Modern Loading Screen
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.spinner}></div>
          <h2 style={styles.title}>Analyzing Your Interview</h2>
          <p style={styles.subtitle}>Parsing architecture, generating metrics, and preparing your custom roadmap. Please wait...</p>
        </div>
      </div>
    );
  }

  // 2. ✨ Clean Styled Fallback Error View
  if (!report) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{...styles.spinner, borderColor: '#ef4444', animation: 'none', borderTopColor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <span style={{color: '#ef4444', fontSize: '1.2rem', fontWeight: 'bold'}}>!</span>
          </div>
          <h2 style={{...styles.title, marginTop: '1.5rem'}}>No Report Found</h2>
          <p style={styles.subtitle}>Please return to the dashboard homepage to submit your resume and profile form securely.</p>
        </div>
      </div>
    );
  }

  // 3. Render dashboard when report data is loaded successfully
  return <InterviewResultsUI data={report} />;
};

// 💅 Injected Inline Component Styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#0f172a', // Sleek dark mode background
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '1.5rem',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: '3rem 2.5rem',
    borderRadius: '16px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
    maxWidth: '440px',
    textAlign: 'center',
    border: '1px solid #334155',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #334155',
    borderTopColor: '#6366f1', // Indigo accent color for loader
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  title: {
    color: '#f8fafc',
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: '1.5rem 0 0.5rem 0',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '0.925rem',
    lineHeight: '1.5',
    margin: '0',
  }
};

// Injecting CSS rotation animation directly into the document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default Interview;