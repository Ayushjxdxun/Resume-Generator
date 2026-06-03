import React, { useState } from "react";
import "../style/interview.scss";

const InterviewResultsUI = ({
  data = {
    matchScore: 0,
    technicalQuestions: [],
    behavioralQuestions: [],
    skillGaps: [],
    preparationPlan: [],
  },
}) => {
  const [activeTab, setActiveTab] = useState("technical");
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const technicalQuestions = data.technicalQuestions || [];
  const behavioralQuestions = data.behavioralQuestions || [];
  const skillGaps = data.skillGaps || [];
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
        </div>

        {/* Center Column - Main Content */}
        <div className="center-column">
          <div className="content-card">
            {/* Section Header */}
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

            {/* Content Area */}
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

            {/* Navigation */}
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
            {/* Match Score */}
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

            {/* Skill Gaps */}
            <div className="skills-block">
              <div className="skills-label">SKILL GAPS</div>
              <div className="skills-list">
                {skillGaps.map((gap, index) => (
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
