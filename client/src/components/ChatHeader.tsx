import { MessageCircle } from "lucide-react";
import { Chat } from "../types";

export default function ChatHeader({ currentChat }: { currentChat: Chat | null }) {
  if (currentChat === null) {
    return (
      <h1 className="px-6 py-4 shadow-lg text-2xl font-bold text-primary-800">
        Select a chat
      </h1>
    );
  }
  return (
    <div className="flex items-center px-6 py-4 shadow-lg">
      <MessageCircle className="text-primary-800 ml-3" size={28} />
      <h1 className="pl-3 flex items-center text-2xl font-bold text-primary-800">
        {currentChat.name}
      </h1>
    </div>
  );
}
