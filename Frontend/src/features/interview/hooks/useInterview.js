import { getAllInterviewReports, getInterviewReportById, generateInterviewReport ,generateResumePdf } from "../services/interview.api"
import { useContext, useState } from "react"
import { InterviewContext } from "../interview.context"

export const useInterview = () => {
    const context = useContext(InterviewContext)
    if(!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
     }
    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({jobDescription, selfDescription, resumeFile}) => {
        setLoading(true)
        let response=null
        try {
            response = await generateInterviewReport({jobDescription, selfDescription, resumeFile})
            setReport(response.interviewReport)
            // Add the newly generated report to the reports list
            setReports(prevReports => [response.interviewReport, ...prevReports])
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response.interviewReport
    }
    const generateReportById = async (interviewId) => {
        setLoading(true)
        let response=null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        let response=null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response.interviewReports
    }
    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response=null      
        try {
            response = await generateResumePdf(interviewReportId)
            const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `resume_${interviewReportId}.pdf`) 
            document.body.appendChild(link)
            link.click()
        } catch (error) {
            console.log(error)
        }finally {
            setLoading(false)
        }
    }
    return { loading, report, reports, generateReport, generateReportById, getReports, getResumePdf }
}