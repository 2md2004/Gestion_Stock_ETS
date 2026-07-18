import { useEffect, useState } from 'react'
import api from '../services/api'
import '../styles/Profile.css'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = sessionStorage.getItem('userId')
        const response = await api.get(`/gerants/${userId}`)
        setProfile(response.data)
      } catch (error) {
        setError("Impossible de charger le profil")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="profilePage">
        <div className="profileCard loadingCard">
          Chargement du profil...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="profilePage">
        <div className="profileCard errorCard">
          <i className="bi bi-exclamation-circle-fill"></i>
          {error}
        </div>
      </div>
    )
  }

  const initials = `${profile.prenom?.[0] || ''}${profile.nom?.[0] || ''}`.toUpperCase()

  return (
    <div className="profilePage">
      <div className="profileCard">
        <div className="profileTop">
          <div className="profileBigAvatar">
            {initials}
          </div>

          <div className="profileIdentity">
            <h2>{profile.prenom} {profile.nom}</h2>
            <span>
              <i className="bi bi-person-badge"></i>
              {profile.role}
            </span>
          </div>
        </div>

        <div className="profileSection">
          <h3>Informations personnelles</h3>

          <div className="profileInfoGrid">
            <div className="infoItem">
              <div className="infoIcon">
                <i className="bi bi-person"></i>
              </div>
              <div>
                <small>Prénom</small>
                <p>{profile.prenom}</p>
              </div>
            </div>

            <div className="infoItem">
              <div className="infoIcon">
                <i className="bi bi-person-badge"></i>
              </div>
              <div>
                <small>Nom</small>
                <p>{profile.nom}</p>
              </div>
            </div>

            <div className="infoItem">
              <div className="infoIcon">
                <i className="bi bi-envelope"></i>
              </div>
              <div>
                <small>Adresse email</small>
                <p>{profile.email}</p>
              </div>
            </div>

            <div className="infoItem">
              <div className="infoIcon">
                <i className="bi bi-shield-check"></i>
              </div>
              <div>
                <small>Rôle</small>
                <p>{profile.role}</p>
              </div>
            </div>

            <div className="infoItem">
              <div className="infoIcon">
                <i className="bi bi-check-circle"></i>
              </div>
              <div>
                <small>Etat du compte</small>
                <p className="status">{profile.etat}</p>
              </div>
            </div>

            <div className="infoItem">
              <div className="infoIcon">
                <i className="bi bi-calendar-event"></i>
              </div>
              <div>
                <small>Date de création</small>
                <p>{profile.dateDeCreation || "Non disponible"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile