import { useContext, useRef, useState } from "react";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Users as UsersIcon,
  X,
  Frown,
  UserMinus,
} from "lucide-react";
import AuthContext from "../contexts/AuthContext";
import Avatar from "./Avatar";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  getIncomingFriendRequests,
  getUsers,
  getUsersFriends,
  sendFriendRequest,
} from "../services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FriendRequest, User, UserPayload } from "../types";
import Spinner from "./Spinner";

export default function UsersModal() {
  const { userData } = useContext(AuthContext);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<"users" | "friends" | "requests">("users");
  const { data: list, isPending } = useQuery<User[] | FriendRequest[]>({
    queryKey: [mode],
    queryFn: () => {
      switch (mode) {
        case "friends":
          return getUsersFriends(userData!).then((res) => res.data);
        case "requests":
          return getIncomingFriendRequests(userData!).then((res) => res.data);
        case "users":
        default:
          return getUsers().then((res) => res.data);
      }
    },
  });

  return (
    <>
      <button
        type="button"
        className="size-15 flex flex-col items-center p-2 rounded-lg hover:bg-primary-700 text-primary-100"
        title="Users"
        onClick={() => dialogRef.current?.showModal()}
      >
        <Users size={24} />
        <span className="text-xs mt-1">Users</span>
      </button>
      <dialog
        ref={dialogRef}
        className="fixed inset-0 z-50 max-h-none h-screen max-w-none w-screen sm:w-[clamp(370px,30%,450px)] overflow-hidden shadow-2xl backdrop:bg-black/40"
        style={{ background: "none" }}
        onClick={(e) => {
          const dims = dialogRef.current?.getBoundingClientRect();
          if (dims?.right === undefined) return;
          if (
            e.clientY < dims.top ||
            e.clientX > dims.right ||
            e.clientY > dims.bottom ||
            e.clientX < dims.left
          )
            dialogRef.current?.close();
        }}
      >
        <div className=" h-full bg-gradient-to-br from-primary-700/90 via-primary-500/90 to-primary-400/90 flex flex-col">
          <div className="flex justify-between items-center pl-6 pr-5 pt-4 pb-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <UsersIcon size={22} /> Users
            </h2>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="text-white text-2xl rounded-full p-1 font-bold cursor-pointer hover:bg-primary-100/20"
              title="Close"
            >
              <X />
            </button>
          </div>
          <div className="flex gap-1 px-6 font-semibold text-md">
            <button
              type="button"
              className={`px-3 py-1 rounded-t-lg transition-colors ${
                mode === "users"
                  ? "bg-primary-100 text-primary-700"
                  : "bg-primary-500 text-white hover:bg-primary-500/70 cursor-pointer"
              }`}
              onClick={() => setMode("users")}
              tabIndex={mode === "users" ? -1 : undefined}
            >
              All Users
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded-t-lg transition-colors ${
                mode === "friends"
                  ? "bg-primary-100 text-primary-700"
                  : "bg-primary-500 text-white hover:bg-primary-500/70 cursor-pointer"
              }`}
              onClick={() => setMode("friends")}
              tabIndex={mode === "friends" ? -1 : undefined}
            >
              Friends
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded-t-lg transition-colors ${
                mode === "requests"
                  ? "bg-primary-100 text-primary-700"
                  : "bg-primary-500 text-white hover:bg-primary-500/70 cursor-pointer"
              }`}
              onClick={() => setMode("requests")}
              tabIndex={mode === "requests" ? -1 : undefined}
            >
              Requests
            </button>
          </div>
          <div className="mx-6 mb-6 overflow-hidden rounded-r-lg flex flex-col">
            <ul
              className="overflow-y-auto w-full rounded-b-lg bg-gradient-to-br from-primary-300 to-primary-400"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "var(--color-primary-300) var(--color-primary-200)",
              }}
            >
              {isPending || list === undefined ? (
                <SkeletonList />
              ) : list.length === 0 ? (
                <EmptyList mode={mode} />
              ) : mode === "users" ? (
                list.map((user) => (
                  <UsersListItem key={user.username} userData={userData!} user={user} />
                ))
              ) : mode === "friends" ? (
                list.map((user) => (
                  <FriendsListItem key={user.username} userData={userData!} user={user} />
                ))
              ) : (
                (list as FriendRequest[]).map((request) => (
                  <RequestsListItem key={request.username} userData={userData!} request={request} />
                ))
              )}
            </ul>
          </div>
        </div>
      </dialog>
    </>
  );
}

