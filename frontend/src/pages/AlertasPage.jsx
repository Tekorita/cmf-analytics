// src/pages/AlertasPage.jsx
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  TextField,
  MenuItem,
  Button,
  Stack
} from '@mui/material';
import { getAlertas } from '../services/api';
import SelectorAdministradora from '../components/SelectorAdministradora';
import SelectorFondo from '../components/SelectorFondo';

const meses = [
  { label: 'Enero', value: 1 }, { label: 'Febrero', value: 2 }, { label: 'Marzo', value: 3 },
  { label: 'Abril', value: 4 }, { label: 'Mayo', value: 5 }, { label: 'Junio', value: 6 },
  { label: 'Julio', value: 7 }, { label: 'Agosto', value: 8 }, { label: 'Septiembre', value: 9 },
  { label: 'Octubre', value: 10 }, { label: 'Noviembre', value: 11 }, { label: 'Diciembre', value: 12 }
];

export default function AlertasPage() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [anioInicio, setAnioInicio] = useState(2024);
  const [mesInicio, setMesInicio] = useState(1);
  const [anioFin, setAnioFin] = useState(2024);
  const [mesFin, setMesFin] = useState(4);
  const [agf, setAgf] = useState('');
  const [fondo, setFondo] = useState('');

  useEffect(() => {
    setFondo('');
  }, [agf]);

  const formatFecha = (anio, mes) => {
    return `${anio}${mes.toString().padStart(2, '0')}01`;
  };

  const handleBuscar = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAlertas({
        fecha_inicio: formatFecha(anioInicio, mesInicio),
        fecha_fin: formatFecha(anioFin, mesFin),
        agf,
        fondo,
        page: 1,
        page_size: 50
      });
      setAlertas(data);
    } catch (err) {
      setError("Error al cargar las alertas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        🔔 Alertas e Insights Automáticos
      </Typography>

      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', mb: 3 }}>
        <TextField
          label="Año Inicio"
          type="number"
          value={anioInicio}
          onChange={(e) => setAnioInicio(Number(e.target.value))}
        />
        <TextField
          select
          label="Mes Inicio"
          value={mesInicio}
          onChange={(e) => setMesInicio(Number(e.target.value))}
        >
          {meses.map((m) => (
            <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Año Fin"
          type="number"
          value={anioFin}
          onChange={(e) => setAnioFin(Number(e.target.value))}
        />
        <TextField
          select
          label="Mes Fin"
          value={mesFin}
          onChange={(e) => setMesFin(Number(e.target.value))}
        >
          {meses.map((m) => (
            <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
          ))}
        </TextField>
        <SelectorAdministradora onSelect={setAgf} />
        <SelectorFondo agfNombre={agf?.nombre} onSelect={setFondo} />
        <Button variant="contained" onClick={handleBuscar}>
          Buscar
        </Button>
      </Stack>

      {loading && <CircularProgress />} 
      {error && <Alert severity="error">{error}</Alert>}

      {alertas.map((alerta, index) => (
        <Alert key={index} severity={alerta.nivel || 'info'} sx={{ mb: 2 }}>
          {alerta.mensaje}
        </Alert>
      ))}
    </Box>
  );
}
