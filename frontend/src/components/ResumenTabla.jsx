import { Typography, Box } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

export default function ResumenTabla({ data }) {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" gutterBottom>🥧 Resumen de Rentabilidad</Typography>
      <TableContainer component={Paper} sx={{ width: "100%", minWidth: 500 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Serie</strong></TableCell>
              <TableCell align="right">Valor Inicial</TableCell>
              <TableCell align="right">Valor Final</TableCell>
              <TableCell align="right">Rentabilidad %</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(data).map(([serie, valores]) => {
              const inicio = valores[0]?.valor_cuota ?? 0;
              const fin = valores[valores.length - 1]?.valor_cuota ?? 0;
              const rentabilidad = inicio ? (((fin - inicio) / inicio) * 100).toFixed(2) : "0.00";

              return (
                <TableRow key={serie}>
                  <TableCell>{serie}</TableCell>
                  <TableCell align="right">{inicio.toFixed(2)}</TableCell>
                  <TableCell align="right">{fin.toFixed(2)}</TableCell>
                  <TableCell align="right">{rentabilidad}%</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
