import { Link } from 'react-router'
import AuthLayout from '../Components/AuthLayout'
import PasswordField from '../Components/PasswordField'

const Login = () => {

    const handleSumbit = (e)=>{
        e.preventDefault()
    }
    
  return (
    <AuthLayout>
        <title>Log in | CareerPilot AI</title>
        <div className="auth-heading">
            <span className="auth-eyebrow">YOUR CAREER, IN FOCUS</span>
            <h1>Welcome back.</h1>
            <p>A little clarity for your next big move.</p>
        </div>

        <form className="auth-form" noValidate onSubmit={handleSumbit}>
            <div className="auth-field">
                <label htmlFor="email">Email address</label>
                <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
            </div>
            <PasswordField />
            <button className="auth-submit" type="submit">
                Log in <span aria-hidden="true">↗</span>
            </button>
        </form>

        <p className="auth-switch">New to CareerPilot? <Link to="/register">Create an account</Link></p>
    </AuthLayout>
  )
}

export default Login
