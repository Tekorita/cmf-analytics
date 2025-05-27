import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { getFondos } from "../services/api";

export default function SelectorFondo({ agfId, onSelect }) {
  const [fondos, setFondos] = useState([]);

  useEffect(() => {
    if (!agfId) return;

    getFondos().then((data) => {
      const filtrados = data.filter((fondo) => fondo.rut_admin === agfId);
      setFondos(filtrados);
    });
  }, [agfId]);

  return (
    <Autocomplete
      options={fondos}
      getOptionLabel={(option) => option.nombre_fondo}
      onChange={(_, newValue) => onSelect(newValue)}
      renderInput={(params) => (
        <TextField {...params} label="Fondo" variant="outlined" size="small" />
      )}
      sx={{ width: 300 }}
    />
  );
}
