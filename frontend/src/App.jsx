import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Produit from './pages/Produit'
import Categorie from './pages/Categorie'
// import Reapprovisionnement from './pages/Reapprovisionnement'
// import Alertes from './pages/Alertes'
// import Ventes from './pages/Ventes'
// import Rapport from './pages/Rapport'
// import Gerants from './pages/Gerants'
// import InfosBoutique from './pages/InfosBoutique'
import DashboardLayout from './layouts/DashboardLayout'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/produits" element={<Produit />} />
          <Route path="/categories" element={<Categorie />} />
          {/* <Route
            path="/reapprovisionnement"
            element={<Reapprovisionnement />}
          />
          <Route path="/alertes" element={<Alertes />} />
          <Route path="/ventes" element={<Ventes />} />
          <Route path="/rapport" element={<Rapport />} />
          <Route path="/gerants" element={<Gerants />} />
          <Route path="/infos-boutique" element={<InfosBoutique />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App