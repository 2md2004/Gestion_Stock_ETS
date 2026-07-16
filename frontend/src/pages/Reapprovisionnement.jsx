import { useEffect, useState } from "react";
import "../styles/Produit.css";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import EmptyImg from "../assets/Empty (1).gif";
import { getProduitsPerPage, rechercherProduits, reapprovisionnementProduit } from "../services/ProduitService";
import useDebounce from "../hooks/useDebounce";

const Reapprovisionnement = () => {
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
  const [refreshTrigger, setRefreshTrigger] = useState(0); // ✅ Pour forcer le rechargement

  const loadPage = async (page) => {
    setLoading(true);
    try {
      const data = await getProduitsPerPage(page, 7, "nom");
      setProduits(data.content || []);
      setPages(data.totalPages || 0);
      setCurrentPage(page);
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors du chargement des produits");
      setProduits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(0);
  }, [refreshTrigger]); // ✅ Recharger quand refreshTrigger change

  useEffect(() => {
    if (searchDebounce.trim().length >= 2) {
      setIsSearching(true);
      rechercherProduits(searchDebounce)
        .then((data) => { 
          setResultats(data); 
          setShowResults(true); 
        })
        .catch(() => {
          setResultats([]);
          toast.error("Erreur lors de la recherche");
        })
        .finally(() => setIsSearching(false));
    } else {
      setResultats([]);
      setShowResults(false);
      setIsSearching(false);
    }
  }, [searchDebounce]);

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value.trim().length < 2) {
      setShowResults(false);
      setResultats([]);
    }
  };

  const clearSearch = () => {
    setSearch("");
    setResultats([]);
    setShowResults(false);
    loadPage(0);
  };

  const renderPages = () => {
    return Array.from({ length: pages }, (_, i) => (
      <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
        <button className="page-link" onClick={() => loadPage(i)} style={{ color: "#3E2C1C" }}>
          {i + 1}
        </button>
      </li>
    ));
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
        quantite: Number(quantite)
      };
      
      // Appel API
      const updatedProduit = await reapprovisionnementProduit(selectedProduit.id, dto);
      
      // ✅ Mettre à jour avec les données du backend
      setProduits((prev) =>
        prev.map((p) =>
          p.id === selectedProduit.id ? updatedProduit : p
        )
      );
      
      // Mettre à jour les résultats de recherche
      if (showResults) {
        setResultats((prev) =>
          prev.map((p) =>
            p.id === selectedProduit.id ? updatedProduit : p
          )
        );
      }
      
      toast.success(`${quantite} unité(s) ajoutée(s) au stock de "${selectedProduit.nom}"`);
      setSelectedProduit(null);
      setQuantite("");
      
      // ✅ Optionnel: Forcer un rechargement après un délai
      // setRefreshTrigger(prev => prev + 1);
      
    } catch (error) {
      console.error("Erreur lors du réapprovisionnement:", error);
      toast.error("Erreur lors du réapprovisionnement. Veuillez réessayer.");
      
      // ✅ En cas d'erreur, recharger pour être sûr d'avoir les bonnes données
      if (showResults && search.length >= 2) {
        try {
          const data = await rechercherProduits(search);
          setResultats(data);
        } catch (e) {
          console.error("Erreur lors du rechargement:", e);
        }
      } else {
        await loadPage(currentPage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const tableContent = (list) => (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="bg-light">
          <tr>
            <th className="py-3 ps-4">Nom</th>
            <th className="py-3">Catégorie</th>
            <th className="py-3">Prix d'achat</th>
            <th className="py-3">Stock actuel</th>
            <th className="py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((produit) => (
            <tr key={produit.id} className="border-bottom">
              <td className="ps-4 fw-semibold">{produit.nom}</td>
              <td>{produit.categorie?.nom || "N/A"}</td>
              <td>
                {produit.prixAchat?.toLocaleString()} FCFA
              </td>
              <td>
                 {produit.quantite}
              </td>
              <td className="text-center">
                <button
                  className="btn btn-sm btn-outline-success"
                  title="Réapprovisionner"
                  onClick={() => openModal(produit)}
                  style={{ width: "32px", height: "32px", padding: 0 }}
                >
                  <i className="bi bi-arrow-repeat"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">
              <i className="bi bi-arrow-repeat me-2" style={{ color: "#002050" }}></i>
              Réapprovisionnement des stocks
            </h5>
            <div className="search-box" style={{ position: "relative", width: "300px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={handleChangeSearch}
                style={{ paddingLeft: "40px", paddingRight: search ? "35px" : "40px" }}
              />
              <i className="bi bi-search" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6c757d" }}></i>
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

        <div className="col-md-12 mt-3 shadow-sm p-0 bg-white" style={{ borderRadius: "10px" }}>
          {loading || isSearching ? (
            <div className="d-flex flex-column justify-content-center align-items-center gap-3" style={{ height: "60vh" }}>
              <ClipLoader color="#002050" loading={loading || isSearching} size={60} />
              <p>{isSearching ? "Recherche en cours..." : "Chargement des données..."}</p>
            </div>
          ) : (
            <div className="w-100" style={{ borderRadius: "10px", overflow: "hidden" }}>
              {showResults && resultats.length === 0 && search.length >= 2 ? (
                <div className="text-center py-5">
                  <img src={EmptyImg} alt="empty" style={{ width: "300px" }} />
                  <h5 className="mt-3">Aucun produit trouvé pour "{search}"</h5>
                </div>
              ) : showResults && resultats.length > 0 ? (
                <>
                  <div className="d-flex justify-content-between align-items-center p-3 bg-light border-bottom">
                    <h6 className="mb-0">
                      <i className="bi bi-search me-2"></i>
                      Résultats de recherche pour "<strong>{search}</strong>"
                      <span className="badge bg-secondary ms-2">{resultats.length}</span>
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
                      <h5 className="mt-3">Aucun produit disponible</h5>
                    </div>
                  ) : (
                    <>
                      {tableContent(produits)}
                      {produits.length !== 0 && (
                        <nav aria-label="Page navigation example" className="p-3">
                          <ul className="pagination justify-content-center mb-0">
                            <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                              <button className="page-link" onClick={() => loadPage(currentPage - 1)} style={{ color: "#D09018" }}>
                                Précédent
                              </button>
                            </li>
                            {renderPages()}
                            <li className={`page-item ${currentPage === pages - 1 ? "disabled" : ""}`}>
                              <button className="page-link" onClick={() => loadPage(currentPage + 1)} style={{ color: "#D09018" }}>
                                Suivant
                              </button>
                            </li>
                          </ul>
                        </nav>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de réapprovisionnement */}
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
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  Le nouveau stock sera de <strong>{selectedProduit.quantite + (Number(quantite) || 0)}</strong> unités
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
                  disabled={submitting || !quantite || Number(quantite) <= 0}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Traitement...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-1"></i>
                      Confirmer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reapprovisionnement;