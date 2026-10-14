import '../auth.scss'

const AuthLayout = ({ children }) => {
  return (
    <main className="auth-page">
        <aside className="auth-story" aria-label="About CareerPilot AI">
            <div className="auth-brand">
                <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
                    <path d="M16 3 29 16 16 29 3 16Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="m21 11-3 7-7 3 3-7Z" fill="currentColor" />
                </svg>
                <span>CareerPilot <span className="auth-brand-ai">AI</span></span>
            </div>

            <div className="auth-story-content">
                <p className="auth-story-label"><span /> A CLEARER WAY FORWARD</p>
                <h2>Your next chapter.<br /><span>Your own direction.</span></h2>
                <p>You bring the ambition. We help you turn it into a career plan that feels like you.</p>

                <div className="career-map" aria-hidden="true">
                    <svg className="career-map-route" viewBox="0 0 440 250" fill="none">
                        <path d="M40 204H130Q165 204 165 169V117Q165 82 200 82H330Q365 82 365 47V28" stroke="currentColor" strokeWidth="2" strokeDasharray="5 7" />
                        <circle cx="40" cy="204" r="6" fill="currentColor" />
                        <circle cx="365" cy="28" r="6" fill="currentColor" />
                        <circle cx="365" cy="28" r="15" stroke="currentColor" strokeOpacity=".3" />
                    </svg>
                    <div className="career-map-start">WHERE YOU ARE</div>
                    <div className="career-map-note">
                        <span className="career-map-icon">↗</span>
                        <div><span>YOUR NEXT MOVE</span><strong>A career that fits.</strong></div>
                    </div>
                    <div className="career-map-end">WHERE YOU COULD GO</div>
                </div>
            </div>

            <p className="auth-story-footer">Built around your potential.</p>
        </aside>

        <section className="auth-panel" aria-label="Account access">
            <div className="auth-panel-caption">A LITTLE DIRECTION. A LOT OF POSSIBILITY.</div>
            <div className="auth-panel-content">{children}</div>
            <p className="auth-panel-footer">Your next move starts with you.</p>
        </section>
    </main>
  )
}

export default AuthLayout
