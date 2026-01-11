import { useEffect, useRef, useState } from "react";
import { DialogTitle } from "./ui/dialog";
import { IoVideocamOutline } from "react-icons/io5";
import { PiMicrophoneLight } from "react-icons/pi";
import { PiMicrophoneSlashLight } from "react-icons/pi";
import { IoVideocamOffOutline } from "react-icons/io5";
function CheckHair({ startSession }: { startSession: () => Promise<void> }) {
  const vidRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cam, setCam] = useState(true);
  const [mic, setMic] = useState(false);
  useEffect(() => {
    async function init() {
      if (!vidRef || !vidRef.current) {
        return;
      }

      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: mic ? true : false,
        video: cam ? { width: 1280, height: 720 } : false,
      });
      vidRef.current.srcObject = streamRef.current;
      vidRef.current.play();
    }
    init();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [cam, mic]);
  return (
    <div className="">
      <DialogTitle className="text-lg font-thin text-zinc-700 mb-5 tracking-normal">
        Check camera and mic
      </DialogTitle>
      <video
        ref={vidRef}
        className="h-52 w-full md:h-full md:w-full mb-2"
        style={{ transform: "scaleX(-1)" }}
      />
      <div className="flex justify-center items-center gap-2 mb-2">
        {!cam ? (
          <div className="hover:bg-zinc-700 p-2 rounded-full cursor-pointer text-zinc-700 hover:text-zinc-200">
            <IoVideocamOutline size={20} onClick={() => setCam(true)} />
          </div>
        ) : (
          <div className="hover:bg-zinc-700 p-2 rounded-full cursor-pointer text-zinc-700 hover:text-zinc-200">
            <IoVideocamOffOutline size={20} onClick={() => setCam(false)} />
          </div>
        )}

        {!mic ? (
          <div className="hover:bg-zinc-700 p-2 rounded-full cursor-pointer text-zinc-700 hover:text-zinc-200">
            <PiMicrophoneLight size={20} onClick={() => setMic(true)} />
          </div>
        ) : (
          <div className="hover:bg-zinc-700 p-2 rounded-full cursor-pointer text-zinc-700 hover:text-zinc-200">
            <PiMicrophoneSlashLight size={20} onClick={() => setMic(false)} />
          </div>
        )}
      </div>
      <button
        className="bg-sky-400/30 border-[0.5px] border-sky-500 text-zinc-950 hover:bg-sky-600/30 w-full py-2 rounded-lg font-thin"
        onClick={startSession}
      >
        Start
      </button>
    </div>
  );
}

export default CheckHair;
