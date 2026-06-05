const { GoogleGenAI } = require("@google/genai")
const puppeteer = require("puppeteer-core")
const chromium = require("@sparticuz/chromium")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        // Automatically finds the optimized production binary on Render
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        args: [
            ...chromium.args,
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-extensions"
        ]
    })
    
    try {
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "networkidle2" })

        const pdfBuffer = await page.pdf({
            format: "A4", 
            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm"
            }
        })

        return pdfBuffer
    } finally {
        await browser.close()
    }
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `
    You are an expert technical interviewer. Generate a highly comprehensive interview report based on these details:
    - Resume: ${resume}
    - Self Description: ${selfDescription}
    - Job Description: ${jobDescription}
    `
    
    const nativeGeminiSchema = {
        type: "object",
        properties: {
            matchScore: {
                type: "number",
                description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
            },
            technicalQuestions: {
                type: "array",
                description: "Technical questions that can be asked in the interview along with their intention and how to answer them",
                items: {
                    type: "object",
                    properties: {
                        question: { type: "string", description: "The technical question can be asked in the interview" },
                        intention: { type: "string", description: "The intention of interviewer behind asking this question" },
                        answer: { type: "string", description: "How to answer this question, what points to cover, what approach to take etc." }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            behavioralQuestions: {
                type: "array",
                description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
                items: {
                    type: "object",
                    properties: {
                        question: { type: "string", description: "The behavioral question can be asked in the interview" },
                        intention: { type: "string", description: "The intention of interviewer behind asking this question" },
                        answer: { type: "string", description: "How to answer this question, what points to cover, what approach to take etc." }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            skillGaps: {
                type: "array",
                description: "List of skill gaps in the candidate's profile along with their severity",
                items: {
                    type: "object",
                    properties: {
                        skill: { type: "string", description: "The skill which the candidate is lacking" },
                        severity: { 
                            type: "string", 
                            enum: ["low", "medium", "high"],
                            description: "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances" 
                        }
                    },
                    required: ["skill", "severity"]
                }
            },
            preparationPlan: {
                type: "array",
                description: "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
                items: {
                    type: "object",
                    properties: {
                        day: { type: "number", description: "The day number in the preparation plan, starting from 1" },
                        focus: { type: "string", description: "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc." },
                        tasks: { 
                            type: "array", 
                            items: { type: "string" },
                            description: "List of tasks to be done on this day to follow the preparation plan" 
                        }
                    },
                    required: ["day", "focus", "tasks"]
                }
            },
            title: {
                type: "string",
                description: "The title of the job for which the interview report is generated"
            }
        },
        required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "title"]
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite", 
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: nativeGeminiSchema, 
        }
    })

    return JSON.parse(response.text)
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        The response must be a JSON object with a single field "html" containing the HTML content of the resume.
                        The resume MUST fit completely within 1 to 2 pages maximum when printed to PDF. Do not let it spill onto a 3rd page.

                        Strict Content Constraints to ensure a 2-page maximum fit:
                        1. Limit the "Work Experience" section to a maximum of the 3 most relevant roles, and no more than 3 bullet points per role.
                        2. Limit the "Projects" section to a maximum of 3 key projects, and no more than 2-3 concise bullet points per project.
                        3. Write highly compact, metric-focused descriptions. Avoid wordy introductions, long explanations, or narrative fluff.
                        4. Condense skills into a neat, comma-separated grid or single line per category rather than listing them vertically.

                        Strict CSS Layout Constraints inside the generated HTML <style> block:
                        1. Use a compact font size: 10pt or 11pt for body text, 13pt to 14pt for section headings.
                        2. Use tight spacing: set line-height to 1.2 or 1.3 maximum.
                        3. Minimize margins and paddings: set margins for sections, paragraphs, and list items (ul, li) to 4px - 6px. Avoid large gaps or empty spacer divs.
                        4. Use CSS flex/grid structures efficiently to organize sections side-by-side where appropriate to maximize printable real estate.

                        The content of the resume should be ATS friendly, simple, professional, and visually appealing without sounding like it was generated by AI.
                    `

    const nativeGeminiSchema = {
        type: "object",
        properties: {
            html: {
                type: "string",
                description: "The HTML content of the resume which can be converted to PDF using any library like puppeteer"
            }
        },
        required: ["html"]
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: nativeGeminiSchema,
        }
    })

    const jsonContent = JSON.parse(response.text)
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
    return pdfBuffer
}

module.exports = {
    generateInterviewReport,
    generateResumePdf
}