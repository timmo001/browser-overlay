import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import Head from "next/head";

const RainbowGlow: NextPage = () => {
  const router = useRouter();
  const { glow, height, width } = router.query;

  return (
    <>
      <Head>
        <title>Rainbow Glow - Stream Overlay</title>
        <meta name="description" content="Stream Overlay" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        component="main"
        sx={{
          height: "100%",
        }}
      >
        <Box
          className="rainbow"
          sx={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            height: Number(height) || 880,
            width: Number(width) || 1408,
            "&:after": {
              filter: `blur(${Number(glow) || 40}px) !important`,
            },
          }}
        />{" "}
      </Box>
    </>
  );
};

export default RainbowGlow;
