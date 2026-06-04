import React, { useState, useRef, useEffect } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router"; // Fixed typo

const InterviewHomeUI = ({
  resumeName = "",
  onResumeChange = () => {},
}) => {
  const { loading, generateReport, getReports, reports } = useInterview();
  const navigate = useNavigate(); // Added missing initialization
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const resumeInputRef = useRef();

  // Fetch reports on component mount
  useEffect(() => {
    getReports();
  }, []);

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];
    const data = await generateReport({ jobDescription, selfDescription, resumeFile });
    if (data && data._id) {
      navigate(`/interview/${data._id}`); // Fixed matching frontend URL pattern
    }
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Generating Your Interview Strategy...</h1>
      </main>
    );
  }

  return (
    <main className="home">
      <div className="interview-container">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">
            Create Your Custom <br />
            <span className="highlight-text">Interview Plan</span>
          </h1>
          <p className="hero-subtitle">Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
        </div>

        {/* Target Job Description Card */}
        <div className="target-card panel-card">
          <div className="panel-header">
            <span className="panel-icon">🎯</span>
            <div className="header-content">
              <h2>Target Job Description</h2>
              <span className="badge required">REQUIRED</span>
            </div>
          </div>
          <p className="panel-description">Paste the full job description here...</p>
          <textarea 
            onChange={(e) => setJobDescription(e.target.value)}
            name="jobDescription"
            id="jobDescription"
            className="job-description-textarea"
            placeholder="Paste the full job description here... e.g. Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design..."
            value={jobDescription}
            rows={14}
          />
          <div className="char-counter">
            <span>{jobDescription.length} / 1000 chars</span>
          </div>
        </div>

        {/* Your Profile Card */}
        <div className="profile-card panel-card">
          <div className="panel-header">
            <span className="panel-icon">👤</span>
            <h2>Your Profile</h2>
          </div>

          <div className="resume-section">
            <div className="resume-header">
              <p className="resume-title">Upload Resume</p>
              <span className="badge best-results">BEST RESULTS</span>
            </div>
            <label className="upload-dropzone" htmlFor="resume">
              <div className="upload-icon">📁</div>
              <p className="upload-text">Click to upload or drag &amp; drop</p>
              <small className="upload-hint">PDF or DOCX. Max 5MB.</small>
              {resumeName && <div className="resume-filename">{resumeName}</div>}
            </label>
            <input 
              ref={resumeInputRef} 
              type="file"
              name="resume"
              id="resume"
              accept=".pdf,.doc,.docx"
              onChange={onResumeChange}
              className="hidden-file-input"
            />
            <small className="divider-text">OR</small>
          </div>

          <div className="input-group">
            <label htmlFor="selfDescription" className="section-label">Quick Self-Description</label>
            <textarea 
              onChange={(e) => setSelfDescription(e.target.value)} 
              name="selfDescription"
              id="selfDescription"
              className="self-description-textarea"
              placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              value={selfDescription}
              rows={8}
            />
          </div>

          <div className="warning-box">
            <span className="warning-icon">!</span>
            <p>
              Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.
            </p>
          </div>

          <button 
            onClick={handleGenerateReport} 
            className="button primary-button"
            type="button"
          >
            Generate My Interview Strategy
          </button>
        </div>
      </div>

      <footer className="interview-footer">
        <p>AI Powered Strategy Generation • Applies 50+</p>
      </footer>

      {/* Recent Reports List */}
      {reports && reports.length > 0 && (
        <section className='recent-reports'>
          <h2>My Recent Interview Plans</h2>
          <ul className='reports-list'>
            {reports.map(report => (
              <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                <h3>{report.title || 'Untitled Position'}</h3>
                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
};

export default InterviewHomeUI;