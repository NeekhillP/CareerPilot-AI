import { useState } from 'react'
import '../home.scss'

const Home = () => {
  const [resume, setResume] = useState(null)
  const [fileError, setFileError] = useState('')

  const handleResumeChange = (event) => {
    const file = event.target.files[0]

    if(!file) return

    let error = ''

    if(!file.name.toLowerCase().endsWith('.pdf')){
        error = 'Please choose a PDF resume.'
    } else if(file.size > 3 * 1024 * 1024){
        error = 'Your resume is too large. Choose a PDF no larger than 3 MB.'
    } else if(file.size === 0){
        error = 'This file is empty. Please choose another PDF.'
    }

    setFileError(error)
    setResume(error ? null : file)

    if(error) event.target.value = ''
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
            <span className="home-workspace">INTERVIEW WORKSPACE</span>
        </header>

        <main className="home-main">
            <div className="home-intro">
                <p className="home-eyebrow"><span /> YOUR NEXT MOVE</p>
                <h1>Walk in <span>prepared.</span></h1>
                <p>Bring your experience. Add the opportunity. Give your next interview a little direction.</p>
            </div>

            <form className="interview-form" noValidate onSubmit={(event) => event.preventDefault()}>
                <div className="interview-form-body">
                    <section className="home-background" aria-labelledby="background-title">
                        <div className="home-section-heading">
                            <h2 id="background-title">Your experience</h2>
                            <p>The starting point for a plan that fits you.</p>
                        </div>

                        <div className="home-field">
                            <label htmlFor="resume">Resume</label>
                            <div className={`resume-picker${resume ? ' has-file' : ''}${fileError ? ' has-error' : ''}`}>
                                <input id="resume" name="resume" type="file" accept=".pdf,application/pdf" onChange={handleResumeChange} aria-invalid={Boolean(fileError)} aria-describedby="resume-hint resume-feedback" />
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
                            <textarea id="selfDescription" name="selfDescription" rows="5" placeholder="Your strengths, career goals, or the experience you want to highlight…" aria-describedby="self-description-hint" />
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
                            <textarea id="jobDescription" name="jobDescription" rows="15" placeholder={'Paste the job description here…\n\nInclude the skills, responsibilities, and qualifications the company is looking for.'} aria-describedby="job-description-hint" />
                        </div>
                    </section>
                </div>

                <div className="interview-form-footer">
                    <p>A clearer picture. A more focused preparation plan.</p>
                    <button type="submit" className="home-generate">Generate Report <span aria-hidden="true">↗</span></button>
                </div>
            </form>

            <footer className="home-footer">Built around your potential.</footer>
        </main>
    </div>
  )
}

export default Home
