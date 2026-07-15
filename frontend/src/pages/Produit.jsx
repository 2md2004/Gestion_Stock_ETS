import { useEffect, useState } from "react";
import "../styles/Produit.css"
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import EmptyImg from "../assets/Empty (1).gif";
import { createProduit, getProduitsPerPage, deleteProduit, updateProduit, rechercherProduits } from "../services/ProduitService";
import AddProduit from "../components/AddProduit";
import EditProduit from "../components/EditProduit";
import useDebounce from "../hooks/useDebounce";

const Produit = () => {
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [search, setSearch] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const searchDebounce = useDebounce(search, 500);
    const [resultats, setResultats] = useState([]);
    const [showResults, setShowResults] = useState(false);

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

    const addProduit = async (produit) => {
        try {
            setLoading(true);
            await createProduit(produit);
            toast.success("Produit créé avec succès");
            loadPage(currentPage);
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Erreur lors de l'ajout"
            );
        } finally {
            setLoading(false);
        }
    }

    const updateProduitt = async (id, produit) => {
        try {
            setLoading(true);
            await updateProduit(id, produit);
            toast.success("Produit modifié avec succès");
            loadPage(currentPage);
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Erreur lors de la modification"
            );
        } finally {
            setLoading(false);
        }
    }

    const deleteproduitById = async (id) => {
        try {
            setLoading(true);
            await deleteProduit(id);
            toast.success("Produit supprimé avec succès");
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
            const data = await getProduitsPerPage(page, 7, "nom");
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

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="search-box" style={{ position: 'relative', width: '300px' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Rechercher un produit..."
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
                            data-bs-toggle="modal"
                            data-bs-target="#addModal"
                            style={{ backgroundColor: "#002050" }}
                        >
                            <i className="bi bi-plus-circle me-2"></i>
                            Nouveau produit
                        </button>
                    </div>

                    <div
                        className="modal fade"
                        id="addModal"
                        tabIndex="-1"
                        aria-labelledby="addModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header" style={{ backgroundColor: "#002050" }}>
                                    <h1 className="modal-title fs-5 text-white" id="addModalLabel">
                                        Ajout d'un produit
                                    </h1>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <AddProduit onAdd={addProduit} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-12 mt-3 shadow-sm p-0 bg-white">
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
                                    <h5 className="mt-3">Aucun produit trouvé pour "{search}"</h5>
                                </div>
                            ) : showResults && resultats.length > 0 ? (
                                <>
                                    <div className="d-flex justify-content-between align-items-center p-3 bg-light">
                                        <h6 className="mb-0">
                                            <i className="bi bi-search me-2"></i>
                                            Résultats de recherche pour "{search}" ({resultats.length} produit{resultats.length > 1 ? 's' : ''})
                                        </h6>
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={clearSearch}
                                        >
                                            <i className="bi bi-x-circle me-1"></i>
                                            Effacer
                                        </button>
                                    </div>
                                    <table className="table w-100">
                                        <thead>
                                            <tr>
                                                <th>Nom</th>
                                                <th>Description</th>
                                                <th>Prix d'achat</th>
                                                <th>Prix de vente</th>
                                                <th>Catégorie</th>
                                                <th>Quantité du stock</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {resultats.map((produit) => (
                                                <tr key={produit.id}>
                                                    <td>{produit.nom}</td>
                                                    <td>{produit.description}</td>
                                                    <td>{produit.prixAchat} FCFA</td>
                                                    <td>{produit.prixVente} FCFA</td>
                                                    <td>{produit.categorie?.nom || 'N/A'}</td>
                                                    <td>{produit.quantite}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-outline-primary me-2"
                                                            data-bs-toggle="modal"
                                                            data-bs-target={`#editModal${produit.id}`}
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>

                                                        <button
                                                            className="btn btn-outline-danger"
                                                            data-bs-toggle="modal"
                                                            data-bs-target={`#confirmModal${produit.id}`}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>

                                                        <div
                                                            className="modal fade"
                                                            id={`editModal${produit.id}`}
                                                        >
                                                            <div className="modal-dialog">
                                                                <div className="modal-content">
                                                                    <div
                                                                        className="modal-header"
                                                                        style={{ backgroundColor: "#002050" }}
                                                                    >
                                                                        <h1 className="modal-title fs-5 text-white">
                                                                            Modification d'une produit
                                                                        </h1>
                                                                    </div>
                                                                    <div className="modal-body">
                                                                        <EditProduit
                                                                            onUpdate={updateProduitt}
                                                                            produit={produit}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="modal fade"
                                                            id={`confirmModal${produit.id}`}
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
                                                                            Voulez-vous vraiment supprimer le produit
                                                                            <br />
                                                                            <strong className="text-dark">
                                                                                "{produit.nom}"
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
                                                                            onClick={() => deleteproduitById(produit.id)}
                                                                        >
                                                                            Oui
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <>
                                    {produits.length === 0 ? (
                                        <div className="text-center py-5">
                                            <img
                                                src={EmptyImg}
                                                alt="empty"
                                                style={{ width: "300px" }}
                                            />
                                            <h5 className="mt-3">Aucun produit ajouté pour le moment</h5>
                                        </div>
                                    ) : (
                                        <table className="table w-100">
                                            <thead>
                                                <tr>
                                                    <th>Nom</th>
                                                    <th>Description</th>
                                                    <th>Prix d'achat</th>
                                                    <th>Prix de vente</th>
                                                    <th>Catégorie</th>
                                                    <th>Quantité du stock</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {produits.map((produit) => (
                                                    <tr key={produit.id}>
                                                        <td>{produit.nom}</td>
                                                        <td>{produit.description}</td>
                                                        <td>{produit.prixAchat} FCFA</td>
                                                        <td>{produit.prixVente} FCFA</td>
                                                        <td>{produit.categorie?.nom || 'N/A'}</td>
                                                        <td>{produit.quantite}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-outline-primary me-2"
                                                                data-bs-toggle="modal"
                                                                data-bs-target={`#editModal${produit.id}`}
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </button>

                                                            <button
                                                                className="btn btn-outline-danger"
                                                                data-bs-toggle="modal"
                                                                data-bs-target={`#confirmModal${produit.id}`}
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>

                                                            <div
                                                                className="modal fade"
                                                                id={`editModal${produit.id}`}
                                                            >
                                                                <div className="modal-dialog">
                                                                    <div className="modal-content">
                                                                        <div
                                                                            className="modal-header"
                                                                            style={{ backgroundColor: "#002050" }}
                                                                        >
                                                                            <h1 className="modal-title fs-5 text-white">
                                                                                Modification d'une produit
                                                                            </h1>
                                                                        </div>
                                                                        <div className="modal-body">
                                                                            <EditProduit
                                                                                onUpdate={updateProduitt}
                                                                                produit={produit}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div
                                                                className="modal fade"
                                                                id={`confirmModal${produit.id}`}
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
                                                                                Voulez-vous vraiment supprimer le produit
                                                                                <br />
                                                                                <strong className="text-dark">
                                                                                    "{produit.nom}"
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
                                                                                onClick={() => deleteproduitById(produit.id)}
                                                                            >
                                                                                Oui
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                    {produits.length !== 0 && (
                                        <nav aria-label="Page navigation example">
                                            <ul className="pagination justify-content-center">
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

export default Produit;