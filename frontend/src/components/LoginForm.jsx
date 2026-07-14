import { useState } from 'react'
import logo from '../assets/logo_EBS.png'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Veuillez remplir tous les champs')
      return
    }
    setError('')
    setLoading(true)


    setTimeout(() => {
      setLoading(false)
      console.log('Connexion :', email, password)
    }, 1000)
  }

  return (
    <div className="loginFormContainer">
      <div className="logoSection">
        <img src={logo} alt="Logo" style={{ width: 70, height: 70, objectFit: 'contain', margin: '0 auto 12px' }} />
        <h2 className="systemName">ETS Beug Serigne Mansour Sy</h2>
        <p className="systemDescription">
          Système de gestion de stock et de suivi des produits
        </p>
      </div>



      {error && (
        <div className="errorMessage">
          <svg className="errorIcon" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form className="loginForm" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label className="inputLabel">
            <svg className="inputIcon" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            Email
          </label>
          <input
            type="email"
            className="formInput"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            disabled={loading}
          />
        </div>

        <div className="inputGroup">
          <label className="inputLabel">
            <svg className="inputIcon" viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm3 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
            </svg>
            Mot de passe
          </label>
          <div className="passwordInputContainer">
            <input
              type={showPassword ? 'text' : 'password'}
              className="formInput"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
            <button
              type="button"
              className="passwordToggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <svg className="eyeIcon" viewBox="0 0 24 24">
                {showPassword ? (
                  <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.79.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.42 1.68-2.65 2.93-3.53z" />
                ) : (
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className="formOptions">
          <a href="#" className="forgotPassword">Mot de passe oublié ?</a>
        </div>

        <button type="submit" className="submitButton" disabled={loading}>
          {loading ? (
            <svg className="spinner" viewBox="0 0 50 50">
              <circle className="spinnerPath" cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
            </svg>
          ) : (
            'Se connecter'
          )}
        </button>
      </form>
    </div>
  )
}

export default LoginForm