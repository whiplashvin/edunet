import { useRecoilValue } from "recoil";
import { currUser, userRole } from "../recoil";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu.tsx";
import { useEffect, useState } from "react";
function Sidebar() {
  const Role = useRecoilValue(userRole);
  const CurrUser = useRecoilValue(currUser);
  const navigate = useNavigate();
  const location = useLocation();
  const [currPath, setCurrPath] = useState("");
  async function logout() {
    await axios.post(
      `${import.meta.env.VITE_PRIMARY_BACKEND_URL}/logout`,
      {},
      { withCredentials: true }
    );
    navigate("/signin");
  }
  useEffect(() => {
    const path = location.pathname.split("dashboard")[1];
    setCurrPath(path);
  }, [location]);
  return (
    <div className="hidden xl:block relative h-full bg-zinc-50 col-span-1 min-w-44 border-r border-zinc-200">
      <button
        className="flex items-center gap-1 justify-center border-b border-zinc-200 h-14 w-full"
        onClick={() => navigate("/signin")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00a6f4"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-cube-3d-sphere"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M6 17.6l-2 -1.1v-2.5" />
          <path d="M4 10v-2.5l2 -1.1" />
          <path d="M10 4.1l2 -1.1l2 1.1" />
          <path d="M18 6.4l2 1.1v2.5" />
          <path d="M20 14v2.5l-2 1.12" />
          <path d="M14 19.9l-2 1.1l-2 -1.1" />
          <path d="M12 12l2 -1.1" />
          <path d="M18 8.6l2 -1.1" />
          <path d="M12 12l0 2.5" />
          <path d="M12 18.5l0 2.5" />
          <path d="M12 12l-2 -1.12" />
          <path d="M6 8.6l-2 -1.1" />
        </svg>
        <span className="text-xl md:text-xl font-extralight text-zinc-500">
          Edunet
        </span>
      </button>
      <div className="flex flex-col text-zinc-500 mt-10 font-light text-sm">
        <Link to="/dashboard/all-classes" className="p-3">
          <div
            className={`flex items-center gap-2 hover:text-zinc-800 p-2 rounded-md ${currPath === "/all-classes" ? "bg-sky-200/80 transition-all ease-in-out duration-300 delay-100" : "hover:translate-x-1.5 transition-all ease-in-out duration-300 delay-100"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-chalkboard"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M8 19h-3a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v11a1 1 0 0 1 -1 1" />
              <path d="M11 17a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -1" />
            </svg>
            All Classes
          </div>
        </Link>
        {Role === "admin" && (
          <Link to="/dashboard/admin" className="p-3">
            <div
              className={`flex items-center gap-2 hover:text-zinc-800 p-2 rounded-md ${currPath === "/admin" ? "bg-sky-200/80 transition-all ease-in-out duration-300 delay-100" : "hover:translate-x-1.5 transition-all ease-in-out duration-300 delay-100"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-user"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
              </svg>
              Admin
            </div>
          </Link>
        )}
        <Link to="/dashboard/profile" className="p-3">
          <div
            className={`flex items-center gap-2 hover:text-zinc-800 p-2 rounded-md ${currPath === "/profile" ? "bg-sky-200/80 transition-all ease-in-out duration-300 delay-100" : "hover:translate-x-1.5 transition-all ease-in-out duration-300 delay-100"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-settings"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065" />
              <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
            </svg>
            Setting
          </div>
        </Link>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuContent
            side="top"
            sideOffset={8}
            // className="bg-sky-100 border-0"
          >
            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer bg-zinc-100 text-xs text-zinc-950 focus:bg-zinc-200 flex justify-center"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
          <DropdownMenuTrigger>
            <CiLogout className="text-zinc-900 text-xl cursor-pointer hover:scale-110" />
          </DropdownMenuTrigger>
        </DropdownMenu>
        <span className="text-zinc-900 font-thin text-sm">{CurrUser}</span>
      </div>
    </div>
  );
}

export default Sidebar;
