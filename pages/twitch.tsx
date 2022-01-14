import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import { mdiCircle } from "@mdi/js";
import { useTheme } from "@mui/system";
import Head from "next/head";
import Icon from "@mdi/react";

import GridComponent from "../components/grid";
import { Twitch } from "../lib/twitch";

interface PageProps {
  twitchCredentials: {
    clientId: string;
    clientSecret: string;
  };
}

interface ChannelData {
  name: string;
  live: boolean;
}

let twitch: Twitch;

const PageTwitch: NextPage<PageProps> = ({ twitchCredentials }: PageProps) => {
  const [channelsData, setChannelsData] = useState<Array<ChannelData>>([]);

  const router = useRouter();
  const { channels } = router.query as NodeJS.Dict<string>;

  useEffect(() => {
    (async () => {
      twitch = new Twitch(
        twitchCredentials.clientId,
        twitchCredentials.clientSecret
      );
      if (channels) {
        const newChannelsData = [];
        for (const channel of channels.split(",")) {
          newChannelsData.push({
            name: channel,
            live: await twitch.isStreamLive(channel),
          });
        }
        setChannelsData(newChannelsData);
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
                fontSize: 34,
              }}>
              {channelsData.map((channel: ChannelData, index: number) => (
                <span key={index}>
                  <Icon
                    path={mdiCircle}
                    title={channel.live ? "Live" : "Offline"}
                    size={1}
                    color={channel.live ? "red" : "gray"}
                  />{" "}
                  {channel.name}
                  <br />
                </span>
              ))}
            </Typography>,
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
