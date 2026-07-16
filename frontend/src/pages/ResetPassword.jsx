import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/logo_EBS.png'
import resetPasswordImg from '../assets/Reset password.gif'
import { URL_RESET_PASSWORD } from '../constants/server'
import '../styles/Login.css'
import api from '../services/api'

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const tokenFromUrl = queryParams.get('token')
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
      console.log('Token récupéré:', tokenFromUrl)
    } else {
      setError('Token manquant. Veuillez utiliser le lien envoyé par email.')
    }
  }, [location.search])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!token) {
      setError("Token invalide. Veuillez utiliser le lien envoyé par email.")
      return
    }

    if (!formData.password) {
      setError("Veuillez saisir un mot de passe")
      return
    }
    
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    setError('')
    setLoading(true)

    try {
      // Envoyer le token et le mot de passe dans le body
      await api.post(URL_RESET_PASSWORD, {
        token: token,
        password: formData.password
      })
      setSuccess(true)
      
      setTimeout(() => navigate('/login'), 3000)
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
                Réinitialisation du mot de passe
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
                  Votre mot de passe a été réinitialisé avec succès.
                  <br />
                  <small>Redirection vers la connexion...</small>
                </span>
              </div>
            )}

            {!success && (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Nouveau mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Nouveau mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading || !token}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Confirmer le mot de passe"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading || !token}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-brand w-100 py-2 fw-semibold" 
                  disabled={loading || !token}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    'Réinitialiser'
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

        <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-4 p-lg-5 loginRightPanel">
          <div className="flex-grow-1 d-flex align-items-center justify-content-center position-relative illustrationSection">
            <img
              src={resetPasswordImg}
              alt="Réinitialiser mot de passe"
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
      </div>
    </div>
  )
}

export default ResetPassword