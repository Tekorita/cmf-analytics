import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { getSeries } from "../services/api";

export default function SelectorSerie({ fondoRun, onChange }) {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fondoRun) {
      setSeries([]);
      return;
    }

    setLoading(true);
    getSeries(fondoRun)
      .then((data) => {
        const seriesFormateadas = data.map(s => ({
          id: s.id,
          nombre: s.nombre
        }));
        setSeries(seriesFormateadas);
      })
      .catch((e) => console.error("❌ Error al cargar series:", e))
      .finally(() => setLoading(false));
  }, [fondoRun]);

  return (
    <Autocomplete
      multiple
      options={series}
      getOptionLabel={(option) => option.nombre}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(_, newValue) => onChange(newValue)}
      loading={loading}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.nombre}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Series" variant="outlined" size="small" />
      )}
      sx={{ width: 300 }}
    />
  );
}
