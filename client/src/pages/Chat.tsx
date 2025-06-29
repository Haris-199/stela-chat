import { Chat as ChatType, getChats } from "../services/api";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import ChatSidebar from "../components/ChatSidebar";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import Options from "../components/Options";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export default function Chat() {
  const { userData } = useContext(AuthContext);
  const [currentChat, setCurrentChat] = useState<ChatType | null>(null);
  const { chatId } = useParams();

  const { data: chats, isLoading, error } = useQuery({
    queryFn: () => getChats(userData!).then((res) => res.data),
    queryKey: ["chats", userData],
  });
  console.log(chats);

  useEffect(() => {
    if (userData !== undefined && chatId !== undefined && chats !== undefined) {
      setCurrentChat(chats.find((chat) => chat.id === +chatId) || null);
    }
  }, [chatId, chats, userData]);

  if (userData === undefined) {
    return <h1>Error</h1>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-primary-50">
        <span className="text-primary-700 text-xl font-semibold animate-pulse">
          Loading chats...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <span className="text-red-700 text-xl font-semibold">
          Failed to load chats. Please try again.
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Options />
      <ChatSidebar chats={chats} chatId={Number(chatId)} setCurrentChat={setCurrentChat} />
      <main className="flex-1 flex flex-col bg-gradient-to-br from-primary-100 via-primary-200 to-primary-100">
        {currentChat !== null ? (
          <ChatHeader currentChat={currentChat} />
        ) : (
          <h1 className="px-6 py-4 md:py-8 shadow-lg text-2xl font-bold text-primary-800">
            Select a chat
          </h1>
        )}
        <MessageList userData={userData} chatId={chatId} />
        {currentChat !== null && <MessageInput />}
      </main>
    </div>
  );
}


