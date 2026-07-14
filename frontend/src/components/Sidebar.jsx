import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/logo_EBS.png'
import '../styles/Sidebar.css'

const PRODUCT_MENU = [
  {
    label: 'Ajouter un produit',
    to: '/produits/ajouter',
    icon: <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />,
  },
  {
    label: 'Liste des produits',
    to: '/produits',
    icon: <path d="M4 5h2v2H4V5zm4 0h12v2H8V5zM4 11h2v2H4v-2zm4 0h12v2H8v-2zM4 17h2v2H4v-2zm4 0h12v2H8v-2z" />,
  },
  {
    label: 'Catégories',
    to: '/categories',
    icon: <path d="M21.41 11.58l-9-9A2 2 0 0011 2H4a2 2 0 00-2 2v7a2 2 0 00.59 1.41l9 9a2 2 0 002.82 0l7-7a2 2 0 000-2.83zM6.5 8A1.5 1.5 0 118 6.5 1.5 1.5 0 016.5 8z" />,
  },
]

const Icon = ({ children }) => (
  <svg className="sidebarIcon flex-shrink-0" viewBox="0 0 24 24">
    {children}
  </svg>
)

const MenuTitle = ({ children }) => (
  <div className="menuTitle text-uppercase text-secondary fw-bold px-2 mt-3 mb-1">
    {children}
  </div>
)

const Sidebar = () => {
  const [produitsOpen, setProduitsOpen] = useState(false)

  return (
    <aside className="sidebar d-flex flex-column bg-white border-end vh-100 p-3">
      {/* LOGO */}
      <div className="sidebarLogo d-flex flex-column align-items-center text-center pb-3 border-bottom flex-shrink-0">
        <img src={logo} alt="Logo ETS" className="sidebarLogoImg" />
        <span className="sidebarBrand mt-2 fw-bold">ETS Beug Serigne Mansour Sy</span>
      </div>

      {/* MENU */}
      <nav className="sidebarNav flex-grow-1 overflow-auto pt-2">
        <MenuTitle>MENU</MenuTitle>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${isActive ? 'active' : ''}`
          }
        >
          <Icon>
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </Icon>
          Tableau de bord
        </NavLink>

        <MenuTitle>STOCK</MenuTitle>

        {/* PRODUITS */}
        <button
          type="button"
          className="sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 w-100 border-0 bg-transparent text-start"
          onClick={() => setProduitsOpen(!produitsOpen)}
        >
          <Icon>
            <path
              d="M12 2L2 7l10 5 10-5-10-5zm0 10L2 7v10l10 5 10-5V7l-10 5z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </Icon>
          Produits
          <svg className={`chevron ms-auto ${produitsOpen ? 'rotate' : ''}`} viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>

        {produitsOpen && (
          <div className="submenu ms-4">
            {PRODUCT_MENU.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `subLink d-flex align-items-center gap-2 rounded-2 px-2 py-1 text-decoration-none ${isActive ? 'active' : ''}`
                }
              >
                <svg className="subIcon flex-shrink-0" viewBox="0 0 24 24">
                  {item.icon}
                </svg>
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        {/* REAPPRO */}
        <NavLink
          to="/reapprovisionnement"
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${isActive ? 'active' : ''}`
          }
        >
          <Icon>
            <path d="M17.65 6.35A8 8 0 1019.9 12h-2.1a6 6 0 11-1.7-4.2L13 11h7V4l-2.35 2.35z" />
          </Icon>
          Réapprovisionnement
        </NavLink>

        {/* ALERTES */}
        <NavLink
          to="/alertes"
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${isActive ? 'active' : ''}`
          }
        >
          <Icon>
            <path d="M12 2a7 7 0 00-7 7v4l-2 3v2h18v-2l-2-3V9a7 7 0 00-7-7z" />
          </Icon>
          Alertes stock
          <span className="badge rounded-circle ms-auto d-flex align-items-center justify-content-center">5</span>
        </NavLink>

        <MenuTitle>VENTES</MenuTitle>

        <NavLink
          to="/ventes"
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${isActive ? 'active' : ''}`
          }
        >
          <Icon>
            <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45A2 2 0 007 17h12v-2H7.42l.9-2h7.5a2 2 0 001.75-1l3.58-6.5H5.21L4.27 2H1z" />
          </Icon>
          Ventes
        </NavLink>

        <MenuTitle>ANALYSE</MenuTitle>

        <NavLink
          to="/rapport"
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${isActive ? 'active' : ''}`
          }
        >
          <Icon>
            <path d="M6 2h9l5 5v15H6a2 2 0 01-2-2V4a2 2 0 012-2zm8 1.5V8h4.5L14 3.5zM8 12h2v6H8v-6zm3 2h2v4h-2v-4zm3-4h2v8h-2v-8z" />
          </Icon>
          Rapport
        </NavLink>

        <MenuTitle>ADMINISTRATION</MenuTitle>

        <NavLink
          to="/gerants"
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${isActive ? 'active' : ''}`
          }
        >
          <Icon>
            <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-8 2-8 5v2h16v-2c0-3-4-5-8-5z" />
          </Icon>
          Gérants
        </NavLink>

        <NavLink
          to="/infos-boutique"
          className={({ isActive }) =>
            `sidebarLink d-flex align-items-center gap-2 rounded-3 px-2 py-2 text-decoration-none w-100 ${isActive ? 'active' : ''}`
          }
        >
          <Icon>
            <path d="M12 2L2 7v2h20V7L12 2zM4 10v10h4v-6h8v6h4V10H4z" />
          </Icon>
          Infos boutique
        </NavLink>
      </nav>

      {/* BAS */}
      <div className="sidebarBottom flex-shrink-0 pt-3 border-top mt-auto">
        <button className="sidebarLogout d-flex align-items-center gap-2 w-100 border-0 bg-transparent rounded-3 px-2 py-2">
          <Icon>
            <path d="M17 7l-1.41 1.41L17.17 10H8v2h9.17l-1.58 1.59L17 15l4-4-4-4zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
          </Icon>
          Déconnexion
        </button>
      </div>
    </aside>
  )
}

export default Sidebar