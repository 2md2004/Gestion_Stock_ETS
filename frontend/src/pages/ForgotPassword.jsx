import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo_EBS.png'
import forgotPasswordImg from '../assets/Forgot password-amico.png'
import { URL_FORGOT_PASSWORD } from '../constants/server'
import '../styles/ForgotPassword.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError("Veuillez saisir votre adresse email")
      return
    }
    setError('')
    setLoading(true)
    try {
      const response = await fetch(URL_FORGOT_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      if (!response.ok) {
        setError("Adresse email introuvable")
        return
      }
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch {
      setError("Impossible de contacter le serveur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="forgotPage">
      <div className="forgotIllustration">
        <img src={forgotPasswordImg} alt="Mot de passe oublié" />
      </div>
      <div className="forgotRight">
        <div className="forgotCard">
          <div className="text-center">
            <img src={logo} alt="Logo" className="forgotLogo" />
            <h2 className="forgotTitle">Mot de passe oublié</h2>
            <p className="forgotText">
              Saisissez votre email pour recevoir un nouveau mot de passe.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger small">
              <i className="bi bi-exclamation-circle-fill me-2"></i>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success small">
              <i className="bi bi-check-circle-fill me-2"></i>
              Un nouveau mot de passe a été envoyé.
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button type="submit" className="btn btn-brand w-100 py-2 fw-semibold" disabled={loading}>
                {loading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  "Envoyer"
                )}
              </button>
            </form>
          )}

          <div className="text-center mt-4">
            <a href="/login" className="small fw-semibold loginLink text-decoration-none">
              Retour à la connexion
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
