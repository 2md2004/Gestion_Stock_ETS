import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* tu ajouteras /ventes, /reapprovisionnement, /rapport, /infos-boutique ici plus tard */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App