const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

async function generateInterviewReportController(req, res) {
    try {
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
        const { selfDescription, jobDescription } = req.body

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            title: interviewReportByAi.title,
            ...interviewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Error creating report:", error)
        res.status(500).json({ message: "Failed to generate interview report." })
    }
}

async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        })
        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }
        res.status(200).json({ interviewReport })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error retrieving report." })
    }
}

async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({
            user: req.user.id
        }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
        
        res.status(200).json({
            message: "Interview reports retrieved successfully.",
            interviewReports
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error pulling records list." })
    }
}

async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        // Finding report matching both dynamic id AND current authorized user constraint context window boundary checks
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

        // Content-Length has been removed to prevent reverse-proxy compression truncation issues on platforms like Render
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.end(pdfBuffer)
    } catch (error) {
        console.error("Error inside PDF endpoint handler chain:", error)
        res.status(500).json({ message: "Server error mapping schema rules on compiling target document structures." })
    }
}

module.exports = { 
    generateInterviewReportController, 
    getInterviewReportByIdController, 
    getAllInterviewReportsController,
    generateResumePdfController 
}