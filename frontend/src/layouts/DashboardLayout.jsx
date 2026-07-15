import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import '../styles/DashboardLayout.css'

const pageTitles = {
  '/dashboard': 'Tableau de bord',
  '/produits': 'Produits',
  '/categories': 'Catégories',
  '/reapprovisionnement': 'Réapprovisionnement',
  '/alertes': 'Alertes stock',
  '/ventes': 'Ventes',
  '/rapport': 'Rapport',
  '/gerants': 'Gérants',
  '/infos-boutique': 'Infos boutique',
  '/notifications': 'Notifications',
}

const DashboardLayout = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Tableau de bord';
  return (
    <div className="dashboardLayout min-vh-100">
      <Sidebar />
      <div className="dashboardMain min-vh-100 d-flex flex-column">
        <Topbar title={title} />
        <main className="dashboardContent flex-grow-1 p-3 p-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout;