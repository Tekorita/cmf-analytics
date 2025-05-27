import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { getSeries } from "../services/api";

export default function SelectorSerie({ fondoRun, onChange }) {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    if (!fondoRun) return;

    getSeries().then((data) => {
      const filtradas = data.filter((s) => s.run_fondo === fondoRun);
      setSeries(filtradas);
    });
  }, [fondoRun]);

  return (
    <Autocomplete
      multiple
      options={series}
      getOptionLabel={(option) => option.nombre}
      onChange={(_, newValue) => onChange(newValue)}
      renderInput={(params) => (
        <TextField {...params} label="Series" variant="outlined" size="small" />
      )}
      sx={{ width: 400 }}
    />
  );
}
