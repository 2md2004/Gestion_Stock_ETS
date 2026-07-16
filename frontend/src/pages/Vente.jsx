import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import EmptyImg from "../assets/Empty (1).gif";
import {  getVentesPerPage, deleteVente, rechercherVentes } from "../services/VenteService";
import useDebounce from "../hooks/useDebounce";
import { useLocation, useNavigate } from "react-router-dom";

const Vente = () => {
    const [ventes, setVentes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [search, setSearch] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const searchDebounce = useDebounce(search, 500);
    const [resultats, setResultats] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
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
    }

    useEffect(() => {
        if (searchDebounce.trim().length >= 2) {
            rechercherVente(searchDebounce);
        } else {
            setResultats([]);
            setShowResults(false);
            setIsSearching(false);
        }
    }, [searchDebounce]);

    const rechercherVente = async (query) => {
        try {
            setIsSearching(true);
            const data = await rechercherVentes(query);
            setResultats(data);
        } catch (error) {
            console.log(error);
            setResultats([]);
        } finally {
            setIsSearching(false);
        }
    };

   
    
    const deleteVenteById = async (id) => {
        try {
            setLoading(true);
            await deleteVente(id);
            toast.success("Vente supprimée avec succès");
            loadPage(currentPage);
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Erreur lors de la suppression"
            );
        } finally {
            setLoading(false);
        }
    }

    const loadPage = async (page) => {
        setLoading(true);
        try {
            const data = await getVentesPerPage(page, 7, "date");
            setVentes(data.content || []);
            setPages(data.totalPages || 0);
            setCurrentPage(page);
        } catch (error) {
            console.log(error);
            setVentes([]);
        } finally {
            setLoading(false);
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

    useEffect(() => {
        loadPage(0);
    }, []);

    const clearSearch = () => {
        setSearch("");
        setResultats([]);
        setShowResults(false);
        setIsSearching(false);
        loadPage(0);
    };


    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // --- Voir le détail d'une vente ---
    const voirDetailsVente = (id) => {
        navigate(`${location.pathname}/${id}`);
    };

    // --- Export PDF (stub : à brancher sur un endpoint /ventes/{id}/pdf) ---
    const exporterVentePdf = async (vente) => {
        toast.info(`Génération du PDF pour la vente #${vente.id?.substring ? vente.id.substring(0, 6) : vente.id}...`);
        // TODO: brancher un vrai service d'export, ex:
        // const blob = await exporterVentePdfService(vente.id);
        // const url = window.URL.createObjectURL(blob);
        // const a = document.createElement("a");
        // a.href = url;
        // a.download = `vente-${vente.id}.pdf`;
        // a.click();
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="search-box" style={{ position: 'relative', width: '300px' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Rechercher une vente..."
                                value={search}
                                onChange={handleChangeSearch}
                                style={{ paddingLeft: '40px', paddingRight: search ? '35px' : '40px' }}
                            />
                            <i
                                className="bi bi-search"
                                style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#6c757d'
                                }}
                            ></i>
                            {search && (
                                <i
                                    className="bi bi-x-circle-fill"
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#6c757d',
                                        cursor: 'pointer'
                                    }}
                                    onClick={clearSearch}
                                ></i>
                            )}
                        </div>

                        <button
                            className="btn text-white"
                            onClick={() => navigate(location.pathname + "/nouvelle")}
                            style={{ backgroundColor: "#002050" }}
                        >
                            <i className="bi bi-plus-circle me-2"></i>
                            Nouvelle vente
                        </button>
                    </div>
                </div>

                <div className="col-md-12 mt-3 shadow-sm p-0 bg-white" style={{ borderRadius: "10px" }}>
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
                            {showResults && resultats.length === 0 && search.length >= 2 ? (
                                <div className="text-center py-5">
                                    <img
                                        src={EmptyImg}
                                        alt="empty"
                                        style={{ width: "300px" }}
                                    />
                                    <h5 className="mt-3">Aucune vente trouvée pour "{search}"</h5>
                                </div>
                            ) : showResults && resultats.length > 0 ? (
                                <>
                                    <div className="d-flex justify-content-between align-items-center p-3 bg-light border-bottom">
                                        <h6 className="mb-0">
                                            <i className="bi bi-search me-2"></i>
                                            Résultats de recherche pour "<strong>{search}</strong>"
                                            <span className="badge bg-secondary ms-2">{resultats.length}</span>
                                        </h6>
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={clearSearch}
                                        >
                                            <i className="bi bi-x-circle me-1"></i>
                                            Effacer
                                        </button>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="py-3 ps-4">Vente</th>
                                                    <th className="py-3">Date</th>
  
                                                    <th className="py-3">Montant</th>
                        
                                                    <th className="py-3 text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {resultats.map((vente) => {
                                                    
                                                    return (
                                                        <tr key={vente.id} className="border-bottom">
                                                            <td className="ps-4 fw-semibold">
                                                                Vente #{vente.id}
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <i className="bi bi-calendar3 me-2 text-muted"></i>
                                                                    {formatDate(vente.date)}
                                                                </div>
                                                            </td>
                                                           
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <i className="bi bi-currency-franc me-2 text-success"></i>
                                                                    <span className="fw-semibold">{vente.montantTotal?.toLocaleString()} FCFA</span>
                                                                </div>
                                                            </td>
                                                            
                                                            <td>
                                                                <div className="d-flex justify-content-center gap-1">
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        onClick={() => voirDetailsVente(vente.id)}
                                                                        title="Voir plus"
                                                                        style={{ width: "32px", height: "32px", padding: 0 }}
                                                                    >
                                                                        <i className="bi bi-eye"></i>
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-secondary"
                                                                        onClick={() => exporterVentePdf(vente)}
                                                                        title="Exporter en PDF"
                                                                        style={{ width: "32px", height: "32px", padding: 0 }}
                                                                    >
                                                                        <i className="bi bi-file-earmark-pdf"></i>
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target={`#confirmModal${vente.id}`}
                                                                        title="Supprimer"
                                                                        style={{ width: "32px", height: "32px", padding: 0 }}
                                                                    >
                                                                        <i className="bi bi-trash"></i>
                                                                    </button>
                                                                </div>

                                                                {/* Delete Confirmation Modal */}
                                                                <div
                                                                    className="modal fade"
                                                                    id={`confirmModal${vente.id}`}
                                                                    tabIndex="-1"
                                                                    aria-hidden="true"
                                                                >
                                                                    <div className="modal-dialog modal-dialog-centered">
                                                                        <div className="modal-content border-0 rounded-4 shadow">
                                                                            <div className="modal-header border-0 justify-content-center">
                                                                                <div
                                                                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                                                                    style={{
                                                                                        width: "70px",
                                                                                        height: "70px",
                                                                                        backgroundColor: "#fee2e2",
                                                                                    }}
                                                                                >
                                                                                    <i
                                                                                        className="bi bi-trash-fill"
                                                                                        style={{
                                                                                            fontSize: "35px",
                                                                                            color: "#dc3545",
                                                                                        }}
                                                                                    ></i>
                                                                                </div>
                                                                            </div>

                                                                            <div className="modal-body text-center px-4">
                                                                                <p className="text-secondary mb-0">
                                                                                    Voulez-vous vraiment supprimer cette vente
                                                                                    <br />
                                                                                    <strong className="text-dark">
                                                                                        Vente #{vente.id?.substring(0, 6)}
                                                                                    </strong>
                                                                                    ?
                                                                                </p>
                                                                                <small className="text-danger d-block mt-2">
                                                                                    Cette action est irréversible.
                                                                                </small>
                                                                            </div>

                                                                            <div className="modal-footer border-0 justify-content-center pb-4">
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-sm btn-light rounded-3 px-4"
                                                                                    data-bs-dismiss="modal"
                                                                                >
                                                                                    Annuler
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-sm btn-danger text-white rounded-3 px-4"
                                                                                    data-bs-dismiss="modal"
                                                                                    onClick={() => deleteVenteById(vente.id)}
                                                                                >
                                                                                    Oui
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {ventes.length === 0 ? (
                                        <div className="text-center py-5">
                                            <img
                                                src={EmptyImg}
                                                alt="empty"
                                                style={{ width: "300px" }}
                                            />
                                            <h5 className="mt-3">Aucune vente effectuée pour le moment</h5>
                                        </div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-hover align-middle mb-0">
                                                <thead className="bg-light">
                                                    <tr>
                                                        <th className="py-3 ps-4">Vente</th>
                                                        <th className="py-3">Date</th>
                                      
                                                        <th className="py-3">Montant total</th>

                                                        <th className="py-3 text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ventes.map((vente) => {
                                                      
                                                        return (
                                                            <tr key={vente.id} className="border-bottom">
                                                                <td className="ps-4 fw-semibold">
                                                                    N°{vente.id}
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <i className="bi bi-calendar3 me-2 text-muted"></i>
                                                                        {formatDate(vente.date)}
                                                                    </div>
                                                                </td>
                                                               
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <i className="bi bi-currency-franc me-2 text-success"></i>
                                                                        <span className="fw-semibold">{vente.montantTotal?.toLocaleString()} FCFA</span>
                                                                    </div>
                                                                </td>
                                                              
                                                                <td>
                                                                    <div className="d-flex justify-content-center gap-1">
                                                                        <button
                                                                            className="btn btn-sm btn-outline-primary"
                                                                            onClick={() => voirDetailsVente(vente.id)}
                                                                            title="Voir plus"
                                                                            style={{ width: "32px", height: "32px", padding: 0 }}
                                                                        >
                                                                            <i className="bi bi-eye"></i>
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-sm btn-outline-secondary"
                                                                            onClick={() => exporterVentePdf(vente)}
                                                                            title="Exporter en PDF"
                                                                            style={{ width: "32px", height: "32px", padding: 0 }}
                                                                        >
                                                                            <i className="bi bi-file-earmark-pdf"></i>
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-sm btn-outline-danger"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target={`#confirmModal${vente.id}`}
                                                                            title="Supprimer"
                                                                            style={{ width: "32px", height: "32px", padding: 0 }}
                                                                        >
                                                                            <i className="bi bi-trash"></i>
                                                                        </button>
                                                                    </div>

                                                                    {/* Delete Confirmation Modal */}
                                                                    <div
                                                                        className="modal fade"
                                                                        id={`confirmModal${vente.id}`}
                                                                        tabIndex="-1"
                                                                        aria-hidden="true"
                                                                    >
                                                                        <div className="modal-dialog modal-dialog-centered">
                                                                            <div className="modal-content border-0 rounded-4 shadow">
                                                                                <div className="modal-header border-0 justify-content-center">
                                                                                    <div
                                                                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                                                                        style={{
                                                                                            width: "70px",
                                                                                            height: "70px",
                                                                                            backgroundColor: "#fee2e2",
                                                                                        }}
                                                                                    >
                                                                                        <i
                                                                                            className="bi bi-trash-fill"
                                                                                            style={{
                                                                                                fontSize: "35px",
                                                                                                color: "#dc3545",
                                                                                            }}
                                                                                        ></i>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="modal-body text-center px-4">
                                                                                    <p className="text-secondary mb-0">
                                                                                        Voulez-vous vraiment supprimer cette vente
                                                                                        <br />
                                                                                        <strong className="text-dark">
                                                                                            Vente #{vente.id?.substring(0, 6)}
                                                                                        </strong>
                                                                                        ?
                                                                                    </p>
                                                                                    <small className="text-danger d-block mt-2">
                                                                                        Cette action est irréversible.
                                                                                    </small>
                                                                                </div>

                                                                                <div className="modal-footer border-0 justify-content-center pb-4">
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-sm btn-light rounded-3 px-4"
                                                                                        data-bs-dismiss="modal"
                                                                                    >
                                                                                        Annuler
                                                                                    </button>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-sm btn-danger text-white rounded-3 px-4"
                                                                                        data-bs-dismiss="modal"
                                                                                        onClick={() => deleteVenteById(vente.id)}
                                                                                    >
                                                                                        Oui
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    {ventes.length !== 0 && (
                                        <nav aria-label="Page navigation example" className="p-3">
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

                                                <li
                                                    className={`page-item ${currentPage === pages - 1 ? "disabled" : ""}`}
                                                >
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
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Vente;