import { useState } from "react";

function AddGerant({ onAdd }) {
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        motDePasse: "",
        sexe: "",
        role: "GERANT"
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        setFormData({
            nom: "",
            prenom: "",
            email: "",
            telephone: "",
            motDePasse: "",
            sexe: "",
            role: "GERANT"
        });
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
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label mb-2">Prénom</label>
                <input
                    type="text"
                    className="form-control"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label mb-2">Email</label>
                <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label mb-2">Téléphone</label>
                <input
                    type="tel"
                    className="form-control"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    required
                />
            </div>


            <div className="mb-3">
                <label className="form-label mb-2">Sexe</label>
                <select
                    className="form-control"
                    name="sexe"
                    value={formData.sexe}
                    onChange={handleChange}
                    required
                >
                    <option value="">Sélectionner le sexe</option>
                    <option value="HOMME">Homme</option>
                    <option value="FEMME">Femme</option>
                </select>
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

export default AddGerant;