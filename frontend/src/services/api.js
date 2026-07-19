import axios from "axios";
import { API_URL } from "../constants/server";


const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json'
    }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    console.log(`📋 Traitement de la file d'attente (${failedQueue.length} requête(s) en attente)`, error ? '❌ échec' : '✅ succès');
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve();
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        console.log('⚠️ Erreur interceptée:', {
            url: originalRequest?.url,
            status: error.response?.status,
            retry: originalRequest?._retry
        });

        if (error.response && originalRequest.url.includes('/refresh-token')) {
            console.log('🔒 Le refresh-token lui-même a échoué → déconnexion définitive');
            sessionStorage.clear();
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }

        // ✅ MODIF : 401 OU 403 déclenchent maintenant tous les deux une tentative de refresh
        if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {

            if (isRefreshing) {
                console.log('⏳ Un refresh est déjà en cours, mise en file d\'attente:', originalRequest.url);
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        console.log('▶️ Requête rejouée depuis la file d\'attente:', originalRequest.url);
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            console.log('🔄 Déclenchement de /refresh-token pour:', originalRequest.url);

            try {
                const refreshResponse = await api.post('refresh-token');
                console.log('✅ /refresh-token réussi:', refreshResponse.status);
                processQueue(null);
               
                return api(originalRequest);
            } catch (refreshError) {
                
                processQueue(refreshError);
                sessionStorage.clear();
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;