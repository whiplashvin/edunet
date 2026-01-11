import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createSession } from "../actions";
import { IoAdd } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

function CreateSess() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { mutate } = useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      setTitle("");
      queryClient.invalidateQueries({ queryKey: ["adminClasses"] });
      setIsOpen(false);
    },
  });
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="bg-sky-400/30 border-[0.5px] border-sky-500 text-zinc-950 px-4 py-2 rounded-lg flex items-center text-sm font-thin hover:bg-sky-600/30 gap-2 shadow-lg">
        <IoAdd size={20} />
        Create Session
      </DialogTrigger>
      <DialogContent className="bg-zinc-50 border-zinc-700 w-72 md:w-full rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-thin text-zinc-900 mb-5 tracking-normal">
            Create a Session
          </DialogTitle>
          <DialogDescription>
            <input
              value={title}
              className="w-full px-4 py-3 rounded-lg font-thin bg-zinc-100 border border-zinc-300 text-zinc-900 text-xs mb-5 focus:outline-none"
              placeholder="Give it a title"
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              // value={title}
              className="w-full px-4 py-3 rounded-lg font-thin bg-zinc-100 border border-zinc-300 text-zinc-900 text-xs mb-5 focus:outline-none"
              placeholder="Description"
              // onChange={(e) => setTitle(e.target.value)}
            />
            <button
              className="bg-sky-400/30 border-[0.5px] border-sky-500 text-zinc-950 hover:bg-sky-600/30 py-4 rounded-lg font-thin text-xs w-full shadow-lg"
              onClick={() => mutate(title)}
            >
              Create
            </button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CreateSess;
