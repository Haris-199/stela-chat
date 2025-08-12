import {  MessageCircle } from "lucide-react";
import { Chat } from "../types";

export default function ChatHeader({ currentChat }: { currentChat: Chat | null }) {
  if (currentChat === null) {
    return (
      <h1 className="px-6 py-4 shadow-lg text-2xl font-bold text-primary-800 flex justify-center med:justify-start med:pl-8">
        Select a chat
      </h1>
    );
  }

  return (
    <div className="flex relative med:justify-start items-center px-6 py-4 shadow-lg">
      <MessageCircle className="hidden med:block text-primary-800 ml-3" size={28} />
      <h1 className="med:pl-3 grow justify-center med:justify-start flex items-center text-2xl font-bold text-primary-800">
        {currentChat.name}
      </h1>
    </div>
  );
}
