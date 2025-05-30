import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { getFondos } from "../services/api";

export default function SelectorAdministradora({ onSelect }) {
  const [agfs, setAgfs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("✅ Montando componente SelectorAdministradora");
  
    setLoading(true);
    getFondos()
      .then((data) => {
        console.log("📦 Fondos recibidos:", data);
  
        const agfsFiltradas = data
          .filter(f => f.administradora__nombre)
          .map(f => ({
            id: f.administradora__nombre,
            nombre: f.administradora__nombre
          }));
  
        const agfsUnicas = Array.from(
          new Map(agfsFiltradas.map(a => [a.id, a])).values()
        );
  
        console.log("✅ AGFs únicas:", agfsUnicas);
        setAgfs(agfsUnicas);
      })
      .catch((e) => console.error("❌ Error cargando AGFs:", e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Autocomplete
      options={agfs}
      loading={loading}
      onChange={(_, newValue) => onSelect(newValue)}
      getOptionLabel={(option) => {
        if (!option || typeof option !== "object") return "";
        return option.nombre || "";
      }}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Administradora"
          variant="outlined"
          size="small"
        />
      )}
      sx={{ width: 300 }}
    />
  );
}
