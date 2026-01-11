import axios from "axios";
import { MdOnlinePrediction } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { sessionTitle, socket, userRole } from "../recoil";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import CheckHair from "./CheckHair";
import { useToast } from "@/hooks/use-toast";
import JoinPermission from "./JoinPermission";
function ClassAdmin({
  title,
  status,
  sessionId,
}: {
  title: string;
  status: string;
  sessionId: string;
}) {
  const Role = useRecoilValue(userRole);
  const navigate = useNavigate();
  const setSessionTitle = useSetRecoilState(sessionTitle);
  const setSocket = useSetRecoilState(socket);
  const { toast } = useToast();
  async function startSession() {
    const res = await axios.post(
      `${import.meta.env.VITE_PRIMARY_BACKEND_URL}/session/${sessionId}/start`,
      {},
      {
        withCredentials: true,
      }
    );
    setSessionTitle(res.data.sessionTitle);
    const ws = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}`);
    ws.onopen = () => {
      console.log("connected to ws");
      console.log(new Date().toTimeString());
      ws.send(
        JSON.stringify({
          event: "join",
          payload: {
            role: Role,
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

      ws.onclose = (event) => {
        console.log(event);
        console.warn("WebSocket disconnected:", event.reason);
        console.log(new Date().toTimeString());
        clearInterval(heartbeat);
      };
      ws.onmessage = (message) => {
        const parsed = JSON.parse(message.data as unknown as string);
        if (parsed.event === "join-request") {
          toast({
            title: `${parsed.payload.user} wants to join.`,
            action: (
              <JoinPermission Socket={ws} uniqueId={parsed.payload.uniqueId} />
            ),
            duration: 100000000000,
          });
        }
      };
      setSocket(ws);
    };
    navigate(`/session/${sessionId}`);
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
            {status === "active" && <MdOnlinePrediction />}
            <span>{status}</span>
          </div>
        </div>
        <p className="text-zinc-700 text-[10px] md:text-[12px]  leading-5 font-extralight mb-5">
          <span className="text-sky-500">Description:</span> Lorem ipsum dolor
          sit amet consectetur adipisicing elit. Sed autem non tenetur! Mollitia
          illo aut voluptatum, quas.
        </p>
        <div className="flex w-full gap-2">
          <button
            disabled={true}
            className={`${status === "active" ? "hidden" : "block"} bg-zinc-700 hover:bg-zinc-600 py-2 rounded-lg text-zinc-300 font-thin w-full text-sm cursor-not-allowed`}
          >
            Delete
          </button>

          <Dialog>
            <DialogTrigger
              className={`${status === "active" ? "bg-rose-800" : "bg-sky-400/30 border-[0.5px] border-sky-500 hover:bg-sky-600/30"} py-2 rounded-lg text-neutral-950 font-thin cursor-pointer w-full text-sm shadow-md`}
            >
              {status === "active" ? "End" : "Start"}
            </DialogTrigger>
            <DialogContent className="bg-zinc-50 border-zinc-700 flex justify-center items-center w-full md:w-full">
              <CheckHair startSession={startSession} />
            </DialogContent>
          </Dialog>
        </div>
      </li>
    </div>
  );
}

export default ClassAdmin;
