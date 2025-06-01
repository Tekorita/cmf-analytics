import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Toolbar,
  Box,
  Divider,
  Typography,
  Button,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon     from '@mui/icons-material/Dashboard';
import BarChartIcon      from '@mui/icons-material/BarChart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import 'animate.css';

const drawerWidth = 240;

export default function Sidebar({ usuario, onLogout }) {
  const location = useLocation();

  const menuItems = [
    { text: 'Rentabilidades',     icon: <DashboardIcon fontSize="small" />,    path: '/dashboard_page' },
    { text: 'Ranking Mensual',    icon: <BarChartIcon  fontSize="small" />,    path: '/ranking_page'   },
    { text: 'Alertas e Insights', icon: <NotificationsIcon fontSize="small" />,path: '/alertas_page'   },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#13274D',
          color: 'white',
        },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          width: '100%',
          bgcolor: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 2,
        }}
      >
        <img src="/img/logo.gif" alt="Logo" style={{ width: 100 }} />
      </Box>

      {/* Menú */}
      <Box className="animate__animated animate__slideInLeft" sx={{ flexGrow: 1 }}>
        <List sx={{ mt: 1 }}>
          {menuItems.map(({ text, icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <ListItem key={path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={path}
                  sx={{
                    justifyContent: 'flex-end',          // Empuja el bloque al borde derecho
                    px: 2,
                    color: 'white',
                    bgcolor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  }}
                >
                  {/* Icono + texto juntos */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {icon}
                    <Typography
                      variant="body2"
                      sx={{ fontSize: '1rem', fontWeight: isActive ? 'bold' : 'normal' }}
                    >
                      {text}
                    </Typography>
                  </Box>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />

        {/* Ícono + nombre */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: 'rgba(255,255,255,0.8)', mb: 1 }}>
          <AccountCircleIcon sx={{ mr: 0.5 }} fontSize="small" />
          <Typography variant="body2">
            Sesión:&nbsp;<strong>{usuario}</strong>
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          onClick={onLogout}
          fullWidth
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: '#ffffff',
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          Cerrar sesión
        </Button>
      </Box>
    </Drawer>
  );
}
