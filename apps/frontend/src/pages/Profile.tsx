import { currUser, email, userRole } from "@/recoil";
import { useRecoilValue } from "recoil";
import { CiUser } from "react-icons/ci";
import { useEffect, useState } from "react";

function Profile() {
  const User = useRecoilValue(currUser);
  const Email = useRecoilValue(email);
  const Role = useRecoilValue(userRole);
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
      // className={`w-full col-span-6 xl:col-span-5 bg-zinc-950 p-10 flex flex-col md:flex-row justify-center items-start md:items-center md:block relative overflow-y-auto scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-500`}
      className={`w-full col-span-5 relative overflow-y-auto scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-500`}
    >
      <div className="border-b border-zinc-200 h-14" />
      <h1 className="text-sm md:text-2xl text-sky-600 font-extralight p-4 pl-8 my-5">
        Profile
      </h1>
      <div className="w-[95%] mx-auto flex flex-col items-start px-5 py-10 lg:flex-row bg-sky-100/70 rounded-xl gap-10 relative mt-10 shadow-lg border border-zinc-200">
        <div className="size-20 rounded-full bg-white flex items-center justify-center">
          <CiUser fontSize={40} color="#343a40" />
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-lg font-extralight text-sky-500">{User}</p>
          <div className="flex flex-col lg:flex-row gap-10 md:gap-20">
            <div className="font-extralight min-w-fit">
              <p className="text-zinc-500 text-base lg:text-lg">Role</p>
              <p className="text-zinc-500 text-xs lg:text-sm">{Role}</p>
            </div>
            <div className="font-extralight min-w-fit">
              <p className="text-zinc-500 text-base lg:text-lg">
                Email Address
              </p>
              <p className="text-zinc-500 text-xs lg:text-sm">{Email}</p>
            </div>
            <div className="font-extralight min-w-fit">
              <p className="text-zinc-500 text-base lg:text-lg">Phone Number</p>
              <p className="text-zinc-500 text-xs lg:text-sm">+91 9876543210</p>
            </div>
            <div className="font-extralight min-w-fit">
              <p className="text-zinc-500 text-base lg:text-lg">Password</p>
              <p className="text-zinc-500 text-xs lg:text-sm">******</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full lg:w-fit lg:absolute lg:top-5 right-5">
          <button
            className="bg-sky-400/30 border-[0.5px] border-sky-500 text-zinc-950 px-4 py-2 rounded-lg flex items-center text-sm font-thin hover:bg-sky-600/30 gap-2 shadow-lg"
            disabled={true}
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
