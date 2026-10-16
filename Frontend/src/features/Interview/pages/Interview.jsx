import { useState } from 'react'
import { Link } from 'react-router'
import sampleReport from '../data/sampleReport'
import '../interview.scss'

const sections = [
    {id: 'technicalQuestions', label: 'Technical questions', description: 'Go beyond the answer. Get comfortable explaining your thinking.'},
    {id: 'behavioralQuestions', label: 'Behavioral questions', description: 'Connect your experience to the way you work, collaborate, and solve problems.'},
    {id: 'preparationPlan', label: 'Roadmap', description: 'Turn your focus areas into a practical, day-by-day preparation plan.'}
]

const Interview = ({report = sampleReport}) => {
    const [activeSection, setActiveSection] = useState('technicalQuestions')
    const skillGaps = report.skillGaps ?? []

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
                                        {report === sampleReport && <span className="report-sample-label">Sample report</span>}
                                    </div>
                                    <h1>{section.label}</h1>
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
                                                <h2>{day.focus}</h2>
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
                                                    <h2>{question.question}</h2>
                                                </summary>
                                                <div className="report-question-body">
                                                    <div className="report-intention">
                                                        <h3>What they’re looking for</h3>
                                                        <p>{question.intention}</p>
                                                    </div>
                                                    <div className="report-answer">
                                                        <h3>How to approach your answer</h3>
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
            <footer className="report-footer">Preparation with a little more direction.</footer>
        </div>
    )
}

export default Interview
