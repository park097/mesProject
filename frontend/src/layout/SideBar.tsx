import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import FactoryOutlinedIcon from "@mui/icons-material/FactoryOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { DRAWER_WIDTH } from "./Layout";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    { text: "Dashboard", path: "/", icon: <DashboardOutlinedIcon fontSize="small" /> },
    { text: "Items", path: "/items", icon: <LayersOutlinedIcon fontSize="small" /> },
    { text: "Stocks", path: "/stocks", icon: <Inventory2OutlinedIcon fontSize="small" /> },
    { text: "Productions", path: "/productions", icon: <FactoryOutlinedIcon fontSize="small" /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        [`& .MuiDrawer-paper`]: {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          borderRight: "1px solid #e6e8ef",
          backgroundColor: "#ffffff",
        },
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#4f5bd5" }}>
            Mini MES
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Admin Panel
          </Typography>
        </Box>
      </Toolbar>
      <List sx={{ px: 1.2 }}>
        {menus.map((menu) => (
          <ListItemButton
            key={menu.text}
            selected={location.pathname === menu.path}
            onClick={() => navigate(menu.path)}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>{menu.icon}</ListItemIcon>
            <ListItemText primary={menu.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default SideBar;

