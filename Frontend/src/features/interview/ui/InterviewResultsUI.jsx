import React, { useState } from "react";
import "../style/interview.scss";
import { useInterview } from '../hooks/useInterview'; 

const InterviewResultsUI = ({ 
  data = {
    matchScore: 0,
    technicalQuestions: [],
    behavioralQuestions: [],
    skillGaps: [],
    preparationPlan: [],
  }
}) => {
  // Pull both the download function AND the active report state from our hook
  const { getResumePdf, report } = useInterview();
  
  const [activeTab, setActiveTab] = useState("technical");
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const technicalQuestions = data.technicalQuestions || [];
  const behavioralQuestions = data.behavioralQuestions || [];
  const preparationPlan = data.preparationPlan || [];

  const currentList =
    activeTab === "technical"
      ? technicalQuestions
      : activeTab === "behavioral"
      ? behavioralQuestions
      : preparationPlan;

  const currentItem = currentList[selectedItemIndex];
  const itemCount = currentList.length;

  return (
    <div className="interview-results-wrapper">
      <div className="interview-results-grid">
        {/* Left Sidebar - Navigation */}
        <div className="left-column">
          <div className="sidebar-card">
            
            {/* Scrollable Upper Area */}
            <div className="sidebar-nav-content">
              <div className="section-label">SECTIONS</div>
              
              <div className="tabs-navigation">
                <button
                  className={`tab-btn ${activeTab === "technical" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("technical");
                    setSelectedItemIndex(0);
                  }}
                >
                  Technical Questions
                </button>
                <button
                  className={`tab-btn ${activeTab === "behavioral" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("behavioral");
                    setSelectedItemIndex(0);
                  }}
                >
                  Behavioral questions
                </button>
                <button
                  className={`tab-btn ${activeTab === "roadmap" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("roadmap");
                    setSelectedItemIndex(0);
                  }}
                >
                  Road Map
                </button>
              </div>

              <div className="items-container">
                {currentList.map((item, index) => (
                  <button
                    key={index}
                    className={`item-btn ${selectedItemIndex === index ? "active" : ""}`}
                    onClick={() => setSelectedItemIndex(index)}
                  >
                    <span className="item-num">{index + 1}</span>
                    <span className="item-text">
                      {activeTab === "roadmap"
                        ? `Day ${item.day}`
                        : item.question?.substring(0, 25) + "..."}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fixed Lower Area holding the Button */}
            <div className="sidebar-actions">
              <button
                onClick={() => { 
                  // Fallback: Check if report._id exists, otherwise check data._id
                  const fallbackId = report?._id || data?._id;
                  if (fallbackId) {
                    getResumePdf(fallbackId);
                  } else {
                    alert("Could not locate an active interview report ID to download.");
                  }
                }}
                className='button primary-button download-resume-btn'
              >
                <svg height={"0.8rem"} style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path>
                </svg>
                Download Resume
              </button>
            </div>

          </div>
        </div>

        {/* Center Column - Main Content */}
        <div className="center-column">
          <div className="content-card">
            <div className="section-header">
              <h2 className="section-name">
                {activeTab === "technical"
                  ? "Technical Questions"
                  : activeTab === "behavioral"
                  ? "Behavioral Questions"
                  : "Road Map"}
              </h2>
              {activeTab !== "roadmap" && (
                <span className="item-count">{itemCount} questions</span>
              )}
            </div>

            <div className="content-area">
              {currentItem && (
                <>
                  {activeTab === "roadmap" ? (
                    <div className="roadmap-view">
                      <div className="day-header">
                        <h3 className="day-title">{currentItem.focus}</h3>
                      </div>
                      <div className="tasks-section">
                        {currentItem.tasks?.map((task, idx) => (
                          <div key={idx} className="task-row">
                            <span className="task-bullet">•</span>
                            <span className="task-text">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="question-view">
                      <div className="question-section">
                        <div className="question-label">QUESTION</div>
                        <p className="question-text">{currentItem.question}</p>
                      </div>

                      <div className="intention-section">
                        <div className="section-label">INTENTION:</div>
                        <p className="intention-text">{currentItem.intention}</p>
                      </div>

                      <div className="answer-section">
                        <div className="section-label">ANSWER:</div>
                        <p className="answer-text">{currentItem.answer}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="nav-controls">
              <button
                className="nav-btn prev-btn"
                onClick={() => setSelectedItemIndex(Math.max(0, selectedItemIndex - 1))}
                disabled={selectedItemIndex === 0}
              >
                ← Previous
              </button>
              <button
                className="nav-btn next-btn"
                onClick={() =>
                  setSelectedItemIndex(Math.min(itemCount - 1, selectedItemIndex + 1))
                }
                disabled={selectedItemIndex === itemCount - 1}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Score & Skills */}
        <div className="right-column">
          <div className="sidebar-card">
            <div className="match-score-block">
              <div className="score-label">MATCH SCORE</div>
              <div className="score-value">{data.matchScore}</div>
              <div className="score-bar">
                <div 
                  className="score-fill" 
                  style={{ width: `${data.matchScore}%` }}
                />
              </div>
              <div className="score-text">Strong match for this role</div>
            </div>

            <div className="skills-block">
              <div className="skills-label">SKILL GAPS</div>
              <div className="skills-list">
                {(data.skillGaps || []).map((gap, index) => (
                  <div 
                    key={index} 
                    className={`skill-item severity-${gap.severity}`}
                  >
                    <span className="skill-tag">{gap.skill}</span>
                    <span className="severity-badge">{gap.severity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InterviewResultsUI;