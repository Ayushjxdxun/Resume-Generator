import React, { useState, useEffect } from 'react'
import InterviewResultsUI from '../ui/InterviewResultsUI'

const Interview = () => {
  const [data, setData] = useState({
    matchScore: 0,
    technicalQuestions: [],
    behavioralQuestions: [],
    skillGaps: [],
    preparationPlan: [],
  })

  // TODO: Replace with actual API call
  useEffect(() => {
    // Mock data - replace with actual API call
    const mockData = {
      matchScore: 90,
      technicalQuestions: [
        {
          question: "Can you explain the concept of MVC architecture and how you've applied it in your CampusHub project?",
          intention: "To assess the candidate's understanding of fundamental software architecture patterns and their practical application in their projects.",
          answer: "MVC (Model-View-Controller) is an architectural pattern that separates an application into three interconnected components: Model (data and business logic), View (user interface), and Controller (handles user input and interacts with Model and View). In the CampusHub project, the Node.js/Express.js backend implemented the Controller and Model layers. Routes and middleware acted as controllers, handling incoming requests, interacting with the database (Model) for data operations, and sending responses. The React frontend served as the View, displaying data received from the backend APIs and sending user interactions back to the Controller. This separation made the codebase modular, easier to maintain, and scalable."
        },
        {
          question: "You mentioned using JWT for authentication in both CampusHub and Munchly. Can you describe how JWT works and why you chose it over session-based authentication?",
          intention: "To evaluate the candidate's knowledge of secure authentication mechanisms commonly used in web applications.",
          answer: "JWT (JSON Web Token) is a compact, URL-safe means of representing claims to be transferred between two parties. It consists of three parts: a header, a payload (containing claims like user ID, roles, expiry time), and a signature. The server signs the token with a secret key. When a user logs in, the server generates a JWT and sends it to the client. The client then includes this token in the Authorization header (e.g., 'Bearer <token>') for subsequent requests. The server verifies the signature using the secret key. I chose JWT because it's stateless, meaning the server doesn't need to store session information, making it scalable and suitable for distributed systems. It also allows for passing user information securely within the token itself, reducing database lookups."
        },
        {
          question: "Describe a scenario where you had to optimize a MongoDB query. What was the problem, and what was your solution?",
          intention: "To understand the candidate's experience with database performance tuning and their ability to solve real-world performance issues.",
          answer: "In the Munchly project, I noticed that fetching the list of restaurants and their menus was taking longer than expected, impacting the user experience. After profiling, I found that some queries were performing full collection scans or inefficient joins. My solution involved several steps: First, I analyzed the query patterns using MongoDB's `explain()` method to identify bottlenecks. Then, I added appropriate indexes on fields frequently used in query filters (e.g., `restaurantId`, `category`). I also refactored some queries to be more specific and avoid fetching unnecessary data. For instance, instead of fetching the entire menu for each restaurant upfront, I optimized it to fetch only the necessary details for the initial display and load more on demand. This resulted in an average API response time reduction of about 30% for these critical endpoints."
        }
      ],
      behavioralQuestions: [
        {
          question: "Tell me about a challenging technical problem you faced in one of your projects and how you overcame it. What did you learn from that experience?",
          intention: "To assess problem-solving skills, resilience, and the ability to learn from challenges.",
          answer: "During the development of the CampusHub project, I encountered a significant challenge with state management in the React frontend, particularly when data needed to be shared across multiple unrelated components. Initially, I was passing props down multiple levels (prop drilling), which became cumbersome and hard to manage. To overcome this, I researched and decided to implement a state management solution using React Context API combined with `useReducer`. This allowed me to create a global state for authentication and user data, accessible by any component that needed it, without prop drilling. It made the code cleaner, more maintainable, and easier to debug. The key learning was the importance of choosing the right architecture and tools early on for complex applications and the value of exploring different solutions when facing difficulties."
        },
        {
          question: "You've been an Organizer for the Society for Promotion of Electronics Culture. Can you describe a situation where you had to coordinate with multiple teams or individuals to achieve a common goal?",
          intention: "To evaluate teamwork, coordination, and leadership skills in a practical context.",
          answer: "Organizing events involved coordinating with several sub-teams: the sponsorship team, the technical operations team, the marketing team, and the logistics team. My role required ensuring seamless communication and collaboration between these groups. I facilitated meetings, documented decisions, proactively identified potential roadblocks, and ensured everyone was aligned on deadlines and responsibilities. It taught me the importance of clear communication channels, delegation, and proactive problem-solving."
        }
      ],
      skillGaps: [
        { skill: "redis", severity: "low" },
        { skill: "Message queue", severity: "medium" },
        { skill: "Event loop", severity: "low" }
      ],
      preparationPlan: [
        {
          day: 1,
          focus: "Deep Dive into Frontend Fundamentals",
          tasks: [
            "Review React core concepts: Hooks (useState, useEffect, useContext, useReducer), component lifecycle, performance optimizations.",
            "Understand modern JavaScript features (ES6+): arrow functions, promises, async/await, modules.",
            "Explore advanced CSS techniques: Flexbox, Grid, responsive design principles, CSS-in-JS libraries (optional).",
            "Practice building complex UI components and managing state effectively."
          ]
        },
        {
          day: 2,
          focus: "Strengthening Backend & API Knowledge",
          tasks: [
            "Revisit Node.js event loop and asynchronous programming patterns.",
            "Understand Express.js middleware, routing, error handling in depth.",
            "Practice designing and implementing robust RESTful APIs, including versioning and documentation (e.g., OpenAPI/Swagger).",
            "Explore security best practices for APIs (e.g., input validation, rate limiting)."
          ]
        },
        {
          day: 3,
          focus: "Database Optimization & Cloud Concepts",
          tasks: [
            "Review MongoDB indexing strategies and query optimization techniques.",
            "Understand different database types (SQL vs. NoSQL) and their use cases.",
            "Learn about basic cloud concepts: containers (Docker), CI/CD pipelines.",
            "Research deployment strategies on platforms like AWS or GCP (beyond Vercel/Render)."
          ]
        },
        {
          day: 4,
          focus: "System Design & Architecture Patterns",
          tasks: [
            "Study microservices architecture and when to use it vs monolithic design.",
            "Understand caching strategies: Redis, in-memory caching, CDN optimization.",
            "Learn about message queues and event-driven architecture (RabbitMQ, Kafka basics).",
            "Practice designing scalable systems (load balancing, database sharding)."
          ]
        },
        {
          day: 5,
          focus: "Testing & Code Quality",
          tasks: [
            "Master unit testing with Jest/Mocha and writing testable code.",
            "Understand integration testing and end-to-end (E2E) testing with tools like Cypress.",
            "Learn about code coverage, linting, and code review best practices.",
            "Practice Test-Driven Development (TDD) approach."
          ]
        },
        {
          day: 6,
          focus: "Advanced JavaScript & Performance Tuning",
          tasks: [
            "Deep dive into event loop, call stack, and asynchronous patterns (callbacks, promises, async/await).",
            "Understand memory management, garbage collection, and performance optimization.",
            "Learn profiling tools and how to identify bottlenecks in applications.",
            "Practice optimizing React performance: memoization, lazy loading, code splitting."
          ]
        },
        {
          day: 7,
          focus: "Interview Preparation & Problem Solving",
          tasks: [
            "Practice solving LeetCode-style algorithmic problems (focus on arrays, strings, trees, DP).",
            "Mock interview practice: system design discussions and technical explanations.",
            "Prepare for behavioral questions using STAR method (Situation, Task, Action, Result).",
            "Review all covered topics and solidify understanding with real-world projects."
          ]
        }
      ]
    }
    setData(mockData)
  }, [])

  return <InterviewResultsUI data={data} />
}

export default Interview
