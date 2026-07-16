import api from "./api";


export const getGerants = async () => {
    const response = await api.get("/gerants");
    return response.data;
};

export const getGerantById = async (id) => {
    const response = await api.get(`/gerants/${id}`);
    return response.data;
};

export const createGerant = async (gerant) => {
    const response = await api.post("/gerants", gerant);
    return response.data;
};

export const updateGerant = async (id,gerant) => {
    const response = await api.put(`/gerants/${id}`,gerant);
    return response.data;
};

export const archiverGerant = async (id) => {
    const response = await api.patch(`/gerants/archiver/${id}`);
    return response.data;
};

export const activerGerant = async (id) => {
    const response = await api.patch(`/gerants/activer/${id}`);
    return response.data;
};

export const desactiverGerant = async (id) => {
    const response = await api.patch(`/gerants/desactiver/${id}`);
    return response.data;
};


export const deleteGerant = async (id) => {
    const response = await api.delete(`/gerants/${id}`);
    return response.data;
};