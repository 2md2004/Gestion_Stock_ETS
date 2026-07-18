import { useState } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'
import changePasswordImg from '../assets/change_password.png'
import '../styles/Profile.css'
import '../styles/Login.css'

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

      const userId = sessionStorage.getItem('userId')

      await api.put(`/gerants/${userId}/changer-mot-de-passe`, {
        ancienMotDePasse: oldPassword,
        nouveauMotDePasse: newPassword
      })

      setSuccess(true)
      toast.success("Mot de passe modifié avec succès")
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (err) {
      setError(err?.response?.data?.message || "Ancien mot de passe incorrect")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profilePage">
      <div
        className="profileCard"
        style={{ maxWidth: '900px' }}
      >
        <div className="row g-0">
          <div className="col-lg-5 d-none d-lg-flex flex-column justify-content-between p-4 p-lg-5 loginLeftPanel" style={{ borderRadius: '18px 0 0 18px' }}>
            <div className="flex-grow-1 d-flex align-items-center justify-content-center position-relative illustrationSection">
              <img
                src={changePasswordImg}
                alt="Modifier mot de passe"
                className="img-fluid illustration"
              />
            </div>
          </div>

          <div className="col-12 col-lg-7 d-flex flex-column justify-content-center" style={{ padding: '35px 30px' }}>
            <div className="text-center mb-4">
              <h2 style={{ color: '#002050', fontSize: '20px', fontWeight: 700 }}>
                Modifier le mot de passe
              </h2>
              <p style={{ color: '#64748b', fontSize: '13px', marginBottom: 0 }}>
                Entrez votre ancien mot de passe avant la modification.
              </p>
            </div>

            {error && (
              <div className="message error">
                <i className="bi bi-exclamation-circle-fill"></i>
                {error}
              </div>
            )}

            {success && (
              <div className="message success">
                <i className="bi bi-check-circle-fill"></i>
                Mot de passe modifié avec succès.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="passwordField">
                <label>
                  <i className="bi bi-lock me-1" style={{ color: '#D09018' }}></i>
                  Ancien mot de passe
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              <div className="passwordField">
                <label>
                  <i className="bi bi-lock-fill me-1" style={{ color: '#D09018' }}></i>
                  Nouveau mot de passe
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              <div className="passwordField">
                <label>
                  <i className="bi bi-shield-lock me-1" style={{ color: '#D09018' }}></i>
                  Confirmer le nouveau mot de passe
                </label>
                <div className="passwordInput">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={loading}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="passwordButton mt-3"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Modifier le mot de passe
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
