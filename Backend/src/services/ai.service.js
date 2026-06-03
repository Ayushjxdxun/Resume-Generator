const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `
    You are an expert technical interviewer. Generate a highly comprehensive interview report based on these details:
    - Resume: ${resume}
    - Self Description: ${selfDescription}
    - Job Description: ${jobDescription}
    `
    
    // Explicitly defining the schema using native OpenAPI/JSON schema format accepted by Gemini.
    // This completely prevents Zod generators from adding problematic "$defs" or "def" wrappers.
    const nativeGeminiSchema = {
        type: "OBJECT",
        properties: {
            matchScore: {
                type: "NUMBER",
                description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
            },
            technicalQuestions: {
                type: "ARRAY",
                description: "Technical questions that can be asked in the interview along with their intention and how to answer them",
                items: {
                    type: "OBJECT",
                    properties: {
                        question: { type: "STRING", description: "The technical question can be asked in the interview" },
                        intention: { type: "STRING", description: "The intention of interviewer behind asking this question" },
                        answer: { type: "STRING", description: "How to answer this question, what points to cover, what approach to take etc." }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            behavioralQuestions: {
                type: "ARRAY",
                description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
                items: {
                    type: "OBJECT",
                    properties: {
                        question: { type: "STRING", description: "The behavioral question can be asked in the interview" },
                        intention: { type: "STRING", description: "The intention of interviewer behind asking this question" },
                        answer: { type: "STRING", description: "How to answer this question, what points to cover, what approach to take etc." }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            skillGaps: {
                type: "ARRAY",
                description: "List of skill gaps in the candidate's profile along with their severity",
                items: {
                    type: "OBJECT",
                    properties: {
                        skill: { type: "STRING", description: "The skill which the candidate is lacking" },
                        severity: { 
                            type: "STRING", 
                            enum: ["low", "medium", "high"],
                            description: "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances" 
                        }
                    },
                    required: ["skill", "severity"]
                }
            },
            preparationPlan: {
                type: "ARRAY",
                description: "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
                items: {
                    type: "OBJECT",
                    properties: {
                        day: { type: "NUMBER", description: "The day number in the preparation plan, starting from 1" },
                        focus: { type: "STRING", description: "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc." },
                        tasks: { 
                            type: "ARRAY", 
                            items: { type: "STRING" },
                            description: "List of tasks to be done on this day to follow the preparation plan" 
                        }
                    },
                    required: ["day", "focus", "tasks"]
                }
            },
            title: {
                type: "STRING",
                description: "The title of the job for which the interview report is generated"
            }
        },
        required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "title"]
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", 
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: nativeGeminiSchema, 
        }
    })

    console.log(JSON.parse(response.text))
}

module.exports = generateInterviewReport