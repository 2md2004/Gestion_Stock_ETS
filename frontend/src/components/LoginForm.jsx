import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo_EBS.png'
import { URL_LOGIN } from '../constants/server'
import api from '../services/api'

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
      const response = await api.post(URL_LOGIN, {
        email: email,
        motDePasse: password
      })

      if (response.status === 200) {
        const data = response.data
        
        console.log('📦 Données reçues:', data)
        
        // ✅ Stockage des données utilisateur (avec 'id' au lieu de 'userId')
        if (data.id) {
          sessionStorage.setItem('userId', data.id)  // On stocke 'id' sous 'userId'
          console.log('✅ userId stocké:', data.id)
        } else {
          console.warn('⚠️ id non reçu du backend')
          setError('Erreur: Identifiant utilisateur manquant')
          setLoading(false)
          return
        }
        
        if (data.nom) {
          sessionStorage.setItem('userNom', data.nom)
        }
        if (data.prenom) {
          sessionStorage.setItem('userPrenom', data.prenom)
        }
        if (data.role) {
          sessionStorage.setItem('userRole', data.role)
        }
        if (data.email) {
          sessionStorage.setItem('userEmail', data.email)
        }
        
        console.log('✅ Données stockées:', {
          userId: sessionStorage.getItem('userId'),
          nom: sessionStorage.getItem('userNom'),
          prenom: sessionStorage.getItem('userPrenom'),
          role: sessionStorage.getItem('userRole'),
          email: sessionStorage.getItem('userEmail')
        })
        
        // ✅ Redirection
        navigate('/dashboard')
      }

    } catch (error) {
      console.error('❌ Erreur:', error)
      
      if (error.response) {
        const status = error.response.status
        
        if (status === 401) {
          setError('Email ou mot de passe incorrect')
        } else if (status === 403) {
          setError('Compte désactivé, veuillez contacter l\'administrateur')
        } else {
          setError(error.response.data?.message || 'Une erreur est survenue')
        }
      } else if (error.request) {
        setError('Impossible de contacter le serveur')
      } else {
        setError('Une erreur est survenue')
      }
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
            autoComplete="email"
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
              autoComplete="current-password"
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              tabIndex={-1}
              aria-label="Afficher/masquer le mot de passe"
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

        <button 
          type="submit" 
          className="btn btn-brand w-100 py-2 fw-semibold" 
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Connexion en cours...
            </>
          ) : (
            'Se connecter'
          )}
        </button>
      </form>

    </div>
  )
}

export default LoginForm