import {getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf} from '../services/interview.api'
import {useCallback, useContext, useRef} from 'react'
import {InterviewContext} from '../interviewContext'

export const useInterview =()=>{

    const context = useContext(InterviewContext);

    if(!context){
        throw new Error('useInterview must be used within an InterviewProvider')
    }

    const {loading, setLoading, report, setReport, reports, setReports} = context;
    const reportRequest = useRef(0);
    const reportsRequest = useRef(0);

    const generateReport = async ({jobDescription, selfDescription, resumeFile})=>{
        setLoading(true);
        try{
            const response = await generateInterviewReport({jobDescription, selfDescription, resumeFile});
            setReport(response.data);
            return response.data;
        } finally {
            setLoading(false);
        }
    }


    const getReportById = useCallback(async (interviewId, signal)=>{
        const requestId = ++reportRequest.current;
        setLoading(true);
        try{
            const response = await getInterviewReportById(interviewId, signal);
            if(!signal?.aborted && requestId === reportRequest.current) setReport(response.data);
            return response.data;
        } catch(error){
            if(!signal?.aborted && requestId === reportRequest.current) setReport(null);
            throw error;
        } finally {
            if(requestId === reportRequest.current) setLoading(false);
        }
    }, [setLoading, setReport])

    const getAllReports = useCallback(async (signal)=>{
        const requestId = ++reportsRequest.current;
        const response = await getAllInterviewReports(signal);
        if(!signal?.aborted && requestId === reportsRequest.current) setReports(response.data);
        return response.data;
    }, [setReports])

    const generateResumePdfFile = async({interviewId, signal})=>{
        const pdf = await generateResumePdf({interviewId, signal});
        if(signal?.aborted) return;

        const url = window.URL.createObjectURL(pdf);
        const link = document.createElement('a');
        try{
            link.href = url;
            link.setAttribute('download', `resume_${interviewId}.pdf`);
            document.body.appendChild(link);
            link.click();
        } finally {
            link.remove();
            setTimeout(()=>window.URL.revokeObjectURL(url), 1000);
        }
    }

    const resetInterview = ()=>{
        setReport(null);
        setReports([]);
    }

    return {loading, report, reports, generateReport, getReportById, getAllReports, generateResumePdfFile, resetInterview};
}
