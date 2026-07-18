import "../styles/RapportVentes.css";
import logoEBS from "../assets/logo_EBS.png";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getRapportVentes } from "../services/VenteService";

const TYPES = [
  { value: "hebdomadaire", label: "Hebdomadaire", icon: "bi-calendar-week" },
  { value: "mensuel", label: "Mensuel", icon: "bi-calendar-month" },
  { value: "annuel", label: "Annuel", icon: "bi-calendar-range" },
];

const formatMontant = (valeur) => {
  const nombre = Number(valeur) || 0;
  return nombre.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " FCFA";
};

const decalerDate = (date, type, sens) => {
  const d = new Date(date);
  if (type === "hebdomadaire") d.setDate(d.getDate() + 7 * sens);
  else if (type === "mensuel") d.setMonth(d.getMonth() + 1 * sens);
  else d.setFullYear(d.getFullYear() + 1 * sens);
  return d.toISOString().slice(0, 10);
};

const RapportVentes = () => {
  const [type, setType] = useState("hebdomadaire");
  const [dateRef, setDateRef] = useState(new Date().toISOString().slice(0, 10));
  const [rapport, setRapport] = useState(null);
  const [rapportPrecedent, setRapportPrecedent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generationPdf, setGenerationPdf] = useState(false);
  const [infosBoutique, setInfosBoutique] = useState(null);

  const zoneRapportRef = useRef(null);
  const controlesRef = useRef(null);
  const graphiqueRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("infosBoutique");
    if (saved) setInfosBoutique(JSON.parse(saved));
  }, []);

  const chargerRapport = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRapportVentes(type, dateRef);
      setRapport(data);

      const datePrecedente = decalerDate(dateRef, type, -1);
      const dataPrecedente = await getRapportVentes(type, datePrecedente);
      setRapportPrecedent(dataPrecedente);
    } catch (err) {
      toast.error("Impossible de charger le rapport");
    } finally {
      setLoading(false);
    }
  }, [type, dateRef]);

  useEffect(() => {
    chargerRapport();
  }, [chargerRapport]);

  const evolution = () => {
    if (!rapport || !rapportPrecedent || Number(rapportPrecedent.totalVentes) === 0) return null;
    const diff =
      ((Number(rapport.totalVentes) - Number(rapportPrecedent.totalVentes)) /
        Number(rapportPrecedent.totalVentes)) *
      100;
    return diff;
  };

  const diffPct = evolution();
  const maxMontant = rapport
    ? Math.max(...rapport.donneesGraphique.map((p) => Number(p.montant)), 1)
    : 1;

  const handleTelechargerPDF = async () => {
    if (!zoneRapportRef.current) return;
    setGenerationPdf(true);

    // On cache les boutons/sélecteurs ET le graphique juste le temps de la capture
    if (controlesRef.current) controlesRef.current.style.visibility = "hidden";
    if (graphiqueRef.current) graphiqueRef.current.style.display = "none";

    try {
      const canvas = await html2canvas(zoneRapportRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const largeurPage = pdf.internal.pageSize.getWidth();
      const hauteurImage = (canvas.height * largeurPage) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, largeurPage, hauteurImage);
      pdf.save(`rapport-ventes-${type}-${dateRef}.pdf`);
    } catch (err) {
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      if (controlesRef.current) controlesRef.current.style.visibility = "visible";
      if (graphiqueRef.current) graphiqueRef.current.style.display = "block";
      setGenerationPdf(false);
    }
  };

  return (
    <div className="rapportPage">
      <div className="rapportSheet" ref={zoneRapportRef}>
        {/* En-tête */}
        <div className="rapportHeader">
          <div className="rapportBoutiqueInfo">
            <img
              src={infosBoutique?.logoBase64 || logoEBS}
              alt="Logo boutique"
              className="rapportLogoEBS"
            />
            <div>
              <h2>{infosBoutique?.nomBoutique || "ETS Beugue Serigne Mansour SY"}</h2>
              {infosBoutique?.adresse && <p>{infosBoutique.adresse}</p>}
              {(infosBoutique?.ninea || infosBoutique?.rccm) && (
                <p>
                  {infosBoutique.ninea && `NINEA: ${infosBoutique.ninea}`}
                  {infosBoutique.ninea && infosBoutique.rccm && " • "}
                  {infosBoutique.rccm && `RCCM: ${infosBoutique.rccm}`}
                </p>
              )}
              {(infosBoutique?.telephone || infosBoutique?.email) && (
                <p>
                  {infosBoutique.telephone}
                  {infosBoutique.telephone && infosBoutique.email && " • "}
                  {infosBoutique.email}
                </p>
              )}
            </div>
          </div>
          <div className="rapportTitreBloc">
            <span className="rapportEyebrow">Rapport de ventes</span>
            <h1>{TYPES.find((t) => t.value === type)?.label}</h1>
            {rapport && (
              <p className="rapportPeriode">
                Du {new Date(rapport.dateDebut).toLocaleDateString("fr-FR")} au{" "}
                {new Date(rapport.dateFin).toLocaleDateString("fr-FR")}
              </p>
            )}
          </div>
        </div>

        {/* Sélecteur + navigation + bouton PDF */}
        <div className="rapportControles" ref={controlesRef}>
          <div className="rapportTypeSelector">
            {TYPES.map((t) => (
              <button
                key={t.value}
                className={`rapportTypeBtn ${type === t.value ? "actif" : ""}`}
                onClick={() => setType(t.value)}
              >
                <i className={`bi ${t.icon}`}></i>
                {t.label}
              </button>
            ))}
          </div>
          <div className="rapportNavDate">
            <button onClick={() => setDateRef(decalerDate(dateRef, type, -1))}>
              <i className="bi bi-chevron-left"></i>
            </button>
            <span>{new Date(dateRef).toLocaleDateString("fr-FR")}</span>
            <button onClick={() => setDateRef(decalerDate(dateRef, type, 1))}>
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
          <button
            className="rapportPrintBtn"
            onClick={handleTelechargerPDF}
            disabled={generationPdf || !rapport}
          >
            <i className="bi bi-file-earmark-pdf me-1"></i>
            {generationPdf ? "Génération..." : "Télécharger le PDF"}
          </button>
        </div>

        {loading && <div className="rapportLoading">Chargement du rapport...</div>}

        {!loading && rapport && (
          <>
            {/* KPI */}
            <div className="rapportKpis">
              <div className="rapportKpiCard">
                <span className="rapportKpiLabel">Total des ventes</span>
                <span className="rapportKpiValeur">{formatMontant(rapport.totalVentes)}</span>
                {diffPct !== null && (
                  <span className={`rapportTrend ${diffPct >= 0 ? "hausse" : "baisse"}`}>
                    <i className={`bi ${diffPct >= 0 ? "bi-arrow-up-right" : "bi-arrow-down-right"}`}></i>
                    {Math.abs(diffPct).toFixed(1)}% vs période précédente
                  </span>
                )}
              </div>
              <div className="rapportKpiCard">
                <span className="rapportKpiLabel">Nombre de ventes</span>
                <span className="rapportKpiValeur">{rapport.nombreVentes}</span>
              </div>
              <div className="rapportKpiCard">
                <span className="rapportKpiLabel">Vente moyenne</span>
                <span className="rapportKpiValeur">{formatMontant(rapport.venteMoyenne)}</span>
              </div>
              <div className="rapportKpiCard">
                <span className="rapportKpiLabel">Bénéfices</span>
                <span className="rapportKpiValeur">{formatMontant(rapport.beneficeTotal)}</span>
              </div>
              <div className="rapportKpiCard">
                <span className="rapportKpiLabel">Produit le plus vendu</span>
                <span className="rapportKpiValeur">
                  {rapport.produitPlusVendu
                    ? `${rapport.produitPlusVendu} (${rapport.quantiteProduitPlusVendu})`
                    : "Non disponible"}
                </span>
              </div>
            </div>

            {/* Graphique (exclu du PDF) */}
            <div className="rapportGraphiqueBloc" ref={graphiqueRef}>
              <h3>Évolution des ventes</h3>
              <div className="rapportGraphique">
                {rapport.donneesGraphique.map((point, i) => {
                  const hauteur = (Number(point.montant) / maxMontant) * 100;
                  return (
                    <div className="rapportBarreWrapper" key={i}>
                      <div className="rapportBarreValeur">
                        {Number(point.montant) > 0 ? formatMontant(point.montant) : ""}
                      </div>
                      <div className="rapportBarre" style={{ height: `${hauteur}%` }}></div>
                      <span className="rapportBarreLabel">{point.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {!loading && rapport && rapport.nombreVentes === 0 && (
          <p className="rapportVide">Aucune vente enregistrée sur cette période.</p>
        )}
      </div>
    </div>
  );
};

export default RapportVentes;
