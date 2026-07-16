import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import EmptyImg from "../assets/Empty (1).gif";
import { createVente } from "../services/venteService";
import { rechercherProduits } from "../services/ProduitService";
import useDebounce from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";

const AddDetailsVente = () => {
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const searchDebounce = useDebounce(search, 500);
    const [resultats, setResultats] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [lignes, setLignes] = useState([]);
    const navigate = useNavigate();
    const handleChangeSearch = (e) => {
        const inputValue = e.target.value;
        setSearch(inputValue);

        if (inputValue.trim().length >= 2) {
            setShowResults(true);
            setIsSearching(true);
        } else {
            setShowResults(false);
            setResultats([]);
            setIsSearching(false);
        }
    };

    useEffect(() => {
        if (searchDebounce.trim().length >= 2) {
            rechercherProduit(searchDebounce);
        } else {
            setResultats([]);
            setShowResults(false);
            setIsSearching(false);
        }
    }, [searchDebounce]);

    const rechercherProduit = async (query) => {
        try {
            setIsSearching(true);
            const data = await rechercherProduits(query);
            setResultats(data);
        } catch (error) {
            console.log(error);
            toast.error("Erreur lors de la recherche du produit");
            setResultats([]);
        } finally {
            setIsSearching(false);
        }
    };

    const clearSearch = () => {
        setSearch("");
        setResultats([]);
        setShowResults(false);
        setIsSearching(false);
    };

    // --- Panier (logique reprise et affichée comme dans V2) ---

    const ajouterProduit = (produit) => {
        setLignes((prev) => {
            const existante = prev.find((l) => l.idProduit === produit.id);
            if (existante) {
                if (existante.quantite + 1 > produit.quantite) {
                    toast.warning(`Stock insuffisant pour ${produit.nom}`);
                    return prev;
                }
                return prev.map((l) =>
                    l.idProduit === produit.id
                        ? { ...l, quantite: l.quantite + 1 }
                        : l
                );
            }
            return [
                ...prev,
                {
                    idProduit: produit.id,
                    nom: produit.nom,
                    prixUnitaireVente: produit.prixVente,
                    quantite: 1,
                    stockDisponible: produit.quantite,
                },
            ];
        });
        setSearch("");
        setResultats([]);
        setShowResults(false);
        toast.success(`${produit.nom} ajouté au panier`);
    };

    const modifierQuantite = (idProduit, quantite) => {
        setLignes((prev) =>
            prev.map((l) => {
                if (l.idProduit !== idProduit) return l;
                const nouvelleQuantite = Math.max(
                    1,
                    Math.min(quantite, l.stockDisponible)
                );
                return { ...l, quantite: nouvelleQuantite };
            })
        );
    };

    const supprimerLigne = (idProduit) => {
        setLignes((prev) => prev.filter((l) => l.idProduit !== idProduit));
        toast.info("Produit retiré du panier");
    };

    const montantTotal = lignes.reduce(
        (acc, l) => acc + l.prixUnitaireVente * l.quantite,
        0
    );

    const enregistrerVente = async () => {
        if (lignes.length === 0) {
            toast.error("Ajoute au moins un produit avant d'enregistrer.");
            return;
        }

        try {
            setLoading(true);
            const dto = {
                date: "",
                detailsVenteRequests: lignes.map((l) => ({
                    idProduit: l.idProduit,
                    quantiteVendu: l.quantite,
                })),
            };
            console.log("DTO envoyé :", dto);
            await createVente(dto);
            toast.success("Vente enregistrée avec succès");
            navigate("/ventes")
            setLignes([]);

        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                    "Erreur lors de l'enregistrement de la vente"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="search-box" style={{ position: "relative", width: "300px" }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Rechercher un produit..."
                                value={search}
                                onChange={handleChangeSearch}
                                style={{ paddingLeft: "40px", paddingRight: search ? "35px" : "40px" }}
                            />
                            <i
                                className="bi bi-search"
                                style={{
                                    position: "absolute",
                                    left: "12px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#6c757d",
                                    zIndex: 5,
                                }}
                            ></i>
                            {search && (
                                <i
                                    className="bi bi-x-circle-fill"
                                    style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#6c757d",
                                        cursor: "pointer",
                                        zIndex: 5,
                                    }}
                                    onClick={clearSearch}
                                ></i>
                            )}
                            {isSearching && (
                                <span
                                    className="text-muted small ms-2"
                                    style={{
                                        position: "absolute",
                                        right: "40px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        zIndex: 5,
                                    }}
                                >
                                    Recherche...
                                </span>
                            )}

                            {resultats.length > 0 && (
                                <div
                                    className="list-group position-absolute shadow"
                                    style={{
                                        top: "calc(100% + 5px)",
                                        left: 0,
                                        zIndex: 10,
                                        maxHeight: "250px",
                                        overflowY: "auto",
                                        width: "100%",
                                        borderRadius: "8px",
                                    }}
                                >
                                    {resultats.map((produit) => (
                                        <button
                                            key={produit.id}
                                            type="button"
                                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                            onClick={() => ajouterProduit(produit)}
                                            disabled={produit.quantite <= 0}
                                        >
                                            <div>
                                                <strong>{produit.nom}</strong>
                                                <br />
                                                <small className="text-muted">
                                                    {produit.prixVente} FCFA
                                                </small>
                                            </div>
                                            <span className="">
                                                Stock: {produit.quantite}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="d-flex gap-2 align-items-center">
                            <div
                                className="px-3 py-2 rounded"
                                style={{
                                    background: "#E8F5EE",
                                    color: "#1A7A52",
                                    fontWeight: "bold",
                                }}
                            >
                                Total: {montantTotal.toLocaleString()} FCFA
                            </div>
                            <button
                                className="btn btn-success text-white"
                                onClick={enregistrerVente}
                                disabled={lignes.length === 0 || loading}
                            >
                                <i className="bi bi-check-circle me-2"></i>
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-md-12 mt-3 shadow-sm p-0 bg-white" style={{ borderRadius: "10px" }}>
                    {loading ? (
                        <div
                            className="d-flex flex-column justify-content-center align-items-center gap-3"
                            style={{ height: "60vh" }}
                        >
                            <ClipLoader color="#002050" loading={loading} size={60} />
                            <p>Enregistrement en cours...</p>
                        </div>
                    ) : (
                        <div className="w-100" style={{ borderRadius: "10px", overflow: "hidden" }}>
                            {lignes.length === 0 ? (
                                <div className="text-center py-5">
                                    <img src={EmptyImg} alt="empty" style={{ width: "300px" }} />
                                    <h5 className="mt-3">Aucun produit ajouté pour l'instant</h5>
                                    <p className="text-muted">
                                        Recherchez un produit ci-dessus pour l'ajouter à la vente
                                    </p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="py-3 ps-4">Produit</th>
                                                <th className="py-3">Quantité</th>
                                                <th className="py-3">Prix unitaire</th>
                                                <th className="py-3">Total</th>
                                                <th className="py-3 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lignes.map((ligne) => (
                                                <tr key={ligne.idProduit} className="border-bottom">
                                                    <td className="ps-4 fw-semibold">{ligne.nom}</td>
                                                    <td style={{ width: "110px" }}>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max={ligne.stockDisponible}
                                                            className="form-control form-control-sm"
                                                            value={ligne.quantite}
                                                            onChange={(e) =>
                                                                modifierQuantite(
                                                                    ligne.idProduit,
                                                                    parseInt(e.target.value, 10) || 1
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td>{ligne.prixUnitaireVente.toLocaleString()} FCFA</td>
                                                    <td className="text-success fw-semibold">
                                                        {(ligne.prixUnitaireVente * ligne.quantite).toLocaleString()} FCFA
                                                    </td>
                                                    <td className="text-center">
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => supprimerLigne(ligne.idProduit)}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddDetailsVente;