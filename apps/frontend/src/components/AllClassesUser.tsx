import { useEffect, useState } from "react";
import ClassUser from "./ClassUser";
import { SessionType } from "@repo/validators/index";
import { useQuery } from "@tanstack/react-query";
import { getAllUserClasses } from "@/actions";

function AllClassesUser() {
  const [sessions, setSessions] = useState<[]>([]);

  const { data, isFetching } = useQuery({
    queryKey: ["liveClasses"],
    queryFn: getAllUserClasses,
  });

  useEffect(() => {
    if (!isFetching && data?.data.allSessions) {
      setSessions(data.data.allSessions);
    }
  }, [data?.data.allSessions, isFetching]);
  return (
    <div className="">
      {isFetching && (
        <p className="text-center text-xs font-thin text-sky-200">
          checking for live classes...
        </p>
      )}
      {!isFetching && sessions.length === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <p className="text-center text-zinc-800 text-xs font-thin">
            No live classes at the moment. Please contact admin at {""}
            <span className="text-sky-500">vin.aka.ak@gmail.com</span>
          </p>
        </div>
      )}
      <ul className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
        {!isFetching &&
          sessions.map((session: SessionType, index) => (
            <ClassUser
              title={session.title}
              sessionId={session.sessionId}
              key={index}
            />
          ))}
      </ul>
    </div>
  );
}

export default AllClassesUser;
