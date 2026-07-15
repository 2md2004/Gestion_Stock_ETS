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
import AlertesStock from './pages/AlertesStock'
import InfosBoutique from './pages/InfosBoutique'
// import Ventes from './pages/Ventes'
// import Rapport from './pages/Rapport'
// import Gerants from './pages/Gerants'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/produits" element={<Produit />} />
            <Route path="/categories" element={<Categorie />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/modifier-mot-de-passe" element={<ChangePassword />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/reapprovisionnement" element={<Reapprovisionnement />} />
            <Route path="/alertes" element={<AlertesStock />} />
            <Route path="/infos-boutique" element={<InfosBoutique />} />
            {/* <Route path="/ventes" element={<Ventes />} />
            <Route path="/rapport" element={<Rapport />} />
            <Route path="/gerants" element={<Gerants />} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App