import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Produit from './pages/Produit'
import Categorie from './pages/Categorie'
import Profile from './pages/Profile'
import ChangePassword from './pages/ChangePassword'
import Notifications from './pages/Notifications'
import Reapprovisionnement from './pages/Reapprovisionnement'
// import Reapprovisionnement from './pages/Reapprovisionnement'
// import Alertes from './pages/Alertes'
// import Ventes from './pages/Ventes'
// import Rapport from './pages/Rapport'
// import Gerants from './pages/Gerants'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'
import Gerant from './pages/Gerant'
import GerantArchive from './pages/GerantArchive'
import ResetPassword from './pages/ResetPassword'
import Vente from './pages/Vente'
import DetailsVente from './pages/DetailsVente'
import AddDetailsVente from './pages/AddDetailsVente'
import AlertesStock from './pages/AlertesStock'
import InfosBoutique from './pages/InfosBoutique'
import RapportVentes from './pages/RapportVentes'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
        <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/produits" element={<Produit />} />
            <Route path="/categories" element={<Categorie />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/modifier-mot-de-passe" element={<ChangePassword />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/reapprovisionnement" element={<Reapprovisionnement />} />
            <Route path="/gerants/archives" element={<GerantArchive />} />
            <Route path="/gerants" element={<Gerant />} />
            <Route path="/ventes" element={<Vente />} />
            <Route path="/ventes/nouvelle" element={<AddDetailsVente />} />
            <Route path="/ventes/:id" element={<DetailsVente />} />
          

            <Route path="/infos-boutique" element={<InfosBoutique />} /> 
            <Route path="/alertes" element={<AlertesStock />} />
            <Route path="/infos-boutique" element={<InfosBoutique />} />
            <Route path="/rapport" element={<RapportVentes />} />
       
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App