import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useTheme } from "@mui/system";
import Head from "next/head";

import GridComponent from "../components/grid";
import { Twitch } from "../lib/twitch";

interface PageProps {
  twitchCredentials: {
    clientId: string;
    clientSecret: string;
  };
}

let twitch: Twitch;

const PageTwitch: NextPage<PageProps> = ({ twitchCredentials }: PageProps) => {
  const router = useRouter();
  const { channels } = router.query as NodeJS.Dict<string>;

  useEffect(() => {
    (async () => {
      twitch = new Twitch(
        twitchCredentials.clientId,
        twitchCredentials.clientSecret
      );
      if (channels) {
        for (const channel of channels.split(",")) {
          console.log(channel, "live:", await twitch.isStreamLive(channel));
        }
      }
    })();
  }, [channels, twitchCredentials.clientId, twitchCredentials.clientSecret]);

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
        }}>
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
              }}></Typography>,
            <Typography key={5} component="span" variant="h2"></Typography>,
          ]}
        />
      </Box>
    </>
  );
};

export const getServerSideProps = async () => {
  return {
    props: {
      twitchCredentials: {
        clientId: process.env.TWITCH_CLIENT_ID,
        clientSecret: process.env.TWITCH_CLIENT_SECRET,
      },
    },
  };
};

export default PageTwitch;
