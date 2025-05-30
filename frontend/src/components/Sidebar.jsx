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
          justifyContent: 'space-between',
          bgcolor: '#13274D',
          color: 'white',
        },
      }}
    >
      <Box>
        <Toolbar sx={{ minHeight: 64 }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/dashboard_page"
              sx={{ color: 'white', justifyContent: 'flex-end' }}
            >
              <ListItemText
                primary="Dashboard Comparativo"
                sx={{ textAlign: 'right' }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/ranking_page"
              sx={{ color: 'white', justifyContent: 'flex-end' }}
            >
              <ListItemText
                primary="Ranking Mensual"
                sx={{ textAlign: 'right' }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/alertas_page"
              sx={{ color: 'white', justifyContent: 'flex-end' }}
            >
              <ListItemText
                primary="Alertas e Insights"
                sx={{ textAlign: 'right' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', textAlign: 'right' }}>
          Sesión: <strong>{usuario}</strong>
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={onLogout}
          fullWidth
          sx={{
            mt: 1,
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
