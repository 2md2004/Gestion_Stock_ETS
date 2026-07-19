import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logo_EBS.png'
import '../styles/Sidebar.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useBadges } from '../context/BadgeContext'

const MenuTitle = ({ children }) => (
  <div className="menuTitle text-uppercase text-secondary fw-bold px-2 mt-3 mb-1">
    {children}
  </div>
)

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const { stockFaible } = useBadges()
   const userRole = sessionStorage.getItem('userRole');
  const handleLogout = () => {
    sessionStorage.removeItem('token')
    navigate('/login')
  }

  const handleLinkClick = () => {
    onClose?.()
  }

  return (
    <aside className={`sidebar d-flex flex-column bg-white border-end vh-100 p-3 ${isOpen ? 'sidebarOpen' : ''}`}>
      {/* LOGO */}
      <div className="sidebarLogo d-flex flex-column align-items-center text-center pb-3 border-bottom flex-shrink-0">
        <img src={logo} alt="Logo ETS" className="sidebarLogoImg" />
        <span className="sidebarBrand mt-2 fw-bold">
          ETS Beug Serigne Mansour Sy
        </span>
      </div>

      {/* MENU */}
      <nav className="sidebarNav flex-grow-1 overflow-auto pt-2">
        <MenuTitle>MENU</MenuTitle>

        <NavLink
          to="/dashboard"
          onClick={handleLinkClick}
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${isActive ? 'active' : ''}`
          }
        >
          <i className="bi bi-grid-fill sidebarIcon"></i>
          Tableau de bord
        </NavLink>

        <MenuTitle>STOCK</MenuTitle>

        <NavLink
          to="/categories"
          onClick={handleLinkClick}
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${isActive ? 'active' : ''}`
          }
        >
          <i className="bi bi-tags-fill sidebarIcon"></i>
          Catégories
        </NavLink>

        <NavLink
          to="/produits"
          onClick={handleLinkClick}
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${isActive ? 'active' : ''}`
          }
        >
          <i className="bi bi-box-seam-fill sidebarIcon"></i>
          Produits
        </NavLink>

        <NavLink
          to="/reapprovisionnement"
          onClick={handleLinkClick}
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${isActive ? 'active' : ''}`
          }
        >
          <i className="bi bi-arrow-repeat sidebarIcon"></i>
          Réapprovisionnement
        </NavLink>

        <NavLink
          to="/alertes"
          onClick={handleLinkClick}
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${isActive ? 'active' : ''}`
          }
        >
          <i className="bi bi-bell-fill sidebarIcon"></i>
          Alertes stock
          {stockFaible > 0 && (
            <span className="badge rounded-circle ms-auto d-flex align-items-center justify-content-center">
              {stockFaible}
            </span>
          )}
        </NavLink>

        <MenuTitle>VENTES</MenuTitle>

        <NavLink
          to="/ventes"
          onClick={handleLinkClick}
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${isActive ? 'active' : ''}`
          }
        >
          <i className="bi bi-cart-fill sidebarIcon"></i>
          Ventes
        </NavLink>

        <MenuTitle>ANALYSE</MenuTitle>

        <NavLink
          to="/rapport"
          onClick={handleLinkClick}
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${isActive ? 'active' : ''}`
          }
        >
          <i className="bi bi-bar-chart-fill sidebarIcon"></i>
          Rapport
        </NavLink>

        <MenuTitle>ADMINISTRATION</MenuTitle>

        {userRole !== 'GERANT' && ( 
        <NavLink
          to="/gerants"
          onClick={handleLinkClick}
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${isActive ? 'active' : ''}`
          }
        >
          <i className="bi bi-people-fill sidebarIcon"></i>
          Gérants
        </NavLink>
      )}

        <NavLink
          to="/infos-boutique"
          onClick={handleLinkClick}
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${isActive ? 'active' : ''}`
          }
        >
          <i className="bi bi-shop sidebarIcon"></i>
          Infos Boutique
        </NavLink>
      </nav>

      {/* BAS */}
      <div className="sidebarBottom flex-shrink-0 pt-3 border-top mt-auto">
        <button onClick={handleLogout} className="sidebarLogout d-flex align-items-center gap-2 w-100 border-0 bg-transparent rounded-3 px-2 py-2">
          <i className="bi bi-box-arrow-right sidebarIcon"></i>
          Déconnexion
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
