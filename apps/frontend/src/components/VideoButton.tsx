import { useState } from "react";
import { FiVideoOff } from "react-icons/fi";
import { IoVideocamOutline } from "react-icons/io5";
import { Room } from "livekit-client";

function VideoButton({ videoRoom }: { videoRoom: Room | null }) {
  const [videoOff, setVideoOff] = useState(false);
  return (
    <div className="group flex flex-col items-center cursor-pointer">
      {videoOff ? (
        <IoVideocamOutline
          className="text-lg"
          onClick={() => {
            setVideoOff(false);
            videoRoom?.localParticipant.setCameraEnabled(true);
          }}
        />
      ) : (
        <FiVideoOff
          className="text-lg"
          onClick={() => {
            setVideoOff(true);
            videoRoom?.localParticipant.setCameraEnabled(false);
          }}
        />
      )}
      {/* <span className="text-zinc-600 text-[10px] md:text-xs group-hover:text-sky-200 font-thin">
        Video
      </span> */}
    </div>
  );
}

export default VideoButton;
