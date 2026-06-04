import { createContext, useState, useEffect } from "react"

export const InterviewContext = createContext()

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)

    // 1. Initialize state directly from localStorage safely
    const [report, setReport] = useState(() => {
        const savedReport = localStorage.getItem('interviewReport')
        if (savedReport) {
            try {
                return JSON.parse(savedReport)
            } catch (error) {
                console.error('Failed to parse saved report:', error)
            }
        }
        return null // Default fallback
    })

    const [reports, setReports] = useState(() => {
        const savedReports = localStorage.getItem('interviewReports')
        if (savedReports) {
            try {
                return JSON.parse(savedReports)
            } catch (error) {
                console.error('Failed to parse saved reports:', error)
            }
        }
        return [] // Default fallback
    })

    // 2. Sync changes flawlessly (including deletes/emptying out)
    useEffect(() => {
        if (report === null) {
            localStorage.removeItem('interviewReport')
        } else {
            localStorage.setItem('interviewReport', JSON.stringify(report))
        }
    }, [report])

    useEffect(() => {
        if (reports.length === 0) {
            localStorage.removeItem('interviewReports')
        } else {
            localStorage.setItem('interviewReports', JSON.stringify(reports))
        }
    }, [reports])

    return (
        <InterviewContext.Provider value={{ loading, setLoading, report, setReport, reports, setReports }} >
            {children}
        </InterviewContext.Provider>
    )
}