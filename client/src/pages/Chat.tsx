import { Chat as Chat_t, getChats } from "../services/api";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import ChatSidebar from "../components/ChatSidebar";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import Options from "../components/Options";
import { useParams } from "react-router-dom";

export default function Chat() {
  const { userData } = useContext(AuthContext);
  const [chats, setChats] = useState<Chat_t[] | null>(null);
  const [currentChat, setCurrentChat] = useState<Chat_t | null>(null);
  const { chatId } = useParams();

  useEffect(() => {
    if (userData !== undefined) getChats(userData).then((res) => setChats(res.data));
  }, [userData]);

  useEffect(() => {
    if (userData !== undefined && chatId !== undefined && chats !== null) {
      setCurrentChat(chats.find((chat) => chat.id === +chatId) || null);
    }
  }, [chatId, chats, userData]);

  if (userData === undefined) {
    return <h1>Error</h1>;
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
        <MessageList userData={userData} currentChat={currentChat} />
        {currentChat !== null && <MessageInput />}
      </main>
    </div>
  );
}
