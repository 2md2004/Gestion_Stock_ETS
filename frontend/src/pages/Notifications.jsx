import { useState, useEffect } from 'react'
import { ClipLoader } from 'react-spinners'
import EmptyImg from '../assets/Empty (1).gif'
import '../styles/Notifications.css'
import { getStatitisques } from '../services/DashboardService'
import { getProduitsStockFaible } from '../services/ProduitService'

const icons = {
  danger: (
    <svg viewBox="0 0 24 24">
      <path d="M12 2L1 21h22L12 2zm1 15h-2v2h2v-2zm0-2h-2v-6h2v6z"/>
    </svg>
  ),
  success: (
    <svg viewBox="0 0 24 24">
      <path d="M9 16.2l-3.5-3.5L4 14.2l5 5L20 8.2 18.5 6.7z"/>
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6V5h12v14z"/>
    </svg>
  )
}

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const [stats, produitsFaible] = await Promise.all([
          getStatitisques(),
          getProduitsStockFaible(0, 100, "nom").then((data) => data.content || [])
        ]);

        const newNotifs = [];

        if (stats.nbreVentesDuJour > 0) {
          newNotifs.push({
            id: 'vente-jour',
            type: 'success',
            title: 'Ventes du jour',
            message: `${stats.nbreVentesDuJour} vente(s) aujourd'hui pour un total de ${stats.chiffreAffaireMois ? stats.chiffreAffaireMois.toLocaleString() : 0} FCFA ce mois.`,
            date: "Aujourd'hui"
          });
        }

        if (stats.stockFaible > 0) {
          newNotifs.push({
            id: 'stock-alerte',
            type: 'danger',
            title: 'Alerte stock faible',
            message: `${stats.stockFaible} produit(s) ont un stock inférieur ou égal à 5 unités.`,
            date: 'En cours'
          });
        }

        produitsFaible.forEach((produit) => {
          newNotifs.push({
            id: `stock-${produit.id}`,
            type: 'danger',
            title: 'Stock faible',
            message: `"${produit.nom}" n'a plus que ${produit.quantite} unité(s) en stock. Catégorie: ${produit.categorie?.nom || 'N/A'}`,
            date: 'En cours'
          });
        });

        if (stats.beneficeMois && stats.beneficeMois > 0) {
          newNotifs.push({
            id: 'benefice',
            type: 'success',
            title: 'Bénéfice du mois',
            message: `Bénéfice actuel: ${stats.beneficeMois.toLocaleString()} FCFA.`,
            date: 'Ce mois'
          });
        }

        setNotifications(newNotifs.slice(0, 5));
      } catch (error) {
        console.error("Erreur chargement notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center gap-3" style={{ height: "60vh" }}>
        <ClipLoader color="#002050" loading={loading} size={60} />
        <p>Chargement des notifications...</p>
      </div>
    );
  }

  return (
    <div className="notificationsPage">
      <div className="notificationsCard">
        <div className="notificationsHeader">
          <h2>Notifications</h2>
          <span>{notifications.length} notification{notifications.length > 1 ? 's' : ''}</span>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-5">
            <img src={EmptyImg} alt="empty" style={{ width: "300px" }} />
            <h5 className="mt-3">Aucune notification</h5>
          </div>
        ) : (
          <div className="notificationsList">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="notificationRow"
                onClick={() => dismissNotification(notification.id)}
                style={{ cursor: "pointer" }}
                title="Cliquer pour fermer"
              >
                <div className={`notificationIcon ${notification.type}`}>
                  {icons[notification.type]}
                </div>
                <div className="notificationInfo">
                  <h3>{notification.title}</h3>
                  <p>{notification.message}</p>
                  <small>{notification.date}</small>
                </div>
                <i className="bi bi-x-circle text-muted" style={{ fontSize: "18px", flexShrink: 0 }}></i>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
