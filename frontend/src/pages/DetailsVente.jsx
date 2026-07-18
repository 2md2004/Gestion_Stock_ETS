import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import EmptyImg from "../assets/Empty (1).gif";
import PayeImg from "../assets/paye.jpg";
import { getVenteById } from "../services/VenteService";

const DetailsVente = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vente, setVente] = useState(null);
    const [loading, setLoading] = useState(false);
    
 

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const loadVente = async () => {
        try {
            setLoading(true);
            const data = await getVenteById(id);
            setVente(data);
        } catch (error) {
            console.log(error);
            toast.error("Erreur lors du chargement de la vente");
            setVente(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("Called")
        loadVente();
    }, [id]);

    // --- Export PDF (stub : à brancher sur un endpoint /ventes/{id}/pdf) ---
    const exporterVentePdf = async () => {
        toast.info(`Génération du PDF pour la vente #${id?.substring ? id.substring(0, 6) : id}...`);
        // TODO: brancher un vrai service d'export, ex:
        // const blob = await exporterVentePdfService(id);
        // const url = window.URL.createObjectURL(blob);
        // const a = document.createElement("a");
        // a.href = url;
        // a.download = `vente-${id}.pdf`;
        // a.click();
    };

    if (loading) {
        return (
            <div className="container">
                <div
                    className="d-flex flex-column justify-content-center align-items-center gap-3"
                    style={{ height: "60vh" }}
                >
                    <ClipLoader color="#002050" loading={loading} size={60} />
                    <p>Chargement de la vente...</p>
                </div>
            </div>
        );
    }

    if (!vente) {
        return (
            <div className="container">
                <div className="text-center py-5">
                    <img src={EmptyImg} alt="empty" style={{ width: "300px" }} />
                    <h5 className="mt-3">Vente introuvable</h5>
                    <button
                        className="btn btn-outline-secondary mt-3"
                        onClick={() => navigate(-1)}
                    >
                        <i className="bi bi-arrow-left me-2"></i>
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    const lignes = vente.details || vente.detailsVente || [];

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => navigate(-1)}
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Retour
                        </button>

                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={exporterVentePdf}
                            >
                                <i className="bi bi-file-earmark-pdf me-2"></i>
                                Exporter en PDF
                            </button>
                        </div>
                    </div>
                </div>

                
                <div className="col-md-12 mb-3">
                    <div 
                        className="shadow-sm bg-white p-4" 
                        style={{ 
                            borderRadius: "10px",
                            borderLeft: "6px solid #002050",
                            borderLeftColor: "#002050"
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                            <div className="flex-grow-1">
                                <h4 className="mb-1" style={{ color: "#002050", fontWeight: "600" }}>
                                    Vente N°{vente.id}
                                </h4>
                                <hr className="my-2" style={{ borderColor: "#e0e0e0" }} />

                                <div>
                                    <div className="row">
                                        <div className="col-md-4 mb-2">
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-calendar3 me-2" style={{ color: "#002050", fontSize: "1.2rem" }}></i>
                                                <div>
                                                    <small className="text-muted d-block" style={{ fontSize: "0.7rem" }}>DATE</small>
                                                    <span style={{ fontSize: "1rem", fontWeight: "500", color: "#333" }}>
                                                        {formatDate(vente.date)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-2">
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-person me-2" style={{ color: "#002050", fontSize: "1.2rem" }}></i>
                                                <div>
                                                    <small className="text-muted d-block" style={{ fontSize: "0.7rem" }}>CLIENT</small>
                                                    <span style={{ fontSize: "1rem", fontWeight: "500", color: "#333" }}>
                                                        {vente.client ? `${vente.client.prenom || ""} ${vente.client.nom || ""}`.trim() : "Client non renseigné"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-2">
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-cash-coin me-2" style={{ color: "#002050", fontSize: "1.2rem" }}></i>
                                                <div>
                                                    <small className="text-muted d-block" style={{ fontSize: "0.7rem" }}>MONTANT TOTAL</small>
                                                    <span style={{ fontSize: "1rem", fontWeight: "600", color: "#28a745" }}>
                                                        {(vente.montantTotal ?? vente.montant)?.toLocaleString()} FCFA
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex-shrink-0">
                                <img src={PayeImg} alt="payé" style={{ width: "150px", height: "auto" }} />
                            </div>
                        </div>
                    </div>
                </div>


                <div className="col-md-12 shadow-sm p-0 bg-white" style={{ borderRadius: "10px" }}>
                    {lignes.length === 0 ? (
                        <div className="text-center py-5">
                            <img src={EmptyImg} alt="empty" style={{ width: "300px" }} />
                            <h5 className="mt-3">Aucun produit associé à cette vente</h5>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="py-3 ps-4">Produit</th>
                                        <th className="py-3">Quantité vendue</th>
                                        <th className="py-3">Prix unitaire</th>
                                        <th className="py-3">Sous-total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lignes.map((ligne) => {
                                        const prixUnitaire =
                                            ligne.produit?.prixVente ?? ligne.prixUnitaireVente ?? 0;
                                        const quantite = ligne.quantiteVendu ?? ligne.quantite ?? 0;
                                        return (
                                            <tr key={ligne.id} className="border-bottom">
                                                <td className="ps-4 fw-semibold">
                                                    {ligne.produit?.nom || "Produit supprimé"}
                                                </td>
                                                <td>{quantite}</td>
                                                <td>{prixUnitaire.toLocaleString()} FCFA</td>
                                                <td className="text-success fw-semibold">
                                                    {(prixUnitaire * quantite).toLocaleString()} FCFA
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailsVente;