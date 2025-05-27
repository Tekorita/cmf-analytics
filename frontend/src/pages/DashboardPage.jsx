import { Container, Typography, Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { getValoresComparativos } from "../services/api";
import SelectorAgf from "../components/selectorAgf";
import SelectorFondo from "../components/SelectorFondo";
import SelectorSerie from "../components/SelectorSerie";

export default function DashboardPage() {
  const [fechas, setFechas] = useState("");
  const [valores, setValores] = useState(null);
  const [agf, setAgf] = useState(null);
  const [fondo, setFondo] = useState(null);
  const [series, setSeries] = useState([]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard Comparativo de Rentabilidad
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <SelectorAgf onSelect={setAgf} />
        <SelectorFondo agfId={agf?.id} onSelect={setFondo} />
        <SelectorSerie fondoRun={fondo?.run_fondo} onChange={setSeries} />
        <TextField
          label="Fechas (YYYYMMDD, separado por comas)"
          variant="outlined"
          size="small"
          value={fechas}
          onChange={(e) => setFechas(e.target.value)}
          sx={{ width: 300 }}
        />
        <Button
          variant="contained"
          onClick={() => {
            const seriesIds = series.map((s) => s.nombre);
            const fechasList = fechas.split(",").map(f => f.trim());

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
                  stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>

      <Box mt={4}>
        <Typography variant="h6">🥧 Participación final por serie</Typography>
        {valores && (
          <PieChart width={400} height={300}>
            <Pie
              data={Object.entries(valores).map(([serie, data]) => ({
                name: serie,
                value: data[data.length - 1]?.valor_cuota || 0,
              }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {Object.keys(valores).map((_, index) => (
                <Cell key={index} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
              ))}
            </Pie>
          </PieChart>
        )}
      </Box>
    </Container>
  );
}
