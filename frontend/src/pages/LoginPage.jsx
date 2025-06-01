// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import { loginUsuario } from '../services/api';
import 'animate.css';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginUsuario({ username, password });

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("usuario", username);

      onLogin(username);
    } catch (err) {
      setError(err.response?.data?.detail || "Error al iniciar sesión");
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/img/fondo_dashboard.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 10,
      }}
    >
      {/* Logo con animación */}
      <img
        src="/img/logo.gif"
        alt="Logo CMF Analytics"
        style={{ maxWidth: 260, marginBottom: 24 }}
      />

      {/* Formulario con Paper animado */}
      <Paper
        elevation={3}
        className="animate__animated animate__zoomIn animate__delay-1s"
        sx={{
          p: 4,
          width: 280,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Bienvenidos
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Usuario"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            label="Contraseña"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mb: 1 }}
          >
            Ingresar
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
