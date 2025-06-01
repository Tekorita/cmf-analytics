import { Container, Typography, Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import '../styles/estilos.css';
import { getValoresComparativos } from "../services/api";
import SelectorAdministradora from "../components/SelectorAdministradora";
import SelectorFondo from "../components/SelectorFondo";
import SelectorSerie from "../components/SelectorSerie";
import ResumenTabla from "../components/ResumenTabla";
import ResumenTorta from "../components/ResumenTorta";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function DashboardPage() {
  const [fechas, setFechas] = useState([dayjs()]);
  const [valores, setValores] = useState(null);
  const [agf, setAgf] = useState(null);
  const [fondo, setFondo] = useState(null);
  const [series, setSeries] = useState([]);

  const handleFechaChange = (value, index) => {
    const nuevasFechas = [...fechas];
    nuevasFechas[index] = value;
    setFechas(nuevasFechas);
  };

  const agregarFecha = () => setFechas([...fechas, dayjs()]);

  return (
    <Container maxWidth="lg" className="animate__animated animate__fadeIn" style={{ animationDelay: '0.2s' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#13274d' }}>
       📊 Dashboard Comparativo de Rentabilidad
      </Typography>

      <Box className="filtros-container" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <SelectorAdministradora onSelect={setAgf} />
        <SelectorFondo agfNombre={agf?.nombre} onSelect={setFondo} />
        <SelectorSerie fondoRun={fondo?.run_fondo} onChange={setSeries} />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {fechas.map((fecha, index) => (
            <DatePicker
              key={index}
              label={`Fecha ${index + 1}`}
              value={fecha}
              format="YYYYMMDD"
              onChange={(newValue) => handleFechaChange(newValue, index)}
              // slotProps={{ textField: { size: "small" } }}
              slotProps={{
                textField: {
                  size: "small",
                  InputProps: {
                    style: {
                      backgroundColor: "white",
                    },
                  },
                },
              }}
            />
          ))}
          <Button variant="outlined" onClick={agregarFecha}>
            + Añadir fecha
          </Button>
        </LocalizationProvider>

        <Button
          variant="contained"
          onClick={() => {
            const seriesIds = series.map((s) => s.nombre);
            const fechasList = fechas.map(f => f.format("YYYYMMDD"));

            getValoresComparativos(seriesIds, fechasList).then(setValores);
          }}
        >
          Comparar
        </Button>
      </Box>

      <Box>
        <Typography variant="h6">📈 Evolución del valor cuota</Typography>
        {valores && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart>
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.entries(valores).map(([serie, data]) => (
                <Line
                  key={serie}
                  dataKey="valor_cuota"
                  name={serie}
                  data={data}
                  stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>

      <Box mt={4}>
        {valores && (
          <Box sx={{ display: "flex", gap: 4 }}>
            {valores && <ResumenTabla data={valores} />}
            {valores && <ResumenTorta valores={valores} />}
          </Box>
        )}
      </Box>
    </Container>
  );
}
