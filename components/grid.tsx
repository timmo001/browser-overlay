import type { ReactElement } from "react";
import { Grid, Typography } from "@mui/material";
import Moment from "react-moment";

function GridComponent(): ReactElement {
  return (
    <>
      <Grid
        container
        sx={{
          height: "50%",
          textAlign: "center",
        }}
      >
        <Grid item xs={12}>
          <Typography component="span" variant="h2">
            <Moment format="HH:mm:ss" interval={500} />
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        alignItems="flex-end"
        sx={{
          height: "50%",
        }}
      >
        <Grid item xs={6}>
          <Typography component="span" variant="h2">
            Hello
          </Typography>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            textAlign: "right",
          }}
        >
          <Typography component="span" variant="h2">
            World
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}

export default GridComponent;
