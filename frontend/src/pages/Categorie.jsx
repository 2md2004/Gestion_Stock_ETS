import { useEffect, useState } from "react";
import { getCategories, createCategorie, deleteCategorie, updateCategorie } from "../services/CategorieService";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import EmptyImg from "../assets/Empty (1).gif";
import EditCategorie from "../components/EditCategorie";
import AddCategorie from "../components/AddCategorie";

const Categorie = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getAllCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
      setFilteredCategories(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de recherche
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((categorie) =>
        categorie.nom?.toLowerCase().includes(term) ||
        categorie.description?.toLowerCase().includes(term) ||
        categorie.id?.toString().includes(term)
      );
      setFilteredCategories(filtered);
    }
  };

  const addCategorie = async (categorie) => {
    try {
      setLoading(true);
      await createCategorie(categorie);
      toast.success("Catégorie ajoutée avec succès");
      getAllCategories();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Erreur lors de l'ajout"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateCategoriee = async (id, categorie) => {
    try {
      setLoading(true);
      await updateCategorie(id, categorie);
      toast.success("Catégorie modifiée avec succès");
      getAllCategories();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Erreur lors de la modification"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteCategorieById = async (id) => {
    try {
      setLoading(true);
      await deleteCategorie(id);
      toast.success("Catégorie supprimée avec succès");
      getAllCategories();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Erreur lors de la suppression"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          {/* Barre de recherche */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="search-box" style={{ position: 'relative', width: '300px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher une catégorie..."
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
                    setFilteredCategories(categories);
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
              Nouvelle catégorie
            </button>
          </div>

          {/* Modals... (keep your existing modals) */}
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
                    Ajout d'une categorie
                  </h1>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <AddCategorie onAdd={addCategorie} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12 mt-3 shadow-sm bg-white p-0" style={{ borderRadius: "10px" }}>
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
              {filteredCategories.length === 0 ? (
                <div className="text-center py-5">
                  <img
                    src={EmptyImg}
                    alt="empty"
                    style={{ width: "300px" }}
                  />
                  <h5 className="mt-3">
                    {searchTerm ? "Aucune catégorie trouvée" : "Aucune catégorie disponible"}
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
                        <th className="py-3 ps-4">Id</th>
                        <th className="py-3">Nom</th>
                        <th className="py-3">Description</th>
                        <th className="py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategories.map((categorie) => (
                        <tr key={categorie.id} className="border-bottom">
                          <td className="ps-4">{categorie.id}</td>
                          <td>{categorie.nom}</td>
                          <td>{categorie.description || "Non specifiée"}</td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-1">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                data-bs-toggle="modal"
                                data-bs-target={`#editModal${categorie.id}`}
                                title="Modifier"
                                style={{ width: "32px", height: "32px", padding: 0 }}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>

                              <button
                                className="btn btn-sm btn-outline-danger"
                                data-bs-toggle="modal"
                                data-bs-target={`#confirmModal${categorie.id}`}
                                title="Supprimer"
                                style={{ width: "32px", height: "32px", padding: 0 }}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>

                            {/* Edit Modal */}
                            <div
                              className="modal fade"
                              id={`editModal${categorie.id}`}
                            >
                              <div className="modal-dialog">
                                <div className="modal-content">
                                  <div
                                    className="modal-header"
                                    style={{ backgroundColor: "#002050" }}
                                  >
                                    <h1 className="modal-title fs-5 text-white">
                                      Modification d'une categorie
                                    </h1>
                                    <button
                                      type="button"
                                      className="btn-close btn-close-white"
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                    ></button>
                                  </div>
                                  <div className="modal-body">
                                    <EditCategorie
                                      onUpdate={updateCategoriee}
                                      categorie={categorie}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Delete Confirmation Modal */}
                            <div
                              className="modal fade"
                              id={`confirmModal${categorie.id}`}
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
                                      Voulez-vous vraiment supprimer la catégorie
                                      <br />
                                      <strong className="text-dark">
                                        "{categorie.nom}"
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
                                      onClick={() => deleteCategorieById(categorie.id)}
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
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categorie;