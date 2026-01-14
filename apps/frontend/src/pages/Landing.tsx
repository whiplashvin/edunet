import SigninPage from "./SigninPage";

function Landing() {
  // const navigate = useNavigate();

  return (
    // <div className="w-full bg-zinc-100 relative">
    //   <div className="w-full sticky top-0 border-b border-zinc-200 z-[1000] bg-zinc-100">
    //     <div className="flex gap-1 text-zinc-900 justify-start items-center p-4">
    //       <svg
    //         xmlns="http://www.w3.org/2000/svg"
    //         width="34"
    //         height="34"
    //         viewBox="0 0 24 24"
    //         fill="none"
    //         // stroke="#00a6f4"
    //         stroke="#615fff"
    //         strokeWidth="1.1"
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         className="icon icon-tabler icons-tabler-outline icon-tabler-cube-3d-sphere"
    //       >
    //         <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    //         <path d="M6 17.6l-2 -1.1v-2.5" />
    //         <path d="M4 10v-2.5l2 -1.1" />
    //         <path d="M10 4.1l2 -1.1l2 1.1" />
    //         <path d="M18 6.4l2 1.1v2.5" />
    //         <path d="M20 14v2.5l-2 1.12" />
    //         <path d="M14 19.9l-2 1.1l-2 -1.1" />
    //         <path d="M12 12l2 -1.1" />
    //         <path d="M18 8.6l2 -1.1" />
    //         <path d="M12 12l0 2.5" />
    //         <path d="M12 18.5l0 2.5" />
    //         <path d="M12 12l-2 -1.12" />
    //         <path d="M6 8.6l-2 -1.1" />
    //       </svg>
    //       <span className="text-xl font-light tracking-widest">EDUNET</span>
    //     </div>
    //   </div>
    //   <div className="bg-zinc-100 max-w-7xl mx-auto border-x border-zinc-200">
    //     <div className="h-32"></div>
    //     <div className="w-full bg-zinc-100 flex">
    //       <div className="w-[40%] h-full flex flex-col items-center justify-center pl-10 gap-8">
    //         <h2 className="text-6xl text-left text-zinc-700 font-light tracking-wide">
    //           Education is now{" "}
    //           <span className="text-indigo-500/90 font-light">accessible</span>,{" "}
    //           <span className="text-indigo-500/90 font-light">accountable</span>{" "}
    //           &{" "}
    //           <span className="text-indigo-500/90 font-light">affordable</span>.{" "}
    //           <br />
    //           <span className="text-3xl text-zinc-500 font-extralight">
    //             Brought to you by Edunet.
    //           </span>
    //         </h2>
    //         <p className="text-base text-zinc-500 font-extralight leading-6">
    //           There has not been a better time to be learning. Join us and be a
    //           part of the ever learning, ever evolving lot.
    //         </p>
    //         <div className="flex items-center gap-5">
    //           <Button onClick={() => navigate("/signin")}>SIGN IN</Button>
    //         </div>
    //       </div>
    //       <div className="w-[60%] h-full flex items-center px-10">
    //         <div className="bg-white/30 p-2 relative rounded-2xl border border-white/70 shadow-[0px_0px_10px_10px_rgba(97,95,255,0.1),0px_0px_10px_10px_rgba(97,95,255,0.1)]">
    //           <div className="inset-0 bg-zinc-500/20 absolute rounded-2xl z-10" />
    //           <img src={screen} className="rounded-xl" />
    //           <img
    //             src={educator}
    //             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%]"
    //           />
    //         </div>
    //       </div>
    //     </div>
    //     <div className="mt-48 w-full h-screen">
    //       <span className="w-full flex justify-center font-thin text-sm tracking-widest">
    //         FEATURES
    //       </span>
    //     </div>
    //   </div>
    // </div>
    <SigninPage />
  );
}

export default Landing;
