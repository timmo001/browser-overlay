import type { NextPage } from "next";
import { Box } from "@mui/material";
import { useTheme } from "@mui/system";
import Head from "next/head";

import DesktopComponent from "../components/desktop";

const Desktop: NextPage = () => {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>Desktop - Stream Overlay</title>
        <meta name="description" content="Stream Overlay" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        component="main"
        sx={{
          height: "100%",
        }}>
        <DesktopComponent />
      </Box>
    </>
  );
};

export default Desktop;