function SkeletonList() {
  return [1, 2, 3].map((n) => (
    <div
      key={n}
      className="last:rounded-bl-lg justify-between px-3 py-3 bg-primary-100 not-last:border-b border-primary-200 "
    >
      <div className="animate-pulse flex items-center gap-2">
        <div className="rounded-full size-10 bg-primary-300" />
        <div className="grow h-3 rounded-lg bg-primary-300" />
      </div>
    </div>
  ));
}

function EmptyList({ mode }: { mode: "users" | "friends" | "requests" }) {
  return (
    <div className="flex flex-col items-center justify-center py-4.5 bg-primary-100 text-primary-700">
      <h1 className="text-xl font-semibold flex items-center">
        {mode === "friends" ? (
          <>
            No friends found <Frown size={28} className="ml-2" />
          </>
        ) : mode === "users" ? (
          "No users found"
        ) : (
          "No requests found"
        )}
      </h1>
    </div>
  );
}

function UsersListItem({ userData, user }: { userData: UserPayload; user: User }) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ receiver }: { receiver: string }) => sendFriendRequest(userData, receiver),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["users"] }),
  });

  return (
    <li
      key={user.username}
      className="flex flex-wrap items-center justify-between gap-2 px-3 py-3 bg-primary-100 hover:bg-primary-200/70 not-last:border-b border-primary-200 transition-colors shadow-sm"
    >
      <span className="font-medium flex items-center gap-2 text-primary-800">
        <Avatar letter={user.username[0].toUpperCase()} className="size-10 text-md" />
        {user.username}
      </span>
      {isPending ? (
        <span className="p-2 rounded-full grid place-items-center bg-primary text-white">
          <Spinner size={20} className="text-white" />
        </span>
      ) : (
        <button
          type="button"
          className="p-2 rounded-full bg-primary hover:bg-primary-600 text-white cursor-pointer"
          title="Send Friend Request"
          onClick={() => mutateAsync({ receiver: user.username })}
        >
          <UserPlus size={20} />
        </button>
      )}
    </li>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FriendsListItem({ userData, user }: { userData: UserPayload; user: User }) {
  return (
    <li
      key={user.username}
      className="flex flex-wrap items-center justify-between gap-2 px-3 py-3 bg-primary-100 hover:bg-primary-200/70 not-last:border-b border-primary-200 transition-colors shadow-sm"
    >
      <span className="font-medium flex items-center gap-2 text-primary-800">
        <Avatar letter={user.username[0].toUpperCase()} className="size-10 text-md" />
        {user.username}
      </span>
      <button
        type="button"
        className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white cursor-pointer"
        title="Remove Friend"
      >
        <UserMinus size={20} />
      </button>
    </li>
  );
}

function RequestsListItem({
  userData,
  request,
}: {
  userData: UserPayload;
  request: FriendRequest;
}) {
  const queryClient = useQueryClient();

  const { mutateAsync: acceptRequest, isPending: acceptPending } = useMutation({
    mutationFn: ({ requestId, sender }: { requestId: number; sender: string }) =>
      acceptFriendRequest(userData, requestId, sender),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["requests"] }),
  });

  const { mutateAsync: cancelRequest, isPending: cancelPending } = useMutation({
    mutationFn: ({ requestId }: { requestId: number }) => cancelFriendRequest(userData, requestId),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["requests"] }),
  });

  return (
    <li
      key={request.id}
      className="flex flex-wrap items-center justify-between gap-2 px-3 py-3 bg-primary-100 hover:bg-primary-200/70 not-last:border-b border-primary-200 transition-colors shadow-sm"
    >
      <span className="font-medium flex items-center gap-2 text-primary-800">
        <Avatar letter={request.username[0].toUpperCase()} className="size-10 text-md" />
        {request.username}
      </span>
      {acceptPending || cancelPending ? (
        <span className="p-2 text-white rounded-full bg-primary">
          <Spinner size={20} />
        </span>
      ) : (
        <span className="flex gap-2">
          <button
            type="button"
            className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white cursor-pointer"
            title="Accept"
            onClick={() => acceptRequest({ requestId: request.id, sender: request.username })}
          >
            <UserCheck size={20} />
          </button>
          <button
            type="button"
            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white cursor-pointer"
            title="Reject"
            onClick={() => cancelRequest({ requestId: request.id })}
          >
            <UserX size={20} />
          </button>
        </span>
      )}
    </li>
  );
}
