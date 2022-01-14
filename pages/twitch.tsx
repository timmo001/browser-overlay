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
  game?: HelixGame | null;
  tags?: Array<HelixTag> | null;
  thumbnail?: string;
  title?: string;
  user?: HelixUser | null;
  viewers?: number;
}

let twitch: Twitch;

const PageTwitch: NextPage<PageProps> = ({ twitchCredentials }: PageProps) => {
  const [channelData, setChannel] = useState<TwitchData>();

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
          setChannel({
            name: channel,
            live: false,
          });
          return;
        }
        console.log("stream:", stream);
        const tags = await stream.getTags();
        setChannel({
          name: channel,
          live: true,
          game: await stream.getGame(),
          tags: twitch.getTagNames(tags),
          thumbnail: stream.thumbnailUrl,
          title: stream.title,
          user: await stream.getUser(),
          viewers: stream.viewers,
        });
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
        {channelData ? (
          <GridComponent
            items={[
              <Typography key={0} component="span" variant="h2"></Typography>,
              <Typography key={1} component="span" variant="h2"></Typography>,
              <Typography
                key={3}
                component="span"
                variant="h2"
                sx={{
                  fontSize: 34,
                }}>
                <Icon
                  path={mdiCircle}
                  title={channelData.live ? "Live" : "Offline"}
                  size={1}
                  color={channelData.live ? "red" : "gray"}
                />{" "}
                {channelData.user
                  ? channelData.user.displayName
                  : channelData.name}
                <br />
              </Typography>,
              <Typography key={4} component="span" variant="h2"></Typography>,
              <Typography
                key={5}
                component="span"
                variant="h2"
                sx={{
                  fontSize: 34,
                }}>
                {channelData ? channelData.game : "No game"}
              </Typography>,
              <Typography
                key={6}
                component="span"
                variant="h2"
                sx={{
                  fontSize: 34,
                }}>
                {channelData.game ? channelData.game.name : "No game"}
              </Typography>,
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
