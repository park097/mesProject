import { AppBar, Avatar, Badge, Box, IconButton, Toolbar, Typography } from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { DRAWER_WIDTH } from "./Layout";

const TopBar = () => {
  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        ml: `${DRAWER_WIDTH}px`,
        borderBottom: "1px solid #e6e8ef",
        backgroundColor: "#ffffff",
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            border: "1px solid #e0e3eb",
            borderRadius: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: 300,
            color: "#7d879c",
          }}
        >
          <SearchOutlinedIcon fontSize="small" />
          <Typography variant="body2">Search...</Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton size="small">
            <LanguageOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <MenuOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <Badge color="error" variant="dot">
              <NotificationsNoneOutlinedIcon fontSize="small" />
            </Badge>
          </IconButton>
          <Avatar sx={{ width: 30, height: 30 }}>A</Avatar>
          <Typography variant="body2" color="text.secondary">
            Admin
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;

