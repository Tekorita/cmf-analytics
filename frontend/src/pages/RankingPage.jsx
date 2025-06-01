import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination
} from '@mui/material';
import '../styles/estilos.css';
import { getRankingMensual } from '../services/api';
import SelectorAdministradora from '../components/SelectorAdministradora';

const meses = [
  { label: 'Enero', value: 1 }, { label: 'Febrero', value: 2 }, { label: 'Marzo', value: 3 },
  { label: 'Abril', value: 4 }, { label: 'Mayo', value: 5 }, { label: 'Junio', value: 6 },
  { label: 'Julio', value: 7 }, { label: 'Agosto', value: 8 }, { label: 'Septiembre', value: 9 },
  { label: 'Octubre', value: 10 }, { label: 'Noviembre', value: 11 }, { label: 'Diciembre', value: 12 }
];

export default function RankingPage() {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [agf, setAgf] = useState('');
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleBuscar = async (pagina = 1) => {
    try {
      const response = await getRankingMensual({ anio, mes, agf, page: pagina });
      setData(response.results);
      setTotalPages(response.total_pages);
      setPage(pagina);
    } catch (error) {
      console.error('Error al obtener el ranking mensual:', error);
    }
  };

  useEffect(() => {
    handleBuscar();
  }, []);

  return (
    <Container maxWidth="lg" className="animate__animated animate__fadeIn" style={{ animationDelay: '0.2s' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#13274d' }}>
        📈 Ranking de Fondos por Rentabilidad Mensual
      </Typography>

      <Box className="filtros-container" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <TextField
          label="Año"
          type="number"
          value={anio}
          onChange={(e) => setAnio(Number(e.target.value))}
          size="small"
          sx={{ minWidth: 120, height: 40 }}
          slotProps={{ input: { min: 2000, max: 2100 } }}
        />

        <TextField
          select
          label="Mes"
          value={mes}
          onChange={(e) => setMes(Number(e.target.value))}
          size="small"
          sx={{ minWidth: 140, height: 40 }}
        >
          {meses.map((m) => (
            <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
          ))}
        </TextField>

        <SelectorAdministradora onSelect={setAgf} />

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleBuscar(1)}
          sx={{ height: 40 }}
        >
          Buscar
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Fondo</strong></TableCell>
              <TableCell><strong>Serie</strong></TableCell>
              <TableCell align="right">Rentabilidad (%)</TableCell>
              <TableCell align="right">Inicio</TableCell>
              <TableCell align="right">Fin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.fondo}</TableCell>
                <TableCell>{item.serie}</TableCell>
                <TableCell align="right">{(item.rentabilidad * 100).toFixed(2)}</TableCell>
                <TableCell align="right">{item.inicio}</TableCell>
                <TableCell align="right">{item.fin}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => handleBuscar(value)}
          color="primary"
        />
      </Box>
    </Container>
  );
}
