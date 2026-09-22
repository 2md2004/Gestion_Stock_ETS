import api from "./api";

export const getProduitsPerPage = async (page, size, sortBy, categorieId = null) => {
    const params = { page, size, sortBy };
    if (categorieId) params.categorieId = categorieId;

    const response = await api.get("/produits", { params });
    return response.data;
};

export const getProduitById = async (id) => {
    const response = await api.get(`/produits/${id}`);
    return response.data;
};

export const createProduit = async (produit) => {
    const response = await api.post("/produits", produit);
    return response.data;
};

export const deleteProduit = async (id) => {
    const response = await api.delete(`/produits/${id}`);
    return response.data;
};

export const updateProduit = async (id, produit) => {
    const response = await api.put(`/produits/${id}`, produit);
    return response.data;
};

export const rechercherProduits = async (query, categorieId = null) => {
    const params = { q: query };
    if (categorieId) params.categorieId = categorieId;

    const { data } = await api.get("/produits/search", { params });
    return data;
};

export const getProduitsStockFaible = async (page, size, sortBy) => {
    const response = await api.get("/produits/stock-faible", {
        params: { page, size, sortBy },
    });
    return response.data;
};

export const reapprovisionnementProduit = async (id, reapprovisionnementDto) => {
    const response = await api.patch(
        `/produits/reapprovisionnement/${id}`,
        reapprovisionnementDto
    );
    return response.data;
};