import type { ReactElement } from "react";
import { useRouter } from "next/router";
import { Box } from "@mui/material";

function DesktopComponent(): ReactElement {
  const router = useRouter();
  const { height, width } = router.query;

  return (
    <>
      <Box
        className="block"
        sx={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          height: Number(height) || 880,
          width: Number(width) || 1408,
        }}
      />
    </>
  );
}

export default DesktopComponent;
