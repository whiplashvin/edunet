import { useRecoilValue } from "recoil";
import { sessionTitle, socket, toDisplay, userRole } from "../recoil";
import Video from "../components/Video";
import { useEffect, useState } from "react";
import Canvas from "../components/Canvas";
import { Room } from "livekit-client";
import SessionControls from "../components/SessionControls";
import UserLeaveBtn from "../components/UserLeaveBtn";
import Whiteboard from "../components/Whiteboard";
import { ToastContainer } from "react-toastify";
import SecondarySessControl from "../components/SecondarySessControl";
import { useNavigate } from "react-router-dom";
import ParticipantControl from "@/components/ParticipantControl";
import SlideControls from "@/components/SlideControls";
function Session() {
  const SessionTitle = useRecoilValue(sessionTitle);
  const [videoRoom, setVideoRoom] = useState<Room | null>(null);
  const Role = useRecoilValue(userRole);
  const ToDisplayValue = useRecoilValue(toDisplay);
  const Socket = useRecoilValue(socket);
  const navigate = useNavigate();
  useEffect(() => {
    if (!Socket) {
      return;
    }

    function handleEvent(message: MessageEvent) {
      const parsed = JSON.parse(message.data as unknown as string);
      if (parsed.event === "removed") {
        alert("You have been removed by the admin.");
        Socket?.close();
        navigate("/dashboard/all-classes");
      } else if (parsed.event === "class-ended") {
        alert("Admin ended the class.");
        Socket?.close();
        navigate("/dashboard/all-classes");
      }
    }
    Socket.addEventListener("message", handleEvent);

    return () => {
      Socket.removeEventListener("message", handleEvent);
      // Socket.close();
    };
  }, [Socket, navigate]);
  return (
    <>
      <div className="bg-zinc-900 h-screen p-4 relative flex flex-col justify-between gap-2">
        <h1 className="text-2xl text-zinc-200 font-thin">{SessionTitle}</h1>
        {ToDisplayValue === "video" ? (
          <Video setVideoRoom={setVideoRoom} />
        ) : ToDisplayValue === "image" ? (
          <>
            <Canvas />
            {Role === "admin" && <SlideControls />}
          </>
        ) : (
          <Whiteboard />
        )}
        <div className=" flex justify-center gap-2">
          {Role === "admin" ? (
            <div className="flex flex-col md:flex-row items-center justify-center w-full gap-2">
              <ParticipantControl />
              <div className="flex items-center gap-4">
                <SessionControls videoRoom={videoRoom} />
                <SecondarySessControl />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <UserLeaveBtn videoRoom={videoRoom} />
              <SecondarySessControl />
            </div>
          )}
        </div>
        {ToDisplayValue === "board" || ToDisplayValue === "image" ? (
          <div className="absolute top-16 right-6 rounded-lg w-44 md:w-50">
            <Video setVideoRoom={setVideoRoom} />
          </div>
        ) : null}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default Session;
