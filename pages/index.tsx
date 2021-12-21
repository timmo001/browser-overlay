import type { NextPage } from "next";
import { Box } from "@mui/material";
import { useTheme } from "@mui/system";
import Head from "next/head";

import GridComponent from "../components/grid";

const Home: NextPage = () => {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>Stream Overlay</title>
        <meta name="description" content="Stream Overlay" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        component="main"
        sx={{
          padding: theme.spacing(2, 3),
          height: "100%",
        }}
      >
        <GridComponent />
      </Box>
    </>
  );
};

export default Home;
