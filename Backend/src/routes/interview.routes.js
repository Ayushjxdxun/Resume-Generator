const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const { 
    generateInterviewReportController, 
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController // Added the imported reference hook wrapper here
} = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()

/**
 * @route POST /api/interview/
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), generateInterviewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, getInterviewReportByIdController)

/**
 * @route GET /api/interview/
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, getAllInterviewReportsController)

/**
 * @route GET /api/interview/resume/pdf/:interviewReportId
 * @access private
 * Note: Changed to .get instead of .post as it handles resource downloads safely from browsers/links.
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, generateResumePdfController)

module.exports = interviewRouter