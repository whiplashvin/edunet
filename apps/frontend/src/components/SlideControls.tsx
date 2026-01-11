import { GrNext, GrPrevious } from "react-icons/gr";
import { imageCurrPage, imageUrls, socket, toDisplay } from "../recoil";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useParams } from "react-router-dom";

function SlideControls() {
  const ImageUrls = useRecoilValue(imageUrls);
  const setToDisplay = useSetRecoilState(toDisplay);
  const Socket = useRecoilValue(socket);
  const { sessionId } = useParams();
  const [currPage, setCurrPage] = useRecoilState(imageCurrPage);
  function nextPage() {
    if (currPage < ImageUrls.length - 1) {
      setCurrPage((currPage) => currPage + 1);
      Socket?.send(
        JSON.stringify({
          event: "image-next-page",
          payload: {
            sessionId: sessionId,
            currPage: currPage + 1,
            imgUrl: ImageUrls,
          },
        })
      );
    }
  }
  function prevPage() {
    if (currPage > 0) {
      setCurrPage((currPage) => currPage - 1);
      Socket?.send(
        JSON.stringify({
          event: "image-prev-page",
          payload: {
            sessionId: sessionId,
            currPage: currPage - 1,
            imgUrl: ImageUrls,
          },
        })
      );
    }
  }

  return (
    <div className="p-2 flex justify-between gap-2">
      <div className="flex gap-4 items-center">
        <GrPrevious
          className="p-2  text-sky-200 text-3xl hover:bg-neutral-600 hover:text-sky-300 rounded-full"
          onClick={prevPage}
        />
        <GrNext
          className="p-2  text-sky-200 text-3xl hover:bg-neutral-600 hover:text-sky-300 rounded-full"
          onClick={nextPage}
        />
      </div>
      <div className="flex gap-4 items-center">
        <button className="px-2 py-1 rounded bg-sky-200 text-neutral-30 hover:scale-105 text-zinc-900 font-thin text-[10px]">
          annotate
        </button>
        <span className="text-sky-200 text-xs">
          {currPage + 1}/{ImageUrls.length}
        </span>
        <button
          className="px-2 py-1 rounded bg-red-600 text-neutral-30 hover:scale-105 text-neutral-300 font-thin text-[10px]"
          onClick={() => {
            setToDisplay("video");
            Socket?.send(
              JSON.stringify({
                event: "image-close",
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

export default SlideControls;
