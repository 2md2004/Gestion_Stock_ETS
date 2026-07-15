import api from "./api";


export const getStatitisques = async () => {
    const response = await api.get("/dashboard");
    return response.data;
};