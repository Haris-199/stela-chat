import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import ChatSidebar from "../components/ChatSidebar";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessages";
import Options from "../components/Options";
import { Chat as ChatType } from "../services/api";

export default function Chat() {
  const { userData } = useContext(AuthContext);
  const [currentChat, setCurrentChat] = useState<ChatType | null>(null);
  const cid = useParams().chatId;
  const chatId = cid !== undefined ? +cid : undefined;

  if (userData === undefined) {
    return <h1>Error</h1>;
  }

  return (
    <div className="flex h-screen">
      <Options />
      <ChatSidebar userData={userData} chatId={Number(chatId)} setCurrentChat={setCurrentChat} />
      <main className="flex-1 flex flex-col bg-gradient-to-br from-primary-100 via-primary-200 to-primary-100">
        {currentChat !== null ? (
          <>
            <ChatHeader name={currentChat.name} />
            <ChatMessages userData={userData} currentChat={currentChat} />
          </>
        ) : (
          <h1 className="px-6 py-4 md:py-8 shadow-lg text-2xl font-bold text-primary-800">
            Select a chat
          </h1>
        )}
      </main>
    </div>
  );
}
