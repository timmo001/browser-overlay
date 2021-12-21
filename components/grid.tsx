import type { ReactElement } from "react";
import { Grid } from "@mui/material";

interface GridComponentProps {
  items: Array<ReactElement>;
}

function GridComponent({ items }: GridComponentProps): ReactElement {
  return (
    <>
      <Grid container sx={{ height: "50%" }}>
        <Grid item xs={4}>
          {items[0]}
        </Grid>
        <Grid item xs={4} sx={{ textAlign: "center" }}>
          {items[1]}
        </Grid>
        <Grid item xs={4} sx={{ textAlign: "right" }}>
          {items[2]}
        </Grid>
      </Grid>
      <Grid container alignItems="flex-end" sx={{ height: "50%" }}>
        <Grid item xs={4}>
          {items[3]}
        </Grid>
        <Grid item xs={4} sx={{ textAlign: "center" }}>
          {items[4]}
        </Grid>
        <Grid item xs={4} sx={{ textAlign: "right" }}>
          {items[5]}
        </Grid>
      </Grid>
    </>
  );
}

export default GridComponent;
