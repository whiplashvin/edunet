import React, { SetStateAction } from "react";
import { MdDraw } from "react-icons/md";

function DrawButton({
  setToDisplay,
  Socket,
  sessionId,
}: {
  setToDisplay: React.Dispatch<SetStateAction<"video" | "image" | "board">>;
  Socket: WebSocket | null;
  sessionId: string | undefined;
}) {
  return (
    <div className="group flex flex-col items-center cursor-pointer">
      <MdDraw
        className="text-lg"
        onClick={() => {
          setToDisplay("board");
          Socket?.send(
            JSON.stringify({
              event: "whiteBoard-open",
              payload: {
                sessionId: sessionId,
              },
            })
          );
        }}
      />
      {/* <span className="text-zinc-600 text-[10px] md:text-xs group-hover:text-sky-200 font-thin">
        Draw
      </span> */}
    </div>
  );
}

export default DrawButton;
