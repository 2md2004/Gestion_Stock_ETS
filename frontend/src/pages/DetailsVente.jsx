import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import EmptyImg from "../assets/Empty (1).gif";
import { getVenteById } from "../services/VenteService";
import { getBoutique } from "../services/BoutiqueService";
import { API_URL } from "../constants/server";
import FactureVente from "../components/FactureVente";
import { exporterElementEnPdf, withLogoUrl } from "../utils/pdfExport";

const DetailsVente = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vente, setVente] = useState(null);
    const [loading, setLoading] = useState(false);
    const [boutique, setBoutique] = useState(null);
    const [generationPdf, setGenerationPdf] = useState(false);
    const factureRef = useRef(null);

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
        loadVente();
    }, [id]);

    useEffect(() => {
        getBoutique()
            .then((data) => setBoutique(withLogoUrl(data, API_URL)))
            .catch(() => {});
    }, []);

    const exporterVentePdf = async () => {
        if (!factureRef.current) return;
        setGenerationPdf(true);
        try {
            await exporterElementEnPdf(factureRef.current, `facture-vente-${vente.id}.pdf`);
            toast.success("PDF téléchargé avec succès");
        } catch (error) {
            console.error("Erreur export PDF:", error);
            toast.error("Erreur lors de la génération du PDF");
        } finally {
            setGenerationPdf(false);
        }
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
                    <button className="btn btn-outline-secondary mt-3" onClick={() => navigate(-1)}>
                        <i className="bi bi-arrow-left me-2"></i>
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                            <i className="bi bi-arrow-left me-2"></i>
                            Retour
                        </button>

                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={exporterVentePdf}
                                disabled={generationPdf}
                            >
                                {generationPdf ? (
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                ) : (
                                    <i className="bi bi-file-earmark-pdf me-2"></i>
                                )}
                                Exporter en PDF
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-md-12 mb-3">
                    <FactureVente ref={factureRef} vente={vente} boutique={boutique} />
                </div>
            </div>
        </div>
    );
};

export default DetailsVente;