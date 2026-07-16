import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import '../styles/Dashboard.css'
import { getStatitisques } from '../services/DashboardService';
import { ClipLoader } from "react-spinners";
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProduits: 0,
    totalCategories: 0,
    stockFaible: 0,
    nbreVentesDuJour: 0,
    valeurStock: 0,
    beneficeMois: 0,
    chiffreAffaireMois: 0,
    beneficeAnnee: 0,
    chiffreAffaireAnnee: 0,
    produitPlusVenduMois: null,
    produitPlusVenduAnnee: null,
    top5ProduitsMois: [],
    top5ProduitsAnnee: [],
    ventesParJour: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getStatitisques();
        setStats(data);
        console.log('Stats:', data);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Produits',
      value: stats.totalProduits || 0,
      subtitle: 'Références',
      color: '#4A90D9',
      bgColor: '#E8F0FE',
      icon: 'bi bi-box-seam',
    },
    {
      title: 'Valeur du stock',
      value: stats.valeurStock ? stats.valeurStock.toLocaleString() : '0',
      subtitle: 'FCFA',
      color: '#2ECC71',
      bgColor: '#E8F8F0',
      icon: 'bi bi-cash-stack',
    },
    {
      title: 'Ventes du jour',
      value: stats.nbreVentesDuJour || 0,
      subtitle: 'Ventes',
      color: '#E74C3C',
      bgColor: '#FDE8E8',
      icon: 'bi bi-cart',
    },
    {
      title: 'Alertes stock',
      value: stats.stockFaible || 0,
      subtitle: 'Stock faible',
      color: '#F39C12',
      bgColor: '#FEF5E7',
      icon: 'bi bi-exclamation-triangle',
    },
    {
      title: 'Total Catégories',
      value: stats.totalCategories || 0,
      subtitle: 'Catégories',
      color: '#9B59B6',
      bgColor: '#F4ECF7',
      icon: 'bi bi-tags',
    },
    {
      title: 'Bénéfice du mois',
      value: stats.beneficeMois ? stats.beneficeMois.toLocaleString() : '0',
      subtitle: 'FCFA',
      color: '#1ABC9C',
      bgColor: '#E8F8F5',
      icon: 'bi bi-graph-up-arrow',
    },
    {
      title: 'CA du mois',
      value: stats.chiffreAffaireMois ? stats.chiffreAffaireMois.toLocaleString() : '0',
      subtitle: 'FCFA',
      color: '#E67E22',
      bgColor: '#FDF2E9',
      icon: 'bi bi-bar-chart-line',
    },
    {
      title: "CA Annuel",
      value: stats.chiffreAffaireAnnee ? stats.chiffreAffaireAnnee.toLocaleString() : '0',
      subtitle: 'FCFA',
      color: '#3498DB',
      bgColor: '#EBF5FB',
      icon: 'bi bi-calendar-range',
    },
  ];

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center gap-3" style={{ height: "60vh" }}>
        <ClipLoader color="#002050" loading={loading} size={60} />
        <p>Chargement des statistiques...</p>
      </div>
    );
  }

  // Données du graphique - utilisation des données réelles
  const salesData = stats.ventesParJour && stats.ventesParJour.length > 0 
    ? stats.ventesParJour.map(item => ({
        jour: item.jour,
        ventes: item.ventes
      }))
    : [
        { jour: 'Lun', ventes: 0 },
        { jour: 'Mar', ventes: 0 },
        { jour: 'Mer', ventes: 0 },
        { jour: 'Jeu', ventes: 0 },
        { jour: 'Ven', ventes: 0 },
        { jour: 'Sam', ventes: 0 },
        { jour: 'Dim', ventes: 0 }
      ];

  // Produits les plus vendus (à partir des vraies données)
  const topProducts = stats.top5ProduitsMois && stats.top5ProduitsMois.length > 0 
    ? stats.top5ProduitsMois.map((p, index) => ({
        rank: index + 1,
        name: p.nom,
        quantity: p.quantite,
        amount: `${(p.quantite * 10000).toLocaleString()} FCFA`
      }))
    : [
        { rank: 1, name: 'Aucun produit vendu', quantity: 0, amount: '0 FCFA' }
      ];

  // Produits en stock faible (à partir des vraies données)
  const stockAlertItems = stats.stockFaible > 0 
    ? [
        { name: `${stats.stockFaible} produits en stock faible`, quantity: stats.stockFaible }
      ]
    : [
        { name: 'Aucun produit en stock faible', quantity: 0 }
      ];

  // Calcul des statistiques du graphique
  const totalVentesSemaine = salesData.reduce((sum, item) => sum + item.ventes, 0);
  const moyenneVentes = salesData.length > 0 ? Math.round(totalVentesSemaine / salesData.length) : 0;
  const maxVentes = salesData.length > 0 ? Math.max(...salesData.map(item => item.ventes)) : 0;

  return (
    <div className="dashboardPage d-flex flex-column gap-4">
      {/* Cartes de statistiques */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3">
        {statCards.map((item) => (
          <div className="col" key={item.title}>
            <div className="statCard bg-white border rounded-4 p-3 h-100">
              <div 
                className="statIcon rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 mb-2"
                style={{ 
                  backgroundColor: item.bgColor,
                  color: item.color,
                  width: '48px',
                  height: '48px'
                }}
              >
                <i className={`${item.icon} fs-4`}></i>
              </div>

              <div className="statContent d-flex flex-column">
                <span className="text-secondary small">{item.title}</span>
                <h3 className="fw-bold my-1">{item.value}</h3>
                <div className="d-flex align-items-center justify-content-between">
                  <small className="text-secondary">{item.subtitle}</small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Graphique et Alertes */}
      <div className="row g-3">
        <div className="col-lg-8">
          <section className="panel bg-white border rounded-4 p-4 h-100">
            <div className="panelHeader d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold mb-0">
                <i className="bi bi-graph-up-arrow me-2" style={{ color: '#002050' }}></i>
                Évolution des ventes
              </h3>
              
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="jour" 
                  tick={{ fill: '#6c757d' }}
                />
                <YAxis 
                  tickFormatter={(value) => value.toLocaleString()}
                  tick={{ fill: '#6c757d' }}
                />
                <Tooltip 
                  formatter={(value) => [`${value.toLocaleString()} FCFA`, 'Ventes']}
                  labelFormatter={(label) => `Jour: ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '10px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ventes" 
                  stroke="#002050" 
                  strokeWidth={3}
                  dot={{ fill: '#002050', r: 4 }}
                  activeDot={{ r: 6, fill: '#002050' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>
        </div>

        <div className="col-lg-4">
          <section className="panel bg-white border rounded-4 p-4 h-100">
            <div className="panelHeader d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold mb-0">
                <i className="bi bi-exclamation-triangle me-2" style={{ color: '#F39C12' }}></i>
                Stock faible
              </h3>
              <span className="text-secondary small">
                <i className="bi bi-bell me-1"></i>
                {stats.stockFaible || 0} alertes
              </span>
            </div>

            {stockAlertItems.map((item, index) => (
              <Link 
                to="/alertes"
                key={index}
                className="stockAlert d-flex justify-content-between align-items-center rounded-3 p-3 mb-3"
                style={{
                  backgroundColor: item.quantity > 0 ? '#FEF5E7' : '#f8f9fa',
                  borderLeft: item.quantity > 0 ? '4px solid #F39C12' : '4px solid #ced4da'
                }}
              >
                <div>
                  {item.quantity > 0 && (
                    <i className="bi bi-exclamation-circle me-2" style={{ color: '#F39C12' }}></i>
                  )}
                  {item.quantity === 0 && (
                    <i className="bi bi-check-circle me-2" style={{ color: '#28a745' }}></i>
                  )}
                  <strong>{item.name}</strong>
                </div>
                
              </Link>
            ))}

            {stats.produitPlusVenduMois && (
              <div className="mt-3 p-3 bg-light rounded-3">
                <small className="text-muted">
                  <i className="bi bi-trophy me-1" style={{ color: '#FFD700' }}></i>
                  Produit le plus vendu du mois
                </small>
                <div className="d-flex justify-content-between align-items-center mt-1">
                  <strong>
                    <i className="bi bi-box-seam me-2" style={{ color: '#002050' }}></i>
                    {stats.produitPlusVenduMois.nom}
                  </strong>
                 
                </div>
              </div>
            )}

            {stats.produitPlusVenduAnnee && stats.produitPlusVenduAnnee.id !== stats.produitPlusVenduMois?.id && (
              <div className="mt-2 p-3 bg-light rounded-3">
                <small className="text-muted">
                  <i className="bi bi-trophy me-1" style={{ color: '#C0C0C0' }}></i>
                  Produit le plus vendu de l'année
                </small>
                <div className="d-flex justify-content-between align-items-center mt-1">
                  <strong>
                    <i className="bi bi-box-seam me-2" style={{ color: '#002050' }}></i>
                    {stats.produitPlusVenduAnnee.nom}
                  </strong>
                  <span className="badge bg-secondary">
                    <i className="bi bi-cart me-1"></i>
                    {stats.produitPlusVenduAnnee.quantite} unités
                  </span>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Top produits */}
      <section className="panel bg-white border rounded-4 p-4">
        <div className="panelHeader d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold mb-0">
            <i className="bi bi-trophy me-2" style={{ color: '#FFD700' }}></i>
            Top 5 produits les plus vendus
          </h3>
          <span className="text-secondary small">
            <i className="bi bi-calendar-month me-1"></i>
            Ce mois-ci
          </span>
        </div>

        <div className="row g-3">
          {topProducts.map((product) => (
            <div className="col-md-4" key={product.rank}>
              <div className="topProductCard d-flex align-items-center gap-3 rounded-3 p-3 h-100">
                <span 
                  className="topProductRank rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: product.rank === 1 ? '#FFD700' : product.rank === 2 ? '#C0C0C0' : '#CD7F32',
                    color: '#fff',
                    fontWeight: 'bold'
                  }}
                >
                  {product.rank === 1 && <i className="bi bi-star-fill"></i>}
                  {product.rank === 2 && <i className="bi bi-star-fill"></i>}
                  {product.rank === 3 && <i className="bi bi-star-fill"></i>}
                  {product.rank > 3 && product.rank}
                </span>
                <div className="d-flex flex-column">
                  <strong>
                    <i className="bi bi-box-seam me-2" style={{ color: '#002050' }}></i>
                    {product.name}
                  </strong>
                  <small className="text-secondary">
                    <i className="bi bi-cart me-1"></i>
                    {product.quantity} unités vendues
                  </small>
                  <small className="topProductAmount fw-semibold" style={{ color: '#28a745' }}>
                    <i className="bi bi-coin me-1"></i>
                    {product.amount}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>

        
      </section>
    </div>
  )
}

export default Dashboard