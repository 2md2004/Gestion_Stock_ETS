import { useState, useEffect } from "react";
import { getCategories } from "../services/categorieService";

function EditProduit({ onUpdate, produit }) {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        nom: produit.nom,
        description: produit.description,
        prixAchat: produit.prixAchat,
        prixVente: produit.prixVente,
        quantite: produit.quantite,
        categorieId: produit.categorie?.id || ""
    });

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategories();
            setCategories(data);
            console.log(data);
        };
        fetchCategories();
    }, []);


    useEffect(() => {
        setFormData({
            nom: produit.nom,
            description: produit.description,
            prixAchat: produit.prixAchat,
            prixVente: produit.prixVente,
            quantite: produit.quantite,
            categorieId: produit.categorie?.id || ""
        });
    }, [produit]); 

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        onUpdate(produit.id, formData);
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

            <div className="d-flex justify-content-between">
                <div className="mb-3">
                    <label className="form-label mb-2">Prix Achat</label>
                    <input
                        type="number"
                        className="form-control"
                        name="prixAchat"
                        value={formData.prixAchat}
                        onChange={handleChange}
                    />
                </div>
               
                <div className="mb-3">
                    <label className="form-label mb-2">Prix de Vente</label>
                    <input
                        type="number"
                        className="form-control"
                        name="prixVente"
                        value={formData.prixVente}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label mb-2">Quantité</label>
                <input
                    type="number"
                    className="form-control"
                    name="quantite"
                    value={formData.quantite}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-3">
                <label className="form-label mb-2">Catégorie</label>
                <select
                    className="form-select"
                    name="categorieId"
                    value={formData.categorieId}
                    onChange={handleChange}
                >
                    <option value="">-- Choisir une catégorie --</option>
                    {categories.map((categorie) => (
                        <option key={categorie.id} value={categorie.id}>
                            {categorie.nom}
                        </option>
                    ))}
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

export default EditProduit;