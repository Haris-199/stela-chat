import Avatar from "./Avatar";
import { Chat } from "../services/api";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function ChatSidebar({
  chats,
  chatId,
  setCurrentChat,
}: {
  chats: Chat[] | null;
  chatId: number;
  setCurrentChat: (id: Chat) => void;
}) {

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
