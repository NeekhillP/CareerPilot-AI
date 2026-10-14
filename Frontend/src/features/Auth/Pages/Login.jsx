import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import AuthLayout from '../Components/AuthLayout'
import PasswordField from '../Components/PasswordField'
import {useAuth} from '../Hooks/useAuth'

const Login = () => {

    const navigate = useNavigate();

    const {loading, handleLogin} = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');



    const handleSumbit = async (e)=>{
        e.preventDefault()
        const userData = await handleLogin({email, password})

        if(userData){
            navigate('/')
        }

    }
    if(loading){
        return (
            <AuthLayout>
                <div className="auth-heading">
                    <span className="auth-eyebrow">YOUR CAREER, IN FOCUS</span>
                    <h1>Welcome back.</h1>
                    <p>A little clarity for your next big move.</p>
                </div>
            </AuthLayout>
        )
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
                <input 
                onChange={(e)=>setEmail(e.target.value)}
                id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
            </div>
            <PasswordField onChange={(e)=>setPassword(e.target.value)} />
            <button className="auth-submit" type="submit">
                Log in <span aria-hidden="true">↗</span>
            </button>
        </form>

        <p className="auth-switch">New to CareerPilot? <Link to="/register">Create an account</Link></p>
    </AuthLayout>
  )
}

export default Login
