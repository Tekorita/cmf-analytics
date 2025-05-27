import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

export const getFondos = async () => {
  const res = await axios.get(`${BASE_URL}/fondos/`);
  return res.data;
};

export const getSeries = async () => {
  const res = await axios.get(`${BASE_URL}/series/`);
  return res.data;
};

export const getValoresComparativos = async (series, fechas) => {
  const res = await axios.get(`${BASE_URL}/valores_comparativos/`, {
    params: { series: series.join(","), fechas: fechas.join(",") },
  });
  return res.data;
};
