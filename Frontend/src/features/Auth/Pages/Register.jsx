import { Link } from 'react-router'
import AuthLayout from '../Components/AuthLayout'
import PasswordField from '../Components/PasswordField'
import {useNavigate} from 'react-router'

const Register = () => {
       
    const navigate = useNavigate()

    const handleSumbit = (e)=>{
        e.preventDefault()

    }

  return (
    <AuthLayout>
        <title>Create an account | CareerPilot AI</title>
        <div className="auth-heading">
            <span className="auth-eyebrow">A NEW CHAPTER STARTS HERE</span>
            <h1>Find your direction.</h1>
            <p>Create an account. Make room for what’s next.</p>
        </div>

        <form className="auth-form" noValidate onSubmit={handleSumbit}>
            <div className="auth-field">
                <label htmlFor="username">Username</label>
                <input id="username" name="username" type="text" placeholder="Choose a username" autoComplete="username" required />
            </div>
            <div className="auth-field">
                <label htmlFor="email">Email address</label>
                <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
            </div>
            <PasswordField isRegister />
            <button className="auth-submit" type="submit">
                Create account <span aria-hidden="true">↗</span>
            </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
    </AuthLayout>
  )
}

export default Register
