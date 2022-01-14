import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import { HelixGame, HelixTag, HelixUser } from "@twurple/api";
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

interface TwitchData {
  name: string;
  live: boolean;
  game?: {
    name?: string;
    boxArtUrl?: string;
  };
  tags?: Array<string>;
  thumbnail?: string;
  title?: string;
  viewers?: number;
}

let twitch: Twitch;

const PageTwitch: NextPage<PageProps> = ({ twitchCredentials }: PageProps) => {
  const [twitchData, setTwitchData] = useState<TwitchData>();

  const router = useRouter();
  const { channel } = router.query as NodeJS.Dict<string>;

  useEffect(() => {
    (async () => {
      twitch = new Twitch(
        twitchCredentials.clientId,
        twitchCredentials.clientSecret
      );
      if (channel) {
        const stream = await twitch.getStream(channel);
        if (!stream) {
          setTwitchData({
            name: channel,
            live: false,
          });
          return;
        }
        console.log("stream:", stream);
        const game = await stream.getGame();
        const tags = await stream.getTags();
        const newTwitchData: TwitchData = {
          name: (await stream.getUser()).displayName,
          live: true,
          game: game
            ? {
                name: game.name,
                boxArtUrl: game.boxArtUrl,
              }
            : undefined,
          tags: twitch.getTagNames(tags),
          thumbnail: stream.thumbnailUrl,
          title: stream.title,
          viewers: stream.viewers,
        };
        console.log("newTwitchData:", newTwitchData);
        setTwitchData(newTwitchData);
      }
    })();
  }, [channel, twitchCredentials.clientId, twitchCredentials.clientSecret]);

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
        {twitchData ? (
          <GridComponent
            items={[
              <Typography
                key={0}
                component="span"
                variant="h2"
                sx={{
                  fontSize: 34,
                }}>
                <Icon
                  path={mdiCircle}
                  title={twitchData.live ? "Live" : "Offline"}
                  size={1}
                  color={twitchData.live ? "red" : "gray"}
                />{" "}
                {twitchData.name}
              </Typography>,
              <Typography
                key={1}
                component="span"
                variant="h2"
                sx={{
                  fontSize: 34,
                }}>
                {twitchData.title}
              </Typography>,
              <Typography
                key={3}
                component="span"
                variant="h2"
                sx={{
                  fontSize: 34,
                }}>
                {twitchData.game ? twitchData.game.name : "No game"}
              </Typography>,
              <Typography
                key={4}
                component="span"
                variant="h2"
                sx={{
                  fontSize: 34,
                }}></Typography>,
              <Typography
                key={5}
                component="span"
                variant="h2"
                sx={{
                  fontSize: 34,
                }}></Typography>,
              <Typography
                key={6}
                component="span"
                variant="h2"
                sx={{
                  fontSize: 34,
                }}></Typography>,
            ]}
          />
        ) : (
          ""
        )}
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
