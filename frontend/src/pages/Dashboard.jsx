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

const salesData = [
  { day: 'Lun', ventes: 120000 },
  { day: 'Mar', ventes: 180000 },
  { day: 'Mer', ventes: 145000 },
  { day: 'Jeu', ventes: 210000 },
  { day: 'Ven', ventes: 265000 },
  { day: 'Sam', ventes: 320000 },
  { day: 'Dim', ventes: 190000 },
]

const stats = [
  {
    title: 'Produits',
    value: '245',
    subtitle: 'Références',
    color: 'navy',
    trend: '+8% ce mois',
    trendTone: 'up',
    icon: <path d="M12 2L3 7l9 5 9-5-9-5zm0 7L3 4v13l9 5 9-5V4l-9 5z" />,
  },
  {
    title: 'Valeur du stock',
    value: '2 450 000',
    subtitle: 'FCFA',
    color: 'gold',
    trend: 'Stable',
    trendTone: 'neutral',
    icon: <path d="M12 2L4 6v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V6l-8-4z" />,
  },
  {
    title: 'Ventes du jour',
    value: '350 000',
    subtitle: 'FCFA',
    color: 'navy',
    trend: '+12% vs hier',
    trendTone: 'up',
    icon: <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM3 2l2 12h13l2-8H6" />,
  },
  {
    title: 'Alertes',
    value: '5',
    subtitle: 'Stock faible',
    color: 'gold',
    trend: '+2 vs hier',
    trendTone: 'down',
    icon: <path d="M12 2L1 21h22L12 2zm0 6v6m0 4h.01" />,
  },
]

const topProducts = [
  { rank: 1, name: 'Ciment 50 kg', quantity: 148, amount: '740 000 FCFA' },
  { rank: 2, name: 'Fer 12', quantity: 96, amount: '576 000 FCFA' },
  { rank: 3, name: 'Tuyau PVC', quantity: 74, amount: '207 200 FCFA' },
]

const Dashboard = () => {
  return (
    <div className="dashboardPage d-flex flex-column gap-4">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
        {stats.map((item) => (
          <div className="col" key={item.title}>
            <div className="statCard bg-white border rounded-4 p-3 h-100">
              <div className={`statIcon ${item.color} rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 mb-2`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {item.icon}
                </svg>
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