import Avatar from "./Avatar";
import { getChats } from "../services/api";
import { Chat, UserPayload } from "../types";
import { Plus } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import CreateChatModal from "./CreateChatModal";

export default function ChatSidebar({
  userData,
  chatId,
  setCurrentChat,
}: {
  userData: UserPayload;
  chatId: number | undefined;
  setCurrentChat: (chat: Chat | null) => void;
}) {
  const {
    data: chats,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => getChats(userData).then((res) => res.data),
    queryKey: ["chats", userData],
  });

  useEffect(() => {
    if (chatId !== undefined && chats !== undefined) {
      setCurrentChat(chats.find((chat) => chat.id === chatId) || null);
    }
  }, [chatId, chats, setCurrentChat]);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <Navigate to="/500" />;
  }

  return (
    <aside className="w-80 text-white flex flex-col">
      <h2 className=" px-6 py-1 flex justify-between items-center text-primary-100 bg-gradient-to-r from-primary-800 to-primary-700 shadow-md">
        <p className="font-bold text-lg">Chats</p>
        <CreateChatModal />
      </h2>
      <nav
        className="bg-radial-[at_0%_-50%] from-primary-900 to-primary-700 flex-1 flex flex-col gap-3 px-2 py-2 overflow-y-auto"
        style={{ scrollbarColor: "var(--color-primary-700) var(--color-primary-600)" }}
      >
        {chats &&
          chats.map((chat) => (
            <Link
              to={`/chat/${chat.id}`}
              key={chat.id}
              className={`first-of-type:mt-1 flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-150 font-medium text-primary-100 hover:bg-primary-400/40 focus:outline-none focus:ring-2 focus:ring-primary-300 shadow-sm ${
                chatId === chat.id
                  ? "bg-primary-400/80 text-primary-900 font-bold"
                  : "bg-primary-700/60"
              }`}
              onClick={() => setCurrentChat(chat)}
              title={chat.name}
            >
              <Avatar letter={chat.name[0]} className="size-10" />
              <span className="truncate">{chat.name}</span>
            </Link>
          ))}
      </nav>
    </aside>
  );
}

function SkeletonLoader() {
  return (
    <aside className="w-64 text-white bg-radial-[at_0%_-50%] from-primary-900 to-primary-700 flex flex-col shadow-lg">
      <h2 className="px-6 py-1 flex justify-between items-center text-primary-100 bg-gradient-to-r from-primary-800 to-primary-700 shadow-md">
        <p className="font-bold text-lg">Chats</p>
        <button
          className="flex flex-col items-center p-2 rounded-lg hover:bg-primary-700"
          title="New Chat"
        >
          <Plus size={20} />
          <span className="text-xs mt-1">New</span>
        </button>
      </h2>
      <nav className="flex-1 flex flex-col gap-3 px-2 overflow-y-auto bg-radial-[at_0%_-50%] from-primary-900 to-primary-700 py-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse first-of-type:mt-1 flex items-center gap-3 px-3 py-2 rounded-lg bg-primary-700/60 shadow-sm"
          >
            <div className="bg-primary-500/40 rounded-full size-10" />
            <div className="h-4 bg-primary-500/40 rounded w-2/3" />
          </div>
        ))}
      </nav>
    </aside>
  );
}
