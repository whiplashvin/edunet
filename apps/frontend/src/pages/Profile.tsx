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
      <h1
        // className="text-neutral-400 text-2xl mb-10">
        className="text-sm md:text-xl text-zinc-900 font-light border-b border-zinc-200 p-4 pl-8"
      >
        Profile
      </h1>
      <div className="w-[95%] mx-auto flex flex-col items-start px-5 py-10 lg:flex-row bg-gradient-to-tr from-30% from-sky-100 via-50% via-fuchsia-100 to-100% to-amber-100 rounded-xl gap-10 relative mt-10 shadow-lg border border-zinc-200">
        <div className="size-20 rounded-full bg-white flex items-center justify-center">
          <CiUser fontSize={40} color="black" />
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-lg font-extralight text-blue-500">{User}</p>
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
            className="bg-blue-500 text-zinc-50 text-sm font-extralight rounded px-4 py-1 cursor-not-allowed"
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
