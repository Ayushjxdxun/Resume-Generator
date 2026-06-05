import axios from "axios";

// Dynamically determine base URL depending on production environment vs local development
const baseURL = process.env.NODE_ENV === 'production' ? "https://apexcv-if07.onrender.com" : "http://localhost:3000";

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true
})


export const generateInterviewReport = async ({jobDescription, selfDescription, resumeFile}) => { 
    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data
}

export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)
    return response.data
}

export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")
    return response.data
}

export const generateResumePdf = async (interviewReportId) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "arraybuffer" // Switched to arraybuffer to safeguard binary formatting across network layers
    })
    
    // Defensive check: If a global response interceptor automatically returns response.data, 
    // the variable 'response' contains the ArrayBuffer directly. Otherwise, return response.data.
    return response.data ? response.data : response;
}