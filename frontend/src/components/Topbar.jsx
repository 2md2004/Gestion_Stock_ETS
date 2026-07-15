import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Topbar.css'

const notifs = [
  { id: 1, type: 'danger', title: 'Stock faible', message: 'Le ciment est presque en rupture de stock.', time: 'Il y a 2h' },
  { id: 2, type: 'success', title: 'Nouvelle vente', message: 'Une vente de 45 000 FCFA a été enregistrée.', time: 'Il y a 5h' },
  { id: 3, type: 'warning', title: 'Réapprovisionnement', message: 'Une nouvelle livraison est arrivée.', time: 'Hier' },
]

const notifIcons = {
  danger: 'bi-exclamation-circle-fill text-danger',
  success: 'bi-check-circle-fill text-success',
  warning: 'bi-info-circle-fill text-warning',
}

const Topbar = ({ title = 'Tableau de bord' }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const menuRef = useRef(null)
  const notifRef = useRef(null)
  const navigate = useNavigate()

  const userNom = sessionStorage.getItem('userNom') || ''
  const userPrenom = sessionStorage.getItem('userPrenom') || ''
  const userName = `${userPrenom} ${userNom}`.trim() || 'Utilisateur'
  const userRole = sessionStorage.getItem('userRole') || 'Gérant'

  const handleLogout = () => {
    sessionStorage.clear()
    navigate('/login')
  }

  const goToProfile = () => {
    setMenuOpen(false)
    navigate('/profil')
  }

  const goToChangePassword = () => {
    setMenuOpen(false)
    navigate('/modifier-mot-de-passe')
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = userName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const date = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  return (
    <header className="topbar d-flex align-items-center justify-content-between gap-3 bg-white border-bottom px-4">
      <div className="topbarLeft d-flex flex-column flex-shrink-0">
        <h1 className="topbarTitle mb-0 fw-bold">{title}</h1>
        <span className="topbarSubtitle text-secondary">Gestion de stock</span>
      </div>

      <div className="topbarRight d-flex align-items-center gap-2 gap-md-3 flex-shrink-0">
        <div className="topbarDate d-none d-xl-flex align-items-center gap-2 bg-light rounded-3 px-3 fw-semibold text-secondary">
          <i className="bi bi-calendar3"></i>
          {date}
        </div>

        <div className="notificationWrapper" ref={notifRef}>
          <button onClick={() => setNotifOpen(!notifOpen)} className="notification position-relative border-0 rounded-3 bg-light d-flex align-items-center justify-content-center">
            <i className="bi bi-bell"></i>
            <span className="badge rounded-pill position-absolute top-0 start-100 translate-middle">{notifs.length}</span>
          </button>

          {notifOpen && (
            <div className="notificationMenu">
              <div className="notificationHeader">
                <span>Notifications</span>
                <span className="notificationCount">{notifs.length} nouvelles</span>
              </div>

              {notifs.map((n) => (
                <div key={n.id} className="notificationItem">
                  <i className={`bi ${notifIcons[n.type]}`}></i>
                  <div className="notificationContent">
                    <strong>{n.title}</strong>
                    <p>{n.message}</p>
                    <span className="notificationTime">{n.time}</span>
                  </div>
                </div>
              ))}

              <div className="notificationFooter">
                <button onClick={() => { setNotifOpen(false); navigate('/notifications') }}>
                  Voir toutes les notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="topbarProfile position-relative" ref={menuRef}>
          <button
            className="profileButton d-flex align-items-center gap-2 bg-white border rounded-3 px-2 py-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="profileAvatar rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0">
              {initials}
            </div>

            <div className="profileInfo d-none d-md-flex flex-column align-items-start">
              <strong>{userName}</strong>
              <small className="text-secondary">{userRole}</small>
            </div>

            <i className={`bi bi-chevron-down profileChevron ${menuOpen ? 'rotate' : ''}`}></i>
          </button>

          {menuOpen && (
            <div className="profileMenu position-absolute end-0 bg-white border rounded-3 shadow-sm p-2">
              <button onClick={goToProfile} className="d-flex align-items-center gap-2 w-100 border-0 bg-transparent rounded-2 px-2 py-2">
                <i className="bi bi-person-circle"></i>
                Mon profil
              </button>

              <button onClick={goToChangePassword} className="d-flex align-items-center gap-2 w-100 border-0 bg-transparent rounded-2 px-2 py-2">
                <i className="bi bi-lock"></i>
                Modifier mot de passe
              </button>

              <button onClick={handleLogout} className="danger d-flex align-items-center gap-2 w-100 border-0 bg-transparent rounded-2 px-2 py-2">
                <i className="bi bi-box-arrow-right"></i>
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar