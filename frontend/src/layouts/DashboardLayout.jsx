import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { BadgeProvider } from '../context/BadgeContext'
import '../styles/DashboardLayout.css'

const pageTitles = {
  '/dashboard': 'Tableau de bord',
  '/produits': 'Produits',
  '/categories': 'Catégories',
  '/reapprovisionnement': 'Réapprovisionnement',
  '/alertes': 'Alertes stock',
  '/ventes': 'Historique des ventes',
  '/ventes/nouvelle': 'Nouvelle vente',
  '/ventes/:id': 'Détails de la vente',
  '/infos-boutique': 'Informations boutique',
  '/notifications': 'Notifications',
  '/gerants/archives': 'Gérants archivés',
  '/rapport': 'Rapport',
  '/gerants': 'Gérants',
}

const DashboardLayout = () => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Fermer le sidebar quand on navigue
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const getPageTitle = (path) => {
    if (pageTitles[path]) {
      return pageTitles[path]
    }
    if (path.startsWith('/ventes/') && path !== '/ventes/nouvelle') {
      return pageTitles['/ventes/:id']
    }
    if (path.startsWith('/produits/')) {
      return 'Détails du produit'
    }
    if (path.startsWith('/categories/')) {
      return 'Détails de la catégorie'
    }
    if (path.startsWith('/gerants/')) {
      return 'Détails du gérant'
    }
    return 'Tableau de bord'
  }

  const title = getPageTitle(location.pathname)

  return (
    <BadgeProvider>
      <div className="dashboardLayout min-vh-100">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {sidebarOpen && (
          <div className="sidebarOverlay" onClick={() => setSidebarOpen(false)} />
        )}

        <div className="dashboardMain min-vh-100 d-flex flex-column">
          <Topbar title={title} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="dashboardContent flex-grow-1 p-3 p-md-4">
            <Outlet />
          </main>
        </div>
      </div>
    </BadgeProvider>
  )
}

export default DashboardLayout
