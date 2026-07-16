import api from "./api";

export const getRapportVentes = async (type, date) => {
  const params = { type };
  if (date) params.date = date;
  const response = await api.get("/ventes/rapport", { params });
  return response.data;
};