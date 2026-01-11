import React, { SetStateAction } from "react";
import { socket, toDisplay } from "../recoil";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useParams } from "react-router-dom";

function WhiteBoardControls({
  action,
  setAction,
  setColor,
  clearCanvas,
  setStrokeWidth,
}: {
  action: string | null;
  setAction: React.Dispatch<SetStateAction<"draw" | "erase" | null>>;
  setColor: React.Dispatch<SetStateAction<string>>;
  clearCanvas: () => void;
  setStrokeWidth: React.Dispatch<SetStateAction<number>>;
}) {
  const setToDisplay = useSetRecoilState(toDisplay);
  const Socket = useRecoilValue(socket);
  const { sessionId } = useParams();

  return (
    <div className="p-2">
      <div className="flex gap-4 items-center justify-end">
        <button
          className={`px-2 py-1 rounded bg-sky-500 text-zinc-50 hover:scale-105 font-thin text-[10px] ${action === "draw" && "ring-1 ring-offset-2"}`}
          onClick={() => {
            setAction("draw");
            setColor("#343a40");
            setStrokeWidth(7);
            Socket?.send(
              JSON.stringify({
                event: "whiteBoard-draw",
                payload: {
                  sessionId: sessionId,
                },
              })
            );
          }}
        >
          draw
        </button>
        <button
          className={`px-2 py-1 rounded bg-sky-500 text-zinc-50 hover:scale-105 font-thin text-[10px] ${action === "erase" && "ring-1 ring-offset-2"}`}
          onClick={() => {
            setColor("#f5faff");
            setAction("erase");
            setStrokeWidth(14);
            Socket?.send(
              JSON.stringify({
                event: "whiteBoard-erase",
                payload: {
                  sessionId: sessionId,
                },
              })
            );
          }}
        >
          erase
        </button>
        <select
          disabled={action === "erase"}
          className="px-2 py-1 font-thin text-[10px] rounded"
          onChange={(e) => {
            setColor(e.target.value);
            Socket?.send(
              JSON.stringify({
                event: "whiteBoard-color-change",
                payload: {
                  sessionId: sessionId,
                  strokeStyle: e.target.value,
                },
              })
            );
          }}
        >
          <option value="#343a40">black</option>
          <option value="#ff8787">red</option>
          <option value="#4dabf7">blue</option>
        </select>
        <button
          className="px-2 py-1 rounded bg-sky-500 hover:scale-105 text-zinc-50 font-thin text-[10px]"
          onClick={() => {
            console.log("sending clear");
            Socket?.send(
              JSON.stringify({
                event: "whiteBoard-clear",
                payload: {
                  sessionId: sessionId,
                },
              })
            );
            clearCanvas();
          }}
        >
          clear
        </button>
        <button
          className="px-2 py-1 rounded bg-red-500 text-neutral-50 hover:scale-105 font-thin text-[10px]"
          onClick={() => {
            console.log("close");
            setToDisplay("video");
            Socket?.send(
              JSON.stringify({
                event: "whiteBoard-close",
                payload: {
                  sessionId: sessionId,
                },
              })
            );
          }}
        >
          close
        </button>
      </div>
    </div>
  );
}

export default WhiteBoardControls;
