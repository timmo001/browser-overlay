import type { NextPage } from "next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import { mdiAccount, mdiCircle, mdiClockOutline, mdiGamepad } from "@mdi/js";
import { useTheme } from "@mui/system";
import Head from "next/head";
import Icon from "@mdi/react";
import Moment from "react-moment";

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
  startDate?: Date;
  tags?: Array<string> | null;
  thumbnail?: string;
  title?: string;
  viewers?: number;
}

let twitch: Twitch;

const PageTwitch: NextPage<PageProps> = ({ twitchCredentials }: PageProps) => {
  const [twitchData, setTwitchData] = useState<TwitchData>();

  const router = useRouter();
  const { channel, live, title, game, uptime, viewers } =
    router.query as NodeJS.Dict<string>;

  const getData = useCallback(async () => {
    console.log("Get data..");
    if (!channel) return;
    const stream = await twitch.getStream(channel);
    if (!stream) {
      setTwitchData({
        name: channel,
        live: false,
      });
      return;
    }
    const game = await stream.getGame();
    const newTwitchData: TwitchData = {
      name: (await stream.getUser()).displayName,
      live: true,
      game: game
        ? {
            name: game.name,
            boxArtUrl: game.boxArtUrl,
          }
        : undefined,
      startDate: stream.startDate,
      tags: await twitch.getTagNames(stream.tagIds),
      thumbnail: stream.thumbnailUrl,
      title: stream.title,
      viewers: stream.viewers,
    };
    console.log("Twitch data:", newTwitchData);
    setTwitchData(newTwitchData);
  }, [channel]);

  useEffect(() => {
    twitch = new Twitch(
      twitchCredentials.clientId,
      twitchCredentials.clientSecret
    );
    getData();
    setTimeout(async () => getData(), 60000);
  }, [getData, twitchCredentials.clientId, twitchCredentials.clientSecret]);

  const visualLive = useMemo(
    () =>
      live === "true" && twitchData ? (
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
            color={twitchData.live ? "red" : "lightgray"}
          />{" "}
          {twitchData.name}
        </Typography>
      ) : (
        <Typography key={0} />
      ),
    [live, twitchData]
  );

  const visualTitle = useMemo(
    () =>
      title === "true" && twitchData ? (
        <Typography
          key={1}
          component="span"
          variant="h2"
          sx={{
            fontSize: 34,
          }}>
          {twitchData.title}
        </Typography>
      ) : (
        <Typography key={1} />
      ),
    [title, twitchData]
  );

  const visualGame = useMemo(
    () =>
      game === "true" && twitchData ? (
        <Typography
          key={2}
          component="span"
          variant="h2"
          sx={{
            fontSize: 34,
          }}>
          <Icon path={mdiGamepad} title="Game" size={1} color="lightgrey" />{" "}
          {twitchData.game ? twitchData.game.name : ""}
        </Typography>
      ) : (
        <Typography key={2} />
      ),
    [game, twitchData]
  );

  const visualUptime = useMemo(
    () =>
      uptime === "true" && twitchData ? (
        <Typography
          key={3}
          component="span"
          variant="h2"
          sx={{
            fontSize: 34,
          }}>
          <Icon
            path={mdiClockOutline}
            title="Time Since"
            size={1}
            color="lightgrey"
          />{" "}
          <Moment
            date={twitchData.startDate}
            durationFromNow
            format="HH:mm:ss"
            interval={500}
          />
        </Typography>
      ) : (
        <Typography key={3} />
      ),
    [uptime, twitchData]
  );

  const visualViewers = useMemo(
    () =>
      viewers === "true" && twitchData ? (
        <Typography
          key={5}
          component="span"
          variant="h2"
          sx={{
            fontSize: 34,
          }}>
          <Icon path={mdiAccount} title="Viewers" size={1} color="lightgrey" />{" "}
          {twitchData.viewers}
        </Typography>
      ) : (
        <Typography key={5} />
      ),
    [viewers, twitchData]
  );

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
              visualLive,
              visualTitle,
              visualGame,
              visualUptime,
              <Typography
                key={4}
                component="span"
                variant="h2"
                sx={{
                  fontSize: 34,
                }}></Typography>,
              visualViewers,
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
