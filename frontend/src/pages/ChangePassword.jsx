import { useState } from 'react'
import { URL_UTILISATEUR } from '../constants/server'
import changePasswordImg from '../assets/change_password.png'
import '../styles/ForgotPassword.css'

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
    setSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { oldPassword, newPassword, confirmPassword } = formData

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Veuillez remplir tous les champs")
      return
    }

    if (newPassword.length < 6) {
      setError("Le nouveau mot de passe doit contenir au moins 6 caractères")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas")
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess(false)

      const token = sessionStorage.getItem('token')
      const userId = sessionStorage.getItem('userId')

      const response = await fetch(
        `${URL_UTILISATEUR}/${userId}/changer-mot-de-passe`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ancienMotDePasse: oldPassword,
            nouveauMotDePasse: newPassword
          })
        }
      )

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setError(data?.message || "Ancien mot de passe incorrect")
        return
      }

      setSuccess(true)
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch {
      setError("Impossible de contacter le serveur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="forgotPage">
      <div className="forgotIllustration">
        <img
          src={changePasswordImg}
          alt="Modifier mot de passe"
        />
      </div>

      <div className="forgotRight">
        <div className="forgotCard">
          <div className="text-center">
            <h2 className="forgotTitle">
              Modifier le mot de passe
            </h2>
            <p className="forgotText">
              Entrez votre ancien mot de passe avant la modification.
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
              Mot de passe modifié avec succès.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">
                Ancien mot de passe
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">
                Nouveau mot de passe
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">
                Confirmer le nouveau mot de passe
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-brand w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : (
                "Modifier le mot de passe"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
