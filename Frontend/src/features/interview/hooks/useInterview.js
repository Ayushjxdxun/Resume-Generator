import { useState, useCallback } from "react"
import * as interviewApi from "./interview.api"

export const useInterview = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [reports, setReports] = useState([])
    const [currentReport, setCurrentReport] = useState(null)

    const handleGenerateReport = async (data) => {
        setLoading(true)
        setError(null)
        try {
            const result = await interviewApi.generateInterviewReport(data)
            return result
        } catch (err) {
            console.error("Error running generation pipeline:", err)
            setError(err.response?.data?.message || "Failed to compile interview setup profile.")
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleGetReportById = useCallback(async (id) => {
        setLoading(true)
        setError(null)
        try {
            const result = await interviewApi.getInterviewReportById(id)
            setCurrentReport(result.interviewReport)
            return result.interviewReport
        } catch (err) {
            console.error("Error fetching single database record:", err)
            setError(err.response?.data?.message || "Failed to find requested target profile.")
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const handleGetAllReports = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await interviewApi.getAllInterviewReports()
            setReports(result.interviewReports)
            return result.interviewReports
        } catch (err) {
            console.error("Error reading dashboard records array:", err)
            setError(err.response?.data?.message || "Failed to read database compilation logs.")
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const handleDownloadResumePdf = async (interviewReportId) => {
        setLoading(true)
        setError(null)
        try {
            // 1. Fetch raw uncorrupted data buffer stream array
            const bufferData = await interviewApi.generateResumePdf(interviewReportId)
            
            if (!bufferData) {
                throw new Error("Received empty stream chunk arrays from application server framework layers.")
            }

            // 2. Wrap buffer data safely into an explicit application/pdf Blob sequence
            const blob = new Blob([bufferData], { type: "application/pdf" })
            const url = window.URL.createObjectURL(blob)
            
            // 3. Inject ephemeral browser link element and fire synthetic execution triggers
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            
            document.body.appendChild(link)
            link.click()
            
            // 4. Garbage cleanup cycles for runtime system stability
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error("Fatal failure attempting to compile or down-stream raw document binaries:", err)
            setError("Failed to down-stream asset structural configuration layers.")
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        error,
        reports,
        currentReport,
        generateInterviewReport: handleGenerateReport,
        getInterviewReportById: handleGetReportById,
        getAllInterviewReports: handleGetAllReports,
        downloadResumePdf: handleDownloadResumePdf
    }
}