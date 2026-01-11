import { useEffect, useState } from "react";
import ClassAdmin from "./ClassAdmin";
import { SessionType } from "@repo/validators/index";
import { useQuery } from "@tanstack/react-query";
import { getAllAdminClasses } from "../actions";

function AllClassAdmin() {
  const [sessions, setSessions] = useState<[]>([]);
  const { data } = useQuery({
    queryKey: ["adminClasses"],
    queryFn: getAllAdminClasses,
  });
  useEffect(() => {
    if (data) {
      setSessions(data.allSessions);
    }
  }, [data]);
  return (
    <div>
      <ul className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
        {sessions.length > 0 &&
          sessions.map((session: SessionType, index) => (
            <ClassAdmin
              title={session.title}
              status={session.status}
              sessionId={session.sessionId}
              key={index}
            />
          ))}
      </ul>
    </div>
  );
}

export default AllClassAdmin;
