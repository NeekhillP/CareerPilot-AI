import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useInterview } from '../Hooks/useInterview'
import '../interview.scss'

const sections = [
    {id: 'technicalQuestions', label: 'Technical questions', description: 'Go beyond the answer. Get comfortable explaining your thinking.'},
    {id: 'behavioralQuestions', label: 'Behavioral questions', description: 'Connect your experience to the way you work, collaborate, and solve problems.'},
    {id: 'preparationPlan', label: 'Roadmap', description: 'Turn your focus areas into a practical, day-by-day preparation plan.'}
]

const Interview = () => {
    const {interviewId} = useParams()
    const {report, getReportById} = useInterview()
    const [request, setRequest] = useState({id: null, error: ''})
    const [retryCount, setRetryCount] = useState(0)
    const [activeSection, setActiveSection] = useState('technicalQuestions')
    const skillGaps = report?.skillGaps ?? []
    const ready = request.id === interviewId && !request.error && report?._id === interviewId

    useEffect(()=>{
        const controller = new AbortController()

        getReportById(interviewId, controller.signal)
            .then(()=>{
                if(!controller.signal.aborted) setRequest({id: interviewId, error: ''})
            })
            .catch((error)=>{
                if(!controller.signal.aborted){
                    setRequest({id: interviewId, error: error.response?.data?.message || 'We could not load your report. Please try again.'})
                }
            })

        return ()=>controller.abort()
    }, [interviewId, getReportById, retryCount])

    const handleTabKeyDown = (event) => {
        const currentIndex = sections.findIndex((section) => section.id === activeSection)
        let nextIndex

        if(event.key === 'ArrowDown' || event.key === 'ArrowRight'){
            nextIndex = (currentIndex + 1) % sections.length
        } else if(event.key === 'ArrowUp' || event.key === 'ArrowLeft'){
            nextIndex = (currentIndex - 1 + sections.length) % sections.length
        } else if(event.key === 'Home'){
            nextIndex = 0
        } else if(event.key === 'End'){
            nextIndex = sections.length - 1
        } else {
            return
        }

        event.preventDefault()
        setActiveSection(sections[nextIndex].id)
        event.currentTarget.querySelectorAll('[role="tab"]')[nextIndex].focus()
    }

    return (
        <div className="interview-report">
            <title>Interview report | CareerPilot AI</title>

            <header className="report-topbar">
                <Link to="/" className="report-back"><span aria-hidden="true">←</span> Back to workspace</Link>
                <span className="report-wordmark">CareerPilot <span>AI</span></span>
            </header>

            {request.id === interviewId && request.error ? (
                <main className="report-status" role="alert">
                    <h1>Report unavailable</h1>
                    <p>{request.error}</p>
                    <button type="button" onClick={()=>{
                        setRequest({id: null, error: ''})
                        setRetryCount((count)=>count + 1)
                    }}>Try again</button>
                </main>
            ) : !ready ? (
                <main className="report-status" role="status"><p>Loading your interview report...</p></main>
            ) : (
            <>
            <div className="report-title">
                <p className="report-eyebrow">YOUR INTERVIEW REPORT</p>
                <h1>{report.title || 'Interview report'}</h1>
            </div>
            <main className="report-layout">
                <aside className="report-sidebar" aria-label="Report navigation and match score">
                    <p className="report-eyebrow">YOUR PREPARATION</p>

                    <div className="report-nav" role="tablist" aria-label="Report sections" aria-orientation="vertical" onKeyDown={handleTabKeyDown}>
                        {sections.map((section) => (
                            <button key={section.id} type="button" role="tab" id={`tab-${section.id}`} aria-selected={activeSection === section.id} aria-controls={`panel-${section.id}`} tabIndex={activeSection === section.id ? 0 : -1} onClick={() => setActiveSection(section.id)}>
                                <span>{section.label}</span>
                                <span className="report-nav-count">{report[section.id]?.length ?? 0}</span>
                            </button>
                        ))}
                    </div>

                    <div className="report-match">
                        <p className="report-eyebrow">PROFILE MATCH</p>
                        <p className="report-match-value">{report.matchScore ?? '—'}<span>/ 100</span></p>
                        {typeof report.matchScore === 'number' && <meter min="0" max="100" value={report.matchScore} aria-label="Profile match score" />}
                        <p>Resume & role alignment</p>
                    </div>
                </aside>

                <div className="report-content">
                    {sections.map((section) => {
                        const items = report[section.id] ?? []
                        const isRoadmap = section.id === 'preparationPlan'

                        return (
                            <section key={section.id} id={`panel-${section.id}`} role="tabpanel" aria-labelledby={`tab-${section.id}`} hidden={activeSection !== section.id} tabIndex="0">
                                <div className="report-content-heading">
                                    <div className="report-heading-meta">
                                        <p className="report-eyebrow">YOUR INTERVIEW GUIDE</p>
                                    </div>
                                    <h2>{section.label}</h2>
                                    <p>{section.description}</p>
                                </div>

                                <p className="report-item-count">{items.length} {isRoadmap ? 'preparation days' : 'questions to explore'}</p>

                                {items.length === 0 ? (
                                    <p className="report-empty">No {isRoadmap ? 'preparation days' : 'questions'} in this report yet.</p>
                                ) : isRoadmap ? (
                                    <ol className="report-roadmap">
                                        {items.map((day, index) => (
                                            <li key={index}>
                                                <span className="report-day">Day {day.day}</span>
                                                <h3>{day.focus}</h3>
                                                <ul>{day.tasks.map((task, taskIndex) => <li key={taskIndex}>{task}</li>)}</ul>
                                            </li>
                                        ))}
                                    </ol>
                                ) : (
                                    <div className="report-questions">
                                        {items.map((question, index) => (
                                            <details className="report-question" key={index} open={index === 0}>
                                                <summary>
                                                    <span className="report-question-number">{String(index + 1).padStart(2, '0')}</span>
                                                    <h3>{question.question}</h3>
                                                </summary>
                                                <div className="report-question-body">
                                                    <div className="report-intention">
                                                        <h4>What they’re looking for</h4>
                                                        <p>{question.intention}</p>
                                                    </div>
                                                    <div className="report-answer">
                                                        <h4>How to approach your answer</h4>
                                                        <p>{question.answer}</p>
                                                    </div>
                                                </div>
                                            </details>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )
                    })}
                </div>

                <aside className="report-skills" aria-labelledby="skill-gaps-title">
                    <p className="report-eyebrow">ROOM TO GROW</p>
                    <h2 id="skill-gaps-title">Skill gaps<span>{skillGaps.length}</span></h2>
                    <p>A little focus here can make a difference in your preparation.</p>

                    {skillGaps.length === 0 ? <p className="report-empty">No skill gaps listed in this report.</p> : (
                        <ul className="report-skill-list">
                            {skillGaps.map((gap, index) => (
                                <li key={index}>
                                    <span>{gap.skill}</span>
                                    <span className={`report-severity severity-${gap.severity}`}>{gap.severity} priority</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="report-skill-note">
                        <span aria-hidden="true">↗</span>
                        <p>Use your roadmap to work through these focus areas, one day at a time.</p>
                    </div>
                </aside>
            </main>
            </>
            )}
            <footer className="report-footer">Preparation with a little more direction.</footer>
        </div>
    )
}

export default Interview
