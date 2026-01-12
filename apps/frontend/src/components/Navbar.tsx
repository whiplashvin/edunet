import { RxHamburgerMenu } from "react-icons/rx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navbarHeight, userRole } from "@/recoil";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef } from "react";

function Navbar() {
  const Role = useRecoilValue(userRole);
  const navigate = useNavigate();
  const setNavbarHeight = useSetRecoilState(navbarHeight);
  const ref = useRef<HTMLDivElement | null>(null);
  async function logout() {
    await axios.post(
      `${import.meta.env.VITE_PRIMARY_BACKEND_URL}/logout`,
      {},
      { withCredentials: true }
    );
    navigate("/signin");
  }
  useEffect(() => {
    if (ref.current) {
      setNavbarHeight(ref.current.offsetHeight);
    }
  }, [setNavbarHeight]);
  return (
    <div
      className="xl:hidden sticky top-5 flex justify-between items-center z-50 bg-neutral-200/50 px-2 rounded-xl w-[95%] mx-auto"
      ref={ref}
    >
      <div className="flex gap-1 text-zinc-900 justify-start items-center p-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
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
        <span className="text-base font-extralight">Edunet</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {/* <RxHamburgerMenu fontSize={20} color="#bfdbfe" /> */}
          <RxHamburgerMenu fontSize={20} color="oklch(21% 0.006 285.885)" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-zinc-50 m-2 border-none">
          <DropdownMenuItem
            className="text-[10px] font-extralight text-zinc-900"
            onClick={() => navigate("/dashboard/all-classes")}
          >
            All Classes
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-zinc-200" />
          {Role === "admin" && (
            <>
              <DropdownMenuItem
                className="text-[10px] font-extralight text-zinc-900"
                onClick={() => navigate("/dashboard/admin")}
              >
                Admin
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-200" />
            </>
          )}

          <DropdownMenuItem
            className="text-[10px] font-extralight text-zinc-900"
            onClick={() => navigate("/dashboard/profile")}
          >
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-zinc-200" />
          <DropdownMenuItem
            className="text-[10px] font-extralight text-zinc-900"
            onClick={logout}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default Navbar;
