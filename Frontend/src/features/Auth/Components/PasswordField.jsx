import { useState } from 'react'

const PasswordField = ({ isRegister = false, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="auth-field">
        <label htmlFor="password">Password</label>
        <div className="auth-password">
            <input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder={isRegister ? 'Create a password' : 'Enter your password'} autoComplete={isRegister ? 'new-password' : 'current-password'} value={value} onChange={onChange} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} title={showPassword ? 'Hide password' : 'Show password'}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                    {showPassword && <path d="m3 3 18 18" />}
                </svg>
            </button>
        </div>
    </div>
  )
}

export default PasswordField
