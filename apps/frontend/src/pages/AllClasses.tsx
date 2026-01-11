import AllClassesUser from "../components/AllClassesUser";
import { useEffect, useState } from "react";

function AllClasses() {
  // const NavbarHeight = useRecoilValue(navbarHeight);
  const [deviceHeight, setDeviceHeight] = useState<number | null>(null);
  useEffect(() => {
    setDeviceHeight(window.innerHeight);
  }, []);
  return (
    <div
      style={{
        // height: `calc(100vh - ${NavbarHeight}px - 16px - 16px)`,
        height: "100vh",
        overflowY: `${deviceHeight! < 800 ? "scroll" : "auto"}`,
      }}
      className={`w-full col-span-5 relative overflow-y-auto scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-500`}
    >
      <div className="border-b border-zinc-200 h-14" />
      <div>
        <h1 className="text-sm md:text-2xl text-sky-600 font-extralight p-4 pl-8 my-5">
          Live Classes
        </h1>
        <AllClassesUser />
      </div>
    </div>
  );
}

export default AllClasses;
