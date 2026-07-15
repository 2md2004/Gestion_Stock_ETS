import { useState, useEffect } from "react";

function EditCategorie({ onUpdate, categorie }) {
    const [formData, setFormData] = useState({
        nom: categorie.nom,
        description: categorie.description
    });

    useEffect(() => {
        setFormData({
            nom: categorie.nom,
            description: categorie.description
        });
    }, [categorie]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(categorie.id, formData); 
        console.log(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label mb-2">Nom</label>
                <input
                    type="text"
                    className="form-control"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-3">
                <label className="form-label mb-2">Description</label>
                <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
            </div>

            <div className="d-flex justify-content-end gap-2">
                <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                >
                    Annuler
                </button>

                <button
                    type="submit"
                    className="btn text-white"
                    data-bs-dismiss="modal"
                    style={{ backgroundColor: "#002050" }}
                >
                    Enregistrer
                </button>
            </div>
        </form>
    );
}

export default EditCategorie;