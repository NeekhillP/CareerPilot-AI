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

export const generateResumePdf = async({interviewId, signal}) =>{
    try{
        const response = await api.get(`/resume/pdf/${encodeURIComponent(interviewId)}`, {
            responseType: 'blob',
            timeout: 120000,
            signal,
        });

        if(!response.data.size || !response.data.type.includes('application/pdf')){
            throw new Error('The server did not return a PDF. Please try again.');
        }

        return response.data;
    } catch(error){
        if(error.response?.data instanceof Blob){
            try{
                error.response.data = JSON.parse(await error.response.data.text());
            } catch {
                // Non-JSON errors use the download's fallback message.
            }
        }
        throw error;
    }
}
