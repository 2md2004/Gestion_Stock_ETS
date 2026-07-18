import api from "./api";

export const getBoutique = async () => {
    const response = await api.get("/boutique");
    return response.data;
};

export const saveBoutique = async (boutique) => {
    const response = await api.put("/boutique", boutique);
    return response.data;
};

export const uploadLogo = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/boutique/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};
