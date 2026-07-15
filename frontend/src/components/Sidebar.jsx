import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logo_EBS.png'
import '../styles/Sidebar.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

const MenuTitle = ({ children }) => (
  <div className="menuTitle text-uppercase text-secondary fw-bold px-2 mt-3 mb-1">
    {children}
  </div>
)

const Sidebar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <aside className="sidebar d-flex flex-column bg-white border-end vh-100 p-3">
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

        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${
              isActive ? 'active' : ''
            }`
          }
        >
          <i className="bi bi-grid-fill sidebarIcon"></i>
          Tableau de bord
        </NavLink>

        <MenuTitle>STOCK</MenuTitle>

        {/* Catégories */}
        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${
              isActive ? 'active' : ''
            }`
          }
        >
          <i className="bi bi-tags-fill sidebarIcon"></i>
          Catégories
        </NavLink>

        {/* Produits */}
        <NavLink
          to="/produits"
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${
              isActive ? 'active' : ''
            }`
          }
        >
          <i className="bi bi-box-seam-fill sidebarIcon"></i>
          Produits
        </NavLink>

        {/* Réapprovisionnement */}
        <NavLink
          to="/reapprovisionnement"
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${
              isActive ? 'active' : ''
            }`
          }
        >
          <i className="bi bi-arrow-repeat sidebarIcon"></i>
          Réapprovisionnement
        </NavLink>

        {/* Alertes */}
        <NavLink
          to="/alertes"
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${
              isActive ? 'active' : ''
            }`
          }
        >
          <i className="bi bi-bell-fill sidebarIcon"></i>
          Alertes stock
          <span className="badge rounded-circle ms-auto d-flex align-items-center justify-content-center">
            5
          </span>
        </NavLink>

        <MenuTitle>VENTES</MenuTitle>

        {/* Ventes */}
        <NavLink
          to="/ventes"
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${
              isActive ? 'active' : ''
            }`
          }
        >
          <i className="bi bi-cart-fill sidebarIcon"></i>
          Ventes
        </NavLink>

        <MenuTitle>ANALYSE</MenuTitle>

        {/* Rapport */}
        <NavLink
          to="/rapport"
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${
              isActive ? 'active' : ''
            }`
          }
        >
          <i className="bi bi-bar-chart-fill sidebarIcon"></i>
          Rapport
        </NavLink>

        <MenuTitle>ADMINISTRATION</MenuTitle>

        {/* Gérants */}
        <NavLink
          to="/gerants"
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${
              isActive ? 'active' : ''
            }`
          }
        >
          <i className="bi bi-people-fill sidebarIcon"></i>
          Gérants
        </NavLink>

        {/* Infos boutique */}
        <NavLink
          to="/infos-boutique"
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${
              isActive ? 'active' : ''
            }`
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