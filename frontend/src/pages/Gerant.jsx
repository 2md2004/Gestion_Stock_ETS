import { useEffect, useState } from "react";
import { getGerants, getGerantById, updateGerant, activerGerant, archiverGerant, deleteGerant, createGerant, desactiverGerant } from "../services/GerantService";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import EmptyImg from "../assets/Empty (1).gif";
import AddGerant from "../components/AddGerant";
import EditGerant from "../components/EditGerant";

const Gerant = () => {
    const [gerants, setGerants] = useState([]);
    const [filteredGerants, setFilteredGerants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const getStatutInfo = (etat) => {
        switch (etat) {
            case "ACTIF":
                return {
                    bg: "#DCFCE7",
                    color: "#27A869",
                    label: "Actif",
                    border: "1px solid #27A869",
                    icon: "bi bi-check-circle-fill"
                };
            case "INACTIF":
                return {
                    bg: "#FEE2E2",
                    color: "#991B1B",
                    label: "Inactif",
                    border: "1px solid #991B1B",
                    icon: "bi bi-pause-circle-fill"
                };
            case "ARCHIVE":
                return {
                    bg: "#FEF3C7",
                    color: "#92400E",
                    label: "Archivé",
                    border: "1px solid #92400E",
                    icon: "bi bi-archive-fill"
                };
            default:
                return {
                    bg: "#F3F4F6",
                    color: "#374151",
                    label: "Inconnu",
                    border: "1px solid #374151",
                    icon: "bi bi-question-circle-fill"
                };
        }
    };

    const getAllGerants = async () => {
        try {
            setLoading(true);
            const data = await getGerants();
            setGerants(data);
            setFilteredGerants(data);
            console.log(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        if (term === "") {
            setFilteredGerants(gerants);
        } else {
            const filtered = gerants.filter((gerant) =>
                gerant.nom?.toLowerCase().includes(term) ||
                gerant.prenom?.toLowerCase().includes(term) ||
                gerant.email?.toLowerCase().includes(term) ||
                gerant.telephone?.includes(term) ||
                gerant.id?.toString().includes(term)
            );
            setFilteredGerants(filtered);
        }
    };

    const addGerant = async (gerant) => {
        try {
            setLoading(true);
            await createGerant(gerant);
            toast.success("Gérant ajouté avec succès");
            getAllGerants();
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Erreur lors de l'ajout"
            );
        } finally {
            setLoading(false);
        }
    };

    const updateGerantt = async (id, gerant) => {
        try {
            setLoading(true);
            await updateGerant(id, gerant);
            toast.success("Gérant modifié avec succès");
            getAllGerants();
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Erreur lors de la modification"
            );
        } finally {
            setLoading(false);
        }
    };

    const deleteGerantById = async (id) => {
        try {
            setLoading(true);
            await deleteGerant(id);
            toast.success("Gérant supprimé avec succès");
            getAllGerants();
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Erreur lors de la suppression"
            );
        } finally {
            setLoading(false);
        }
    };

    const activerGerantById = async (id) => {
        try {
            setLoading(true);
            await activerGerant(id);
            toast.success("Gérant activé avec succès");
            getAllGerants();
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Erreur lors de l'activation"
            );
        } finally {
            setLoading(false);
        }
    };

    const archiverGerantById = async (id) => {
        try {
            setLoading(true);
            await archiverGerant(id);
            toast.success("Gérant archivé avec succès");
            getAllGerants();
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Erreur lors de l'archivage"
            );
        } finally {
            setLoading(false);
        }
    };

    const desactiverGerantById = async (id) => {
        try {
            setLoading(true);
            await desactiverGerant(id);
            toast.success("Gérant désactivé avec succès");
            getAllGerants();
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Erreur lors de la désactivation"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllGerants();
    }, []);

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="search-box" style={{ position: 'relative', width: '300px' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Rechercher un gérant..."
                                value={searchTerm}
                                onChange={handleSearch}
                                style={{ paddingLeft: '40px' }}
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
                            {searchTerm && (
                                <button
                                    className="btn btn-link"
                                    style={{
                                        position: 'absolute',
                                        right: '5px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        textDecoration: 'none',
                                        color: '#6c757d'
                                    }}
                                    onClick={() => {
                                        setSearchTerm("");
                                        setFilteredGerants(gerants);
                                    }}
                                >
                                    <i className="bi bi-x-circle"></i>
                                </button>
                            )}
                        </div>

                        <button
                            className="btn text-white"
                            data-bs-toggle="modal"
                            data-bs-target="#addModal"
                            style={{ backgroundColor: "#002050" }}
                        >
                            <i className="bi bi-plus-circle me-2"></i>
                            Nouveau Gérant
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
                                        Nouveau Gérant
                                    </h1>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <AddGerant onAdd={addGerant} />
                                </div>
                            </div>
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
                            <p>Chargement des données...</p>
                        </div>
                    ) : (
                        <div className="w-100" style={{ borderRadius: "10px", overflow: "hidden" }}>
                            {filteredGerants.length === 0 ? (
                                <div className="text-center py-5">
                                    <img
                                        src={EmptyImg}
                                        alt="empty"
                                        style={{ width: "300px" }}
                                    />
                                    <h5 className="mt-3">
                                        {searchTerm ? "Aucun gérant trouvé" : "Aucun gérant disponible"}
                                    </h5>
                                    {searchTerm && (
                                        <p className="text-muted">
                                            Aucun résultat pour "{searchTerm}"
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="py-3 ps-4">Gérant</th>
                                                <th className="py-3">Email</th>
                                                <th className="py-3">Téléphone</th>
                                                <th className="py-3">Sexe</th>
                                                <th className="py-3">Statut</th>
                                                <th className="py-3 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredGerants.map((gerant) => {
                                                const statutInfo = getStatutInfo(gerant.etat);
                                                return (
                                                    <tr key={gerant.id} className="border-bottom">
                                                        <td className="ps-4">
                                                            <div className="d-flex align-items-center">
                                                                <div 
                                                                    className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                                                    style={{
                                                                        width: "40px",
                                                                        height: "40px",
                                                                        backgroundColor: "#E8F0FE",
                                                                        color: "#002050",
                                                                        fontWeight: "600",
                                                                        fontSize: "14px"
                                                                    }}
                                                                >
                                                                    {gerant.prenom?.charAt(0)}{gerant.nom?.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="fw-semibold">{gerant.prenom} {gerant.nom}</div>
                                                                    <small className="text-muted">ID: {gerant.id}</small>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <i className="bi bi-envelope me-2 text-muted"></i>
                                                                {gerant.email}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <i className="bi bi-phone me-2 text-muted"></i>
                                                                {gerant.telephone}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className="text-capitalize">
                                                                {gerant.sexe?.toLowerCase()}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {gerant.etat ? (
                                                                <span
                                                                    className="badge px-3 py-2"
                                                                    style={{
                                                                        backgroundColor: statutInfo.bg,
                                                                        color: statutInfo.color,
                                                                        border: statutInfo.border,
                                                                        borderRadius: "20px",
                                                                        fontSize: "12px",
                                                                        fontWeight: "600",
                                                                        display: "inline-flex",
                                                                        alignItems: "center",
                                                                        gap: "6px",
                                                                        minWidth: "80px",
                                                                        justifyContent: "center",
                                                                        whiteSpace: "nowrap"
                                                                    }}
                                                                >
                                                                    <i className={statutInfo.icon} style={{ fontSize: "12px" }}></i>
                                                                    <span>{statutInfo.label}</span>
                                                                </span>
                                                            ) : (
                                                                <span className="text-secondary">—</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-center gap-1">
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target={`#editModal${gerant.id}`}
                                                                    title="Modifier"
                                                                    style={{ width: "32px", height: "32px", padding: 0 }}
                                                                >
                                                                    <i className="bi bi-pencil"></i>
                                                                </button>

                                                                {gerant.etat === "ACTIF" ? (
                                                                    <>
                                                                        <button
                                                                            className="btn btn-sm btn-outline-warning"
                                                                            onClick={() => desactiverGerantById(gerant.id)}
                                                                            title="Désactiver"
                                                                            style={{ width: "32px", height: "32px", padding: 0 }}
                                                                        >
                                                                            <i className="bi bi-pause-circle"></i>
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-sm btn-outline-secondary"
                                                                            onClick={() => archiverGerantById(gerant.id)}
                                                                            title="Archiver"
                                                                            style={{ width: "32px", height: "32px", padding: 0 }}
                                                                        >
                                                                            <i className="bi bi-archive"></i>
                                                                        </button>
                                                                    </>
                                                                ) : gerant.etat === "INACTIF" ? (
                                                                    <>
                                                                        <button
                                                                            className="btn btn-sm btn-outline-success"
                                                                            onClick={() => activerGerantById(gerant.id)}
                                                                            title="Activer"
                                                                            style={{ width: "32px", height: "32px", padding: 0 }}
                                                                        >
                                                                            <i className="bi bi-check-circle"></i>
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-sm btn-outline-secondary"
                                                                            onClick={() => archiverGerantById(gerant.id)}
                                                                            title="Archiver"
                                                                            style={{ width: "32px", height: "32px", padding: 0 }}
                                                                        >
                                                                            <i className="bi bi-archive"></i>
                                                                        </button>
                                                                    </>
                                                                ) : gerant.etat === "ARCHIVE" ? (
                                                                    <button
                                                                        className="btn btn-sm btn-outline-success"
                                                                        onClick={() => activerGerantById(gerant.id)}
                                                                        title="Activer"
                                                                        style={{ width: "32px", height: "32px", padding: 0 }}
                                                                    >
                                                                        <i className="bi bi-check-circle"></i>
                                                                    </button>
                                                                ) : null}

                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target={`#confirmModal${gerant.id}`}
                                                                    title="Supprimer"
                                                                    style={{ width: "32px", height: "32px", padding: 0 }}
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            </div>

                                                            {/* Edit Modal */}
                                                            <div
                                                                className="modal fade"
                                                                id={`editModal${gerant.id}`}
                                                            >
                                                                <div className="modal-dialog">
                                                                    <div className="modal-content">
                                                                        <div
                                                                            className="modal-header"
                                                                            style={{ backgroundColor: "#002050" }}
                                                                        >
                                                                            <h1 className="modal-title fs-5 text-white">
                                                                                Modification d'un gérant
                                                                            </h1>
                                                                            <button
                                                                                type="button"
                                                                                className="btn-close btn-close-white"
                                                                                data-bs-dismiss="modal"
                                                                            ></button>
                                                                        </div>
                                                                        <div className="modal-body">
                                                                            <EditGerant
                                                                                onUpdate={updateGerantt}
                                                                                gerant={gerant}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Delete Confirmation Modal */}
                                                            <div
                                                                className="modal fade"
                                                                id={`confirmModal${gerant.id}`}
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
                                                                                Voulez-vous vraiment supprimer le gérant
                                                                                <br />
                                                                                <strong className="text-dark">
                                                                                    "{gerant.nom} {gerant.prenom}"
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
                                                                                onClick={() => deleteGerantById(gerant.id)}
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Gerant;