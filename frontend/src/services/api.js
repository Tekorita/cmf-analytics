import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

// 👇 Callback configurable desde afuera
let cerrarSesionConMensaje = () => {
  console.warn("cerrarSesionConMensaje() no está definido.");
};

export const setCerrarSesionConMensajeCallback = (callback) => {
  cerrarSesionConMensaje = callback;
};

// Instancia base de Axios
const api = axios.create({
  baseURL: BASE_URL,
});

// ✅ Interceptor de requests: agrega el access_token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Interceptor de responses: intenta refrescar token si da 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh_token")
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(`${BASE_URL}/token/refresh/`, {
          refresh: localStorage.getItem("refresh_token"),
        });

        const nuevoAccess = res.data.access;
        localStorage.setItem("access_token", nuevoAccess);

        originalRequest.headers.Authorization = `Bearer ${nuevoAccess}`;
        return api(originalRequest);
      } catch (refreshError) {
        cerrarSesionConMensaje(); // ← ejecuta el callback del frontend
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// --- Servicios ---
export const getFondos = async () => {
  const res = await api.get("/fondos/");
  return res.data;
};

export const getSeries = async (fondoRun) => {
  const res = await api.get("/series/", {
    params: { run_fondo: fondoRun },
  });
  return res.data;
};

export const getValoresComparativos = async (series, fechas) => {
  const res = await api.get("/dashboard/valores_series/", {
    params: { series: series.join(","), fechas: fechas.join(",") },
  });
  return res.data;
};

export const getRankingMensual = async ({ anio, mes, agf, page }) => {
  const params = { anio, mes, page };
  if (agf) params.agf = agf.nombre;

  const res = await api.get("/ranking_mensual/", { params });
  return res.data;
};

export const getAlertas = async ({ fecha_inicio, fecha_fin, agf, fondo, page = 1, page_size = 50 }) => {
  const res = await api.get("/insights/", {
    params: {
      fecha_inicio,
      fecha_fin,
      agf,
      fondo,
      page,
      page_size
    },
  });
  return res.data;
};

export const loginUsuario = async ({ username, password }) => {
  const res = await axios.post(`${BASE_URL}/token/`, {
    username,
    password
  });
  return res.data; // { access, refresh }
};
