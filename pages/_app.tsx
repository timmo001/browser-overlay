import type { AppProps } from "next/app";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { purple, teal } from "@mui/material/colors";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "../assets/css/global.css";
import "../assets/css/rainbow.css";
import "../assets/css/neon.css";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: purple[500],
    },
    secondary: {
      main: teal[500],
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default App;
