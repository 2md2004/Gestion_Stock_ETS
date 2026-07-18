import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import EmptyImg from "../assets/Empty (1).gif";
import { createVente } from "../services/VenteService";
import { rechercherProduits } from "../services/ProduitService";
import { createClient } from "../services/ClientService";
import { getCategories } from "../services/CategorieService";
import useDebounce from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { useBadges } from "../context/BadgeContext";

const AddDetailsVente = () => {
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const searchDebounce = useDebounce(search, 500);
    const [resultats, setResultats] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [lignes, setLignes] = useState([]);
    const navigate = useNavigate();
    const { refreshBadges } = useBadges();

    const [showClientModal, setShowClientModal] = useState(false);
    const [clientPrenom, setClientPrenom] = useState("");
    const [clientNom, setClientNom] = useState("");

    const [showNewProductModal, setShowNewProductModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        nom: "",
        categorieId: "",
        prixAchat: "",
        prixVente: "",
        stockInitial: "",
        quantiteVendue: "",
    });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getCategories().then(setCategories).catch(() => {});
    }, []);

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

    const ajouterNouveauProduitAuPanier = () => {
        const { nom, categorieId, prixAchat, prixVente, stockInitial, quantiteVendue } = newProduct;
        if (!nom.trim() || !categorieId || !prixVente || !stockInitial || !quantiteVendue) {
            toast.warning("Veuillez remplir tous les champs obligatoires");
            return;
        }
        if (Number(quantiteVendue) > Number(stockInitial)) {
            toast.warning("La quantité vendue ne peut pas dépasser le stock initial");
            return;
        }
        const tempId = `new-${Date.now()}`;
        setLignes((prev) => [
            ...prev,
            {
                idProduit: tempId,
                nom: nom,
                prixUnitaireVente: Number(prixVente),
                quantite: Number(quantiteVendue),
                stockDisponible: Number(stockInitial),
                nouveauProduit: true,
                nomNouveauProduit: nom,
                categorieId: Number(categorieId),
                prixAchat: Number(prixAchat) || 0,
                stockInitial: Number(stockInitial),
            },
        ]);
        setShowNewProductModal(false);
        setNewProduct({ nom: "", categorieId: "", prixAchat: "", prixVente: "", stockInitial: "", quantiteVendue: "" });
        toast.success(`${nom} ajouté au panier`);
    };

    const modifierQuantite = (idProduit, quantite) => {
        setLignes((prev) =>
            prev.map((l) => {
                if (l.idProduit !== idProduit) return l;
                const nouvelleQuantite = Math.max(1, Math.min(quantite, l.stockDisponible + l.quantite));
                return { ...l, quantite: nouvelleQuantite };
            })
        );
    };

    const supprimerLigne = (idProduit) => {
        setLignes((prev) => prev.filter((l) => l.idProduit !== idProduit));
        toast.info("Produit retiré du panier");
    };

    const montantTotal = lignes.reduce(
        (acc, l) => acc + l.prixUnitaireVente * l.quantite, 0
    );

    const handleEnregistrerClick = () => {
        if (lignes.length === 0) {
            toast.error("Ajoute au moins un produit avant d'enregistrer.");
            return;
        }
        setShowClientModal(true);
    };

    const confirmerVente = async () => {
        if (!clientNom.trim()) {
            toast.warning("Le nom du client est requis");
            return;
        }

        try {
            setLoading(true);
            setShowClientModal(false);

            const created = await createClient({
                prenom: clientPrenom.trim(),
                nom: clientNom.trim(),
            });

            const dto = {
                date: "",
                clientId: created.id,
                detailsVenteRequests: lignes.map((l) => {
                    if (l.nouveauProduit) {
                        return {
                            nouveauProduit: true,
                            nomNouveauProduit: l.nomNouveauProduit,
                            categorieId: l.categorieId,
                            prixAchat: l.prixAchat,
                            prixVente: l.prixUnitaireVente,
                            stockInitial: l.stockInitial,
                            quantiteVendu: l.quantite,
                        };
                    }
                    return {
                        idProduit: l.idProduit,
                        quantiteVendu: l.quantite,
                    };
                }),
            };
            await createVente(dto);
            toast.success("Vente enregistrée avec succès");
            await refreshBadges();
            navigate("/ventes");
            setLignes([]);
            setClientPrenom("");
            setClientNom("");
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Erreur lors de l'enregistrement de la vente"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    {/* Search + actions */}
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
                            <i className="bi bi-search" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6c757d", zIndex: 5 }}></i>
                            {search && (
                                <i className="bi bi-x-circle-fill" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6c757d", cursor: "pointer", zIndex: 5 }} onClick={clearSearch}></i>
                            )}
                            {isSearching && (
                                <span className="text-muted small" style={{ position: "absolute", right: "40px", top: "50%", transform: "translateY(-50%)", zIndex: 5 }}>Recherche...</span>
                            )}
                            {resultats.length > 0 && (
                                <div className="list-group position-absolute shadow" style={{ top: "calc(100% + 5px)", left: 0, zIndex: 10, maxHeight: "250px", overflowY: "auto", width: "100%", borderRadius: "8px" }}>
                                    {resultats.map((produit) => (
                                        <button key={produit.id} type="button" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center" onClick={() => ajouterProduit(produit)} disabled={produit.quantite <= 0}>
                                            <div>
                                                <strong>{produit.nom}</strong>
                                                <br />
                                                <small className="text-muted">{produit.prixVente?.toLocaleString()} FCFA</small>
                                            </div>
                                            <span>Stock: {produit.quantite}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="d-flex gap-2 align-items-center">
                            <button className="btn btn-outline-primary" onClick={() => setShowNewProductModal(true)}>
                                <i className="bi bi-plus-circle me-1"></i>Autre
                            </button>
                            <div className="px-3 py-2 rounded" style={{ background: "#E8F5EE", color: "#1A7A52", fontWeight: "bold" }}>
                                Total: {montantTotal.toLocaleString()} FCFA
                            </div>
                            <button className="btn btn-success text-white" onClick={handleEnregistrerClick} disabled={lignes.length === 0 || loading}>
                                <i className="bi bi-check-circle me-2"></i>Enregistrer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cart table */}
                <div className="col-md-12 mt-3 shadow-sm p-0 bg-white" style={{ borderRadius: "10px" }}>
                    {loading ? (
                        <div className="d-flex flex-column justify-content-center align-items-center gap-3" style={{ height: "60vh" }}>
                            <ClipLoader color="#002050" loading={loading} size={60} />
                            <p>Enregistrement en cours...</p>
                        </div>
                    ) : (
                        <div className="w-100" style={{ borderRadius: "10px", overflow: "hidden" }}>
                            {lignes.length === 0 ? (
                                <div className="text-center py-5">
                                    <img src={EmptyImg} alt="empty" style={{ width: "300px" }} />
                                    <h5 className="mt-3">Aucun produit ajouté pour l'instant</h5>
                                    <p className="text-muted">Recherchez un produit ou cliquez sur "Autre" pour en créer un</p>
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
                                                    <td className="ps-4 fw-semibold">
                                                        {ligne.nom}
                                                        {ligne.nouveauProduit && <span className="badge bg-info ms-2" style={{ fontSize: "10px" }}>Nouveau</span>}
                                                    </td>
                                                    <td style={{ width: "110px" }}>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max={ligne.stockDisponible + ligne.quantite}
                                                            className="form-control form-control-sm"
                                                            value={ligne.quantite}
                                                            onChange={(e) => modifierQuantite(ligne.idProduit, parseInt(e.target.value, 10) || 1)}
                                                        />
                                                    </td>
                                                    <td>{ligne.prixUnitaireVente?.toLocaleString()} FCFA</td>
                                                    <td className="text-success fw-semibold">
                                                        {(ligne.prixUnitaireVente * ligne.quantite).toLocaleString()} FCFA
                                                    </td>
                                                    <td className="text-center">
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => supprimerLigne(ligne.idProduit)}>
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

            {/* Client Modal - appears when clicking Enregistrer */}
            {showClientModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow">
                            <div className="modal-header border-0" style={{ backgroundColor: "#002050" }}>
                                <h5 className="modal-title text-white">
                                    <i className="bi bi-person me-2"></i>Informations client
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowClientModal(false)}></button>
                            </div>
                            <div className="modal-body px-4 pt-4">
                                <p className="text-muted small mb-3">Saisissez les coordonnées du client pour la facture.</p>
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Prénom</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Prénom du client"
                                        value={clientPrenom}
                                        onChange={(e) => setClientPrenom(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Nom *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nom du client"
                                        value={clientNom}
                                        onChange={(e) => setClientNom(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer border-0 pb-4">
                                <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowClientModal(false)}>
                                    Annuler
                                </button>
                                <button
                                    type="button"
                                    className="btn text-white rounded-3 px-4"
                                    style={{ backgroundColor: "#002050" }}
                                    onClick={confirmerVente}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm me-1"></span>
                                    ) : (
                                        <i className="bi bi-check-circle me-1"></i>
                                    )}
                                    Confirmer la vente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* New Product Modal */}
            {showNewProductModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow">
                            <div className="modal-header border-0" style={{ backgroundColor: "#002050" }}>
                                <h5 className="modal-title text-white">
                                    <i className="bi bi-plus-circle me-2"></i>Ajout rapide produit
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowNewProductModal(false)}></button>
                            </div>
                            <div className="modal-body px-4 pt-4">
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Nom du produit *</label>
                                    <input type="text" className="form-control" placeholder="Ex: Fer 10 importé" value={newProduct.nom} onChange={(e) => setNewProduct({ ...newProduct, nom: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Catégorie *</label>
                                    <select className="form-select" value={newProduct.categorieId} onChange={(e) => setNewProduct({ ...newProduct, categorieId: e.target.value })}>
                                        <option value="">-- Sélectionner --</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.nom}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-6">
                                        <label className="form-label small fw-semibold">Prix d'achat</label>
                                        <input type="number" className="form-control" placeholder="0" value={newProduct.prixAchat} onChange={(e) => setNewProduct({ ...newProduct, prixAchat: e.target.value })} />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label small fw-semibold">Prix de vente *</label>
                                        <input type="number" className="form-control" placeholder="0" value={newProduct.prixVente} onChange={(e) => setNewProduct({ ...newProduct, prixVente: e.target.value })} />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-6">
                                        <label className="form-label small fw-semibold">Stock initial *</label>
                                        <input type="number" className="form-control" placeholder="0" value={newProduct.stockInitial} onChange={(e) => setNewProduct({ ...newProduct, stockInitial: e.target.value })} />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label small fw-semibold">Quantité vendue *</label>
                                        <input type="number" className="form-control" placeholder="0" min="1" value={newProduct.quantiteVendue} onChange={(e) => setNewProduct({ ...newProduct, quantiteVendue: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0 pb-4">
                                <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowNewProductModal(false)}>Annuler</button>
                                <button type="button" className="btn text-white rounded-3 px-4" style={{ backgroundColor: "#002050" }} onClick={ajouterNouveauProduitAuPanier}>
                                    <i className="bi bi-cart-plus me-1"></i>Ajouter au panier
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddDetailsVente;
