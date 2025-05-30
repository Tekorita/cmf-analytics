import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { getFondos } from "../services/api";

export default function SelectorFondo({ agfNombre, onSelect }) {
  const [fondos, setFondos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!agfNombre) return;

    setLoading(true);
    getFondos()
      .then((data) => {
        const filtrados = data.filter(
          (f) => f.administradora__nombre === agfNombre
        );

        setFondos(filtrados);
      })
      .catch((e) => console.error("❌ Error cargando fondos:", e))
      .finally(() => setLoading(false));
  }, [agfNombre]);

  return (
    <Autocomplete
      options={fondos}
      getOptionLabel={(option) => option.nombre}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(_, newValue) => onSelect(newValue)}
      loading={loading}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.nombre}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Fondo" variant="outlined" size="small" />
      )}
      sx={{ width: 300 }}
    />
  );
}
