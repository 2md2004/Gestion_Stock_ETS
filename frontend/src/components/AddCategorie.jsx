import { useState } from "react";

function AddCategorie({ onAdd }) {

    const [formData, setFormData] = useState({
        nom: "",
        description: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData); 
        setFormData({ nom: "", description: "" }); 
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

export default AddCategorie;