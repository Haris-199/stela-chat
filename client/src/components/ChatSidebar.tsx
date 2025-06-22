import Avatar from "./Avatar";
import { Chat, getChats, UserPayload } from "../services/api";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

export default function ChatSidebar({
  userData,
  currentChat,
  setCurrentChat,
}: {
  userData: UserPayload;
  currentChat: Chat | null;
  setCurrentChat: (id: Chat) => void;
}) {
  const [chats, setChats] = useState<Chat[] | null>(null);

  useEffect(() => {
    getChats(userData!).then((res) => setChats(res.data));
  }, [currentChat, userData]);

  return (
    <aside className="w-64 text-white bg-radial-[at_0%_-50%] from-primary-900 to-primary-700 flex flex-col py-4 shadow-lg">
      <h2 className="px-6 mb-4 flex justify-between items-center text-primary-100">
        <p className="font-bold text-lg">Chats</p>
        <button className="flex flex-col items-center p-2 rounded-lg hover:bg-primary-700" title="New Chat">
          <Plus size={20} />
          <span className="text-xs mt-1">New</span>
        </button>
      </h2>
      <nav className="flex-1 flex flex-col gap-4 px-2 overflow-y-auto">
        {chats &&
          chats.map((chat) => (
            <button
              key={chat.id}
              className={`first-of-type:mt-1 flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-150 font-medium text-primary-100 hover:bg-primary-400/40 focus:outline-none focus:ring-2 focus:ring-primary-300 shadow-sm ${
                currentChat?.id === chat.id
                  ? "bg-primary-400/80 text-primary-900 font-bold"
                  : "bg-primary-700/60"
              }`}
              onClick={() => setCurrentChat(chat)}
              title={chat.name}
            >
              <Avatar letter={chat.name[0]} className="size-10" />
              <span className="truncate">{chat.name}</span>
            </button>
          ))}
      </nav>
    </aside>
  );
}
