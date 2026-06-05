const { GoogleGenAI } = require("@google/genai")
const puppeteer = require("puppeteer")

// Fallback check to ensure it reads whichever variable name you set up on Render
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY
})

async function generatePdfFromHtml(htmlContent) {
    let launchArgs = [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-extensions",
        "--disable-gpu"
    ];

    const browser = await puppeteer.launch({
        headless: true,
        args: launchArgs
    });
    
    try {
        const page = await browser.newPage();
        
        // Force screen mode so print media stylesheets don't blank out your styles
        await page.emulateMediaType('screen');
        
        // Switch to "load" so Render servers don't hang indefinitely on external tracking/fonts
        await page.setContent(htmlContent, { waitUntil: "load" });

        const pdfBuffer = await page.pdf({
            format: "A4", 
            printBackground: true,
            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm"
            }
        });

        return pdfBuffer;
    } finally {
        await browser.close();
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
            matchScore: { type: "number" },
            technicalQuestions: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        question: { type: "string" },
                        intention: { type: "string" },
                        answer: { type: "string" }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            behavioralQuestions: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        question: { type: "string" },
                        intention: { type: "string" },
                        answer: { type: "string" }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            skillGaps: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        skill: { type: "string" },
                        severity: { type: "string", enum: ["low", "medium", "high"] }
                    },
                    required: ["skill", "severity"]
                }
            },
            preparationPlan: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        day: { type: "number" },
                        focus: { type: "string" },
                        tasks: { type: "array", items: { type: "string" } }
                    },
                    required: ["day", "focus", "tasks"]
                }
            },
            title: { type: "string" }
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

    return JSON.parse(response.text)
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const prompt = `
                        You are an expert executive resume writer and career coach. Your task is to transform, optimize, and tailor the candidate's original resume to stand out for the specific target job description, utilizing insights from their self-description.

                        INPUTS:
                        1. Original Resume: ${resume}
                        2. Candidate Self-Description/Context: ${selfDescription}
                        3. Target Job Description: ${jobDescription}

                        CRITICAL OPTIMIZATION CORE STRATEGIES:
                        1. Keyword Tailoring: Analyze the Target Job Description for key technical skills, frameworks, methodologies, and core competencies. Naturally weave these critical keywords into the professional summary, skill grids, and work experience descriptions.
                        2. Impact & Action Verbs: Rewrite weak, passive sentences into strong, achievement-oriented bullets. Begin every work experience bullet point with a powerful action verb. Where possible, add hypothetical or structured metrics/impact metrics based on typical industry outcomes if numbers aren't provided.
                        3. Profile Relevance: Cross-reference the self-description to emphasize the project architectures and technical problems the candidate solved that match the target job's daily requirements.
                        
                        OUTPUT STRUCTURE CONSTRAINTS:
                        - The response must be a single JSON object with a single field "html" containing the tailored HTML resume string.
                        - The resume MUST fit cleanly within 1 to 2 pages maximum when printed to PDF. Do not let it spill onto a 3rd page.

                        Strict Content Layout Constraints to ensure a 2-page maximum fit:
                        1. Limit the "Work Experience" section to a maximum of the 3 most relevant roles, and no more than 3 bullet points per role.
                        2. Limit the "Projects" section to a maximum of 3 key projects, and no more than 2-3 concise bullet points per project.
                        3. Write highly compact, metric-focused descriptions. Avoid wordy introductions, long explanations, or narrative fluff.
                        4. Condense skills into a neat, comma-separated grid or single line per category rather than listing them vertically.

                        Strict CSS Layout Constraints inside the generated HTML <style> block:
                        1. Use a professional, clean layout with a dark/light contrast balance.
                        2. Use a compact font size: 10pt or 11pt for body text, 13pt to 14pt for section headings.
                        3. Minimize margins and paddings: set margins for sections, paragraphs, and list items (ul, li) to 4px - 6px. Avoid large gaps or empty spacer divs.
                        4. Use CSS flex/grid structures efficiently to organize sections side-by-side where appropriate to maximize printable real estate.

                        The content of the resume should be ATS friendly, simple, professional, and visually appealing without sounding like it was generated by AI.
                    `

    const nativeGeminiSchema = {
        type: "object",
        properties: {
            html: {
                type: "string",
                description: "The highly optimized, tailored HTML content of the enhanced resume"
            }
        },
        required: ["html"]
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
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