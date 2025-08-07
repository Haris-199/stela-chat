import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import ChatSidebar from "../components/ChatSidebar";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessages";
import Options from "../components/Options";
import { Chat as ChatType } from "../types";
import { useAuth } from "../hooks/useAuth";
import Spinner from "../components/Spinner";

export default function Chat() {
  const { userData, isAuthenticating } = useAuth();
  const [currentChat, setCurrentChat] = useState<ChatType | null>(null);
  const cid = useParams().chatId;
  const chatId = cid !== undefined ? +cid : undefined;

  if (isAuthenticating) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1>Loading</h1>
        <Spinner />
      </div>
    );
  }

  if (userData === undefined) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="flex h-screen">
      <Options />
      <ChatSidebar userData={userData} chatId={Number(chatId)} setCurrentChat={setCurrentChat} />
      <main className="grow flex flex-col bg-gradient-to-br from-primary-100 via-primary-200 to-primary-100 relative">
        <ChatHeader currentChat={currentChat} />
        {currentChat && <ChatMessages userData={userData} currentChat={currentChat} />}
      </main>
    </div>
  );
}
