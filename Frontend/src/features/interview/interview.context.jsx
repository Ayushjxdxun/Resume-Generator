import {createContext, useState, useEffect} from "react"

export const InterviewContext = createContext()

export const InterviewProvider = ({children}) => {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])

    // Rehydrate state from localStorage on component mount
    useEffect(() => {
        const savedReport = localStorage.getItem('interviewReport')
        const savedReports = localStorage.getItem('interviewReports')
        
        if (savedReport) {
            try {
                setReport(JSON.parse(savedReport))
            } catch (error) {
                console.error('Failed to parse saved report:', error)
            }
        }
        
        if (savedReports) {
            try {
                setReports(JSON.parse(savedReports))
            } catch (error) {
                console.error('Failed to parse saved reports:', error)
            }
        }
    }, [])

    // Persist report to localStorage whenever it changes
    useEffect(() => {
        if (report) {
            localStorage.setItem('interviewReport', JSON.stringify(report))
        }
    }, [report])

    // Persist reports to localStorage whenever it changes
    useEffect(() => {
        if (reports && reports.length > 0) {
            localStorage.setItem('interviewReports', JSON.stringify(reports))
        }
    }, [reports])

    return (
        <InterviewContext.Provider value={{loading, setLoading, report, setReport,reports, setReports}} >
            {children}
        </InterviewContext.Provider>
    )
}