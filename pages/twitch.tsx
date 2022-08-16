import type { NextPage } from "next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import {
  mdiAccount,
  mdiCircle,
  mdiClockOutline,
  mdiGamepad,
  mdiTimer,
} from "@mdi/js";
import { useTheme } from "@mui/system";
import Head from "next/head";
import Icon from "@mdi/react";
import moment, { Moment } from "moment";
import ReactMoment from "react-moment";

import { Twitch } from "../lib/twitch";
import GridComponent from "../components/grid";

interface TimerData {
  time: Moment;
  incrementPerBit?: number;
  incrementPerDonation?: number;
  incrementPerSubscription?: number;
}

interface TwitchData {
  name?: string;
  live?: boolean;
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

const PageTwitch: NextPage = () => {
  const [twitchData, setTwitchData] = useState<TwitchData>();
  const [timerData, setTimerData] = useState<TimerData>();

  const router = useRouter();
  const {
    channel,
    clientId,
    clientSecret,
    game,
    live,
    title,
    uptime,
    timer,
    timerStartAt,
    viewers,
  } = router.query as NodeJS.Dict<string>;

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

  const setupTimer = useCallback(() => {
    if (timerData) return;
    console.log("Setup timer..");
    const start = moment();
    const newTimerData: TimerData = {
      time: start.add(timerStartAt ? Number(timerStartAt) : 3600, "seconds"),
      // incrementPerBit: timer.incrementPerBit,
      // incrementPerDonation: timer.incrementPerDonation,
      // incrementPerSubscription: timer.incrementPerSubscription,
    };
    console.log("Timer data:", newTimerData);
    setTimerData(newTimerData);
  }, [timerData, timerStartAt]);

  useEffect(() => {
    if (!clientId || !clientSecret || !channel) return;
    twitch = new Twitch(clientId as string, clientSecret as string);
    setupTimer();
    getData();
    setTimeout(() => getData(), 60000);
  }, [clientId, clientSecret, channel, getData, setupTimer]);

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
          <ReactMoment
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

  const visualTimer = useMemo(
    () =>
      timer === "true" && timerData ? (
        <Typography
          key={5}
          component="span"
          variant="h2"
          sx={{
            fontSize: 34,
          }}>
          <Icon path={mdiTimer} title="Timer" size={1} color="lightgrey" />{" "}
          <ReactMoment
            date={timerData.time}
            durationFromNow
            format="HH:mm:ss"
            interval={500}
          />
        </Typography>
      ) : (
        <Typography key={5} />
      ),
    [timer, timerData]
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
              visualTimer,
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

export default PageTwitch;
