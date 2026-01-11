import { AiOutlineAudio } from "react-icons/ai";
import { AiOutlineAudioMuted } from "react-icons/ai";
import { Room } from "livekit-client";
import { useState } from "react";
function AudioButton({ videoRoom }: { videoRoom: Room | null }) {
  const [audioMuted, setAudioMuted] = useState(false);
  return (
    <div className="group flex flex-col items-center cursor-pointer">
      {audioMuted ? (
        <AiOutlineAudio
          className="text-lg"
          onClick={async () => {
            setAudioMuted(false);
            await videoRoom?.localParticipant.setMicrophoneEnabled(true);
          }}
        />
      ) : (
        <AiOutlineAudioMuted
          className="text-lg"
          onClick={async () => {
            setAudioMuted(true);
            await videoRoom?.localParticipant.setMicrophoneEnabled(false);
          }}
        />
      )}
      {/* <span className="text-zinc-600 text-[10px] md:text-xs group-hover:text-sky-200 font-thin">
        Audio
      </span> */}
    </div>
  );
}

export default AudioButton;
