import { useEffect, useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { currUser, socket } from "../recoil";
import { useRecoilValue } from "recoil";
import { useQuery } from "@tanstack/react-query";
import { getMessages } from "@/actions";

function Chat() {
  const [message, setMessage] = useState("");
  const [displayText, setDisplayText] = useState<
    { user: string; text: string }[]
  >([]);
  const Socket = useRecoilValue(socket);
  const { sessionId } = useParams();
  const CurrUser = useRecoilValue(currUser);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { data, isFetching } = useQuery({
    queryKey: ["messages"],
    queryFn: () => getMessages(sessionId ?? ""),
  });
  useEffect(() => {
    if (!isFetching) {
      if (data?.data.chat) {
        const prevChat = data.data.chat.map(
          (c: { sender: string; content: string }) => ({
            user: c.sender,
            text: c.content,
          })
        );
        setDisplayText(prevChat);
      }
    }
    function msgHandler(message: MessageEvent) {
      const parsed = JSON.parse(message.data as unknown as string);
      if (parsed.event === "message") {
        setDisplayText((content) => [...content, parsed.payload.content]);
      }
    }

    Socket?.addEventListener("message", msgHandler);

    return () => {
      Socket?.removeEventListener("message", msgHandler);
    };
  }, [Socket, sessionId, data?.data.chat, isFetching]);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayText]);
  function send() {
    setMessage("");
    Socket?.send(
      JSON.stringify({
        event: "message",
        payload: {
          sessionId: sessionId,
          content: {
            user: CurrUser,
            text: message,
          },
        },
      })
    );
  }
  return (
    <div className="bg-zinc-200 row-span-4 rounded-md p-2 h-full flex flex-col justify-between relative">
      {isFetching && (
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-300 font-extralight text-sm">
          fetching...
        </p>
      )}
      <section
        ref={containerRef}
        className="flex-1 min-h-0 flex flex-col gap-1 relative overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 scrollbar-thumb-rounded p-0"
      >
        {displayText.map((c, index) => (
          <div
            key={index}
            className={`${c.user === CurrUser ? "justify-end" : "justify-start"} flex items-center bg-zinc-50 rounded px-1`}
          >
            <span
              className={`${c.user === CurrUser ? "hidden" : "flex"} size-3 md:size-6 p-2 text-[8px] md:text-xs font-extralight rounded-full bg-zinc-900  justify-center items-center text-sky-300`}
            >
              {c.user.split("")[0].toUpperCase()}
              {c.user.split("")[1].toUpperCase()}
            </span>
            <span
              className={`text-[10px] md:text-sm text-zinc-950 m-2 font-thin`}
            >
              {c.text}
            </span>
          </div>
        ))}
      </section>
      <div className="w-full p-2 flex items-center gap-2">
        <div className="w-full">
          <input
            onKeyDown={(e) => {
              if (message.length > 0 && e.code === "Enter") {
                send();
              }
            }}
            value={message}
            placeholder="send a message..."
            className="border border-zinc-400 rounded-md h-10 w-full bg-white px-2 py-1 text-zinc-900 text-[10px] md:text-sm font-thin focus:outline-none"
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <IoSendSharp
          className="text-sm md:text-xl text-zinc-600 cursor-pointer hover:scale-110 hover:text-sky-300"
          onClick={() => {
            if (message.length > 0) {
              send();
            }
          }}
        />
      </div>
    </div>
  );
}

export default Chat;
