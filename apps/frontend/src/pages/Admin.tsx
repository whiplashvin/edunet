import CreateSess from "../components/CreateSess";
import AllClassAdmin from "../components/AllClassAdmin";
// import { useRecoilValue } from "recoil";
// import { navbarHeight } from "@/recoil";
import { useEffect, useState } from "react";

function Admin() {
  // const NavbarHeight = useRecoilValue(navbarHeight);
  const [deviceHeight, setDeviceHeight] = useState<number | null>(null);
  useEffect(() => {
    setDeviceHeight(window.innerHeight);
  }, []);
  return (
    <div
      className={`w-full col-span-5 bg-zinc-50 relative overflow-y-auto scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-500`}
      style={{
        // height: `calc(100vh - ${NavbarHeight}px - 16px - 16px)`,
        height: "100vh",
        overflowY: `${deviceHeight! < 800 ? "scroll" : "auto"}`,
      }}
    >
      <div className="border-b border-zinc-200 h-14" />
      <div className="flex justify-between items-center p-4 border border-zinc-300 rounded-xl my-5 w-[95%] mx-auto">
        <div className="text-2xl text-sky-600 font-extralight">
          Manage Sessions
        </div>
        <CreateSess />
      </div>
      <AllClassAdmin />
    </div>
  );
}

export default Admin;
