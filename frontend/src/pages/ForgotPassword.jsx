import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo_EBS.png'
import forgotPasswordImg from '../assets/Forgot password-amico.png'
import { URL_FORGOT_PASSWORD } from '../constants/server'
import '../styles/Login.css'
import api from '../services/api'

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
      await api.post(URL_FORGOT_PASSWORD, {
        email: email
      });
      setSuccess(true);
      
      // setTimeout(() => navigate('/reinitialiser-mot-de-passe'), 3000)
    } catch(error) {
      console.log(error.response?.data)
      setError(error.response?.data?.message || "Impossible de contacter le serveur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="loginPage vh-100 d-flex align-items-center justify-content-center">
      <div className="loginCard row g-0 shadow-lg rounded-4 overflow-hidden bg-white mx-auto">
        <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-4 p-lg-5 loginLeftPanel">
          <div className="flex-grow-1 d-flex align-items-center justify-content-center position-relative illustrationSection">
            <img
              src={forgotPasswordImg}
              alt="Mot de passe oublié"
              className="img-fluid illustration"
            />
          </div>

          <div className="text-center">
            <p className="small text-muted mb-1">Version 1.0.0</p>
            <p className="small text-muted mb-0">
              © 2026 ETS Beug Serigne Mansour Sy - Tous droits réservés
            </p>
          </div>
        </div>

        <div className="col-12 col-lg-6 p-4 p-lg-5 d-flex flex-column justify-content-center">
          <div className="loginFormContainer mx-auto w-100">
            <div className="text-center mb-4">
              <img
                src={logo}
                alt="Logo"
                className="mb-3"
                style={{ width: 70, height: 70, objectFit: 'contain' }}
              />
              <h2 className="h5 fw-semibold loginBrand mb-2">ETS Beug Serigne Mansour Sy</h2>
              <p className="small text-muted mb-0">
                Saisissez votre email pour recevoir un nouveau mot de passe
              </p>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small" role="alert">
                <i className="bi bi-exclamation-circle-fill flex-shrink-0"></i>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success d-flex align-items-center gap-2 py-2 small" role="alert">
                <i className="bi bi-check-circle-fill flex-shrink-0"></i>
                <span>
                  Un nouveau mot de passe a été envoyé.
                  <br />
                  <small>Redirection vers la réinitialisation...</small>
                </span>
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
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-brand w-100 py-2 fw-semibold" 
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    "Envoyer"
                  )}
                </button>
              </form>
            )}

            <div className="text-center mt-3">
              <a
                href="/login"
                className="small fw-semibold loginLink text-decoration-none"
              >
                <i className="bi bi-arrow-left me-1"></i>
                Retour à la connexion
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword