import { createTheme } from "@mui/material";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#5b6ef5" },
    background: { default: "#f3f5f9", paper: "#ffffff" },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: ["Pretendard", "Segoe UI", "Noto Sans KR", "sans-serif"].join(","),
  },
});
