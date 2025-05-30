import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import RankingPage from '../pages/RankingPage';
import AlertasPage from '../pages/AlertasPage';
import Sidebar from '../components/Sidebar';
import LoginPage from '../pages/LoginPage';
import PrivateRoute from './PrivateRoute';
import { Box, Toolbar, Snackbar, Alert } from '@mui/material';
import { setCerrarSesionConMensajeCallback } from '../services/api';

export default function AppRoutes() {
  const [usuario, setUsuario] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(usuarioGuardado);
    }

    setCerrarSesionConMensajeCallback(() => {
      setSnackbarOpen(true);
      handleLogout();
    });
  }, []);

  const handleLogin = (username) => {
    localStorage.setItem("usuario", username);
    setUsuario(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUsuario(null);
  };

  return (
    <Router>
      {usuario ? (
        <Box sx={{ display: 'flex' }}>
          <Sidebar usuario={usuario} onLogout={handleLogout} />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Routes>
              <Route
                path="/dashboard_page"
                element={
                  <PrivateRoute usuario={usuario}>
                    <DashboardPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ranking_page"
                element={
                  <PrivateRoute usuario={usuario}>
                    <RankingPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/alertas_page"
                element={
                  <PrivateRoute usuario={usuario}>
                    <AlertasPage />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard_page" replace />} />
            </Routes>
          </Box>
        </Box>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="warning" onClose={() => setSnackbarOpen(false)}>
          ⚠️ Sesión expirada. Inicia sesión nuevamente.
        </Alert>
      </Snackbar>
    </Router>
  );
}
