import { useEffect, useState } from "react";
import "../styles/Produit.css";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import EmptyImg from "../assets/Empty (1).gif";
import {getProduitsStockFaible,rechercherProduits,reapprovisionnementProduit} from "../services/ProduitService";
import useDebounce from "../hooks/useDebounce";

const AlertesStock = () => {
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [search, setSearch] = useState("");
    const searchDebounce = useDebounce(search, 500);
    const [resultats, setResultats] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedProduit, setSelectedProduit] = useState(null);
    const [quantite, setQuantite] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const loadPage = async (page) => {
        setLoading(true);
        try {
            const data = await getProduitsStockFaible(page, 7, "nom");
            setProduits(data.content || []);
            setPages(data.totalPages || 0);
            setCurrentPage(page);
        } catch (error) {
            console.log(error);
            setProduits([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPage(0);
    }, []);

    useEffect(() => {
        if (searchDebounce && searchDebounce.trim().length >= 2) {
            setIsSearching(true);
            rechercherProduits(searchDebounce)
                .then((data) => {
                    const filtered = data.filter((p) => p.quantite <= 5);
                    setResultats(filtered);
                    setShowResults(true);
                })
                .catch(() => setResultats([]))
                .finally(() => setIsSearching(false));
        } else {
            setResultats([]);
            setShowResults(false);
            setIsSearching(false);
        }
    }, [searchDebounce]);

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

    const clearSearch = () => {
        setSearch("");
        setResultats([]);
        setShowResults(false);
        setIsSearching(false);
        loadPage(0);
    };

    const openModal = (produit) => {
        setSelectedProduit(produit);
        setQuantite("");
    };

   const handleReapprovisionner = async () => {
       if (!quantite || Number(quantite) <= 0) {
           toast.warning("Veuillez saisir une quantité valide");
           return;
       }

       setSubmitting(true);

       try {
           const dto = {
               idProduit: selectedProduit.id,
               quantite: Number(quantite),
           };

           await reapprovisionnementProduit(selectedProduit.id, dto);

           toast.success(
               `${quantite} unité(s) ajoutée(s) au stock de "${selectedProduit.nom}"`
           );

           setSelectedProduit(null);
           setQuantite("");
           loadPage(currentPage);
       } catch (error) {
           console.error(error);
           toast.error("Erreur lors du réapprovisionnement");
       } finally {
           setSubmitting(false);
       }
   };
    const renderPages = () => {
        return Array.from({ length: pages }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
                <button
                    className="page-link"
                    onClick={() => loadPage(i)}
                    style={{ color: "#3E2C1C" }}
                >
                    {i + 1}
                </button>
            </li>
        ));
    };

   const tableContent = (list) => (
      <table className="table w-100">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Stock actuel</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((produit) => (
            <tr key={produit.id}>
              <td>{produit.nom}</td>
              <td>{produit.categorie?.nom || "N/A"}</td>
              <td>
                <span className={`fw-semibold ${produit.quantite <= 5 ? "text-danger" : "text-success"}`}>
                  {produit.quantite}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-outline-success btn-sm"
                  title="Réapprovisionner"
                  onClick={() => openModal(produit)}
                >
                  <i className="bi bi-arrow-repeat"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );

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
                                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6c757d" }}
                            ></i>
                            {search && (
                                <i
                                    className="bi bi-x-circle-fill"
                                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6c757d", cursor: "pointer" }}
                                    onClick={clearSearch}
                                ></i>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-12 shadow-sm p-0 bg-white" style={{ borderRadius: "10px" }}>
                    {loading || isSearching ? (
                        <div
                            className="d-flex flex-column justify-content-center align-items-center gap-3"
                            style={{ height: "60vh" }}
                        >
                            <ClipLoader color="#002050" loading={loading || isSearching} size={60} />
                            <p>{isSearching ? "Recherche en cours..." : "Chargement des données..."}</p>
                        </div>
                    ) : (
                        <div className="w-100" style={{ borderRadius: "10px", overflow: "hidden" }}>
                            {showResults && resultats.length === 0 && search && search.length >= 2 ? (
                                <div className="text-center py-5">
                                    <img src={EmptyImg} alt="empty" style={{ width: "300px" }} />
                                    <h5 className="mt-3">Aucun produit en stock faible trouvé pour "{search}"</h5>
                                </div>
                            ) : showResults && resultats.length > 0 ? (
                                <>
                                    <div className="d-flex justify-content-between align-items-center p-3 bg-light">
                                        <h6 className="mb-0">
                                            <i className="bi bi-search me-2"></i>
                                            Résultats pour "{search}" ({resultats.length} produit{resultats.length > 1 ? "s" : ""})
                                        </h6>
                                        <button className="btn btn-sm btn-outline-secondary" onClick={clearSearch}>
                                            <i className="bi bi-x-circle me-1"></i>
                                            Effacer
                                        </button>
                                    </div>
                                    {tableContent(resultats)}
                                </>
                            ) : (
                                <>
                                    {produits.length === 0 ? (
                                        <div className="text-center py-5">
                                            <img src={EmptyImg} alt="empty" style={{ width: "300px" }} />
                                            <h5 className="mt-3">Aucun produit en stock faible</h5>
                                        </div>
                                    ) : (
                                        <>
                                            {tableContent(produits)}
                                            <nav aria-label="Page navigation example" className="mt-4 mb-3">
                                                <ul className="pagination justify-content-center mb-0">
                                                    <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() => loadPage(currentPage - 1)}
                                                            style={{ color: "#D09018" }}
                                                        >
                                                            Précédent
                                                        </button>
                                                    </li>
                                                    {renderPages()}
                                                    <li className={`page-item ${currentPage === pages - 1 ? "disabled" : ""}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() => loadPage(currentPage + 1)}
                                                            style={{ color: "#D09018" }}
                                                        >
                                                            Suivant
                                                        </button>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {selectedProduit && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow">
                            <div className="modal-header border-0" style={{ backgroundColor: "#002050" }}>
                                <h5 className="modal-title text-white">
                                    <i className="bi bi-arrow-repeat me-2"></i>
                                    Réapprovisionner
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedProduit(null)}></button>
                            </div>
                            <div className="modal-body px-4 pt-4">
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold text-secondary">Produit</label>
                                    <input type="text" className="form-control" value={selectedProduit.nom} disabled />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold text-secondary">Stock actuel</label>
                                    <input type="text" className="form-control" value={`${selectedProduit.quantite} unité(s)`} disabled />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Quantité à ajouter</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={quantite}
                                        onChange={(e) => setQuantite(e.target.value)}
                                        placeholder="Entrez la quantité"
                                        min="1"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="modal-footer border-0 pb-4">
                                <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setSelectedProduit(null)}>
                                    Annuler
                                </button>
                                <button
                                    type="button"
                                    className="btn text-white rounded-3 px-4"
                                    style={{ backgroundColor: "#002050" }}
                                    onClick={handleReapprovisionner}
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <span className="spinner-border spinner-border-sm me-1"></span>
                                    ) : (
                                        <i className="bi bi-check-circle me-1"></i>
                                    )}
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlertesStock;
