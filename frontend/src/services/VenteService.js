import api from "./api";

export const getVentesPerPage = async (page, size, sortBy, debut = null, fin = null) => {
    const params = { page, size, sortBy };
    if (debut) params.debut = debut;
    if (fin) params.fin = fin;

    const response = await api.get("/ventes", { params });
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

export const rechercherVentes = async (query) => {
    const { data } = await api.get(`/ventes/search`, {
        params: { q: query },
    });
    return data;
};

export const getRapportVentes = async (type, date) => {
    const params = { type };
    if (date) params.date = date;
    const response = await api.get("/ventes/rapport", { params });
    return response.data;
};