import {useEffect, useState} from 'react'
import {Link} from 'react-router'
import {useInterview} from '../Hooks/useInterview'

const RecentReports = () => {
    const {reports, getAllReports, loading} = useInterview()
    const [status, setStatus] = useState('loading')
    const [error, setError] = useState('')
    const [retryCount, setRetryCount] = useState(0)

    useEffect(()=>{
        const controller = new AbortController()

        getAllReports(controller.signal)
            .then(()=>{
                if(!controller.signal.aborted) setStatus('ready')
            })
            .catch((error)=>{
                if(!controller.signal.aborted){
                    setError(error.response?.status === 401
                        ? 'Your session has expired. Sign in again to see your reports.'
                        : 'We could not load your reports. Please try again.')
                    setStatus('error')
                }
            })

        return ()=>controller.abort()
    }, [getAllReports, retryCount])

    return (
        <section className="recent-reports" aria-labelledby="recent-reports-title">
            <div className="recent-reports-heading">
                <div>
                    <h2 id="recent-reports-title">Recent reports</h2>
                    <p>Pick up where you left off.</p>
                </div>
                {status === 'ready' && <span className="recent-reports-count">{reports.length} saved</span>}
            </div>

            {status === 'loading' ? (
                <p className="recent-reports-message" role="status">Loading your reports...</p>
            ) : status === 'error' ? (
                <div className="recent-reports-error">
                    <p role="alert">{error}</p>
                    <button type="button" onClick={()=>{
                        setStatus('loading')
                        setError('')
                        setRetryCount((count)=>count + 1)
                    }}>Try again</button>
                </div>
            ) : reports.length === 0 ? (
                <p className="recent-reports-message">No reports yet. Generate your first report above and it will appear here.</p>
            ) : (
                <ul className="recent-reports-list">
                    {reports.map((report)=>(
                        <li key={report._id}>
                            <Link to={`/interview/${report._id}`} aria-disabled={loading} tabIndex={loading ? -1 : undefined} onClick={(event)=>{
                                if(loading) event.preventDefault()
                            }}>
                                <div className="recent-report-details">
                                    <h3>{report.title || 'Interview report'}</h3>
                                    {report.createdAt && <time dateTime={report.createdAt}>{new Date(report.createdAt).toLocaleDateString('en', {month: 'short', day: 'numeric', year: 'numeric'})}</time>}
                                </div>
                                <span className="recent-report-match">{typeof report.matchScore === 'number' ? <><strong>{report.matchScore}%</strong> match</> : 'Not scored'}</span>
                                <span className="recent-report-arrow" aria-hidden="true">&rarr;</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}

export default RecentReports
