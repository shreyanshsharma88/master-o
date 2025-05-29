import { Dialog } from "@mui/material";
import { useState } from "react";
import "./App.css";
import { CustomReportsUI } from "./PowerBIAssignment";
import { Close } from "@mui/icons-material";

type TAssignmentTypes = "car-game" | "power-bi" | null;
function App() {
  const [opened, setOpened] = useState<TAssignmentTypes>(null);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <h1>Click on the following buttons to view the assignment</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => setOpened("car-game")}>Car Game</button>
          <button onClick={() => setOpened("power-bi")}>Power BI</button>
        </div>
        <Dialog
          open={!!opened}
          onClose={() => setOpened(null)}
          fullWidth
          fullScreen
          maxWidth="md"
          PaperProps={{
            sx: {
              width: "100%",
            },
          }}
        >
          <Close sx={{
            p:2,
            cursor: 'pointer'
          }} onClick={() => setOpened(null)}/>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {opened === "car-game" && (
              <iframe
                src="../car-game.html"
                style={{ width: "100%", height: "80vh", border: "none" }}
                title="Car Game"
              ></iframe>
            )}
            {opened === "power-bi" && (
              <CustomReportsUI/>
            )}
          </div>
        </Dialog>
      </div>
    </>
  );
}

export default App;
