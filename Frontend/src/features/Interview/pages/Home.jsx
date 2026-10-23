import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useInterview } from '../Hooks/useInterview'
import { useAuth } from '../../Auth/Hooks/useAuth'
import RecentReports from '../Components/RecentReports'
import '../home.scss'

const Home = () => {
  const navigate = useNavigate()
  const {loading, generateReport, resetInterview} = useInterview()
  const {handleLogout} = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')
  const logoutPending = useRef(false)
  const busy = loading || loggingOut
  const [resume, setResume] = useState(null)
  const [fileError, setFileError] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [jobError, setJobError] = useState('')
  const [error, setError] = useState('')
  const resumeInputRef = useRef(null)

  const handleSignOut = async () => {
    if(loading || logoutPending.current) return

    logoutPending.current = true
    setLoggingOut(true)
    setLogoutError('')

    try{
        await handleLogout()
        resetInterview()
        navigate('/login', {replace: true})
    } catch {
        setLogoutError('We could not log you out. Please check your connection and try again.')
    } finally {
        logoutPending.current = false
        setLoggingOut(false)
    }
  }

  const handleResumeChange = (event) => {
    const file = event.target.files[0]
    if(!file) return

    let message = ''
    if(!file.name.toLowerCase().endsWith('.pdf')){
        message = 'Please choose a PDF resume.'
    } else if(file.size > 3 * 1024 * 1024){
        message = 'Your resume is too large. Choose a PDF no larger than 3 MB.'
    } else if(file.size === 0){
        message = 'This file is empty. Please choose another PDF.'
    }

    setFileError(message)
    setResume(message ? null : file)
    if(message) event.target.value = ''
  }

  const handleGenerateReport = async (event) => {
    event.preventDefault()
    if(busy || logoutPending.current) return

    setError('')
    setJobError('')

    if(!resume){
        setFileError('Please choose a PDF resume.')
        resumeInputRef.current.focus()
        return
    }

    if(!jobDescription.trim()){
        setJobError('Please enter a job description.')
        event.currentTarget.elements.jobDescription.focus()
        return
    }

    try{
        const report = await generateReport({
            resumeFile: resume,
            selfDescription: selfDescription.trim(),
            jobDescription: jobDescription.trim()
        })
        navigate('/interview/' + report._id)
    } catch(error){
        setError(error.response?.data?.message || 'We could not generate your report. Please try again.')
    }
  }

  return (
    <div className="interview-home">
        <title>Interview preparation | CareerPilot AI</title>

        <header className="home-header">
            <div className="home-brand">
                <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
                    <path d="M16 3 29 16 16 29 3 16Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="m21 11-3 7-7 3 3-7Z" fill="currentColor" />
                </svg>
                <span>CareerPilot <span className="home-brand-ai">AI</span></span>
            </div>
            <div className="home-header-actions">
                <span className="home-workspace">INTERVIEW WORKSPACE</span>
                <button type="button" className="home-logout" onClick={handleSignOut} disabled={busy} aria-busy={loggingOut} aria-describedby={logoutError ? 'logout-error' : undefined}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M9 4H4v16h5m5-12 4 4-4 4m-6-4h14" />
                    </svg>
                    <span>{loggingOut ? 'Logging out...' : 'Log out'}</span>
                </button>
            </div>
        </header>

        <main className="home-main">
            {logoutError && <p className="home-logout-error" id="logout-error" role="alert">{logoutError}</p>}
            {loggingOut && <p className="home-logout-status" role="status">Logging you out...</p>}
            <div className="home-intro">
                <p className="home-eyebrow"><span /> YOUR NEXT MOVE</p>
                <h1>Walk in <span>prepared.</span></h1>
                <p>Bring your experience. Add the opportunity. Give your next interview a little direction.</p>
            </div>

            <form className="interview-form" noValidate onSubmit={handleGenerateReport}>
                <div className="interview-form-body">
                    <section className="home-background" aria-labelledby="background-title">
                        <div className="home-section-heading">
                            <h2 id="background-title">Your experience</h2>
                            <p>The starting point for a plan that fits you.</p>
                        </div>

                        <div className="home-field">
                            <label htmlFor="resume">Resume</label>
                            <div className={`resume-picker${resume ? ' has-file' : ''}${fileError ? ' has-error' : ''}`}>
                                <input ref={resumeInputRef} disabled={busy} id="resume" name="resume" type="file" accept=".pdf,application/pdf" onChange={handleResumeChange} aria-invalid={Boolean(fileError)} aria-describedby="resume-hint resume-feedback" />
                                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                    <path d="M19 4H9a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10L19 4Z" />
                                    <path d="M18 4v7h7M16 24V15m-4 4 4-4 4 4" />
                                </svg>
                                <span className="resume-picker-title" title={resume?.name}>{resume ? resume.name : 'A good place to start.'}</span>
                                <span className="resume-picker-action">{resume ? 'Choose another PDF' : 'Choose your resume'} <span aria-hidden="true">↗</span></span>
                                <span id="resume-hint">PDF only · Maximum 3 MB</span>
                            </div>
                            <p className={`resume-feedback${fileError ? ' is-error' : ''}`} id="resume-feedback" aria-live="polite">
                                {fileError || (resume ? `${(resume.size / 1024).toFixed(0)} KB · File selected` : '')}
                            </p>
                        </div>

                        <div className="home-field">
                            <label htmlFor="selfDescription">A little about you</label>
                            <p className="home-field-hint" id="self-description-hint">What should we know beyond your resume?</p>
                            <textarea value={selfDescription} onChange={(event) => setSelfDescription(event.target.value)} disabled={busy} id="selfDescription" name="selfDescription" rows="5" placeholder="Your strengths, career goals, or the experience you want to highlight…" aria-describedby="self-description-hint" />
                        </div>
                    </section>

                    <section className="home-opportunity" aria-labelledby="opportunity-title">
                        <div className="home-section-heading">
                            <h2 id="opportunity-title">The opportunity</h2>
                            <p>Tell us about the role you’re working toward.</p>
                        </div>
                        <div className="home-field">
                            <label htmlFor="jobDescription">Job description</label>
                            <p className="home-field-hint" id="job-description-hint">Paste the role, responsibilities, and requirements.</p>
                            <textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} disabled={busy} required aria-invalid={Boolean(jobError)} id="jobDescription" name="jobDescription" rows="15" placeholder={'Paste the job description here…\n\nInclude the skills, responsibilities, and qualifications the company is looking for.'} aria-describedby={jobError ? "job-description-hint job-description-error" : "job-description-hint"} />
                            {jobError && <p className="home-field-error" id="job-description-error">{jobError}</p>}
                        </div>
                    </section>
                </div>

                {error && <p className="home-form-error" role="alert">{error}</p>}

                <div className="interview-form-footer">
                    <p role="status">{loading ? 'Generating your report. This may take a moment.' : 'A clearer picture. A more focused preparation plan.'}</p>
                    <button type="submit" className="home-generate" disabled={busy} aria-busy={loading}>{loading ? 'Generating...' : 'Generate Report'} <span aria-hidden="true">↗</span></button>
                </div>
            </form>

            <RecentReports disabled={loggingOut} />

            <footer className="home-footer">Built around your potential.</footer>
        </main>
    </div>
  )
}

export default Home
