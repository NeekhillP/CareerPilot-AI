import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000/api/interviews",
    withCredentials: true,
})

export const generateInterviewReport = async ({jobDescription, selfDescription, resumeFile})=>{

    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    formData.append('selfDescription', selfDescription);
    formData.append('resume', resumeFile);

    const response = await api.post('/', formData)
    return response.data;
}

export const getInterviewReportById = async (interviewId, signal) => {
    const response = await api.get(`/report/${encodeURIComponent(interviewId)}`, {signal});
    return response.data;
}

export const getAllInterviewReports = async () => {
    const response = await api.get('/');
    return response.data;
}
