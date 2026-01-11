import { SetStateAction } from "react";
import { TbFileUpload } from "react-icons/tb";
import { imageCurrPage } from "../recoil";
import { useSetRecoilState } from "recoil";

function UploadButton({
  setToDisplay,
  uploadPdf,
  loading,
}: {
  setToDisplay: React.Dispatch<SetStateAction<"video" | "image" | "board">>;
  uploadPdf: () => Promise<void | string>;
  loading: boolean;
}) {
  const setCurrPage = useSetRecoilState(imageCurrPage);
  return (
    <div className="group flex flex-col items-center cursor-pointer">
      <TbFileUpload
        className="text-lg"
        onClick={async () => {
          const res = await uploadPdf();
          if (res === "No file selected") {
            return;
          }
          setCurrPage(0);
          setToDisplay("image");
        }}
      />
      {/* <span
        className={`text-[10px] md:text-xs group-hover:text-sky-200 font-thin ${loading ? "text-sky-300" : "text-zinc-600"}`}
      >
        {loading ? "Uploading..." : "Upload"}
      </span> */}
    </div>
  );
}

export default UploadButton;
