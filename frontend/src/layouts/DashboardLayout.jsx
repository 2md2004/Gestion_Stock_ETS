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
  '/ventes': 'Historique des ventes',
  '/ventes/nouvelle': 'Nouvelle vente',
  '/ventes/:id': 'Détails de la vente',


  '/infos-boutique': 'Informations boutique',
  '/notifications': 'Notifications',

  '/rapport': 'Rapport',
  '/gerants': 'Gérants',

}

const DashboardLayout = () => {
  const location = useLocation();

  const getPageTitle = (path) => {
    // Vérifier le chemin exact
    if (pageTitles[path]) {
      return pageTitles[path];
    }

    // Routes dynamiques
    if (path.startsWith('/ventes/') && path !== '/ventes/nouvelle') {
      return pageTitles['/ventes/:id'];
    }

    // Routes avec paramètres
    if (path.startsWith('/produits/')) {
      return 'Détails du produit';
    }

    if (path.startsWith('/categories/')) {
      return 'Détails de la catégorie';
    }

    if (path.startsWith('/gerants/')) {
      return 'Détails du gérant';
    }

    return 'Tableau de bord';
  };

  const title = getPageTitle(location.pathname);

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