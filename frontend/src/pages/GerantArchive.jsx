import { useEffect, useState } from "react";
import { getGerants, getGerantById, updateGerant, activerGerant, archiverGerant, deleteGerant, createGerant, desactiverGerant } from "../services/GerantService";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import EmptyImg from "../assets/Empty (1).gif";
import AddGerant from "../components/AddGerant";
import EditGerant from "../components/EditGerant";

const GerantArchive = () => {
    const [gerants, setGerants] = useState([]);
    const [filteredGerants, setFilteredGerants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const getStatutColor = (etat) => {
        switch (etat) {
            case "ACTIF":
                return { bg: "#DCFCE7", color: "#27A869" };
            case "INACTIF":
                return { bg: "#FEE2E2", color: "#991B1B" };
            case "ARCHIVE":
                return { bg: "#FEF3C7", color: "#92400E" };
            default:
                return { bg: "#F3F4F6", color: "#374151" };
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

                <div className="col-md-12 mt-3 shadow-sm p-0">
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
                                <table className="table w-100 mb-0">
                                    <thead>
                                        <tr>
                                            <th>Gérant</th>
                                            <th>Email</th>
                                            <th>Téléphone</th>
                                            <th>Sexe</th>
                                            <th>Statut</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredGerants.map((gerant) => (
                                            <tr key={gerant.id}>
                                                <td>{gerant.prenom} {gerant.nom}</td>
                                                <td>{gerant.email}</td>
                                                <td>{gerant.telephone}</td>
                                                <td>{gerant.sexe}</td>
                                                <td>
                                                    {gerant.etat ? (
                                                        <span
                                                            className="badge text-lowercase"
                                                            style={{
                                                                background: getStatutColor(gerant.etat).bg,
                                                                color: getStatutColor(gerant.etat).color,
                                                                fontSize: 11,
                                                                borderRadius: 10
                                                            }}
                                                        >
                                                            {gerant.etat}
                                                        </span>
                                                    ) : (
                                                        <span className="text-secondary">—</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-outline-primary me-1"
                                                        data-bs-toggle="modal"
                                                        data-bs-target={`#editModal${gerant.id}`}
                                                        title="Modifier"
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>

                                                    {gerant.etat === "ACTIF" ? (
                                                        <>
                                                            <button
                                                                className="btn btn-outline-warning me-1"
                                                                onClick={() => desactiverGerantById(gerant.id)}
                                                                title="Désactiver"
                                                            >
                                                                <i className="bi bi-pause-circle"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-secondary me-1"
                                                                onClick={() => archiverGerantById(gerant.id)}
                                                                title="Archiver"
                                                            >
                                                                <i className="bi bi-archive"></i>
                                                            </button>
                                                        </>
                                                    ) : gerant.etat === "INACTIF" ? (
                                                        <>
                                                            <button
                                                                className="btn btn-outline-success me-1"
                                                                onClick={() => activerGerantById(gerant.id)}
                                                                title="Activer"
                                                            >
                                                                <i className="bi bi-check-circle"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-secondary me-1"
                                                                onClick={() => archiverGerantById(gerant.id)}
                                                                title="Archiver"
                                                            >
                                                                <i className="bi bi-archive"></i>
                                                            </button>
                                                        </>
                                                    ) : gerant.etat === "ARCHIVE" ? (
                                                        <button
                                                            className="btn btn-outline-success me-1"
                                                            onClick={() => activerGerantById(gerant.id)}
                                                            title="Activer"
                                                        >
                                                            <i className="bi bi-check-circle"></i>
                                                        </button>
                                                    ) : null}

                                                    <button
                                                        className="btn btn-outline-danger"
                                                        data-bs-toggle="modal"
                                                        data-bs-target={`#confirmModal${gerant.id}`}
                                                        title="Supprimer"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>

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
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GerantArchive;