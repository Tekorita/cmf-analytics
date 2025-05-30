import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Box,
  Divider,
  Typography,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

export default function Sidebar({ usuario, onLogout }) {
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
          justifyContent: 'space-between'
        },
      }}
    >
      <Box>
        <Toolbar />
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/dashboard_page">
              <ListItemText primary="Dashboard Comparativo" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/ranking_page">
              <ListItemText primary="Ranking Mensual" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/alertas_page">
              <ListItemText primary="Alertas e Insights" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 1 }} />
        <Typography variant="body2" color="textSecondary">
          Sesión: <strong>{usuario}</strong>
        </Typography>
        <Button variant="outlined" size="small" onClick={onLogout} fullWidth sx={{ mt: 1 }}>
          Cerrar sesión
        </Button>
      </Box>
    </Drawer>
  );
}
