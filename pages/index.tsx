import type { NextPage } from "next";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/system";
import Head from "next/head";
import Moment from "react-moment";

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
        <GridComponent
          items={[
            <Typography key={0} component="span" variant="h2"></Typography>,
            <Typography key={1} component="span" variant="h2"></Typography>,
            <Typography key={2} component="span" variant="h2"></Typography>,
            <Typography key={3} component="span" variant="h2"></Typography>,
            <Typography
              key={4}
              component="span"
              variant="h2"
              sx={{
                fontSize: 42,
              }}
            >
              <Moment format="HH:mm:ss" interval={500} />
            </Typography>,
            <Typography key={5} component="span" variant="h2"></Typography>,
          ]}
        />
      </Box>
    </>
  );
};

export default Home;
