import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import AuthLayout from '../Components/AuthLayout'
import PasswordField from '../Components/PasswordField'
import {useAuth} from '../Hooks/useAuth'

const Register = () => {
       
    const navigate = useNavigate()
    const {loading, handleRegister} = useAuth()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSumbit = async (e)=>{
        e.preventDefault()

        if(loading) return

        const userData = await handleRegister({username, email, password})

        if(userData){
            navigate('/')
        }
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
                <input
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                id="username" name="username" type="text" placeholder="Choose a username" autoComplete="username" required />
            </div>
            <div className="auth-field">
                <label htmlFor="email">Email address</label>
                <input
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
            </div>
            <PasswordField isRegister value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button className="auth-submit" type="submit" disabled={loading} aria-busy={loading}>
                {loading ? 'Creating account...' : 'Create account'} <span aria-hidden="true">↗</span>
            </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
    </AuthLayout>
  )
}

export default Register
