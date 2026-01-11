import axios from "axios";
import { MdOnlinePrediction } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  imageCurrPage,
  imageUrls,
  sessionTitle,
  socket,
  toDisplay,
  whiteBoardState,
} from "../recoil";
import { useSetRecoilState } from "recoil";
import { useState } from "react";

function ClassUser({ title, sessionId }: { title: string; sessionId: string }) {
  const navigate = useNavigate();
  const setSessionTitle = useSetRecoilState(sessionTitle);
  const setSocket = useSetRecoilState(socket);
  const setToDisplay = useSetRecoilState(toDisplay);
  const setImageUrls = useSetRecoilState(imageUrls);
  const setCurrPage = useSetRecoilState(imageCurrPage);
  const setWhiteBoardState = useSetRecoilState(whiteBoardState);
  const [loading, setLoading] = useState(false);

  async function joinSession() {
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_PRIMARY_BACKEND_URL}/session/${sessionId}/join`,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.data.currentState.state === "image-open") {
        setImageUrls(res.data.currentState.payload[0].imgUrl);
        setCurrPage(res.data.currentState.payload[0].currPage);
        setToDisplay("image");
      } else if (res.data.currentState.state === "image-close") {
        setToDisplay("video");
      } else if (res.data.currentState.state === "board-open") {
        setWhiteBoardState(res.data.currentState.payload);
        setToDisplay("board");
      } else if (res.data.currentState.state === "board-close") {
        setToDisplay("video");
      }
      setSessionTitle(res.data.sessionTitle);
      const ws = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}`);
      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            event: "join",
            payload: {
              sessionId: sessionId,
              jwtToken: res.data.jwtToken,
            },
          })
        );
        const heartbeat = setInterval(() => {
          ws.send(
            JSON.stringify({
              event: "heartbeat",
            })
          );
        }, 55000);
        ws.onclose = () => {
          clearInterval(heartbeat);
        };
        setSocket(ws);
      };
      setLoading(false);
      navigate(`/session/${sessionId}`);
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        if (err.status === 403) {
          alert("Acces denied by admin");
        }
      } else {
        throw new Error(String(err));
      }
    }
  }
  return (
    <div className="w-ful h-full p-2 bg-white/10 rounded-xl border border-white shadow-xl">
      <li className="mb-2 px-4 py-3 rounded-lg bg-zinc-100 w-full h-full border-[0.5px] border-zinc-200 shadow">
        <div className="flex justify-between mb-5 flex-wrap">
          <span className="text-zinc-900 font-thin text-xl md:text-2xl tracking-normal">
            {title}
          </span>
          <div
            className={`${status === "active" ? "text-sky-300" : "text-zinc-400"} flex items-center gap-2 font-thin  text-sm md:text-base tracking-tight`}
          >
            <MdOnlinePrediction />
            <span>Active</span>
          </div>
        </div>
        <p className="text-zinc-700 text-[10px] md:text-[12px]  leading-5 font-extralight mb-5">
          <span className="text-sky-500">Description:</span> Lorem ipsum dolor
          sit amet consectetur adipisicing elit. Sed autem non tenetur! Mollitia
          illo aut voluptatum, quas.
        </p>
        <div className="flex w-full gap-2">
          <button
            onClick={joinSession}
            // className={`${status === "active" ? "bg-rose-800" : "bg-sky-400/30 border-[0.5px] border-sky-500 hover:bg-sky-600/30"} py-2 rounded-lg text-neutral-950 font-thin cursor-pointer w-full text-sm shadow-md`}
            className={`bg-sky-400/30 hover:bg-sky-600/30 border-[0.5px] border-sky-500 py-2 rounded-lg text-neutral-950 font-thin shadow-md w-full text-[10px] md:text-sm ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {loading ? "Joining..." : "Join"}
          </button>
        </div>
      </li>
    </div>
  );
}

export default ClassUser;
