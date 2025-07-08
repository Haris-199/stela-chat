import { useActionState, useContext, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, User2, MessageCircle, Users2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import Avatar from "./Avatar";
import Spinner from "./Spinner";
import { createChat, getUser } from "../services/api";
import AuthContext from "../contexts/AuthContext";

export default function CreateChatModal() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { userData } = useContext(AuthContext);
  const [data, action, isPending] = useActionState(createChatAction, undefined);

  async function createChatAction(_previous: unknown, formData: FormData) {
    const name = formData.get("name") as string;
    const users = formData.getAll("users") as string[];

    if (users.length === 0) return { fieldData: { name, users } };

    try {
      const res = await createChat(userData!, name, users);

      if (!res.success) {
        return { fieldData: { name, users } };
      }

      queryClient.refetchQueries({ queryKey: ["chats", userData] });
      dialogRef.current?.close();
    } catch (error) {
      console.error(error);
      navigate("/500");
    }
  }

  return (
    <>
      <button
        className="flex flex-col items-center p-2 rounded-lg hover:bg-primary-700"
        title="New Chat"
        onClick={() => dialogRef.current?.showModal()}
      >
        <Plus size={20} />
        <span className="text-xs mt-1">New</span>
      </button>
      <dialog
        ref={dialogRef}
        className="backdrop:brightness-10 rounded-xl left-[calc(50%-min(400px,90%)/2)] top-[calc(50%-475px/2)] w-[min(400px,90%)] h-[475px] overflow-y-hidden shadow-lg p-0 border-0"
      >
        <form action={action} className="bg-white rounded-xl p-6 flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-center text-primary-700 mb-1">New Chat</h1>
          <div className="flex flex-col items-stretch gap-1">
            <label htmlFor="name">
              <span className="text-sm font-medium text-black-700">Chat Name</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <MessageCircle size={20} />
              </span>
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={data?.fieldData.name}
                className="w-full border border-primary-200 rounded pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="Enter chat name"
                required
              />
            </div>
          </div>
          <span className="text-sm font-medium text-black-700">Members</span>
          <UsersCheckbox defaultValues={data?.fieldData.users} />
          <div className="mt-auto flex gap-2 justify-center font-semibold">
            {!isPending && (
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 text-primary-700 hover:bg-gray-300 cursor-pointer"
                onClick={() => dialogRef.current?.close()}
                formMethod="dialog"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700 cursor-pointer disabled:cursor-default disabled:hover:bg-primary-600"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex gap-1">
                  Creating... <Spinner />
                </div>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

function UsersCheckbox({ defaultValues }: { defaultValues: string[] | undefined }) {
  const [mode, setMode] = useState("friends");
  const {
    data: list,
    refetch,
    isPending,
  } = useQuery({
    queryKey: [mode],
    queryFn: () => {
      switch (mode) {
        case "users":
          return getUser().then((res) => res.data);
        case "friends":
        default:
          return [{ username: "derby" }, { username: "echo" }];
      }
    },
  });

  const buttonStyle =
    "cursor-pointer flex items-center justify-center gap-2 p-2 bg-primary-600 hover:bg-primary-700 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400";

  return (
    <div className="flex flex-col max-h-50 mb-2 -mt-2 rounded-xl shadow-lg">
      <div className="text-white transition-colors grid grid-cols-2 gap-x-1 bg-primary-700 rounded-xl">
        <button
          type="button"
          className={clsx("rounded-tl-xl", buttonStyle, {
            "pointer-events-none bg-primary-700 cursor-default": mode === "friends",
          })}
          onClick={() => {
            setMode("friends");
            refetch();
          }}
          tabIndex={mode === "friends" ? -1 : undefined}
        >
          <User2 size={18} /> Friends
        </button>
        <button
          type="button"
          className={clsx("rounded-tr-xl", buttonStyle, {
            "pointer-events-none bg-primary-700 cursor-default": mode === "users",
          })}
          onClick={() => {
            setMode("users");
            refetch();
          }}
          tabIndex={mode === "users" ? -1 : undefined}
        >
          <Users2 size={18} /> All Users
        </button>
      </div>
      <div
        className="overflow-y-auto rounded-b-xl bg-gradient-to-br from-primary-300 to-primary-400"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "var(--color-primary-300) var(--color-primary-200)",
          // scrollbarGutter: "stable",
        }}
      >
        {isPending || list === undefined ? (
          <h1>Loading</h1>
        ) : (
          list.map((user) => (
            <label
              key={user.username}
              htmlFor={`user-${user.username}`}
              className="flex items-center justify-between gap-2 px-3 py-2 bg-primary-100 hover:bg-primary-200 not-last:border-b border-primary-200 cursor-pointer transition-colors shadow-sm"
            >
              <span className="font-medium flex items-center gap-2 text-primary-800">
                <Avatar letter={user.username[0].toUpperCase()} className="size-8 text-xs" />
                {user.username}
              </span>
              <input
                type="checkbox"
                id={`user-${user.username}`}
                name="users"
                value={user.username}
                className="accent-primary-500"
                defaultChecked={defaultValues?.includes(user.username)}
              />
            </label>
          ))
        )}
      </div>
    </div>
  );
}
