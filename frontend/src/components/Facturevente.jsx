import { forwardRef } from "react";
import logoEBS from "../assets/logo_EBS.png";
import PayeImg from "../assets/paye.jpg";

const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date)) return "—";
    return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// Composant unique utilisé à la fois pour l'affichage (icône œil)
// et pour la capture PDF (icône PDF) -> garantit un rendu 100% identique
const FactureVente = forwardRef(({ vente, boutique }, ref) => {
    if (!vente) return null;

    const lignes = vente.details || vente.detailsVente || [];
    const montantTotal = vente.montantTotal ?? vente.montant ?? 0;

    return (
        <div
            ref={ref}
            className="bg-white"
            style={{ borderRadius: "10px", overflow: "hidden" }}
        >
            {/* En-tête boutique (logo + infos) */}
            <div
                className="d-flex align-items-center gap-3 p-4 shadow-sm"
                style={{ borderBottom: "2px solid #002050" }}
            >
                <img
                    src={boutique?.logoUrl || logoEBS}
                    alt="Logo boutique"
                    style={{ width: "65px", height: "65px", objectFit: "contain" }}
                />
                <div>
                    <h4 className="mb-1" style={{ color: "#002050", fontWeight: "700" }}>
                        {boutique?.nom || "ETS Beugue Serigne Mansour SY"}
                    </h4>
                    {boutique?.adresse && (
                        <p className="mb-0 small text-muted">{boutique.adresse}</p>
                    )}
                    {(boutique?.ninea || boutique?.rccm) && (
                        <p className="mb-0 small text-muted">
                            {boutique.ninea && `NINEA: ${boutique.ninea}`}
                            {boutique.ninea && boutique.rccm && " • "}
                            {boutique.rccm && `RCCM: ${boutique.rccm}`}
                        </p>
                    )}
                    {(boutique?.telephone || boutique?.email) && (
                        <p className="mb-0 small text-muted">
                            {boutique.telephone}
                            {boutique.telephone && boutique.email && " • "}
                            {boutique.email}
                        </p>
                    )}
                </div>
            </div>

            {/* Carte vente */}
            <div
                className="shadow-sm bg-white p-4"
                style={{ borderLeft: "6px solid #002050" }}
            >
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                    <div className="flex-grow-1">
                        <h4 className="mb-1" style={{ color: "#002050", fontWeight: "600" }}>
                            Vente N°{vente.id}
                        </h4>
                        <hr className="my-2" style={{ borderColor: "#e0e0e0" }} />

                        <div className="row">
                            <div className="col-md-4 mb-2">
                                <div className="d-flex align-items-center">
                                    <i
                                        className="bi bi-calendar3 me-2"
                                        style={{ color: "#002050", fontSize: "1.2rem" }}
                                    ></i>
                                    <div>
                                        <small className="text-muted d-block" style={{ fontSize: "0.7rem" }}>
                                            DATE
                                        </small>
                                        <span style={{ fontSize: "1rem", fontWeight: "500", color: "#333" }}>
                                            {formatDate(vente.date)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-2">
                                <div className="d-flex align-items-center">
                                    <i
                                        className="bi bi-person me-2"
                                        style={{ color: "#002050", fontSize: "1.2rem" }}
                                    ></i>
                                    <div>
                                        <small className="text-muted d-block" style={{ fontSize: "0.7rem" }}>
                                            CLIENT
                                        </small>
                                        <span style={{ fontSize: "1rem", fontWeight: "500", color: "#333" }}>
                                            {vente.client
                                                ? `${vente.client.prenom || ""} ${vente.client.nom || ""}`.trim()
                                                : "Client non renseigné"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-2">
                                <div className="d-flex align-items-center">
                                    <i
                                        className="bi bi-cash-coin me-2"
                                        style={{ color: "#002050", fontSize: "1.2rem" }}
                                    ></i>
                                    <div>
                                        <small className="text-muted d-block" style={{ fontSize: "0.7rem" }}>
                                            MONTANT TOTAL
                                        </small>
                                        <span style={{ fontSize: "1rem", fontWeight: "600", color: "#28a745" }}>
                                            {montantTotal?.toLocaleString()} FCFA
                                        </span>
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

            {/* Tableau produits */}
            <div className="shadow-sm p-0 bg-white">
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
                            const prixUnitaire = ligne.produit?.prixVente ?? ligne.prixUnitaireVente ?? 0;
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
                <p className="text-center text-muted small py-3 mb-0">
                    Merci pour votre confiance !
                </p>
            </div>
        </div>
    );
});

export default FactureVente;