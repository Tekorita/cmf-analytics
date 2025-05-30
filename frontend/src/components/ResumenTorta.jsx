import React from "react";
import { Typography, Box } from "@mui/material";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

export default function ResumenTorta({ valores }) {
  if (!valores) return null;

  const data = Object.entries(valores).map(([serie, puntos]) => ({
    name: serie,
    value: puntos[puntos.length - 1]?.valor_cuota || 0,
  }));

  const total = data.reduce((acc, item) => acc + item.value, 0);

  const dataConPorcentaje = data.map((item) => ({
    ...item,
    name: `${item.name} (${((item.value / total) * 100).toFixed(2)}%)`,
  }));

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Box sx={{ gap: 4 }}>
        <Typography variant="h6" gutterBottom>🥧 Participación final por serie</Typography>
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
            <Pie
                data={dataConPorcentaje}
                dataKey="value"
                nameKey="name"
                cx="40%"
                cy="50%"
                outerRadius="80%"
            >
                {dataConPorcentaje.map((_, index) => (
                <Cell
                    key={index}
                    fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                />
                ))}
            </Pie>
            <Tooltip />
            <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
            />
            </PieChart>
        </ResponsiveContainer>
      </Box>
    </div>
  );
}
