// import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const muiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#007acc" },
    error: { main: "#f44336" },
    success: { main: "#4caf50" },
    warning: { main: "#ffa500" },
    background: { default: "#1e1e1e", paper: "#252526" },
    text: { primary: "#d4d4d4", secondary: "#858585" },
  },
  typography: {
    fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
    fontSize: 13,
  },
  shape: { borderRadius: 4 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: "#1e1e1e", color: "#d4d4d4" },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#d4d4d4",
          borderRadius: 4,
          "&:hover": { backgroundColor: "#3a3a3a", color: "#2899f5" },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#333333",
          color: "#d4d4d4",
          fontSize: 11,
          border: "1px solid #3a3a3a",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: { backgroundColor: "#252526", border: "1px solid #3a3a3a" },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: 12,
          gap: 8,
          color: "#d4d4d4",
          "&:hover": { backgroundColor: "#094771" },
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small", variant: "outlined" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#1e1e1e",
            fontSize: 12,
            color: "#d4d4d4",
            "& fieldset": { borderColor: "#007acc" },
            "&:hover fieldset": { borderColor: "#2899f5" },
            "&.Mui-focused fieldset": { borderColor: "#007acc" },
          },
          "& .MuiInputBase-input": { padding: "3px 6px" },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { backgroundColor: "#252526", border: "1px solid #3a3a3a" },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { fontFamily: '"JetBrains Mono", monospace', fontSize: 12 },
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <ThemeProvider theme={muiTheme}>
    <CssBaseline enableColorScheme />
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthProvider>
  </ThemeProvider>,
  // {/* </StrictMode> */}
);
