import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { getFondos } from "../services/api";

export default function SelectorAgf({ onSelect }) {
  const [agfs, setAgfs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getFondos().then((data) => {
      const agfsUnicos = Array.from(
        new Map(
          data.map((fondo) => [fondo.rut_admin, {
            id: fondo.rut_admin,
            nombre: fondo.nombre_admin,
          }])
        ).values()
      );
      setAgfs(agfsUnicos);
      setLoading(false);
    });
  }, []);

  return (
    <Autocomplete
      options={agfs}
      getOptionLabel={(option) => option.nombre}
      onChange={(_, newValue) => onSelect(newValue)}
      loading={loading}
      renderInput={(params) => (
        <TextField {...params} label="Administradora" variant="outlined" size="small" />
      )}
      sx={{ width: 300 }}
    />
  );
}
