import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getStatitisques } from '../services/DashboardService'
import { getProduitsStockFaible } from '../services/ProduitService'

const BadgeContext = createContext(null)

export const BadgeProvider = ({ children }) => {
  const [stockFaible, setStockFaible] = useState(0)
  const [notifs, setNotifs] = useState([])
  const [notifSeen, setNotifSeen] = useState(false)

  const refreshBadges = useCallback(async () => {
    try {
      const [stats, produitsFaible] = await Promise.all([
        getStatitisques(),
        getProduitsStockFaible(0, 5, 'nom').then((data) => data.content || []),
      ])

      setStockFaible(stats.stockFaible || 0)

      const newNotifs = []

      if (stats.nbreVentesDuJour > 0) {
        newNotifs.push({
          id: 'vente-jour',
          type: 'success',
          title: 'Ventes du jour',
          message: `${stats.nbreVentesDuJour} vente(s) aujourd'hui.`,
          time: "Aujourd'hui",
        })
      }

      produitsFaible.forEach((produit) => {
        newNotifs.push({
          id: `stock-${produit.id}`,
          type: 'danger',
          title: 'Stock faible',
          message: `"${produit.nom}" n'a plus que ${produit.quantite} unité(s) en stock.`,
          time: 'En cours',
        })
      })

      setNotifs(newNotifs.slice(0, 3))
      setNotifSeen(false)
    } catch (error) {
      console.error('Erreur chargement badges:', error)
    }
  }, [])

  useEffect(() => {
    refreshBadges()
  }, [refreshBadges])

  return (
    <BadgeContext.Provider
      value={{
        stockFaible,
        notifs,
        notifSeen,
        setNotifSeen,
        refreshBadges,
      }}
    >
      {children}
    </BadgeContext.Provider>
  )
}

export const useBadges = () => {
  const context = useContext(BadgeContext)
  if (!context) {
    throw new Error('useBadges doit être utilisé dans un BadgeProvider')
  }
  return context
}
