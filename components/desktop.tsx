import type { ReactElement } from "react";
import { Box } from "@mui/material";

function DesktopComponent(): ReactElement {
  return (
    <>
      <Box
        className="block"
        sx={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          height: 880,
          width: 1408,
        }}
      />
    </>
  );
}

export default DesktopComponent;
