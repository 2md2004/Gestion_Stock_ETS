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

const salesData = [
  { day: 'Lun', ventes: 120000 },
  { day: 'Mar', ventes: 180000 },
  { day: 'Mer', ventes: 145000 },
  { day: 'Jeu', ventes: 210000 },
  { day: 'Ven', ventes: 265000 },
  { day: 'Sam', ventes: 320000 },
  { day: 'Dim', ventes: 190000 },
]

const topProducts = [
  { rank: 1, name: 'Ciment 50 kg', quantity: 148, amount: '740 000 FCFA' },
  { rank: 2, name: 'Fer 12', quantity: 96, amount: '576 000 FCFA' },
  { rank: 3, name: 'Tuyau PVC', quantity: 74, amount: '207 200 FCFA' },
]

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProduits: 0,
    totalCategories: 0,
    stockFaible: 0,
    nbreVentesDuJour: 0,
    valeurStock: 0,
    beneficeMois: 0,
    chiffreAffaireAnnee: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getStatitisques();
        setStats(data);
        console.log(data);
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
      trend: '+8% ce mois',
      trendTone: 'up',
      icon: 'bi bi-box-seam',
    },
    {
      title: 'Valeur du stock',
      value: stats.valeurStock ? stats.valeurStock.toLocaleString() : '0',
      subtitle: 'FCFA',
      color: '#2ECC71',
      bgColor: '#E8F8F0',
      trend: 'Stable',
      trendTone: 'neutral',
      icon: 'bi bi-cash-stack',
    },
    {
      title: 'Ventes du jour',
      value: stats.nbreVentesDuJour || 0,
      subtitle: 'Ventes',
      color: '#E74C3C',
      bgColor: '#FDE8E8',
      trend: '+12% vs hier',
      trendTone: 'up',
      icon: 'bi bi-cart',
    },
    {
      title: 'Alertes stock',
      value: stats.stockFaible || 0,
      subtitle: 'Stock faible',
      color: '#F39C12',
      bgColor: '#FEF5E7',
      trend: '+2 vs hier',
      trendTone: 'down',
      icon: 'bi bi-exclamation-triangle',
    },
    {
      title: 'Total Catégories',
      value: stats.totalCategories || 0,
      subtitle: 'Catégories',
      color: '#9B59B6',
      bgColor: '#F4ECF7',
      trend: '+2 nouvelles',
      trendTone: 'up',
      icon: 'bi bi-tags',
    },
    {
      title: 'Bénéfice du mois',
      value: stats.beneficeMois ? stats.beneficeMois.toLocaleString() : '0',
      subtitle: 'FCFA',
      color: '#1ABC9C',
      bgColor: '#E8F8F5',
      trend: '+15% vs mois dernier',
      trendTone: 'up',
      icon: 'bi bi-graph-up-arrow',
    },
    {
      title: "Chiffre d'affaires",
      value: stats.chiffreAffaireAnnee ? stats.chiffreAffaireAnnee.toLocaleString() : '0',
      subtitle: 'FCFA / Année',
      color: '#E67E22',
      bgColor: '#FDF2E9',
      trend: '+22% vs année dernière',
      trendTone: 'up',
      icon: 'bi bi-bar-chart-line',
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

  return (
    <div className="dashboardPage d-flex flex-column gap-4">
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
                  <span className={`statTrend ${item.trendTone}`}>{item.trend}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <section className="panel bg-white border rounded-4 p-4 h-100">
            <div className="panelHeader d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold mb-0">Évolution des ventes</h3>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ventes" stroke="#002050" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </section>
        </div>

        <div className="col-lg-4">
          <section className="panel bg-white border rounded-4 p-4 h-100">
            <div className="panelHeader d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold mb-0">Produits à réapprovisionner</h3>
            </div>

            <div className="stockAlert d-flex justify-content-between align-items-center rounded-3 p-3 mb-3">
              <strong>Ciment 50 kg</strong>
              <span className="fw-bold">3 restants</span>
            </div>

            <div className="stockAlert d-flex justify-content-between align-items-center rounded-3 p-3 mb-3">
              <strong>Tuyau PVC</strong>
              <span className="fw-bold">5 restants</span>
            </div>

            <div className="stockAlert d-flex justify-content-between align-items-center rounded-3 p-3 mb-3">
              <strong>Peinture blanche</strong>
              <span className="fw-bold">2 restants</span>
            </div>

            <div className="stockAlert d-flex justify-content-between align-items-center rounded-3 p-3 mb-0">
              <strong>Disjoncteur 20A</strong>
              <span className="fw-bold">4 restants</span>
            </div>
          </section>
        </div>
      </div>

      <section className="panel bg-white border rounded-4 p-4">
        <div className="panelHeader d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold mb-0">Produits les plus vendus</h3>
          <span className="text-secondary small">Ce mois-ci</span>
        </div>

        <div className="row g-3">
          {topProducts.map((product) => (
            <div className="col-md-4" key={product.rank}>
              <div className="topProductCard d-flex align-items-center gap-3 rounded-3 p-3 h-100">
                <span className="topProductRank rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0">
                  {product.rank}
                </span>
                <div className="d-flex flex-column">
                  <strong>{product.name}</strong>
                  <small className="text-secondary">{product.quantity} unités vendues</small>
                  <small className="topProductAmount fw-semibold">{product.amount}</small>
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