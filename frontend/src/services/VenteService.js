import api from "./api";

export const getVentesPerPage = async (page, size, sortBy) => {
    const response = await api.get(
        `/ventes?page=${page}&size=${size}&sortBy=${sortBy}`
    );
    return response.data;
};

export const getVenteById = async (id) => {
    const response = await api.get(`/ventes/${id}`);
    return response.data;
};

export const createVente = async (vente) => {
    const response = await api.post("/ventes", vente);
    return response.data;
};

export const deleteVente = async (id) => {
    const response = await api.delete(`/ventes/${id}`);
    return response.data;
};

export const updateVente = async (id, vente) => {
    const response = await api.put(`/ventes/${id}`, vente);
    return response.data;
};

export const rechercherVentes = async (query) => {
    const { data } = await api.get(`/ventes/search`, {
        params: { q: query },
    });
    return data;
};