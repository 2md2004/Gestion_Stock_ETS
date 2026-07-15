import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import logo from '../assets/logo_EBS.png'
import { URL_LOGIN } from '../constants/server'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Veuillez remplir tous les champs')
      return
    }
    setError('')
    setLoading(true)

    try {
      const response = await fetch(URL_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, motDePasse: password })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setError(data?.message || 'Email ou mot de passe incorrect')
        return
      }

      const data = await response.json()
      if (data.accessToken) {
        sessionStorage.setItem('token', data.accessToken)

        const decoded = jwtDecode(data.accessToken)
        sessionStorage.setItem('userId', decoded.id)
        sessionStorage.setItem('userNom', decoded.nom)
        sessionStorage.setItem('userPrenom', decoded.prenom)
        sessionStorage.setItem('userRole', decoded.role)
      }
      navigate('/dashboard')
    } catch (err) {
      setError('Impossible de contacter le serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
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
          Système de gestion de stock et de suivi des produits
        </p>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small" role="alert">
          <i className="bi bi-exclamation-circle-fill flex-shrink-0"></i>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label small fw-semibold">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            disabled={loading}
          />
        </div>

        <div className="mb-2">
          <label className="form-label small fw-semibold">Mot de passe</label>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              tabIndex={-1}
            >
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </button>
          </div>
        </div>

        <div className="d-flex justify-content-end mb-3">
          <a
            href="#"
            className="small fw-semibold loginLink text-decoration-none"
            onClick={(e) => {
              e.preventDefault()
              navigate('/mot-de-passe-oublie')
            }}
          >
            Mot de passe oublié ?
          </a>
        </div>

        <button type="submit" className="btn btn-brand w-100 py-2 fw-semibold" disabled={loading}>
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            'Se connecter'
          )}
        </button>
      </form>
    </div>
  )
}

export default LoginForm