import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import { loginUsuario } from '../services/api';

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
    <Box sx={{
      display: 'flex',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f4f6f8',
    }}>
      <Paper elevation={3} sx={{ p: 4, width: 300 }}>
        <Typography variant="h6" gutterBottom>Iniciar Sesión</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button fullWidth type="submit" variant="contained">
            Entrar
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
