import api from "./api";


export const getProduitsPerPage = async (page, size, sortBy) => {
    const response = await api.get(
        `/produits?page=${page}&size=${size}&sortBy=${sortBy}`
    );

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

export const updateProduit = async (id,produit) => {
    const response = await api.put(`/produits/${id}`,produit);
    return response.data;
};

export const rechercherProduits = async (query) => {
    const { data } = await api.get(`/produits/search`, {
        params: { q: query },
    });
    return data;
};

export const getProduitsStockFaible = async (page, size, sortBy) => {
    const response = await api.get(
        `/produits/stock-faible?page=${page}&size=${size}&sortBy=${sortBy}`
    );
    return response.data;
};