import { useState, useRef, useEffect } from 'react'
import '../styles/Topbar.css'

const Topbar = ({
  title = 'Tableau de bord',
  userName = 'Ndiaye Moussa',
  userRole = 'Gérant',
}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
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
      {/* GAUCHE */}
      <div className="topbarLeft d-flex flex-column flex-shrink-0">
        <h1 className="topbarTitle mb-0 fw-bold">{title}</h1>
        <span className="topbarSubtitle text-secondary">Gestion de stock</span>
      </div>

      {/* RECHERCHE */}
      {/* <div className="topbarSearch d-none d-md-flex align-items-center gap-2 bg-light border rounded-3 px-3 flex-grow-1">
        <svg viewBox="0 0 24 24" className="flex-shrink-0">
          <path d="M10 2a8 8 0 105.3 14l5 5 1.4-1.4-5-5A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
        </svg>
        <input
          type="text"
          className="form-control form-control-sm border-0 bg-transparent shadow-none px-0"
          placeholder="Rechercher un produit..."
        />
      </div> */}

      {/* DROITE */}
      <div className="topbarRight d-flex align-items-center gap-2 gap-md-3 flex-shrink-0">
        {/* DATE */}
        <div className="topbarDate d-none d-xl-flex align-items-center gap-2 bg-light rounded-3 px-3 fw-semibold text-secondary">
          <svg viewBox="0 0 24 24">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z" />
          </svg>
          {date}
        </div>

        {/* NOTIFICATION */}
        <button className="notification position-relative border-0 rounded-3 bg-light d-flex align-items-center justify-content-center">
          <svg viewBox="0 0 24 24">
            <path d="M12 22a2.5 2.5 0 002.45-2h-4.9A2.5 2.5 0 0012 22zm7-6v-5a7 7 0 00-5-6.7V4a2 2 0 10-4 0v.3A7 7 0 005 11v5l-2 2v1h18v-1l-2-2z" />
          </svg>
          <span className="badge rounded-pill position-absolute top-0 start-100 translate-middle">3</span>
        </button>

        {/* PROFIL */}
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

            <svg className={`profileChevron ${menuOpen ? 'rotate' : ''}`} viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </button>

          {menuOpen && (
            <div className="profileMenu position-absolute end-0 bg-white border rounded-3 shadow-sm p-2">
              <button className="d-flex align-items-center gap-2 w-100 border-0 bg-transparent rounded-2 px-2 py-2">
                <svg viewBox="0 0 24 24">
                  <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4 0-8 2-8 5v2h16v-2c0-3-4-5-8-5z" />
                </svg>
                Mon profil
              </button>

              <button className="d-flex align-items-center gap-2 w-100 border-0 bg-transparent rounded-2 px-2 py-2">
                <svg viewBox="0 0 24 24">
                  <path d="M6 22q-.825 0-1.412-.587Q4 20.825 4 20V10q0-.825.588-1.412Q5.175 8 6 8h1V6q0-2.075 1.463-3.537Q9.925 1 12 1t3.538 1.463Q17 3.925 17 6v2h1q.825 0 1.413.588Q20 9.175 20 10v10q0 .825-.587 1.413Q18.825 22 18 22Zm0-2h12V10H6v10Zm6-3q.825 0 1.413-.587Q14 15.825 14 15t-.587-1.413Q12.825 13 12 13t-1.412.587Q10 14.175 10 15t.588 1.413Q11.175 17 12 17ZM9 8h6V6q0-1.25-.875-2.125T12 3q-1.25 0-2.125.875T9 6Z" />
                </svg>
                Modifier mot de passe
              </button>

              <button className="danger d-flex align-items-center gap-2 w-100 border-0 bg-transparent rounded-2 px-2 py-2">
                <svg viewBox="0 0 24 24">
                  <path d="M17 7l-1.4 1.4 1.6 1.6H8v2h9.2l-1.6 1.6L17 15l4-4-4-4zM4 5h8V3H4a2 2 0 00-2 2v14a2 2 0 002 2h8v-2H4V5z" />
                </svg>
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