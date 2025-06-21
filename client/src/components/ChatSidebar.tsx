import Avatar from "./Avatar";
import { Chat as Chat_t } from "../services/api";

export default function ChatSidebar({ chats, currentChat, setCurrentChat }: {
  chats: Chat_t[] | null,
  currentChat: number,
  setCurrentChat: (id: number) => void
}) {
  return (
    <aside className="w-64 text-white bg-radial-[at_0%_-50%] from-primary-900 to-primary-700 flex flex-col py-4 shadow-lg">
      <h2 className=" text-lg font-bold px-6 mb-4">Chats</h2>
      <nav className="flex-1 flex flex-col gap-4 px-2 overflow-y-auto">
        {chats && chats.map((chat) => (
          <button
            key={chat.id}
            className={`first-of-type:mt-1 flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-150 font-medium text-primary-100 hover:bg-primary-400/40 focus:outline-none focus:ring-2 focus:ring-primary-300 shadow-sm ${
              currentChat === chat.id
                ? "bg-primary-400/80 text-primary-900 font-bold"
                : "bg-primary-700/60"
            }`}
            onClick={() => setCurrentChat(chat.id)}
            title={chat.name}
          >
            <Avatar letter={chat.name[0]} size={10} />
            <span className="truncate">{chat.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
