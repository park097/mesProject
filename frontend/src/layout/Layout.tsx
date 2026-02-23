import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import SideBar from "./SideBar";

export const DRAWER_WIDTH = 240;

const Layout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f3f5f9" }}>
      <TopBar />
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;

