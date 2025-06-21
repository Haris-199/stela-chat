import { Chat as Chat_t } from "../services/api";

export default function ChatHeader({ currentChat, chats }: {
  currentChat: number,
  chats: Chat_t[] | null
}) {
  return (
    <h1 className="px-6 py-4 flex items-center shadow-md text-2xl font-bold text-primary-800">
      {currentChat > -1 && chats
        ? chats.find((c) => c.id === currentChat)?.name
        : "Select a group"}
    </h1>
  );
}
